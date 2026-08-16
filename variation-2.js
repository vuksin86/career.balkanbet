/* ##########################################################################
   VARIJACIJA #2 — uvodna animacija naslovne

   Rekonstrukcija uvoda sa telescope.fyi: polje sitnih slika raspoređeno oko
   naslova prolazi kroz kadar ka posmatraču, naslov se razmiče i gasi, a u
   sredini se zumira glavni medij. Kod nas je taj medij POSTOJEĆI hero video sa
   search barom, pa se na kraju animacije stiže na isti kadar kao u
   varijaciji #1 — odatle nadalje (snap pauza, izlazak, #openings) obe
   varijacije dele isti kod.

   KAKO SE UKLAPA U POSTOJEĆI HERO
   Ovaj fajl NE pravi svoj scroll listener. index.html i dalje ima jedan
   updateHero() koji Lenis zove na svaki tick; on na vrhu proveri
   window.BB_VAR2 i, ako je aktivna, prosledi kadar ovamo. Time ostaju
   zajednički: merenje spacera, izlazna faza (P4) i staklo headera — dakle
   tačno ono što ne sme da se razilazi između varijacija.

   ⚠ JEDNA SCENA, JEDNA PERSPEKTIVA. Ni pločice ni reči naslova nemaju
   sopstvenu formulu za razmicanje: svi dobijaju samo translateZ, a to što se
   šire ka ivicama kadra dok prilaze crta perspektiva. Ako se ovo ikad menja,
   menjati DUBINU (z), ne x/y — čim se x/y anima ručno, pokret prestane da
   izgleda kao jedan prostor i raspadne se na više nezavisnih animacija.
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
  var scrollBall = document.getElementById('hero-scroll-ball');
  if (!stage || !heading || !mediaBox || !searchBlock) return;

  var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  // Ease-in-out: kreće lagano, ubrza po sredini i staje bez trzaja. Isti profil
  // koji varijacija #1 dobija svojim easeOutCubic na kraju uvoda — bitno je da
  // u snap pauzu uđe sa ~nultom brzinom, inače se pauza čita kao naglo kočenje.
  var easeInOut = function (t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  // Glatko 0→1 na zadatom intervalu; koristi se za sve "od kad do kad" pragove
  // umesto lomljenih linearnih rampi.
  var span = function (v, a, b) { return clamp((v - a) / (b - a), 0, 1); };

  /* ==========================================================================
     FAZE — razlomci skrolabilnog raspona (393vh), izvedeni iz vh budžeta
     zapisanih iznad #hero-spacer u variation-2.css:
       P0 1vh | uvod 252vh | P3 10vh | P4 130vh   (spacer 493vh)
     Menja se jedno, preračunava se drugo.

     p4End i razlika p4End−p3End (130vh) MORAJU ostati iste kao u varijaciji #1
     u vh izrazu — na njima stoji margin-top: -130vh sekcije #openings.
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

  var PERSPECTIVE = 1000;   // mora se poklapati sa perspective u variation-2.css

  /* ==========================================================================
     RASPORED PLOČICA

     x/y su procenti stage-a i to je POZICIJA CENTRA pločice; w je širina u
     procentima MANJE stranice kadra (min(vw,vh)), pa polje drži isti odnos i
     na širokom i na uskom ekranu. z0 je početna dubina.

     Raspored je prsten oko sredine: naslov drži centar, pa pločice kreću sa
     strane i odozgo/odozdo. Preklapanje sa naslovom nije problem — pločice se
     pale tek kad naslov počne da se gasi (videti tileOpacity niže).

     z0 je NAMERNO neravnomeran: da su na pravilnom razmaku, pločice bi
     prolazile u taktu i pokret bi se čitao kao mehanička povorka umesto kao
     prolazak kroz prostor.
  ========================================================================== */
  /* ⚠ SAMO FOTOGRAFIJE. assets/values/*.png i assets/bb-zivot/benefit-*.png su
     ikonice — providni PNG-ovi sa sitnim žutim glifom — i u ovom polju se čitaju
     kao prazni tamni pravougaonici, ne kao slike. Fotografija na sajtu ima
     svega šest, pa se ciklus ponavlja; to se ne vidi jer pločice nikad nisu
     istovremeno na istoj dubini ni istoj veličini. */
  var IMAGES = [
    'assets/bb-zivot/storage-profili.png',
    'assets/bb-zivot/1-Autor-Zeljko-Stevanovic.jpg',
    'assets/bb-zivot/quote-01.png',
    'assets/bb-zivot/3-1-1024x683.jpg',
    'assets/bb-zivot/quote-02.png',
    'assets/bb-zivot/2d951b17-9587-4d63-b43b-902873edcb51.png'
  ];

  var TILES = [
    { x: 11, y: 20, w: 15, ar: 0.72, z: -2450 },
    { x: 31, y:  9, w: 12, ar: 1.35, z: -1500 },
    { x: 53, y: 12, w: 10, ar: 0.80, z: -2850 },
    { x: 73, y:  8, w: 14, ar: 1.30, z: -1850 },
    { x: 90, y: 23, w: 11, ar: 0.75, z: -2600 },
    { x: 95, y: 52, w: 16, ar: 1.20, z: -1250 },
    { x: 83, y: 80, w: 12, ar: 0.78, z: -2200 },
    { x: 63, y: 92, w: 15, ar: 1.40, z: -1650 },
    { x: 39, y: 88, w: 11, ar: 0.82, z: -2950 },
    { x: 18, y: 79, w: 14, ar: 1.25, z: -1400 },
    { x:  5, y: 50, w: 12, ar: 0.76, z: -2050 },
    { x: 78, y: 40, w:  9, ar: 1.10, z: -3200 }
  ];

  var tiles = [];
  var words = [];

  /* ==========================================================================
     IZGRADNJA
  ========================================================================== */

  // Search bar se SELI unutar medija. To je ceo trik iza "video i search se
  // zumiraju zajedno": kutija je tačno viewport, bar u njoj stoji na svojih
  // 96px od dna, pa jedan scale() na kutiji zumira oba i sleti na 1:1 bez
  // ijednog dodatnog računa. U varijaciji #1 bar ostaje gde je bio.
  mediaBox.appendChild(searchBlock);

  // Reči naslova. Obavija se SAMO tekst — <br>-ovi i .hero-heading__lead
  // ostaju netaknuti, pa prelom u tri reda i žuta prva rečenica dolaze iz
  // postojećih pravila i ovde se ne ponavljaju.
  function wrapWords(node) {
    var kids = Array.prototype.slice.call(node.childNodes);
    kids.forEach(function (child) {
      if (child.nodeType === 1) { wrapWords(child); return; }   // npr. .hero-heading__lead
      if (child.nodeType !== 3) return;
      var text = child.nodeValue;
      if (!text.trim()) return;
      var frag = document.createDocumentFragment();
      // Razmaci se čuvaju kao zasebni čvorovi: inline-block reč bez njih bi se
      // slepila sa susednom.
      text.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
        var s = document.createElement('span');
        s.className = 'v2-word';
        s.textContent = part;
        frag.appendChild(s);
      });
      node.replaceChild(frag, child);
    });
  }
  wrapWords(heading);
  words = Array.prototype.slice.call(heading.querySelectorAll('.v2-word'));

  var scene = null;
  if (!PREFERS_REDUCED) {
    scene = document.createElement('div');
    scene.id = 'v2-scene';
    scene.setAttribute('aria-hidden', 'true');   // čist ukras, ne sadržaj

    TILES.forEach(function (t, i) {
      var el = document.createElement('div');
      el.className = 'v2-tile';
      var img = document.createElement('img');
      img.src = IMAGES[i % IMAGES.length];
      img.alt = '';
      // Pločice su ukras i sve ih ima 12 odjednom — lazy bi ih dovukao tek kad
      // uđu u kadar, a tada je već kasno: pojavile bi se prazne usred leta.
      img.decoding = 'async';
      el.appendChild(img);
      scene.appendChild(el);
      tiles.push({ el: el, def: t });
    });
    stage.appendChild(scene);
  }

  /* ==========================================================================
     MERENJE

     Sve što traži čitanje layouta radi se OVDE i kešira — update() ispod je
     čista aritmetika, jer ga Lenis zove na svaki scroll tick (isto pravilo po
     kom radi updateHero varijacije #1).
  ========================================================================== */
  var vw = 0, vh = 0, unit = 0;
  var wordDirs = [];

  function measure() {
    vw = document.documentElement.clientWidth;
    vh = window.innerHeight;
    unit = Math.min(vw, vh);

    /* ⚠ PLOČICE SE POSTAVLJAJU U PROSTORU, NE NA EKRANU — ovo je jedina
       netrivijalna računica u fajlu i lako se pogreši.

       x/y/w u TILES su gde pločica treba da se VIDI, ali perspektiva sve što
       je duboko vuče ka nedogledu (sredini kadra) i smanjuje. Postave li se te
       vrednosti direktno kao left/top/width, na dubini od −2500 se celo polje
       skupi u gomilicu u sredini ekrana. (Prvo je tako i bilo.)

       Zato se svaka vrednost pomnoži faktorom sopstvene dubine
         k = (P − z0) / P
       koji je tačno inverz perspektivnog umanjenja na toj dubini. Pločica time
       na svom z0 pada tačno na projektovano mesto i u projektovanoj veličini, a
       kako prilazi kameri i k opada, sama se širi ka ivicama kadra — to
       razmicanje je posledica prostora, ne posebne animacije. */
    tiles.forEach(function (t) {
      var k = (PERSPECTIVE - t.def.z) / PERSPECTIVE;
      var w = unit * t.def.w / 100 * k;
      var h = w / t.def.ar;
      // Odstojanje od centra kadra takođe ide kroz k — inače bi veličina bila
      // tačna a raspored i dalje zgužvan u sredinu.
      var cx = vw / 2 + (vw * t.def.x / 100 - vw / 2) * k;
      var cy = vh / 2 + (vh * t.def.y / 100 - vh / 2) * k;
      t.el.style.width = w + 'px';
      t.el.style.height = h + 'px';
      // left/top nose CENTAR pločice, pa ide -50%/-50% u transformu niže.
      t.el.style.left = (cx - w / 2) + 'px';
      t.el.style.top = (cy - h / 2) + 'px';
    });

    // Smer razmicanja reči: čita se JEDNOM, iz mirnog stanja naslova. Mora se
    // meriti bez ijednog transforma na rečima, inače bi svako sledeće merenje
    // (resize usred skrola) čitalo već pomerene reči i smer bi počeo da luta.
    words.forEach(function (w) { w.style.transform = ''; });
    var box = heading.getBoundingClientRect();
    var mid = box.left + box.width / 2;
    wordDirs = words.map(function (w) {
      var r = w.getBoundingClientRect();
      var d = (r.left + r.width / 2) - mid;
      // Reč tačno na sredini nema smer — dobija znak po redosledu, da ne ostane
      // da stoji dok se sve oko nje razilazi.
      if (Math.abs(d) < 1) return 1;
      return d < 0 ? -1 : 1;
    });
  }

  /* ==========================================================================
     KADAR
  ========================================================================== */
  function update(ctx) {
    var p = ctx.p, exitY = ctx.exitY;
    var e = clamp(p / PHASE.p2End, 0, 1);          // napredak uvoda 0→1

    /* ---- Kamera. Jedan broj vozi celu scenu: koliko je posmatrač odmakao
       napred. Sve pločice i naslov dele isti pomeraj, pa se kadar čita kao
       jedan prostor kroz koji se prolazi. */
    var camZ = easeInOut(e) * 3400;

    /* ---- Pločice */
    for (var i = 0; i < tiles.length; i++) {
      var t = tiles[i];
      var tz = t.def.z + camZ;
      // Iza kamere ili tik uz nju — sklanja se iz posla. display umesto opacity:
      // pločica koja je prošla ne treba ni da se kompozituje.
      if (tz > PERSPECTIVE - 40) { t.el.style.opacity = '0'; continue; }

      // Pale se zajedno na početku skrola (na p=0 kadar je čist naslov), a gase
      // se pojedinačno kako prilaze ravni kamere — bliska pločica koja bi
      // nestala punom neprozirnošću čita se kao rez, ne kao prolazak.
      var opIn = span(e, 0.02, 0.14);
      var opOut = clamp((PERSPECTIVE - tz) / 520, 0, 1);
      t.el.style.opacity = String(opIn * opOut);
      t.el.style.transform = 'translate(-50%, -50%) translateZ(' + tz.toFixed(1) + 'px)';
    }

    /* ---- Naslov: razmicanje + gašenje.

       Naslov i zum se NAMERNO PREKLAPAJU. Prvo su išli jedan za drugim (reči
       odu, pa tek onda video počne da raste) i sredina kadra je ostajala prazna
       nekoliko desetina skrola — čitalo se kao da se animacija pokvarila. Sada
       video počne da raste dok se reči još razmiču, pa raste kroz procep koji
       one otvaraju; to je i ono što se vidi na referenci.

       Skala umesto translateZ: naslov nije u #v2-scene i nema perspektivnog
       pretka, pa Z ovde ne bi radio ništa. Na ravnoj površini je dolazak
       kamere ionako čisto uvećanje, tako da je rezultat isti a računica
       vidljiva. */
    var headT = span(e, 0.06, 0.72);
    var headEased = easeInOut(headT);
    heading.style.transform = 'scale(' + (1 + 0.5 * headEased).toFixed(4) + ')';
    // Gasi se TEK pošto su reči već dobrano razmaknute — da se pamti kao
    // "razišao se", a ne kao "nestao".
    heading.style.opacity = String(1 - span(e, 0.42, 0.72));

    for (var w = 0; w < words.length; w++) {
      // vw * 0.5 je taman toliko da i najkraća reč izađe iz kadra do kraja.
      var tx = wordDirs[w] * vw * 0.5 * headEased;
      words[w].style.transform = 'translateX(' + tx.toFixed(1) + 'px)';
    }

    /* ---- Loptica ide sa naslovom, isto kao u varijaciji #1. */
    if (scrollBall) {
      var ballOp = 1 - span(e, 0.04, 0.30);
      scrollBall.style.opacity = String(ballOp);
      scrollBall.style.transform = 'translateX(-50%) translateY(' + (-vh * 0.18 * span(e, 0.04, 0.30)).toFixed(1) + 'px)';
      var gone = ballOp <= 0;
      if (scrollBall.hidden !== gone) scrollBall.hidden = gone;
    }

    /* ---- Medij: zum iz tačke u sredini kadra do punog ekrana.
       Kreće posle pločica, pa se prvo vidi prostor a tek onda ono ka čemu se
       ide. Skala ide kroz isti easeInOut da bi u snap pauzu ušla mirno. */
    var zoomT = span(e, 0.16, 1);
    var zoomEased = easeInOut(zoomT);
    var scale = lerp(0.015, 1, zoomEased);
    // Radijus prati skalu tako da IZGLEDA konstantan dok je kadar mali, pa
    // sleti na 0 kad postane pun ekran — na punom ekranu zaobljeni uglovi
    // seku četiri zareza u samom ekranu (isti razlog kao u varijaciji #1).
    var radius = lerp(26, 0, span(zoomT, 0.75, 1));

    mediaBox.style.opacity = String(span(zoomT, 0, 0.06));
    mediaBox.style.borderRadius = (radius / Math.max(scale, 0.02)).toFixed(1) + 'px';
    mediaBox.style.transform =
      'translate(-50%, -50%) translateY(' + exitY.toFixed(1) + 'px) scale(' + scale.toFixed(4) + ')';
    mediaBox.style.zIndex = 20;

    // Search bar se ne anima zasebno — nosi ga skala kutije. Ostaje samo
    // horizontalno centriranje, koje je inače u CSS transformu koji ovde
    // prepisujemo.
    searchBlock.style.opacity = '1';
    searchBlock.style.transform = 'translateX(-50%)';
  }

  /* Završni kadar bez ijednog pokreta — za prefers-reduced-motion.

     ⚠ IZLAZAK SE I OVDE MORA ODRADITI. Sve uvodno je ovde ugašeno, ali exitY
     nije uvodna faza nego predaja sledećoj sekciji: bez njega video ostane
     zalepljen preko #openings do kraja stranice. Zato ovo nije "ne radi ništa"
     nego "odmah je na kraju uvoda, a dalje se ponaša normalno". */
  function settle(ctx) {
    var exitY = (ctx && ctx.exitY) || 0;
    heading.style.opacity = '0';
    mediaBox.style.opacity = '1';
    mediaBox.style.borderRadius = '0';
    mediaBox.style.transform = 'translate(-50%, -50%) translateY(' + exitY.toFixed(1) + 'px)';
    mediaBox.style.zIndex = 20;
    searchBlock.style.opacity = '1';
    searchBlock.style.transform = 'translateX(-50%)';
    if (scrollBall) scrollBall.hidden = true;
  }

  measure();

  window.BB_VAR2 = {
    active: true,
    PHASE: PHASE,
    measure: measure,
    update: PREFERS_REDUCED ? settle : update
  };
})();
