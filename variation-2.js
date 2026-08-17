/* ##########################################################################
   VARIJACIJA #2 — uvodna animacija naslovne

   Rekonstrukcija uvoda sa telescope.fyi: polje sitnih slika raspoređeno oko
   naslova prolazi kroz kadar ka posmatraču, naslov ide zajedno sa njima i izlazi
   kroz kameru, a u sredini se zumira glavni medij. Kod nas je taj medij
   POSTOJEĆI hero video sa search barom, pa se na kraju animacije stiže na isti
   kadar kao u varijaciji #1 — odatle nadalje (snap pauza, izlazak, sekcija
   ispod) obe varijacije dele isti kod.

   TRI POKRETA, TRI IZVORA VREMENA:
     1. UVODNI RASPORED  — vreme (rAF), jednom po učitavanju stranice
     2. HOVER            — pokazivač (rAF lerp), samo dok je scena u mirovanju
     3. LET KROZ KADAR   — SCROLL (updateHero iz index.html)
   Sva tri pišu u ISTI transform po pločici, pa postoji jedan `render()` koji ih
   sabira. Nikad ne dodavati četvrti pisac istog svojstva — to je najlakši način
   da se animacije počnu međusobno preskakati.

   KAKO SE UKLAPA U POSTOJEĆI HERO
   Ovaj fajl NE pravi svoj scroll listener. index.html i dalje ima jedan
   updateHero() koji Lenis zove na svaki tick; on na vrhu proveri window.BB_VAR2
   i, ako je aktivna, prosledi kadar ovamo. Time ostaju zajednički: merenje
   spacera, izlazna faza (P4) i staklo headera — dakle tačno ono što ne sme da
   se razilazi između varijacija.

   ⚠ JEDNA SCENA, JEDNA PERSPEKTIVA. Pločice nemaju sopstvenu formulu za
   razmicanje: dobijaju samo translateZ, a to što se šire ka ivicama kadra dok
   prilaze crta perspektiva. Ako se ovo ikad menja, menjati DUBINU (z), ne x/y —
   čim se x/y anima ručno, pokret prestane da izgleda kao jedan prostor.
   ########################################################################## */
(function () {
  'use strict';

  var root = document.documentElement;
  if (root.getAttribute('data-var') !== '2') return;

  var PREFERS_REDUCED = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stage = document.getElementById('hero-stage');
  var heading = document.getElementById('hero-heading');
  var mediaBox = document.getElementById('hero-media-box');
  var searchBlock = document.getElementById('hero-search-block');
  if (!stage || !heading || !mediaBox || !searchBlock) return;

  var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  // Ease-in-out za skrol: kreće lagano, ubrza po sredini i staje bez trzaja.
  // Bitno je da u snap pauzu uđe sa ~nultom brzinom, inače se pauza čita kao
  // naglo kočenje.
  var easeInOut = function (t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  // Ease-out sedmog reda — vrlo brz start, dug i mek doček. Ovo je krivulja
  // uvodnog rasporeda: pločica "doleti" i skoro neprimetno se smiri, umesto da
  // stigne i stane. Blaži eksponenti (cubic) ovde izgledaju kao da pločice
  // klize u mesto.
  var easeOutIntro = function (t) { return 1 - Math.pow(1 - t, 7); };
  // Glatko 0→1 na zadatom intervalu; koristi se za sve "od kad do kad" pragove
  // umesto lomljenih linearnih rampi.
  var span = function (v, a, b) { return clamp((v - a) / (b - a), 0, 1); };

  /* ==========================================================================
     FAZE — razlomci skrolabilnog raspona (393vh), izvedeni iz vh budžeta
     zapisanih iznad #hero-spacer u variation-2.css:
       P0 1vh | uvod 252vh | P3 10vh | P4 130vh   (spacer 493vh)
     Menja se jedno, preračunava se drugo.

     p4End i razlika p4End−p3End (130vh) MORAJU ostati iste kao u varijaciji #1
     u vh izrazu — na njima stoji margin-top: -130vh prve sekcije posle heroja.
  ========================================================================== */
  var SCROLLABLE_VH = 393;
  var PHASE = {
    p0End: 1 / SCROLLABLE_VH,          // 0.00254 — naslov sam
    p2End: 253 / SCROLLABLE_VH,        // 0.64377 — kraj uvoda, medij pun kadar
    p3End: 263 / SCROLLABLE_VH,        // 0.66921 — kraj snap pauze
    p4End: 1,
    // zFlip i p1End postoje samo zato što ih updateHero varijacije #1 čita;
    // ovde nema z-flipa (medij je uvek iznad pločica), pa su izjednačeni sa
    // p0End da nijedna grana ne ostane nedefinisana ako se kod ikad pomeša.
    zFlip: 1 / SCROLLABLE_VH,
    p1End: 253 / SCROLLABLE_VH
  };

  /* Perspektiva je 100vh — tako je i na referenci (izmereno: 720px na kadru
     visokom 720, 900px na 900). Zato NIJE konstanta nego se čita u measure();
     CSS je drži kao `perspective: 100vh`, a ovde mora biti isti broj jer se iz
     njega računa kad pločica stigne do ravni kamere. */
  var PERSPECTIVE = 900;

  /* ==========================================================================
     RASPORED PLOČICA — PREPISAN SA telescope.fyi, ne izmišljen

     Brojevi su IZMERENI sa reference (getComputedStyle nad njenih 12 `.media`
     elemenata) na dva viewport-a, 1280x720 i 1440x900, pa je iz razlike izveden
     i zakon skaliranja:
       x  = left  / vw     (leva ivica, NE centar)
       y  = top   / vh
       w  = width / vw     (visina ide iz `ar`, pa je odnos stranica fiksan)
       ar = width / height
       d  = dubinska konstanta (|translateZ| iz njihovog CSS-a)
     Levo i širina prate ŠIRINU kadra, vrh prati VISINU, a visina pločice opet
     širinu — tako je i na referenci, i zato se raspored ne prelama na drugim
     odnosima stranica.

     ⚠ U MIROVANJU JE translateZ NULA, ne `d`. `d` jeste zapisano u njihovom
     CSS-u, ali čim se njihov skript upali, on piše translateZ od nule naviše.
     Zato pločice posle uvodnog rasporeda stoje TAČNO na ovim koordinatama, a
     `d` odlučuje samo koliko brzo koja poleti ka posmatraču kad skrol krene.

     ⚠ TRI POLOŽAJA SU POMERENA U ODNOSU NA REFERENCU, na zahtev — referenca
     ima brend traku na DNU ekrana, a naša navigacija je na VRHU, pa su joj tri
     pločice ulazile u posao:
       i=4  spuštena sa y .050 na .150      — stajala je preko dugmeta
                                              "Pronađi posao" u headeru
       i=1  smanjena, levo i niže           — ove dve se preklapaju i zajedno
       i=2  smanjena, levo i niže             su prekrivale nav linkove
     Ostalih devet je netaknuto. Ako se ikad menja, menjaju se OVE tri, ne ceo
     raspored — on je merenje, ne procena.
  ========================================================================== */
  var IMAGES = [
    'assets/bb-zivot/storage-profili.png',
    'assets/bb-zivot/1-Autor-Zeljko-Stevanovic.jpg',
    'assets/bb-zivot/quote-01.png',
    'assets/bb-zivot/3-1-1024x683.jpg',
    'assets/bb-zivot/quote-02.png',
    'assets/bb-zivot/2d951b17-9587-4d63-b43b-902873edcb51.png'
  ];

  var TILES = [
    { x: -0.0500, y: 0.2100, w: 0.1150, ar: 1.00, d:  720 },
    { x:  0.2450, y: 0.2050, w: 0.0820, ar: 1.40, d:  360 },
    { x:  0.3150, y: 0.1350, w: 0.1000, ar: 1.10, d: 1080 },
    { x:  0.6240, y: 0.1100, w: 0.0760, ar: 0.90, d:  360 },
    { x:  0.8990, y: 0.1500, w: 0.0610, ar: 1.40, d:  360 },
    { x:  0.7980, y: 0.2800, w: 0.1320, ar: 0.90, d: 1080 },
    { x:  0.9680, y: 0.6041, w: 0.0470, ar: 1.10, d:  360 },
    { x:  0.7000, y: 0.7545, w: 0.1500, ar: 1.40, d:  720 },
    { x:  0.5370, y: 0.8796, w: 0.0830, ar: 1.40, d:  540 },
    { x:  0.1600, y: 0.6953, w: 0.1050, ar: 1.10, d:  360 },
    { x:  0.2900, y: 0.6688, w: 0.0590, ar: 1.15, d:  720 },
    { x:  0.0750, y: 0.4630, w: 0.0520, ar: 1.20, d:  360 }
  ];

  /* Koliko daleko svaka pločica odleti do kraja uvoda, kao višekratnik svoje
     dubinske konstante. IZMERENO na referenci: pločica sa d=720 završi na
     translateZ 1080, ona sa d=360 na 540 — dakle 1.5 × d u oba slučaja.
     Posledica je da one sa velikim d PROĐU pored posmatrača (1.5·1080 = 1620 je
     iza ravni kamere na 100vh), a one sa malim d samo narastu i ostanu. To je
     ono što pokretu daje dubinu umesto da celo polje ode u istom potezu. */
  var DEPTH_TRAVEL = 1.5;

  /* ==========================================================================
     UVODNI RASPORED — pločice dolete na svoja mesta pri učitavanju

     Sve troje je IZMERENO na referenci (uzorkovanje computed style-a frejm po
     frejm od trenutka učitavanja):
       - polazna dubina je −1.25 × d          (d=720 → −900, d=1080 → −1350,
                                               d=360 → −450, d=540 → −675)
       - trajanje po pločici ~1.85s
       - razmak između polazaka ~90ms, i to u OVOM redosledu, koji nije
         pozicioni nego promešan — zato stoji kao spisak, a ne kao formula
     INTRO_DELAY je naš: referenca ima svoj preloader pa joj prva pločica kreće
     tek oko 760ms, a kod nas stranica odmah stoji, pa se čeka samo toliko da
     prvi paint slegne.
  ========================================================================== */
  var INTRO_ORDER = [6, 9, 3, 1, 7, 2, 0, 4, 11, 8, 5, 10];
  var INTRO_DELAY = 180;      // ms pre nego što prva pločica krene
  var INTRO_STAGGER = 90;     // ms između polazaka
  var INTRO_DUR = 1850;       // ms po pločici
  var INTRO_START_DEPTH = -1.25;   // × d

  /* ==========================================================================
     HOVER — slika klizi za pokazivačem ("magnetni" efekat)

     IZMERENO na referenci: unutrašnji omotač slike se pomera za 0.30 × koliko
     je pokazivač odmakao od centra pločice, u ISTOM smeru. Zona osetljivosti je
     15% veća od same pločice sa svake strane (kod njih zaseban `.hover` sloj,
     kod nas `.v2-tile__hit`).

     Pomeranje se ne radi CSS tranzicijom nego lerpom po frejmu: tranzicija na
     svaki pomeraj miša stalno restartuje svoju krivulju i pokret ispadne
     "stepenast", dok lerp uvek juri trenutni cilj i ostaje gladak.
  ========================================================================== */
  var HOVER_PULL = 0.30;      // koliko slika prati pokazivač
  var HOVER_EASE = 0.14;      // koliko se približi cilju po frejmu
  /* Preko ovog napretka skrola hover se GASI: pločice tada lete kroz kadar i
     narastu preko pola ekrana, pa bi "magnetna" zona postala ogromna i hvatala
     pokazivač nasred videa. */
  var HOVER_LOCK_AT = 0.03;

  var tiles = [];
  // Indeks pločice nad kojom je pokazivač (−1 = nijedna) i njegova pozicija.
  // Stoje ovde, iznad izgradnje, jer ih listeneri koji se tamo kače zatvaraju.
  var hovered = -1;
  var pointerX = 0, pointerY = 0;

  /* ==========================================================================
     IZGRADNJA
  ========================================================================== */

  // Search bar se SELI unutar medija. To je ceo trik iza "video i search se
  // zumiraju zajedno": kutija je tačno viewport, bar u njoj stoji na svojih
  // 96px od dna, pa jedan scale() zumira oba i sleti na 1:1 bez ijednog
  // dodatnog računa. U varijaciji #1 bar ostaje gde je bio.
  mediaBox.appendChild(searchBlock);

  /* NASLOV OSTAJE TAČNO KAKAV JE U MARKUPU — ni jedan čvor se ne dira.
     Ranije su se redovi obavijali u <span class="v2-line"> da bi mogli da se
     razmiču gore i dole; sada naslov izlazi kroz kameru kao celina, pa mu treba
     samo jedan transform na samom h1 i nikakvo prepakivanje. */

  var scene = null;
  if (!PREFERS_REDUCED) {
    scene = document.createElement('div');
    scene.id = 'v2-scene';

    TILES.forEach(function (t, i) {
      var el = document.createElement('div');
      el.className = 'v2-tile';

      // Omotač slike je ono što se pomera na hover; sama <img> miruje u njemu.
      var wrap = document.createElement('div');
      wrap.className = 'v2-tile__img';
      var img = document.createElement('img');
      img.src = IMAGES[i % IMAGES.length];
      img.alt = '';
      // Pločice su ukras i sve ih ima 12 odjednom — lazy bi ih dovukao tek kad
      // uđu u kadar, a tada je već kasno: pojavile bi se prazne usred leta.
      img.decoding = 'async';
      wrap.appendChild(img);
      el.appendChild(wrap);

      // Zona osetljivosti, 15% šira od pločice sa svake strane (kao na
      // referenci). Jedini element u sceni koji uopšte prima pokazivač.
      var hit = document.createElement('div');
      hit.className = 'v2-tile__hit';
      el.appendChild(hit);

      scene.appendChild(el);
      tiles.push({
        el: el, wrap: wrap, def: t,
        introAt: 0,               // trenutak polaska, popunjava se niže
        hx: 0, hy: 0,             // trenutni pomeraj slike
        tx: 0, ty: 0,             // ciljni pomeraj slike
        cx: 0, cy: 0, w: 0, h: 0  // keširana geometrija za hover
      });

      /* ⚠ OBA listenera moraju da probude petlju. Ona se gasi čim se sve smiri,
         a `pointermove` prestaje da stiže onog trenutka kad pokazivač napusti
         scenu — bez buđenja na `pointerleave` slika ostane zauvek odgurnuta
         tamo gde ju je pokazivač poslednji put ostavio. (Dogodilo se.) */
      hit.addEventListener('pointerenter', function () { hovered = i; requestFrames(); });
      hit.addEventListener('pointerleave', function () {
        if (hovered === i) hovered = -1;
        requestFrames();
      });
    });

    INTRO_ORDER.forEach(function (idx, k) {
      if (tiles[idx]) tiles[idx].introAt = INTRO_DELAY + k * INTRO_STAGGER;
    });

    // Scena ide u stage; aria-hidden jer je čist ukras.
    scene.setAttribute('aria-hidden', 'true');
    stage.appendChild(scene);
  }

  if (scene) {
    scene.addEventListener('pointermove', function (e) {
      pointerX = e.clientX; pointerY = e.clientY;
      requestFrames();
    });
  }

  /* ==========================================================================
     MERENJE

     Sve što traži čitanje layouta radi se OVDE i kešira — render() ispod je
     čista aritmetika, jer ga Lenis zove na svaki scroll tick (isto pravilo po
     kom radi updateHero varijacije #1).
  ========================================================================== */
  var vw = 0, vh = 0;

  function measure() {
    vw = document.documentElement.clientWidth;
    vh = window.innerHeight;
    PERSPECTIVE = vh;                 // drži se uz `perspective: 100vh` u CSS-u

    /* Raspored je doslovno onaj sa reference: left/top su LEVA GORNJA IVICA i
       postavljaju se direktno, bez ijedne korekcije za dubinu. To sme baš zato
       što je translateZ u mirovanju nula — pločica posle uvoda stoji tačno
       ovde, u ovoj veličini. Perspektiva ulazi u igru tek kad z krene. */
    tiles.forEach(function (t) {
      var w = vw * t.def.w;
      var h = w / t.def.ar;
      t.el.style.width = w + 'px';
      t.el.style.height = h + 'px';
      t.el.style.left = (vw * t.def.x) + 'px';
      t.el.style.top = (vh * t.def.y) + 'px';
      // Centar u ekranskim koordinatama — hover se računa iz njega. Sme se
      // uzeti iz CSS box-a jer je hover ugašen čim skrol pomeri dubinu.
      t.w = w; t.h = h;
      t.cx = vw * t.def.x + w / 2;
      t.cy = vh * t.def.y + h / 2;
    });
  }

  /* ==========================================================================
     KADAR

     render() je JEDINI pisac transformi. Sabira tri izvora (uvod, hover,
     skrol), pa ga zovu i scroll listener i rAF petlja — koji god da je stigao,
     slika je uvek dosledna.
  ========================================================================== */
  var lastP = 0, lastExitY = 0;
  var introDone = PREFERS_REDUCED;
  var t0 = performance.now();

  function render(now) {
    var e = clamp(lastP / PHASE.p2End, 0, 1);          // napredak uvoda 0→1
    var camT = easeInOut(e);
    var locked = e > HOVER_LOCK_AT;

    if (scene) {
      if (locked && !scene.classList.contains('is-locked')) scene.classList.add('is-locked');
      else if (!locked && scene.classList.contains('is-locked')) scene.classList.remove('is-locked');
    }

    var stillAnimating = false;

    for (var i = 0; i < tiles.length; i++) {
      var t = tiles[i];

      /* --- 1. uvodni raspored (vreme) */
      var intro = 1;
      if (!introDone) {
        intro = clamp((now - t0 - t.introAt) / INTRO_DUR, 0, 1);
        if (intro < 1) stillAnimating = true;
      }
      var introEased = easeOutIntro(intro);
      var introZ = lerp(INTRO_START_DEPTH * t.def.d, 0, introEased);

      /* --- 2. let kroz kadar (skrol) */
      var tz = introZ + t.def.d * DEPTH_TRAVEL * camT;

      // Stigla je do ravni kamere ili je prošla — nema šta da se crta.
      if (tz > PERSPECTIVE - 40) { t.el.style.opacity = '0'; continue; }

      /* Neprozirnost: uvodno pojavljivanje (brže od pokreta, da pločica ne
         "iskrsne" tek kad je već blizu) × gašenje pred ravni kamere (bez njega
         bi nestala punom neprozirnošću i pročitala se kao rez). */
      var opIn = introDone ? 1 : clamp(intro * 2.2, 0, 1);
      var opNear = clamp((PERSPECTIVE - tz) / (PERSPECTIVE * 0.45), 0, 1);
      t.el.style.opacity = (opIn * opNear).toFixed(3);
      t.el.style.transform = 'translateZ(' + tz.toFixed(1) + 'px)';

      /* --- 3. hover (pokazivač) */
      if (!locked && hovered === i) {
        t.tx = (pointerX - t.cx) * HOVER_PULL;
        t.ty = (pointerY - t.cy) * HOVER_PULL;
      } else {
        t.tx = 0; t.ty = 0;
      }
      if (Math.abs(t.tx - t.hx) > 0.05 || Math.abs(t.ty - t.hy) > 0.05) {
        t.hx += (t.tx - t.hx) * HOVER_EASE;
        t.hy += (t.ty - t.hy) * HOVER_EASE;
        stillAnimating = true;
        t.wrap.style.transform = 'translate3d(' + t.hx.toFixed(2) + 'px,' + t.hy.toFixed(2) + 'px,0)';
      } else if (t.hx !== t.tx || t.hy !== t.ty) {
        // Dovoljno blizu cilja da se lerp više ne isplati — sedni tačno na
        // njega, jednim upisom, pa petlja može da stane.
        t.hx = t.tx; t.hy = t.ty;
        t.wrap.style.transform = 'translate3d(' + t.hx.toFixed(2) + 'px,' + t.hy.toFixed(2) + 'px,0)';
      }
    }

    if (!introDone && !stillAnimating) introDone = true;

    /* ---- Medij: zum iz tačke u sredini kadra do punog ekrana.
       Kreće posle pločica, pa se prvo vidi prostor a tek onda ono ka čemu se
       ide. Skala ide kroz isti easeInOut da bi u snap pauzu ušla mirno.

       ⚠ BEZ RADIJUSA. Ranije je radijus bio konstantan u EKRANSKIM pikselima,
       što je značilo deljenje sa skalom — a na skali od 0.02 to je davalo
       radijus veći od same kutije, pa se video pojavljivao kao pilula/elipsa i
       tek posle postajao pravougaonik. Traženo je da toga nema; referenca
       ionako ima oštre uglove. */
    var zoomT = span(e, 0.16, 1);
    var zoomEased = easeInOut(zoomT);
    var scale = lerp(0.015, 1, zoomEased);

    /* ---- Naslov: IZLAZI KROZ KAMERU, kao i pločice.

       ⚠ Ranije su se dva reda razmicala gore i dole. Promenjeno na zahtev:
       naslov sada ne ide ni gore ni dole nego prilazi posmatraču i izlazi iz
       kadra "prema nama", dakle isti pokret koji imaju pločice — jedna scena,
       jedan prostor.

       Vozi ga ISTI `zoomEased` koji vozi i zum videa, i to je poenta: naslov
       tako raste u korak sa ivicama videa koji dolazi ispod njega i ne odlepi
       se od njega. Da ima svoju krivulju, dva pokreta bi se razišla i pročitala
       kao dve nezavisne animacije u istom kadru.

       ⚠ 0.55 × P je KOLIKO DUBOKO IDE i taj broj je štimovan prema videu, ne
       izabran zbog samog naslova. Prividna skala je P/(P − z), pa 0.55 daje
       najviše 1/(1 − 0.55) ≈ 2.2×. Na 0.78 (≈4.5×) naslov je bežao daleko ispred
       videa: na polovini uvoda bio je ~1640px širok naspram ~730px koliko je
       tada video, pa se čitao kao da se odlepio i odleteo sam. Na 2.2× ivice
       ostaju blizu ivicama videa koji dolazi i dvoje se čita kao jedan pokret.

       Neprozirnost pada na nulu PRE nego što naslov stigne do ivice (traženo
       tako): uvećan tekst preko videa smeta više nego što pomaže, pa se gasi
       dok je još u kadru. */
    var headZ = PERSPECTIVE * 0.55 * zoomEased;
    heading.style.transform = 'translateZ(' + headZ.toFixed(1) + 'px)';
    heading.style.opacity = (1 - span(zoomT, 0.08, 0.50)).toFixed(3);

    mediaBox.style.opacity = String(span(zoomT, 0, 0.06));
    mediaBox.style.borderRadius = '0';
    mediaBox.style.transform =
      'translate(-50%, -50%) translateY(' + lastExitY.toFixed(1) + 'px) scale(' + scale.toFixed(4) + ')';
    mediaBox.style.zIndex = 20;

    // Search bar se ne anima zasebno — nosi ga skala kutije. Ostaje samo
    // horizontalno centriranje, koje je inače u CSS transformu koji ovde
    // prepisujemo.
    searchBlock.style.opacity = '1';
    searchBlock.style.transform = 'translateX(-50%)';

    return stillAnimating;
  }

  /* ==========================================================================
     rAF PETLJA — vrti se SAMO dok ima šta da se pomera

     Uvod i hover su jedini pokreti koji teku po vremenu; skrol ionako stiže
     kroz updateHero. Petlja se sama gasi kad se oba smire i ponovo pali na
     pokret pokazivača, pa u mirovanju stranica ne troši nijedan frejm.
  ========================================================================== */
  var running = false;
  function frame(now) {
    var more = render(now);
    if (more) requestAnimationFrame(frame);
    else running = false;
  }
  function requestFrames() {
    if (running || PREFERS_REDUCED) return;
    running = true;
    requestAnimationFrame(frame);
  }

  /* Kadar koji stiže sa skrola. Ne pokreće petlju — skrol i sam dolazi na
     svaki tick, pa bi dodatni rAF bio dupli posao za isti frejm. */
  function update(ctx) {
    lastP = ctx.p;
    lastExitY = ctx.exitY;
    render(performance.now());
  }

  /* Završni kadar bez ijednog pokreta — za prefers-reduced-motion.

     ⚠ IZLAZAK SE I OVDE MORA ODRADITI. Sve uvodno je ugašeno, ali exitY nije
     uvodna faza nego predaja sledećoj sekciji: bez njega video ostane zalepljen
     preko nje do kraja stranice. */
  function settle(ctx) {
    var exitY = (ctx && ctx.exitY) || 0;
    heading.style.opacity = '0';
    mediaBox.style.opacity = '1';
    mediaBox.style.borderRadius = '0';
    mediaBox.style.transform = 'translate(-50%, -50%) translateY(' + exitY.toFixed(1) + 'px)';
    mediaBox.style.zIndex = 20;
    searchBlock.style.opacity = '1';
    searchBlock.style.transform = 'translateX(-50%)';
  }

  measure();

  /* ==========================================================================
     START UVODA — čeka se da slike budu tu

     Skript stoji na dnu <body>-ja, dakle radi pre nego što se ijedna od 12
     fotografija dovuče. Da sat krene odmah, prve pločice bi doletele PRAZNE i
     slika bi im samo iskrsla na mestu — najuočljiviji mogući kvar baš na prvom
     ekranu. Zato se t0 postavlja tek kad su sve slike gotove.

     Tajmer je osigurač: jedna spora ili crknuta slika ne sme da zaustavi ceo
     uvod, pa se posle IMG_WAIT_CAP kreće bez obzira na to gde su.
  ========================================================================== */
  var IMG_WAIT_CAP = 1600;   // ms

  if (!PREFERS_REDUCED) {
    render(performance.now());   // prvi kadar: pločice na polaznoj dubini, providne

    var pending = tiles.length;
    var started = false;
    var begin = function () {
      if (started) return;
      started = true;
      t0 = performance.now();    // sat uvoda kreće OVDE, ne pri parsiranju
      requestFrames();
    };
    tiles.forEach(function (t) {
      var img = t.wrap.firstChild;
      if (img.complete) { if (--pending === 0) begin(); return; }
      var done = function () { if (--pending === 0) begin(); };
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
    setTimeout(begin, IMG_WAIT_CAP);
  }

  window.BB_VAR2 = {
    active: true,
    PHASE: PHASE,
    measure: measure,
    update: PREFERS_REDUCED ? settle : update
  };
})();
