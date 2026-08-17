# Balkan Bet - Careers sajt (mockup)

## Šta je ovo
Pixel-perfect vizuelni mockup careers sajta za "Balkan Bet" (kladioničarska firma), za 
prikaz klijentu. Statični HTML/CSS/JS fajlovi, bez backend-a. Originalna struktura je 
klonirana sa careers.kaizengaming.com, ali je SAD KOMPLETNO IZBRENDIRANA u Balkan Bet 
identitet - Kaizen referenca više nije relevantna, ne gledati stare Kaizen 
fajlove/screenshot-ove u reference/ folderu za budući rad, osim ako se eksplicitno ne 
kaže drugačije.

## Fajlovi (VAŽNO pre bilo koje izmene)
- **index.html** - homepage
- **listanje.html** - listing otvorenih pozicija, sa filterom koji stvarno radi. 
  ⚠ NIJE isto što i "Poslovi u lokalima" - to će biti ZASEBNA stranica koja još ne 
  postoji (nav link za nju stoji na `#`). Na listanje se dolazi klikom na "Pronađi 
  posao", "Pretraži", "Pogledaj sve pozicije" i footer CTA kartice. Fajl se ranije zvao 
  poslovi-u-lokalima.html
- **oglas-primer.html** - template pojedinačnog oglasa + forma za prijavu
- **styles.css** - JEDAN zajednički stylesheet za SVE tri stranice (@font-face, 
  .animated-bg, .scroll-progress, hero, .hero-search, .zivot-tile, .opening-card, 
  .page-hero, .search-band, .jf-* filter bar, .nocv-toggle, .jobs-panel, .job-card, 
  .talent-cta, .fld-* polja forme, .info-card, prefers-reduced-motion blok). Stoji u root-u NAMERNO - url() putanje do fontova su relativne 
  (assets/fonts/...), pa bi premeštanje u podfolder polomilo fontove. CSS više NIJE 
  inline u index.html
- **theme-dark.css** - TAMNA TEMA, aditivni sloj i **JEDINA tema sajta**. Učitava se na 
  SVE TRI stranice posle styles.css. Pravila važe dok `<html>` ima `data-theme="dark"`, a 
  taj atribut stoji ZAKUCAN u markupu i NIŠTA GA VIŠE NE SKIDA - svetla varijanta je 
  povučena na zahtev. Ovde živi i `.var-toggle` (prekidač varijacija). Videti sekciju 
  "Tamna tema" niže
- **variation-2.css** / **variation-2.js** - VARIJACIJA #2 dizajna, za sada samo hero 
  naslovne. Sva pravila su pod `[data-var="2"]`, pa bez tog atributa fajlovi ne rade 
  ništa i varijacija #1 (original) ostaje netaknuta. Videti sekciju "Varijacije dizajna"
- **brand-setup.js** - Tailwind (Play CDN) config sa brend tokenima, učitava se odmah 
  posle CDN skripte na sve tri stranice
- **job-filter.js** - custom dropdown-i za filter barove + srpska množina za brojive 
  imenice ("1 poziciju / 2-4 pozicije / 5+ pozicija"). Ista mehanika u DVA SKINA 
  (SKINS objekat): `jf` (kompaktni bar na oglas-primer.html + sortiranje na listanju) i 
  `hero` (.hero-search bar). `initBar(bar, {skin, fields, onChange, onSubmit})` vraća 
  `{values, set, refill}`; `refill` služi kad izbor u jednom tabu poništi listu drugog

### ⚠ HEADER I FOOTER SU ZAKUCANI - IDENTIČNI NA SVE TRI STRANICE
Header i footer su DUPLIRANI kao markup na sve tri stranice (nema build koraka, a 
statični mockup ne treba da zavisi od JS-a da bi nacrtao svoju navigaciju).
**index.html je IZVOR ISTINE.** Pravilo je strogo: blokovi moraju biti BYTE-IDENTIČNI 
na sve tri stranice. Kad se menja header/footer, promeni SAMO u index.html pa prekopiraj 
ceo `<header>…</header>` i ceo `<footer>…</footer>` u druge dve stranice bez ijedne 
izmene.
- NEMA ničeg page-specific u njima: ni per-page aktivnog stanja (raniji 
  `text-brand-yellow` na "Poslovi u lokalima" na podstranicama je UKLONJEN), ni 
  per-page href-ova. Logo svuda vodi na index.html.
- Podstranice su do sada nosile STARI, neizbrendiran futer ("Postani deo našeg tima?" 
  tekst box); zamenjen je aktuelnim futerom sa dve .footer-cta kartice
- Provera da nisu odlutali (hešuje se blok iz sva tri fajla, sva tri moraju biti ista):
  ```
  for f in index.html listanje.html oglas-primer.html; do printf "%-20s %s %s\n" "$f" \
    "$(sed -n '/^<header /,/^<\/header>/p' $f | md5sum | cut -c1-8)" \
    "$(sed -n '/^<footer /,/^<\/footer>/p' $f | md5sum | cut -c1-8)"; done
  ```
- U banner komentarima iznad ta dva bloka NE PISATI doslovno `</header>` ni `</footer>` 
  kao deo teksta - kopiranje se radi matchovanjem od banner-a do prvog zatvarajućeg 
  taga, pa takav tekst u komentaru preseče blok na pola (dogodilo se)

## Brend - Balkan Bet
### Boje
- #FDB813, #FDB913, #FAA61A - nijanse žute/narandžaste (primarni brend akcenti)
- **#ffbb1a - CTA žuta.** Popuna SVAKOG dugmeta sa žutom pozadinom: header "Pronađi posao", 
  "Prijavi se" na karticama pozicija (i na naslovnoj i na listanju - to je isti komponent), 
  i žuti hover stanja tamne pilule "Saznaj više o nama". Živi kao ZASEBAN token 
  `brand.cta` u brand-setup.js, NE kao izmena `brand.yellow` - ta i dalje boji tekst, 
  ikonice i marker sweep, što nije bilo deo zahteva. Razlika je mala (253,184,19 vs 
  255,187,26); ako dugme ikad deluje neusklađeno pored ikonice, to je razlog
- #231F20 - tamna (zamenjuje sve stare tamne/braon boje)
- #FFFFFF - bela
- Animirana pozadina (.animated-bg) koristi #FAA61A (dominantna) i #FFCB05 (blob-ovi, 
  pokretni) - NE MENJATI ove specifične vrednosti bez eksplicitnog zahteva

### Font
NeoSansW1G, 4 težine (fajlovi u assets/fonts/ ili gde su postavljeni):
- **Medium (500) - SVI DISPLAY NASLOVI**, h1/h2/h3 na sve tri stranice. Traženo tako; 
  ranije su bili `font-extrabold` (800, što je NeoSans ionako vraćao na Bold 700). U 
  markupu je to Tailwindova klasa `font-medium`; JEDINI naslovi koji težinu dobijaju iz 
  CSS-a su `.footer-cta__title` (font-weight: 500 u styles.css) - njih zamena klasa ne 
  hvata, pa se moraju menjati posebno
- Bold - podnaslovi kartica, nazivi pozicija, sitniji bold akcenti
- Medium - nav linkovi, CTA dugmad, isticanja
- Regular - običan tekst
- Light - sitniji tekst
Svuda gde je tekst caps-lock, koristi text-transform: uppercase (ne menjati sam HTML tekst)

⚠ **LumieraHandwriting** i **PatrickHand** su i dalje @font-face-ovani na vrhu styles.css,
ali ih VIŠE NIŠTA NE KORISTI - služili su samo sekciji "Proces zapošljavanja", koja je
uklonjena. Brisati ih tek ako je sigurno da se ta sekcija ne vraća.

### Logo
BalkanBetLogo.svg - žuta lopta/krug sa gradijentom + "BALKAN BET / PUN POGODAK" tekst

## Struktura HOMEPAGE-a (index.html, redosled sekcija)
0. **SCROLL PROGRESS RAIL** (`.scroll-progress`) - tanka traka od 2px prikovana za sam vrh 
   ekrana, IZNAD headera (z-60 naspram headerovih z-50, pa se crta preko gornje ivice 
   trake). Podloga je brend žuta na 10% alfe i stoji tu od prvog paint-a; popuna 
   (`.scroll-progress__fill`) je puna žuta #FDB813 i raste s leva na desno do 100% na dnu 
   stranice. SAMO NA NASLOVNOJ - markup stoji u index.html, odmah posle .animated-bg i 
   IZVAN `<header>`-a (koji mora ostati byte-identičan na sve tri stranice).
   - popuna se SKALIRA, ne meri: `transform: scaleX()` na elementu koji je već pun širine, 
     pa je svaki scroll frejm promena samo na kompozitoru, bez layout-a i bez paint-a. 
     `transform-origin: left` je ono što je tera da raste s leva
   - ⚠ progres se čita ISKLJUČIVO iz `lenis.on('scroll')`, kao i sve ostalo na stranici - 
     NE iz window.scrollY (videti desync bag opisan u tački 2)
   - dužina skrola (`scrollHeight - innerHeight`) se MERI I KEŠIRA, ne čita se po frejmu 
     (scrollHeight forsira layout). measureProgress() je zato i u remeasureAll(), uz 
     measureImpact/measureProcess - kartice i fontovi koji stignu kasno menjaju visinu 
     stranice, a to je tačno taj broj
1. Header - fiksiran, FULL-BLEED: `top-0 inset-x-0`, puna širina od ivice do ivice, BEZ 
   radijusa i BEZ max-width-a. Ranije je bio plutajuća pilula (`top-6`, `max-w-[1300px]`, 
   `rounded-full`, okvir sa sve četiri strane) - UKLONJENO na eksplicitan zahtev, ne 
   vraćati. Staklena podloga (`bg-brand-dark/40` + `backdrop-blur-md`) OSTAJE jer header 
   stoji preko hero videa; okvir je sada SAMO donji (`border-b`) - na traci koja ide od 
   ivice do ivice, levi/desni/gornji rub punog okvira padaju na ivice ekrana i čitaju kao 
   greška.
   ⚠ NA NASLOVNOJ traka STARTUJE BEZ IČEGA - bez pozadine, bez okvira, bez blura, samo 
   logo/linkovi/CTA lebde preko videa. Staklo dobija tek kad hero POČNE DA IZLAZI (prag je 
   HERO_PHASE.p3End, kraj snap pauze); updateHero dodaje/skida `.is-solid` na header. 
   Mehanika je u styles.css, sekcija "HEADER - transparent while the hero owns the screen":
   - opseg su DVA markera, po jedan za stranicu koja to ponašanje ima: 
     `body:has(#hero-spacer)` (postoji samo na index.html) i `body:has(.page-hero--flush)` 
     (postoji samo na listanje.html). Header markup mora ostati byte-identičan na sve tri 
     stranice, pa se per-page ponašanje ne sme pisati kao klasa u markupu nego se 
     zaključuje iz onoga što je još na stranici. oglas-primer.html nosi običan 
     `.page-hero` bez `--flush`, ne matchuje nijedan selektor, i traka mu je uvek puna - 
     što tamo i treba. Ko pali `.is-solid` se razlikuje: na naslovnoj updateHero() na 
     kraju snap pauze, na listanju trenutak kad panel sa rezultatima stigne do headera 
     (videti listanje.html niže) - ista klasa, dva različita okidača
   - pravilo je pisano kao `:not(.is-solid)`, dakle SKIDA fill umesto da ga crta. Zato puno 
     stanje ostaje tačno ono što piše u markupu (bg-brand-dark/40, backdrop-blur-md, 
     border-white/20) i nema druge kopije tih vrednosti koja bi odlutala. Usput, PRVI PAINT 
     je providan, pre nego što ijedan skript odradi - nema blesak pune trake
   - backdrop-filter se NE tranzicionira (none → blur ne interpolira, seče). Taj rez pada 
     tačno kad video klizi gore punom brzinom, pa se ne vidi. Ne pokušavati fade
   - dok je providna, sadržaj trake nosi `filter: drop-shadow(...)`. NIJE dekoracija: žuti 
     "BET" u logotipu se bez tamnog stakla iza sebe gubi na narandžastoj aurori (ranije je 
     čitao naspram stakla, ne naspram stranice), a preko videa se svetlina menja iz kadra u 
     kadar. Ako logo ikad stigne u potpuno beloj varijanti za ovo stanje, senka može da ode
   BalkanBetLogo je visok 60px (ranije 51.2px). Traka NEMA svoju fiksnu visinu - ona je logo 
   + py-3 wrappera, pa dizanje logotipa je ono što diže header, sa ~76px na ~85px. 
   **NAV LINKOVI, tačan redosled (traženo eksplicitno):** „O kompaniji", „Život u Balkan 
   Betu", „Poslovi u lokalima", „Poslovi u centrali", „CSR", „Kontakt". Šest ih je, ranije 
   pet (Poslovi u lokalima / Posao u centrali / O nama / Život u Balkan Betu / Kontakt) - 
   „O nama" je postalo „O kompaniji", „Posao u centrali" je prešao u množinu, „CSR" je nov, 
   i ceo redosled je promenjen. U markupu stoje u rečeničnom slučaju; verzali dolaze iz 
   `uppercase` klase, po opštem pravilu sajta. Caps-lock, 16px, Medium, letter-spacing 
   -0.06em, padding 30px levo/desno na celom nav baru; CTA dugme "Pronađi posao" desno - bold, puna žuta #FDB813 sa BELIM slovima 
   (ista boja kao "Prijavi se" dugmad na karticama pozicija). JEDINI CTA na sajtu koji 
   NIJE caps-lock - eksplicitan zahtev. Ranije je imao .cta-gradient pozadinu i uppercase, 
   ne vraćati
2. Hero - h1 naslov **"UĐI U IGRU." / "BUDI DEO TIMA."** - DVA REDA, jedna rečenica po
   redu (traženo tako; bila su tri reda i pisalo je "Uskoči"). Bold, letter-spacing
   -0.06em; u tamnoj temi je prva rečenica žuta a druga bela.
   ⚠ `<br>` između njih je NOSEĆI za varijaciju #2 - ona iz njega izvodi dva bloka koja
   se razilaze gore i dole. Scroll-driven animacija: 
   - video (assets/video/BalkanBet.mp4) ulazi odozdo, ide iza donja 2 reda teksta pa 
     ispred gornja 2 reda (z-index skok)
   - h1 se lagano smanjuje (scale down) dok video ulazi
   - kad video počne da prekriva h1, h1 nastavlja gore uz fade-out opacity
   - video se širi do max veličine = CEO EKRAN, edge-to-edge (maxBoxW = vw, maxBoxH = vh), 
     i prolazi ISPOD fiksiranog headera - zato header i jeste providna staklena traka. 
     Ranije je stajao 30px od leve, desne i donje ivice, a gornjom ivicom na polovini 
     visine navigacije (heroNavMid, čitano iz headera). Sve to je UKLONJENO na eksplicitan 
     zahtev; raniji zapis je govorio suprotno ("NE praviti fullscreen, probano, odbijeno") 
     - klijent je posle tražio baš fullscreen. Dve posledice, obe već sprovedene:
       * box je opet simetričan oko centra ekrana, pa je boxCentreOffset (koji je 
         nadoknađivao nejednake gornji/donji inset) identički nula i OBRISAN je
       * heroNavMid i merenje headera u measureHero() više ne postoje - ništa ne zavisi 
         od geometrije navigacije
   - corner radius se ANIMIRA lerp(32 → 0) po revealT, tj. sleti na 0 tačno kad box dostigne 
     punu veličinu. Bio je konstantnih 32px dok video nikad nije išao preko celog ekrana; na 
     fullscreen-u bi ta zaobljenja isekla četiri zareza na uglovima samog ekrana
   - preko DONJEG dela videa ide TAMAN overlay (.hero-media-fade, gradijent do #000 
     na 0.78 alfe; bio je #231F20, a pre toga žut do #FAA61A - ne vraćati ni jedno ni 
     drugo). SVI tamni overlay-i na sajtu su #000 (ovaj, scrim-ovi mozaika, scrim CTA 
     kartica u futeru) - eksplicitan zahtev, ne prevoditi ih na brand-dark. 
     Stoji UNUTAR #hero-media-box da nasledi njegov overflow clip i zaobljene ivice i da 
     putuje sa njim; visina mu je u procentima da zadrži isti odnos dok box raste.
     ⚠ NAMERNO PRELAZI 1px preko leve, desne i donje ivice box-a (left/right/bottom: -1px, 
     height: calc(42% + 1px)). updateHero box-u daje razlomljene piksele (lerp), pa box i 
     ovaj sloj nezavisno zaokružuju svoje pravougaonike - na nekim visinama overlay padne 
     piksel kraće i na dnu videa se pojavi svetla linija punom širinom, kao da je overlay 
     "pobegao gore za 1px". Prelaz se ne vidi jer je roditelj overflow:hidden
   - search blok je SPUŠTEN DOLE (CSS bottom: 96px, NIJE više top:50%). Zato updateHero 
     za njega koristi samo translateX(-50%) - ne vraćati vertikalni -50%, vratio bi ga 
     na sredinu videa
   - search je u JEDNOM redu, po uzoru na booking-style bar: ŽUTI okvir (#FDB913 - 
     NAJSVETLIJA od tri brend žute, luminancija 187.5 vs 186.8 i 173.8) u kome su TRI 
     ODVOJENA BELA TABA + CRNO dugme "Pretraži" (#231F20). Tabovi: (1) Vrsta posla - 
     bira se Poslovi u lokalima / Posao u centrali, (2) Lokacija, (3) Pozicija.
     Tab 1 UPRAVLJA ostalima - na promenu se PUNE OBA: za "lokali" lokacije su SVE 
     opštine Srbije (144, bez KiM, sortirane) i pozicije iz poslovnica; za "centralu" 
     lokacije su samo Beograd i Novi Sad, a pozicije centralske (Marketing, IT, 
     Finansije...). Raniji zaseban .hero-switch iznad bara je UKLONJEN - switcher je 
     sada tab 1. Stare stat kartice (19 Locations / 72 Open Roles) su UKLONJENE. 
     Tabovi NISU <select> nego CUSTOM dropdown-i (trigger dugme + panel). Razlog: 
     native <option> IGNORIŠE padding i line-height (Chrome na Windows-u ih crta po 
     sistemskoj metrici), pa traženi razmak u padajućem meniju sa njima nije moguć. 
     Meni se otvara NAGORE (bottom: calc(100% + 6px)) - bar stoji 96px od dna stage-a 
     koji ima overflow:hidden, pa bi nadole bio odsečen. Bez ikonica.
     ⚠ SVI ELEMENTI U BARU IMAJU JEDNAKU ŠIRINU - i tabovi i checkbox i dugme 
     "Pretraži". Zato je `.hero-search` **GRID** (`grid-auto-flow: column` + 
     `grid-auto-columns: 1fr`), a NE flex - NE vraćati na flex. Sa `flex: 1 1 0` se 
     dolazi blizu ali ne do kraja: `<button>` i `<label>` ispadnu ~32px odnosno ~28px 
     širi od taba (tačno njihov levi+desni padding), jer se flex stavka meri po content 
     box-u a dugme odbija da se stegne do kraja. 1fr traka po detetu meri TRAKE, pa deca 
     nemaju šta da kažu. Deca nose `min-width: 0` da duga vrednost skrati sa "…" umesto 
     da razvuče traku.
     Raniji flex-grow 1 / 1.15 / 1.5 (širine štimovane po najdužoj vrednosti svake liste) 
     je UKLONJEN na eksplicitan zahtev - posledica je da se najduža vrednost, 
     "Regionalni menadžer poslovnica", skraćuje u zatvorenom tabu; ceo tekst se i dalje 
     vidi u otvorenom meniju
   - kratka scroll "snap" pauza kad video dostigne max veličinu i search bar centar ekrana
   - zatim video+search bar kao jedna celina klize gore i izlaze, otkrivajući sledeću sekciju
   - Lenis.js koristi se za smooth scroll (VAŽNO: scroll progress se čita ISKLJUČIVO 
     preko lenis.on('scroll', ...) callback-a, ne mešati sa window.scrollY na drugim 
     mestima - ranije je to izazivalo lag/desync bug sa wheel scroll-om, POPRAVLJENO, 
     ne vraćati tu grešku)
   - TAJMING (ne menjati napamet, sve je izvedeno iz vh budžeta u CSS-u iznad 
     #hero-spacer): P0 1vh / ulazak 132vh / pauza 10vh / izlazak 130vh = spacer 373vh.
     P0 je namerno skoro nula - to je mrtav scroll gde stoji samo naslov. Uz to je 
     HERO_ENTER_TRAVEL 1.0 (ne 1.3) - video kreće bliže ivici ekrana. Oba zajedno čine 
     da video uđe u kadar već na PRVU kretnju točkića (~74px), ranije je trebalo ~190px.
     KRITIČNO: budžet izlaska MORA ostati jednak HERO_EXIT_TRAVEL (130vh), inače video 
     počne da beži brže od scroll-a i iza njega se otvara sve veći prazan prostor pre 
     naredne sekcije. Detaljno objašnjenje formule je u komentaru 
     "HERO → FIRST SECTION OVERLAP".
3. **"TVOJ PROSTOR ZA RAZVOJ"** (#razvoj) - PRVA sekcija posle videa, nastala IZ FUTERA.
   Dve .footer-cta kartice ("Poslovi u lokalima" / "Posao u centrali") su ranije otvarale
   futer bez ikakvog uvoda; sada imaju svoj naslov i podnaslov, a cela sekcija je
   dignuta ODMAH ISPOD intro videa (traženo tako - ranije je stajala ispod #impact).
   ⚠ Kao PRVI SLOT posle heroja nosi `margin-top: -130vh` (pravilo "HERO → FIRST SECTION
   OVERLAP" u styles.css). Ono pripada SLOTU, ne sekciji - slot je do sada menjao vlasnika
   tri puta (#openings → #impact → #razvoj), pa se margina seli sa njim. Puna 130vh je
   koliko i HERO_EXIT_TRAVEL: tako je razmak od donje ivice videa do vrha sekcije NULA na
   svakoj visini ekrana i sekcija se čita kao da je video gura gore.
   - naslov h2 "Tvoj prostor za razvoj" - isti clamp kao ostala dva naslova sekcija
     (clamp(1.75rem, 4.4vw, 3.5rem)); sva tri treba da čitaju kao isti nivo
   - PODNASLOV je scroll-scrubbed reveal reč-po-reč, PRESELJEN iz #impact: reči kreću
     prigušene i popunjavaju se kako sekcija prolazi kroz svoj prozor, a TEK kad se sve
     popuni, poslednja rečenica "Izaberi put u Balkan Bet-u." dobija žuti marker.
     Tekst je prelomljen u 3 reda + markirana rečenica.
     TAJMING: popunjavanje NE počinje dok ceo pasus nije na ekranu - start je zakačen za
     trenutak kad poslednji red pređe donju ivicu (+32px), kraj kad pasus dođe 350px ispod
     headera; na niskim ekranima se run poda na IMPACT_MIN_RUN (260px).
     measureImpact() se OBAVEZNO poziva ponovo na kraju skripte (i na 'load' i na
     document.fonts.ready) - blok koji renderuje kartice pozicija menja visinu stranice,
     pa je prvo merenje kraće od stvarnog
   - ⚠ ID `#impact-heading` i klase `.impact-word` su ISTORIJSKI naziv te mehanike, ne
     mesto gde ona stoji. Skript koji je vozi (IMPACT_LINES / measureImpact /
     updateImpact) je generičan i traži samo taj jedan element, pa je preseljenje bilo
     pomeranje markupa i ništa više. Isto važi za klasu `.footer-cta` na karticama -
     komponenta je ista, samo više ne živi u futeru
   - ⚠ SEKCIJA POSTOJI SAMO NA NASLOVNOJ. Kartice su otišle iz futera, a futer je
     byte-identičan na sve tri stranice - pa ih na listanje.html i oglas-primer.html
     više NEMA uopšte. Ako ikad zatrebaju i tamo, kopira se OVA sekcija, ne futer
4. **"ŽIVOT U BALKAN BET-U"** (#impact) - DRUGA sekcija posle videa, na BELOJ pozadini
   (section-panel + rounded-[32px] + bg-white). Tri dela:
   - h2 "Život u Balkan Bet-u" - običan naslov, taman, caps-lock, ISTI font-size clamp 
     kao naslov "Najnovije pozicije" (clamp(1.75rem, 4.4vw, 3.5rem)) - dva naslova treba 
     da čitaju kao isti nivo, držati clampove usklađene
   - ⚠ NEMA VIŠE PODNASLOVA. Scroll-scrubbed pasus koji se ispisivao reč po reč je
     PRESELJEN u sekciju "Tvoj prostor za razvoj" (tačka 4) - ovde ostaje samo h2.
     Traženo tako. Mehanika je ista i nepromenjena, samo živi jedan blok niže
   - MOZAIK multimedijalnih kartica (#zivot-mosaic, renderuje JS iz ZIVOT_TILES niza). 
     RADIJUS KARTICA JE 12px, isti kao .opening-card/.job-card (Tailwind rounded-xl) - 
     traženo da mozaik i kartice pozicija čitaju kao ista porodica radijusa; bio je 18px. 
     Tamni 'stat' blokovi u tamnoj temi NEMAJU okvir (imali su --dk-line-2, uklonjen na 
     zahtev) - od panela ih odvaja samo razlika u svetlini. 
     Tri kolone kao flex stack-ovi, svaka kartica nosi svoj aspect-ratio - visine kolona 
     su NAMERNO nejednake, srednja kreće niže (lg:mt-10); to je ceo "masonry" efekat, 
     bez biblioteke. Tipovi kartica: slika, video (muted/loop/autoplay), 'stat' 
     (informativni blok pune boje - žuti #FDB813 "1100+ zaposlenih", tamni "90+ lokala 
     u celoj Srbiji", tamni "25 godina poslovanja" na dnu srednje kolone; nisu linkovi i 
     nemaju hover; blokovi su bili narandžasti #FAA61A, prebačeni na brend žutu - ne 
     vraćati), 'quotes' (slajder izjava), i klikabilne koje na hover dobiju 
     ŽUTI panel (#FDB913) sa rečenicom + tamnim CTA dugmetom - panel ZAMENI sliku, ne 
     tonira je. Slike/video su u assets/bb-zivot/. Kartica sa fotografijom iz kuhinje 
     nosi label "Liga dobrih dela"
   - BROJEVI u 'stat' blokovima se VRTE od nule do svoje vrednosti (rAF, ease-out, 1.5s). 
     SVAKI BROJAČ IMA SVOJ IntersectionObserver, NE gleda se mozaik kao celina - mozaik 
     je visok ~dva ekrana, pa je zajednički observer palio sva tri odjednom: samo "1100+" 
     se stvarno gledao kako se vrti, a "90+" i "25" su bili odbrojani mnogo pre nego što 
     se doskroluje do njih. NE vraćati brojače u zivotObserver.
     ⚠ OBSERVE SE KARTICA, NE BROJ - ovo je bio pravi bag i lako se ponovo napravi.
     Zatvorena .zivot-tile nosi clip-path: inset(0 0 100%), a KLIP PRETKA NULIRA 
     intersection rect POTOMKA: dok je kartica zatvorena broj javlja isIntersecting:false 
     bez obzira koliki mu je rootMargin, a sama kartica javlja true (izmereno: 
     intersectionRect.height 0 za broj, kartica true u istom trenutku). Zato observer na 
     BROJU nije mogao da pokrene odbrojavanje pre nego što se kartica otvori - otud 
     "vidi se nula, pa pauzica, pa krene". Sopstveni clip-path elementa NE utiče na 
     njegov sopstveni intersection, pa je kartica ispravan triger. counterTiles Map 
     (kartica -> broj) postoji samo zbog toga.
     DVA observera: counterStartObserver sa rootMargin COUNTER_LEAD (220px) na GORE I NA 
     DOLE - zalet samo nadole ne pomaže pri vraćanju gore, gde blok prelazi pravu gornju 
     ivicu bez ikakvog zaleta (tu se nula i videla). Zalet je NAMERNO mali: treba samo da 
     pokrije prvi deo runa gde cifre još čitaju kao "0"; mnogo veći i broj sleti pre nego 
     što se pojavi, pa se odbrojavanje uopšte ne vidi. counterResetObserver ima mnogo veći 
     COUNTER_KEEP (900px) - reset na istoj granici na kojoj i start stavlja dva događaja 
     jedan piksel jedan od drugog, pa najmanje drmusanje na ivici čita kao treperenje u 
     nulu. runCounter() uz to ODBIJA da restartuje broj koji već ide ili je sleteo.
     NEMA start delay-a (ranije je čekao --stagger-delay svoje kartice, pa se stajalo na 
     vidljivoj 0). Parsiraju se kao cifre + sufiks ("90" + "+"), a uz 
     prefers-reduced-motion odmah skoče na konačnu vrednost.
     RESET SAMO NADOLE, isto kao kartice: broj se vraća na 0 samo ako je blok izašao 
     kroz DNO (boundingClientRect.top >= 0). Ako je izašao kroz vrh, povratak nagore 
     zatiče konačnu cifru kako stoji - ne nulu koja kreće ispočetka
   - QUOTE SLAJDER (donja desna kartica, kind 'quotes', podaci u ZIVOT_QUOTES): dve 
     fotografije zaposlenih (assets/bb-zivot/quote-01.png i quote-02.png) sa tamnim 
     gradijent overlay-em, preko njega izjava + ime + pozicija, žuti navodnici gore levo 
     (INLINE SVG, ne &ldquo; - NeoSans taj glif crta kao dve kose crte) i dve strelice 
     gore desno. Slajdovi su naslagani u istoj kartici i samo se cross-fade-uju, 
     automatski na 5s, a klik na strelicu restartuje tajmer. IMENA I IZJAVE SU 
     PLACEHOLDER - zameniti pravim pre produkcije
   - Ulazna animacija kartica: okvir se otvara odozgo nadole (clip-path inset) dok se 
     slika unutra smiruje iz uvećanja (scale 1.16 -> 1). Dva trajanja su RAZLIČITA 
     namerno (0.85s okvir, 1.25s slika) - slika nastavi da se kreće još malo pošto je 
     okvir stao. Ponavlja se pri svakom povratku u vidno polje, isti 
     reset-u-jednom-frejmu kao .opening-card (resetTile).
     SVAKA KARTICA IMA SVOJ IntersectionObserver, isto kao brojači, sa rootMargin 
     '0px 0px 180px 0px' - kartici se kaže da se otvori DOK JE JOŠ ISPOD PREGIBA, pa je 
     clip-path wipe već u toku kad uđe u kadar. Ranije je jedan observer na #zivot-mosaic 
     otvarao svih 12 odjednom, pa je sve ispod prvog ekrana završilo animaciju pre nego 
     što se doskroluje. Stagger je zato SAMO PO KOLONI (delay = kolona*110ms); raniji 
     `+ red*170ms` je pripadao onom režimu i sada bi samo terao donje kartice da stoje 
     posle sopstvenog trigera.
     RE-ARM SAMO NADOLE (isto pravilo važi za .opening-card i za brojače): reset se 
     okida SAMO ako je element izašao KROZ DNO, tj. entry.boundingClientRect.top >= 0 - 
     tada je čitalac iznad sekcije i sledeći put joj prilazi odozdo nadole, u smeru za 
     koji je kaskada i pravljena. Ako je izašao kroz VRH (top < 0), kartica OSTAJE 
     OTVORENA, pa povratak nagore zatiče sekciju tačno kako je ostavljena. Ranije se 
     resetovalo na obe strane, pa se pri vraćanju gore ponovo pokretao ulaz koji se 
     ionako ne vidi (kartice su visoke do ~590px, a triger se pali na prvi vidljivi 
     piksel, pa se wipe od 0.85s odigra dok je kartica još skoro cela iznad ekrana).
     Gleda se ZNAK boundingClientRect.top, ne entry.rootBounds - rootBounds nije uvek 
     popunjen. PAŽNJA pri testiranju: IntersectionObserver okida samo na PROMENU stanja, 
     pa skok koji preskoči ceo vidljivi opseg (iz "nevidljivo iznad" pravo u "nevidljivo 
     ispod") ne pošalje nikakav callback i reset izostane - to je artefakt skoka, ne bag; 
     testirati postupnim skrolom
   - "BALKAN BET BENEFITI" - poslednji deo belog panela, ispod mozaika: naslov (manji 
     clamp od h2, clamp(1.5rem, 3.2vw, 2.5rem)) + 5 benefita u redu (2 kolone na 
     telefonu, 3 na tabletu, 5 na desktopu), svaki = ikonica u krugu 96px + naslov 
     benefita. BEZ NUMERACIJE - sivi broj 01-05 iznad naslova je UKLONJEN, ne vraćati.
     Naslovi benefita su Medium (500), NE bold - traženo tako.
     Ikonice su KLIJENTOVE: assets/bb-zivot/benefiti.png je iskrojen na pet kvadratnih 
     PNG-ova (benefit-01..05.png), po jedan tesno oko svog žutog kruga. Krop nosi bele/
     sive uglove originala, pa .benefit-item__disc MORA ostati border-radius:999px + 
     overflow:hidden - to zaokruženje je ono što odseca uglove. NE vraćati na CSS krug sa 
     inline SVG-om unutra (to je bio placeholder dok klijentov set nije stigao).
     Redosled u BENEFITS nizu je ISTI kao na klijentovoj slici i svaki naslov je uparen 
     sa glifom koji mu odgovara - premeštanje stavki ćutke spari pogrešnu ikonicu sa 
     pogrešnim tekstom. Stavke nose .reveal, ali ih shared revealObserver NE hvata sam 
     (markup nastaje posle njegovog prolaza) - eksplicitno se observe-uju posle rendera
   - Na dnu "Saznaj više o nama" - VIŠE NIJE DUGME nego ISTI podvučeni tekst link kao 
     "POGLEDAJ SVE POZICIJE" u #openings (border-b-2, Medium, uppercase). Traženo da budu 
     isti. Time je IZAŠAO iz izuzetak-grupe koja nije caps-lock: ta grupa se ticala CTA 
     DUGMADI, a ovo je sada tekst link, a svi tekst linkovi na sajtu su caps. Ranije je 
     bio tamna pilula (bg-brand-dark, beo tekst, hover u žuto), a pre toga "O nama" sa 
     .cta-gradient pozadinom - ne vraćati ni jedno.
     ⚠ JEDINO što ne kopira od "Pogledaj sve pozicije" je BOJA: taj je beo jer stoji na 
     aurori, a ovaj je unutar #impact panela koji je u svetloj temi BEO - belo na belom. 
     Zato je ovde taman (text-brand-dark + border-brand-dark), a u tamnoj temi je žut, 
     gde se dva linka tek onda poklapaju u potpunosti.
     Razmaci mozaik→gore i CTA→gore su mt-16 (stari mt-20, -20%)
5. **"NAJNOVIJE POZICIJE"** (#openings) - POSLEDNJA sekcija pre futera, traženo tako.
   ⚠ Bila je PRVA posle videa i zato je nosila `margin-top: -130vh` i asimetričan padding
   izveden iz donje ivice videa. OBOJE je otišlo sa slotom: marginu sada nosi #impact
   (pravilo pripada "prvom slotu posle heroja", ne konkretnoj sekciji), a padding je ovde
   običan `pt-[120px] pb-[140px]` jer joj iznad više nije video nego druga sekcija.
   Unutrašnji razmaci su stegnuti za 20%: naslov→kartice 51px (mb-[51px]),
   kartice→link 45px (mt-[45px]).
   Sekcija NEMA pozadinu 
   ni zaobljeni panel (aurora se vidi kroz nju), naslov i link su BELI: naslov centriran 
   iznad, a "POGLEDAJ SVE POZICIJE" (beo caps-lock tekst link sa belom podvlakom 
   border-b-2) je ISPOD reda kartica, ne ispod naslova. Ta podvlaka od 2px je referenca 
   za "SAZNAJ VIŠE O NAMA" u #impact - držati ih usklađene (balkanbet.rs link u futeru, 
   koji je ranije bio treći iz te grupe, više ne postoji). 4 kartice 
   pozicija (Beograd, Novi Sad, Niš, Kragujevac), bele: 12px radijus, 28px padding, 
   naslov ~26px, dugme "Prijavi se" (NIJE caps-lock, za razliku od ostalih CTA na sajtu 
   - eksplicitan zahtev). Stagger kaskada s leva na desno; PONAVLJA SE svaki put kad se 
   sekcija vrati u vidno polje
6. Footer - IZBRENDIRAN, kompletno na srpskom. **FULL-BLEED i BEZ `.panel-overlap`**: ide 
   od ivice do ivice, bez 30px inseta (`.section-panel`) i bez radijusa, isti potez kao 
   header. Unutrašnji wrapper i dalje nosi `max-w-[1440px] px-8 md:px-16`, pa se sadržaj 
   poravnava sa svim sekcijama iznad - "full širina" se odnosi na TRAKU, ne na sadržaj.
   ZAŠTO NEMA OVERLAP-a: zaključna traka ima u tamnoj temi punu žutu pozadinu (videti 
   niže), pa bi blok sa vidljivom gornjom ivicom koji jaše 48px preko prethodne sekcije 
   čitao kao greška - a na listanju bi baš prekrio dno svetlog panela sa rezultatima. 
   Posledica je da je sve iznad futera 48px labavije; razmak je namerno ostao veći.
   ⚠ **FUTER JE SADA SAMO ŽUTA TRAKA.** Dve CTA kartice koje su ga otvarale su PRESELJENE
   u sekciju #razvoj (tačka 4) - videti tamo. Ostao je jedan jedini red, `.footer-bar`.
   `.footer-bar` je JEDAN RED sa tri grid slota: levo copyright, U SREDINI 4 dugmeta 
   društvenih mreža, desno "Dizajn i razvoj". Tri slota, a ne justify-between, da bi 
   ikonice bile centrirane prema FUTERU a ne prema dužini bočnih tekstova.
   UKLONJENO (ne vraćati bez zahteva): kolone "Pun pogodak" i "Navigacija" (sa balkanbet.rs 
   linkom i celom navigacijom - to header ionako nosi), link "Nazad na vrh", i naslov 
   "PRATI NAS" iznad ikonica. Naslov je otišao jer četiri prepoznatljiva glifa u svom redu 
   ne treba najavljivati, a bio je i jedino što je smetalo da sve stane u jedan red; 
   `aria-label` na svakom dugmetu ostaje, pa čitač ekrana nije ništa izgubio.
   Sadržaj trake (`.footer-bar` → `.footer-legal`, mt-16, **py-8 = 2rem gore i dole**, 
   traženo tako; bilo je py-6) je namerno SITAN 
   (text-xs), osim samih dugmadi: levo "©2026 Balkan Bet. Sva prava zadržana.", u sredini 
   4 okrugla dugmeta (LinkedIn / Instagram / Facebook / YouTube, 44px), desno 
   "Dizajn i razvoj" + assets/logo/smartweb-logo.svg. Logo je VEĆ ceo beo (fill="#fff") pa 
   u SVETLOJ temi ne treba filter, ali u tamnoj mora (žuta traka - videti "Tamna 
   varijanta"); visina je 1.15em da prati font reda. Klasa `.footer-legal` postoji SAMO 
   kao kuka za to dark pravilo. 
   Traka nosi `border-t border-white/20`: to je separator SAMO u svetloj temi, gde je 
   providna i čita se kao crta ispod kartica. U tamnoj deli sama ivica žutog, pa se 
   linija gasi u `transparent`.
   "Politika privatnosti" je UKLONJENA.

### Uklonjene sekcije (NE vraćati bez eksplicitnog zahteva)
- **"PROCES ZAPOŠLJAVANJA"** (#proces) - rukom pisana kompozicija "4 koraka do karijere u
  Balkan Bet-u" koja se ispisivala na skrol. Uklonjena na zahtev zajedno sa markupom,
  skriptom (measureProcess/updateProcess) i CSS-om (.proc-*). ⚠ `@font-face` za
  **LumieraHandwriting** i **PatrickHand** su ostali na vrhu styles.css ali ih VIŠE NIŠTA
  NE KORISTI - brisati ih tek ako je sigurno da se sekcija ne vraća
- **BOUNCING LOPTICA** (#hero-scroll-ball) - loptica iz logotipa koja je poskakivala ispod
  naslova umesto "scroll down" strelice, i bila klik-prečica na snap pauzu. Uklonjena na
  zahtev, zajedno sa svojom bačenom senkom, keyframe-ovima (hero-ball-bounce /
  hero-ball-shadow), žutim odrazom u tamnoj temi i klik handlerom
- **"Naših 5 vrednosti"** (#values) - uklonjena zajedno sa .value-card CSS-om i VALUES 
  JS blokom. Slike i dalje stoje u assets/values/ (+ originali u assets/values/original/) 
  ako zatrebaju
- **"Recognized for Excellence"** (awards grid) - uklonjena sa svojim JS blokom; bili su 
  Kaizen sertifikati, nikad izbrendirani
- **"Latest events"** (carousel) - uklonjena sa svojim JS blokom; bili su Kaizen/SBC 
  eventi, nikad izbrendirani
- Ranije uklonjeno: "Naše poslovnice" (Leaflet mapa Srbije, zajedno sa Leaflet CDN-om)

## listanje.html (listing)
**TAMNA JE I OVDE JEDINA TEMA** - stranica učitava theme-dark.css i nosi 
`data-theme="dark"` zakucan na `<html>`, isto kao naslovna (videti "Tamna varijanta" niže).
Struktura: hero BEZ PODLOGE (.page-hero--flush) sa naslovom "Postani deo Balkan Bet tima" → 
search bar (.search-band) → svetli panel sa 16 kartica pozicija (4 u redu) + CTA za 
otvorenu prijavu na dnu panela → footer.
- naslov je `pt-[140px]` od vrha (bilo 190px), a podnaslov NEMA margin-top - h1 i pasus 
  su jedan blok, razmak drži line-height naslova. Oboje traženo eksplicitno
- HTML tekst naslova je "Postani deo Balkan Bet tima" u rečeničnom slučaju; verzali dolaze 
  iz `uppercase` klase, po opštem pravilu sajta (ne menjati sam tekst u markupu)
- PODNASLOV ("Pridruži se timu od preko 1000 zaposlenih širom Srbije.") je ŽUT 
  (text-brand-yellow), 1.6rem i U JEDNOM REDU - sve tri stvari tražene eksplicitno. Bio je 
  `text-white/80 text-lg max-w-2xl`; taj max-width je morao da ode jer je na 1.6rem 
  rečenica šira od 42rem, pa je baš on lomio red.
  ⚠ Veličina je `min(1.6rem, 3.1vw)`, ne ravnih 1.6rem. IZMERENO: red je 25.4em širok, pa 
  mu treba 25.4 × font-size prostora; ispod ~825px širine ekrana ravnih 1.6rem više ne 
  stane, a `whitespace-nowrap` bi tu izbacio horizontalni skrol na CELU stranicu. 3.1vw je 
  ta granica uzeta na najužem telefonu (320px), pa na svakoj desktop širini računa tačno 
  1.6rem i vw član nikad ne stupa na scenu. Ako se tekst menja, PREMERITI onih 25.4em - 
  na tome ceo broj 3.1 i stoji

### Hero traka - FULL-BLEED, BEZ RADIJUSA, BEZ PODLOGE
`.page-hero.page-hero--flush` - NEMA .section-panel inset, NEMA mt-6 i NEMA zaobljene 
uglove ni na jednoj strani, a od skora NEMA NI POZADINU: ni tamnu #231F20 traku ni corner 
glow. Naslov stoji direktno na animiranoj aurori, isto kao hero naslov na naslovnoj. 
Ranije je imala `rounded-b-[32px]` - UKLONJENO, ne vraćati.
- ZAŠTO JE TRAKA OTIŠLA: search bar je sada sticky i po skrolu IZLAZI iz ove sekcije. 
  Traka koja bi se završavala iznad njega čitala bi se kao odsečen panel. Uz to, aurora 
  ionako radi posao koji je glow radio, pa je i on obrisan (`background: none` gasi i 
  boju i background-image; `::after` je i dalje `content: none`)
- ⚠ BEZ PODLOGE VAŽI I U TAMNOJ TEMI. `background: none` iz `.page-hero--flush` (0,1,0) 
  gubi od `[data-theme="dark"] .page-hero` (0,2,0), pa je flush hero u tamnoj varijanti 
  ipak dobijao staklenu podlogu (--dk-glass) I okvir. Zato je to pravilo suženo na 
  `[data-theme="dark"] .page-hero:not(.page-hero--flush)` - `:not()` je NOSEĆI, ne 
  kozmetika. Traka na oglas-primer.html (`.page-hero` bez `--flush`) staklo i dalje ima
- ⚠ `.page-hero--flush` je I MARKER po kome header zna da na ovoj stranici startuje 
  providan (videti tačku 1 gore) - ne stavljati tu klasu na treću stranicu ako se ne misli 
  i to
- `overflow: visible` ostaje - sekcija ne sme ništa da klipuje
- z-30 na traci (a z-10 na panelu ispod)

### Search bar - u `.search-band`
IDENTIČAN naslovnoj, sada bez ijedne razlike - ista `.hero-search` komponenta (žuti #FDB913 
okvir, tri bela taba, crno dugme "Pretraži") i NIŠTA VIŠE. Checkbox "Bez CV-ja" koji je 
ovde bio četvrta pločica je ISELJEN u toolbar sa rezultatima i pretvoren u prekidač 
(videti niže); `.hero-search__check` / `.hero-search__box` CSS je OBRISAN iz styles.css. 
Raniji beli `.jf-bar` na ovoj stranici je odavno UKLONJEN, kao i rečenica ispod njega.
- `.hero-search--down` okreće panele da se otvaraju NADOLE. Na naslovnoj se otvaraju 
  nagore samo zato što bar tamo stoji 96px od dna klipovanog stage-a
- SVA ČETIRI elementa (3 taba + dugme) imaju JEDNAKU širinu - isto pravilo i ista grid 
  mehanika kao na naslovnoj, videti tačku 2 gore

#### `.search-band` - red u kome bar stoji
- ⚠ **BAR SE NE ZAKUCAVA. NE VRAĆATI STICKY.** Bio je kratko `position: sticky` (prikovan 
  ispod headera, sa staklenim velom iza sebe) i ODBIJENO je na prvi pogled - traka koja 
  se vozi ispod navigacije deluje teško i tuče se sa headerom oko vrha ekrana. Sa tim su 
  otišli i `.listing` wrapper (postojao je samo kao containing block za sticky) i veo 
  (`::before`) i `--hdr-h` varijabla
- band ostaje ZASEBAN element izvan `.page-hero`, ne vraća se u nju: hero više nema svoju 
  pozadinu, pa nema ni trake "unutar" koje bi bio, a ovako razmaci iznad i ispod stoje na 
  jednom mestu
- `padding-bottom: 64px` + 30px margine panela = 94px razmaka. Gore je `.page-hero` `pb-9` 
  (36px) + 12px band paddinga = 48px (koliko je bio `mt-12` dok je bar bio u heroju). 
  Razmaci na ekranu su NEPROMENJENI kroz sve ove izmene
- z-40 (panel ispod je z-10) - inače otvoren dropdown završi ISPOD panela

#### Header staklo
Traka startuje providna (CSS to zaključuje iz `.page-hero--flush`, videti tačku 1 gore) i 
puni se na scroll. **Okidač je PANEL SA REZULTATIMA koji stigne do headera**, ne fiksna 
razdaljina: to je trenutak kad navigacija prestaje da lebdi nad uvodom stranice (naslov na 
aurori, pa search bar) i počinje da stoji nad stvarnim sadržajem - isto pravilo koje 
naslovna primenjuje na kraju heroja. Search bar u tome NE učestvuje.
- scroll listener, rAF-throttled i `{ passive: true }`; visina headera se MERI (nema svoju 
  fiksnu, ona je logo + padding), pa se remeri na resize i na load (logo je SVG koji možda 
  nije izmeren na prvi paint)
- Wrapper bara je `max-w-[1372px] mx-auto px-[30px]`, pa na ≥1372px bar meri tačno 
  1312px - ISTU širinu kao red kartica u panelu ispod, tako da bar i grid dele levu i 
  desnu ivicu. Onih 30px paddinga je isti inset koji nosi i panel, pa su poravnati na 
  svakoj širini, ne samo na kepu. Širina je bitna otkad su svi elementi jednaki: na 
  ranijih 1072px pet jednakih polja je bilo preusko i default "Poslovi u lokalima" se 
  sekao već pri učitavanju
- Tabovi su isti kao na naslovnoj: Vrsta posla / Lokacija / Pozicija. Tab 1 UPRAVLJA 
  ostalima (`bar.refill(...)`) - liste se prave iz JOBS niza za izabranu vrstu, pa 
  "Posao u centrali" ne nudi pozicije iz poslovnica
- FILTER STVARNO RADI, bez servera: filtrira kartice u realnom vremenu na svaku promenu, 
  a brojač "Pronašli smo N pozicija" se računa iz broja vidljivih kartica uz ispravnu 
  srpsku množinu. Ako nema rezultata, prikazuje se prazno stanje umesto praznog grida
- Dropdown-i su CUSTOM (job-filter.js, skin `hero`), ne <select> - native <option> 
  ignoriše padding/line-height na Windows Chrome-u
- Vrsta "Posao u centrali" namerno ne vraća rezultate (u JOBS nizu žive samo lokali)

### Panel sa karticama
`.jobs-panel` - background **#F4F4F4**, **margin 30px sa svih strana** (30px tamne trake 
se vidi iznad njega i 30px sa obe strane ekrana) + 30px unutrašnjeg padinga + 
`rounded-[32px]` (isti radijus kao svi paneli na naslovnoj). BEZ `.panel-overlap` - taj 
razmak od 30px je ceo efekat, dva panela ne smeju da se dodiruju.
- Kartice su **4 U REDU** (`lg:grid-cols-4`, gap-5) i imaju IDENTIČAN dizajn kao kartice 
  "Najnovije pozicije" na naslovnoj - isti markup polje po polje (zlatni pin + grad, 
  ~26px naslov, kategorija + "Full time", žuto dugme "Prijavi se" prikovano za dno preko 
  mt-auto) i isti box (belo, 12px radijus, 28px padding, min-height 290px).
  ⚠ JEDNA RAZLIKA: tekst u dugmetu "Prijavi se" je OVDE TAMAN (`text-brand-dark`), a na 
  naslovnoj beo. Traženo za ovu stranicu. Piše u markupu, ne u temi - kartica je bela u 
  obe varijante, pa se ne oslanja na theme-dark.css (čije pravilo za tamna slova ionako 
  gađa `.opening-card`, ne `.job-card`)
- I ISTU VELIČINU: unutrašnji kontejner je `max-w-[1312px] mx-auto`, a 1312px je tačno 
  ono što `max-w-[1440px] px-16` na naslovnoj izmeri. Zato red od četiri NE ide od ivice 
  do ivice panela nego stane na istih ~313px po kartici i centrira se. Ako se menja 
  container na naslovnoj, premeriti i ovde
- **NEMA HOVER EFEKTA** na karticama (raniji box-shadow lift je UKLONJEN, ne vraćati) - 
  kartice na naslovnoj ga takođe nemaju. Jedini hover unutar kartice je na dugmetu 
  "Prijavi se"
- RAZLIKA od naslovne je SAMO u ulaznoj animaciji, namerno: `.opening-card` pada 380px sa 
  kaskadom 190ms po kartici, što je štimovano za JEDAN red od četiri. Preko grida od 16 
  to izgleda kao haos, pa ove (`.job-card`) ulaze mekše - 60px, stagger po koloni
- ⚠ ANIMACIJA SE PUŠTA SAMO JEDNOM po kartici: observer dodaje `is-revealed` i ODMAH 
  radi `unobserve()`. Kartica koja je odigrala ulaz ostaje takva do kraja posete. Ovo je 
  SUPROTNO od reda na naslovnoj, koji se re-armira svaki put kad izađe iz kadra - tamo su 
  četiri kartice jedan gest, ovde je grid od 16 kroz koji se skroluje gore-dole, pa 
  ponavljanje fade-a čita kao treperenje. Unobserve (umesto obične zastavice) usput znači 
  i da filter može da sakrije i vrati karticu preko `display` a da se observer ne oglasi
- ⚠ PANEL I KARTICE OSTAJU SVETLI I U TAMNOJ TEMI - traženo eksplicitno. Sve oko njih ide 
  u tamno (aurora, hero, header, futer), a ovo ostaje jedina osvetljena površina na 
  stranici, pa se rezultati čitaju kao ono zbog čega stranica postoji. Zato u 
  theme-dark.css NEMA nijednog pravila za `.jobs-panel` ni `.job-card` - to odsustvo je 
  dizajn, ne propust. Jedini dark izuzetak je hover na "Prijavi se" (videti niže)
- Iznad grida je toolbar: levo brojač rezultata, desno DVE kontrole prikaza - prekidač 
  "Bez CV-ja" i dropdown za sortiranje (Najnovije / Lokacija A-Š / Pozicija A-Š). Red se 
  lomi na `lg:`, a ne na `sm:`: labela prekidača je cela rečenica, pa na tabletu tri 
  stavke traže svoje redove pre nego što toolbar počne da otima prostor brojaču.
  **BEZ labele "Sortiraj" iznad vrednosti** - polje je 
  samostalna kontrola, a ne ćelija označenog bara, i sama vrednost ("Najnovije") kaže šta 
  je; labela živi kao `aria-label` na trigeru radi čitača ekrana. Zato nosi 
  `.jf-field--nolabel`, koji vraća visinu pločice kroz veći vertikalni padding.
- **PREKIDAČ "Bez CV-a"** (`.nocv-toggle`) - bio je četvrta bela pločica u search baru. 
  Iselio se da bi bar mogao da se vrati na tačno onu komponentu koja stoji na naslovnoj, i 
  postao PREKIDAČ a ne checkbox jer nije još jedno polje koje se popunjava pre pretrage 
  nego režim prikaza nad listom koja je već na ekranu - to je ono što prekidač znači.
  - **UKLJUČEN JE PODRAZUMEVANO** (`checked` u markupu, ne postavlja ga skript - važi i 
    pre nego što se JS izvrši). Većina pozicija ovde ne traži CV, pa je to prijateljskiji 
    prvi pogled; `apply()` čita input u prvom prolazu, pa brojač odmah kreće od 14 umesto 
    da blesne 16
  - ⚠ LABELA JE "Bez CV-a", kako je traženo. Ostatak sajta (tag na oglas-primer.html) piše 
    "Bez CV-ja" - ako se ikad ujednačava, menjaju se OBA mesta
  - stoji na svetlom #F4F4F4 panelu u OBE teme, pa je stilizovan jednom i NE treba mu 
    dark pravilo
  - native box je sakriven i precrtan (kao i svaka druga kontrola na sajtu), ali OSTAJE u 
    DOM-u da bi labela, fokus i tastatura bili posao browsera. Hod knoba je 20px 
    (46 - 20 - 3 - 3), pa mu inset od 3px ostaje isti na oba kraja
  - ⚠ BAR VIŠE NE PRIJAVLJUJE `nocv`. `job-filter.js` i dalje ima `check` u SKINS objektu 
    (generički je), ali ga u ovom baru nema, pa `values().nocv` uvek stiže kao false - 
    stanje drži prekidač, a `apply()` ga čita direktno sa inputa. Zbog toga postoji 
    `lastValues`: bar objavi svoje stanje na svaku promenu, ono se zapamti, a klik na 
    prekidač samo pozove `apply()` BEZ ARGUMENTA, što znači "isti upit, preračunaj". 
    Filter i prekidač se tako slažu umesto da se tuku
  - `?nocv=1` sa druge stranice sada pada na prekidač; ugovor query parametara je 
    nepromenjen
  Stoji u istom 1312px kontejneru pa se poravnava sa redom kartica. Sortiranje radi na 
  VIDLJIVOM skupu pa se slaže sa filterom umesto da se tuku; `applySort()` samo 
  re-appenduje postojeće nodove (pomera ih, ne pravi nove)
- Podaci o pozicijama su u JOBS nizu na dnu fajla (title / city / category / vrsta / 
  nocv). Sva dugmad "Prijavi se" vode na isti oglas-primer.html - kad stignu pravi 
  oglasi, svaki dobija svoj url

### CTA za otvorenu prijavu (`.talent-cta`) - poslednja stvar u panelu
Tamni blok POSLE grida, unutar istog panela: naslov "Nema tvoje pozicije?", jedna rečenica 
("Ostavi nam svoje podatke i reci šta tražiš. Čuvamo tvoju prijavu i javljamo se prvi čim 
se otvori nešto po tvojoj meri.") i žuta pilula "Prijavi se unapred".
- POZICIJA JE POENTA: čita ga tačno onaj ko je upravo prešao ceo spisak i nije našao svoje. 
  Bilo gde ranije bio bi upad; u futeru bi bio treća kartica uz dve koje su već tamo
- TAMAN je namerno - jedina tamna površina među 16 belih kartica, pa se čita kao druga 
  vrsta ponude a ne kao sedamnaesta pozicija. Žuti blok je bio druga opcija i odbačen: 16 
  žutih "Prijavi se" pilula je već na ekranu, pa bi žuta ploča iza njih spljoštila ceo panel
- OSTAJE VIDLJIV i kad grid nema rezultata - "ništa ne odgovara filterima" je baš trenutak 
  kad ostavljanje podataka ima smisla. Zato NIJE unutar `#jobs-grid` niti se skriva sa njim
- ⚠ dugme vodi na `oglas-primer.html#prijava` jer zasebna stranica "otvorena prijava" ne 
  postoji. Kad se napravi, menja se SAMO href - forma tamo treba da nosi i polje za željenu 
  poziciju/grad, što je ceo smisao ovog CTA-a

### Uklonjeno sa listanja (NE vraćati bez eksplicitnog zahteva)
- Sekcija sa dve tamne `.info-card` kartice **"Rad u lokalu" / "Rad u centrali"** (stajala 
  je između panela sa karticama i futera). `.info-card` CSS OSTAJE u styles.css - 
  oglas-primer.html ga i dalje koristi za tri kartice "Saznaj više o nama"
- Beli `.jf-bar` filter bar i rečenica "Za većinu pozicija u lokalima CV nije potreban..."
- Tamna podloga hero trake (#231F20) i njen corner glow - videti "Hero traka" gore
- Checkbox "Bez CV-ja" IZ SEARCH BARA, zajedno sa `.hero-search__check` / 
  `.hero-search__box` CSS-om. Nije nestao nego se preselio u toolbar kao `.nocv-toggle` - 
  ne vraćati pločicu u bar, bar mora ostati identičan onom na naslovnoj

### Query parametri (dolazak sa druge stranice)
Listanje čita `?vrsta=lokali|centrala`, `?lokacija=...`, `?pozicija=...`, `?nocv=1` i 
pretpodesi svoj bar. `vrsta` se postavlja PRVA jer ona rebuild-uje ostale dve liste.
Šalju ih: hero "Pretraži" na naslovnoj i mali bar "Pretraži druge pozicije" na 
oglas-primer.html. To je JEDAN ugovor za sve pozivaoce - ne uvoditi po jedan set ključeva 
po stranici (raniji `?grad=` je zamenjen sa `?lokacija=`).

## oglas-primer.html (template oglasa)
Struktura: tamni hero (naziv pozicije, lokacija, tagovi "Smene 8h" i "Bez CV-ja", CTA 
"Prijavi se sada", placeholder okvir "Foto zaposlenog") → beli panel sa opisom pozicije 
→ tamna sekcija sa formom za prijavu → beli panel "Pretraži druge pozicije" → tri 
kartice "Saznaj više o nama" → footer.
- Forma NIŠTA ne šalje (nema backend): jedino pravilo je checkbox saglasnosti, submit 
  zamenjuje formu potvrdom "Hvala, javićemo ti se uskoro!"
- Tagovi su BREND ŽUTI, ne zeleni kao na referentnoj slici - na sajtu nema zelene boje
- Mali filter bar "Pretraži druge pozicije" ne filtrira ovde nego prosleđuje izabrani 
  grad na listanje.html preko ?lokacija=... (listing ga pročita i pretpodesi). Isti set 
  ključeva koji šalje i hero bar sa naslovne - videti "Query parametri" iznad
- Sadržaj oglasa je iz klijentske reference; dupliran bullet iz reference je UKLONJEN 
  (8 bullet-a, svaki jednom). PAŽNJA: uvodni pasus kaže "90 lokala i 13 gradova Srbije" 
  (tako traži brief), a listing prikazuje 16 različitih gradova - proveriti sa klijentom

## Animirana pozadina (globalna)
⚠ `.animated-bg::after` je DITHER sloj i NE SME se brisati. Blobovi su tvrdi krugovi 
zamućeni za 110px, pa je nastali gradijent toliko blag da susedni koraci padaju u isti 
8-bitni nivo - svako mesto gde zaokruživanje preskoči crta vidljivu konturu, i u blobovima 
se ocrtavaju koncentrični prstenovi (najgore na tamnoj temi, gde ceo prelaz živi u par 
nivoa iznad crne). Sloj je fini statični šum (inline SVG feTurbulence) na opacity .06 koji 
te korake razbija. Nije dekoracija - bez njega se prstenovi vrate. Preko ~.09 počinje da 
se čita kao namerna zrnasta tekstura.
⚠ FILTER LANAC U TOM SVG-u JE NOSEĆI, ne ukras. Gola feTurbulence NE radi posao - ona 
šumi i ALFA kanal, pa je veći deo teksture providan i samo deo piksela uopšte biva 
pomeren. Dva dodatna primitiva to rešavaju: `feColorMatrix saturate 0` (turbulence je 
inače šum u boji, koji se na skoro crnoj stranici vidi kao crveno/plavo zrno) i 
`feFuncA slope=0 intercept=1`, koji alfu forsira na 1 svuda, pa je sloj pun i SVAKI 
piksel dobija pomeraj. Jačina se posle podešava isključivo preko `opacity`.
IZMERENO na rezu od 700px kroz gornji levi sjaj (tamna tema): bez sloja 22 promene 
vrednosti i najduža ravna traka od 356px; sa slojem 540 promena i najduža traka 5px. 
Ako neko ikad prijavi da se prstenovi vide, PRVO proveriti da li browser servira keširan 
styles.css (Ctrl+Shift+R) - dither je merljivo ispravan.

.animated-bg - position: fixed, iza celog sadržaja, 3 blob-a (radial gradient, blur 110px, 
manje dimenzije ~25vw/25vw/20vw radi vidljivosti pokreta, brže animacije ~16s/19s/13s), 
boje #FAA61A/#FFCB05. Sekcije sa čvrstom pozadinom (bela/#ECECEC) prekrivaju je normalno; 
orange sekcije je puštaju da se vidi kroz njih.

## Tamna tema (theme-dark.css)
⚠ **TAMNA JE JEDINA TEMA.** Sve tri stranice se otvaraju tamne i NEMA IZLAZA IZ TOGA - 
svetla varijanta je povučena na zahtev ("neće biti light teme, samo dark"). Uklonjeni su 
prekidač teme, `?tema=light` i localStorage ključ `bb-tema`; kružno dugme dole desno je 
ostalo na istom mestu ali sada bira VARIJACIJU dizajna (videti "Varijacije dizajna").

⚠ ŠTA NIJE URAĐENO, i namerno: svetla pravila u styles.css NISU obrisana niti su tamna 
presuta u njih. Ona su i dalje osnovni sloj preko kog theme-dark.css piše - samo se do njih 
više ne može doći iz UI-ja. Presipanje je veliki i nepovratan refaktor jednog jedinog 
stylesheet-a koji dele sve tri stranice; radi se tek kad se dizajn zaključi. Do tada je 
"nema svetle teme" sprovedeno na nivou pristupa, ne na nivou fajlova.

Nije napravljen drugi `index-dark.html` NAMERNO: header i footer moraju ostati 
na tri byte-identične kopije, a duplikat bi ih digao na četiri i svaku buduću ispravku 
udvostručio. Markup stranica se za temu NE dira uopšte osim `<html>` taga i `<head>`-a.

⚠ NAJVEĆI DEO LISTANJA NE TRAŽI NIJEDNO PRAVILO IZ OVOG FAJLA, i to je namerno: aurora, 
header, futer i žuta CTA dugmad su isti zajednički elementi kao na naslovnoj, pa ih hvataju 
pravila koja tu već postoje. Ono što je stvarno specifično za listanje - `.page-hero--flush` 
bez podloge i `.search-band` - pisano je BEZ TEME, u styles.css, jer izgleda isto u 
obe varijante. Stvarno svoja su samo dva izuzetka:
- `[data-theme="dark"] .job-card a.bg-brand-cta:hover` vraća SVETLOTEMSKI hover 
  (brightness .95, bez haloa). "Prijavi se" na listanju je jedina žuta CTA koja i u tamnoj 
  temi stoji na BELOJ kartici, jer panel sa rezultatima ostaje svetao; opšte tamno pravilo 
  (posvetljenje + žuti halo) bi joj na belom nacrtalo prljav oreol
- `:not(.page-hero--flush)` na tamnom pravilu za `.page-hero` - bez toga bi hero na 
  listanju u tamnoj temi dobio staklenu podlogu i okvir, iako u svetloj stoji golo na 
  aurori (videti "Hero traka" u sekciji listanja)
- Uključuje je atribut `data-theme="dark"` na `<html>`, koji STOJI ZAKUCAN U MARKUPU. Tako 
  važi od prvog pixela - pre nego što se izvrši ijedna linija JS-a, i onda kad JS ne radi. 
  Ranije ga je postavljao boot skript, pa je postojao rizik od bleska svetle teme
- Boot skript u `<head>`-u više NE dira temu - on sada postavlja `data-var` (videti 
  "Varijacije dizajna"). Raniji skript koji je SKIDAO `data-theme` na `?tema=light` je 
  obrisan sa sve tri stranice
- Specifičnost: `[data-theme="dark"] .opening-card` (0,2,0) pobeđuje Tailwindovu 
  `.bg-white` (0,1,0), pa !important nigde ne treba OSIM kod stat blokova mozaika - njima 
  JS piše boju u inline style, a to se bez !important ne može nadjačati. Dva tona se 
  razdvajaju preko `:has(.text-brand-yellow)` jer markup ne daje različitu klasu
- Žute (#FDB813/#FDB913) se NE menjaju ni u jednoj varijanti - one su akcenat i na tamnoj 
  rade bolje nego na narandžastoj. Podloge: stranica #131011 (--dk-bg), tekst #F5F1EC 
  (--dk-ink, topla bela a ne čisto #FFF), pune kartice #241F20 (--dk-card).
  ⚠ PANEL #impact I KARTICE POZICIJA (.opening-card) SU PROVIDNI: --dk-glass, tj. 
  **#0e0d0e na 0.6 alfe**, traženo tako. Alfa je deo BOJE, ne opacity na elementu - 
  opacity bi oborila i tekst i slike unutra; ovako se providi samo podloga i aurora se 
  nazire kroz nju. Raniji puni --dk-panel #1B1718 je uklonjen zajedno sa tokenom.
  Stat blokovi mozaika su NAMERNO ostali puni - providni bi propuštali istu auroru kao 
  panel na kome stoje i prestali bi da se čitaju kao kartica
- Šta je SAMO u tamnoj drugačije po boji, a nije samo podloga:
  - hero h1 je RAZDVOJEN po rečenicama: prva ("Uđi u igru.") je BELA, druga ("Budi deo 
    tima.") je BREND ŽUTA (#FDB813). ⚠ RASPORED JE OBRNUT u odnosu na raniju verziju 
    (prva žuta, druga bela) - promenjeno na zahtev, ne vraćati. Zato se žuta piše na CEO 
    `#hero-heading` a bela vraća samo na `.hero-heading__lead`: obrnuto bi tražilo span 
    oko druge rečenice, koji u markupu ne postoji. Selektor sa id-jem uzgred nadjačava 
    Tailwindovu `text-white` iz markupa, pa se markup ne dira
  - TEKST U SVIM ŽUTIM CTA DUGMADIMA je TAMAN (u svetloj je beo) - i "Pronađi posao" u 
    navigaciji i "Prijavi se" na karticama pozicija. Žuta pilula na skoro crnoj stranici, 
    belo na žutom bi bio najslabiji kontrast na ekranu
  - ŽUTA DUGMAD IMAJU SVOJ HOVER: u svetloj temi je `hover:brightness-95`, dakle 
    potamnjenje, što na tamnoj stranici deluje kao da se dugme gasi. Ovde ide obrnuto - 
    brightness(1.07) + meki žuti halo (box-shadow 4px na .16 alfe), pa dugme zasvetli. 
    Selektor je specifičniji od Tailwindove hover klase, pa se markup ne dira
  - **ZAKLJUČNA TRAKA FUTERA JE PUNA ŽUTA** (#FDB813) - jedina puna žuta POVRŠINA na 
    tamnoj stranici. ⚠ ŽUTU NOSI SAMO `.footer-bar`, NE ceo `<footer>`: dve .footer-cta 
    kartice iznad ostaju na podlozi stranice (traženo eksplicitno - fotografije se tuku sa 
    žutom pločom iza sebe). U svetloj temi traka nema podlogu (vidi se aurora, tekst je 
    beo), pa je ceo dark blok samo okretanje te iste, nepromenjene strukture u tamno na 
    žutom:
      * ⚠ žuta je #FDB813 (brend akcenat), NE #ffbb1a (`brand.cta`) - traka je podloga, 
        a ne kontrola
      * tekst trake: belo na .8 alfe → rgba(35,31,32,.72). Isti odnos, pa red ostaje 
        sekundaran umesto da na žutom postane drugi naslov
      * gornja linija trake ide u `transparent` - u svetloj temi je separator, ovde deli 
        sama ivica žutog, pa bi bela crta po njenom vrhu bila šav viška
      * Smartweb logo je ceo beo i na žutom bi NESTAO - obara se u crno preko 
        `filter: brightness(0)` (+ opacity .72 da prati tekst pored sebe). To je jedini 
        razlog zašto red uopšte nosi klasu `.footer-legal`
      * KRUGOVI DRUŠTVENIH MREŽA se obrću: puna TAMNA pločica sa ŽUTIM glifom (u svetloj 
        temi je obrnuto, bela pločica sa tamnim glifom), pa se čitaju kao rupe izbušene u 
        traci. Hover je inverzija - beo krug, taman glif; svetlotemski hover je tamna 
        pilula, tj. tačno mirno stanje ovde, pa bi bio nevidljiv
      * .footer-cta kartice NE TRAŽE NIŠTA - medij ide preko cele kartice a tekst stoji 
        na svom crnom scrimu, pa rade na tamnom bez ijedne izmene
  - linkovi "POGLEDAJ SVE POZICIJE" (#openings) i "SAZNAJ VIŠE O NAMA" (#impact) su ŽUTI 
    zajedno sa svojim border-b-2 podvlakama, hover im se vraća u belo
- SEARCH BAR NEMA tamni skin - stilski je IDENTIČAN u obe varijante (žuti okvir, BELI 
  tabovi, crno dugme "Pretraži", beli meni). Imao ga je (tamne pločice + svetlo dugme); 
  uklonjen na eksplicitan zahtev, ne vraćati
- Aurora ostaje sa istom geometrijom i animacijama, samo prigušena (.18/.14/.11) i u 
  #FAA61A umesto #FFCB05 - hladnija žuta na crnom čita zelenkasto
- ⚠ `hover:text-brand-dark` / `hover:border-brand-dark` je kroz naslovnu hover-potamnjenje; 
  na tamnoj podlozi bi link na hover NESTAO, pa se globalno prevodi u žutu. Izuzetak je CTA 
  "Saznaj više o nama", koji na hover menja i podlogu - njegovo pravilo je specifičnije
- OPSEG JE SVE TRI STRANICE - `oglas-primer.html` je uključena i više nema onog nesklada 
  kad se sa tamnog listanja klikne "Prijavi se"
- KAD SE TEMA ZAKLJUČA: pravila se presipaju u styles.css, a theme-dark.css i njegov 
  `<link>` nestaju. `data-theme="dark"` sa `<html>` tada takođe ide, jer ga niko više ne 
  čita

## Varijacije dizajna (variation-2.css / variation-2.js)
Prekidač dole desno (kružno dugme 44px, `.var-toggle`) više NE bira temu nego DIZAJN. U 
krugu stoji `#1` ili `#2`.
⚠ **#2 JE PODRAZUMEVANA I NA NJOJ SE RADI DALJE.** Atribut `data-var="2"` stoji ZAKUCAN
u markupu sve tri stranice, pa važi od prvog pixela. #1 je original i ostaje samo kao
poređenje; do njega se stiže prekidačem ili preko `?var=1`, i tada boot skript SKIDA
atribut (isti obrazac koji je ranije koristio izlaz iz tamne teme).
- **#1** je original - hero opisan u tački 2 gore. Nema `data-var` atributa.
- **#2** menja SAMO HERO NASLOVNE; sve ispod heroja i cele druge dve stranice su
  identične u obe.

Mehanika je namerno ista kao kod teme, jer je dokazano dobra na ovom projektu:
- atribut `data-var="2"` STOJI U MARKUPU `<html>`-a sve tri stranice; boot skript u
  `<head>`-u ga samo SKIDA kad je tražena #1 (`?var=1` ili localStorage ključ `bb-var`;
  URL pobeđuje, da se varijacija može poslati kao link). MORA ostati u `<head>`-u -
  skidanje kasnije daje vidljiv blesak varijacije #2 pre #1
- `variation-2.css` se učitava SAMO na index.html; svako pravilo u njemu je pod 
  `[data-var="2"]`, pa fajl bez atributa ne radi ništa
- ⚠ **PREKIDAČ RELOADUJE STRANICU.** Varijacija #2 gradi svoj hero iz skripta i menja 
  geometriju naslovne (spacer 493vh naspram 373vh, sva merenja), pa je prebacivanje uživo 
  značilo rušenje i ponovno dizanje pola stranice
- prekidač postoji i na listanju i na oglasu, iako tamo ne menja ništa - da izbor ne bi 
  ispario kad se napusti naslovna, i da broj u krugu bude tačan

### Varijacija #2 - hero naslovne
Rekonstrukcija uvodne animacije sa **telescope.fyi** (traženo eksplicitno, "identična kao 
na tom sajtu"): polje sitnih fotografija oko naslova prolazi kroz kadar ka posmatraču, 
naslov se razmiče u stranu i gasi, a u sredini se zumira glavni medij. Kod nas je taj medij 
POSTOJEĆI hero video sa search barom, umesto njihove slike.
- Naslov: markup se NE dira uopšte - ni jedan čvor se ne obavija. Dva reda, `<br>` između
  njih i `.hero-heading__lead` na prvoj rečenici dolaze iz markupa.
  ⚠ **BOJE SU OBRNUTE** u odnosu na raniju verziju: "Uđi u igru." je BELA, "Budi deo
  tima." je ŽUTA. U theme-dark.css se zato žuta piše na CEO `#hero-heading` a bela vraća
  na `.hero-heading__lead` - obrnuto bi tražilo span oko druge rečenice, koji u markupu ne
  postoji.
  ⚠ **NASLOV IZLAZI KROZ KAMERU**, kao i pločice - ne ide ni gore ni dole. Ranije su se
  redovi razmicali vertikalno (a pre toga reči horizontalno); oboje je promenjeno na
  zahtev, ne vraćati.
  Vozi ga ISTI `zoomEased` koji vozi zum videa, i to je poenta: naslov raste u korak sa
  ivicama videa koji dolazi ispod njega i ne odlepi se od njega.
  ⚠ Dubina je `0.55 × P` (prividna skala do ~2.2×) i taj broj je štimovan PREMA VIDEU:
  na 0.78 (≈4.5×) naslov je na polovini uvoda bio ~1640px širok naspram ~730px koliko je
  tada video i čitao se kao da je odleteo sam.
  Neprozirnost pada na nulu PRE nego što naslov stigne do ivice - traženo tako.
  ⚠ `#hero-heading-wrap` u varijaciji #2 dobija `perspective: 100vh` - bez perspektivnog
  pretka `translateZ` na naslovu ne radi ništa. Ista vrednost kao na sceni sa pločicama
  je ono što drži da naslov i pločice izlaze kroz ISTU kameru
- ⚠ **JEDNA SCENA, JEDNA PERSPEKTIVA.** Ni pločice ni reči nemaju sopstvenu formulu za 
  razmicanje - svi dobijaju samo `translateZ`, a širenje ka ivicama crta sama perspektiva 
  (`perspective: 1000px` na `#v2-scene`). Ako se ovo menja, menjati DUBINU, ne x/y: čim se 
  x/y anima ručno, pokret prestane da izgleda kao jedan prostor
- **RASPORED PLOČICA JE PREPISAN SA REFERENCE, NE IZMIŠLJEN.** Niz TILES u variation-2.js 
  su IZMERENE vrednosti sa telescope.fyi (getComputedStyle nad njihovih 12 `.media` 
  elemenata), snimljene na DVA viewport-a (1280x720 i 1440x900) da bi se izveo i zakon 
  skaliranja: `x` i `w` prate ŠIRINU kadra, `y` prati VISINU, a visina pločice opet širinu 
  (odnos stranica je fiksan). Perspektiva je `100vh` - i to je izmereno (720px na kadru 
  visokom 720, 900px na 900), pa `PERSPECTIVE` u JS-u mora ostati jednak `vh`.
  Provereno: na 1440x900 prva pločica ispadne `−72px / 189px / 165.594×165.594`, referenca 
  ima `−72 / 189 / 165.6 / 165.6`. Ako se raspored ikad menja, menjaju se OVE vrednosti - 
  ne "otprilike slično", nego se premeri referenca
- ⚠ **U MIROVANJU JE translateZ NULA**, ne dubinska konstanta. Ovo je bila prava zabuna: 
  `d` (720/360/1080/540) jeste ono što stoji u njihovom CSS-u, ali čim se njihov skript 
  upali, on piše translateZ od nule naviše - prvo merenje je uhvatilo neinicijalizovano 
  stanje. Posledice, i obe su tražene:
    * pločice na PRVOM EKRANU stoje tačno na prepisanim koordinatama, razasute preko celog 
      kadra, raznih veličina, neke preko naslova i neke odsečene ivicom (x = −0.05 je 
      namerno van kadra)
    * **VIDE SE ODMAH, BEZ SKROLA.** Nema ulaznog fade-a; jedino gašenje je ono na kraju 
      puta, kad pločica stigne do ravni kamere
  `d` odlučuje SAMO koliko brzo koja poleti ka posmatraču. Do kraja uvoda svaka pređe 
  `1.5 × d` (izmereno: d=720 završi na 1080, d=360 na 540), pa one sa velikim `d` PROĐU 
  pored posmatrača a one sa malim samo narastu - to raslojavanje je ono što daje dubinu
- ⚠ Pločice nemaju ni radijus ni senku - i to je sa reference (izmereno `border-radius: 0`). 
  Sa 10px radijusa i senkom su se čitale kao UI kartice, a ne kao slike u prostoru
- ⚠ TRI POLOŽAJA SU POMERENA U ODNOSU NA REFERENCU, na zahtev. Referenca ima brend traku
  na DNU ekrana, a naša navigacija je na VRHU, pa su joj tri pločice ulazile u posao:
  `i=4` spuštena sa y .050 na .150 (stajala je preko dugmeta "Pronađi posao"), a `i=1` i
  `i=2` su smanjene, pomerene levo i spuštene (te dve se preklapaju i zajedno su
  prekrivale nav linkove). Ostalih devet je netaknuto - ako se ikad menja, menjaju se OVE
  tri, ne ceo raspored, jer je on merenje a ne procena
- **UVODNI RASPORED** - pri učitavanju pločice dolete na svoja mesta, pa tek onda miruju.
  Sve je IZMERENO na referenci (uzorkovanje computed style-a frejm po frejm od učitavanja):
  polazna dubina je `−1.25 × d`, trajanje ~1.85s po pločici, razmak polazaka ~90ms, i to u
  promešanom redosledu `[6,9,3,1,7,2,0,4,11,8,5,10]` (nije pozicioni, pa stoji kao spisak).
  ⚠ Sat uvoda kreće TEK KAD SU SVE SLIKE UČITANE (uz osigurač od 1600ms): skript stoji na
  dnu <body>-ja, pa bi inače prve pločice doletele PRAZNE i slika bi im iskrsla na mestu
- **HOVER** - slika unutar pločice klizi za pokazivačem, "magnetno". IZMERENO na referenci:
  pomeraj je `0.30 ×` koliko je pokazivač odmakao od centra pločice, u ISTOM smeru; zona
  osetljivosti je 15% šira od pločice sa svake strane (`.v2-tile__hit`).
  ⚠ `.v2-tile` NE SME imati `overflow: hidden` - slika mora smeti da izađe van okvira,
  inače se efekat pretvori u pomeranje isečka unutar rama.
  ⚠ Pomeranje ide lerpom po frejmu, NE CSS tranzicijom: tranzicija na svaki pomeraj miša
  restartuje svoju krivulju i pokret ispadne stepenast.
  ⚠ Hover se GASI čim skrol krene (`is-locked` na sceni, prag 0.03) - pločice tada narastu
  preko pola ekrana i "magnetna" zona bi hvatala pokazivač nasred videa
- ⚠ rAF petlja se vrti SAMO dok ima šta da se pomera (uvod ili hover) i sama se gasi. Oba
  listenera hovera moraju da je probude - `pointermove` prestaje da stiže čim pokazivač
  napusti scenu, pa bi bez buđenja na `pointerleave` slika ostala zauvek odgurnuta
- ⚠ **SEARCH BAR SE SELI UNUTAR `#hero-media-box`** (samo u #2, radi to skript). To je ceo 
  trik iza "video i search se zumiraju zajedno": kutija je tačno viewport, bar u njoj stoji 
  na svojih 96px od dna, pa jedan `scale()` zumira oba i sleti na 1:1 - krajnji kadar je 
  identičan varijaciji #1 do piksela, a dropdown-i i dalje rade
- Kutija se SKALIRA, ne raste kroz width/height kao u #1. Skaliranje je jedino što zumira
  SADRŽAJ; menjanje dimenzija bi samo otkrivalo više videa umesto da mu prilazi
- ⚠ **BEZ RADIJUSA NA ZUMU.** Radijus je kratko bio konstantan u EKRANSKIM pikselima, što
  je značilo deljenje sa skalom - a na skali od 0.02 to daje radijus veći od same kutije,
  pa se video pojavljivao kao pilula/elipsa i tek posle postajao pravougaonik. Uklonjeno
  na zahtev; referenca ionako ima oštre uglove
- SAMO FOTOGRAFIJE u polju. `assets/values/*.png` i `benefit-*.png` su ikonice (providni 
  PNG sa sitnim žutim glifom) i čitaju se kao prazni tamni pravougaonici - probano, 
  izbačeno. Fotografija ima svega šest pa se ciklus ponavlja
- TAJMING (razlomci uvodnog napretka `e`): pločice su vidljive od nule i nemaju ulaznu
  rampu na skrol (imaju je samo pri učitavanju, videti UVODNI RASPORED); zum ide 0.16→1.0,
  a naslov ga prati istom krivuljom i gasi se na 0.08→0.50 tog zuma
- SPACER je 493vh (naspram 373vh u #1): P0 1vh | uvod 252vh | snap 10vh | izlazak 130vh. 
  ⚠ **IZLAZAK MORA OSTATI 130vh** - na njemu stoji `margin-top: -130vh` sekcije #openings. 
  Produžen je samo uvod. Razlomke drži `PHASE` u variation-2.js
- ŠTA JE ZAJEDNIČKO: `updateHero()` u index.html i dalje je jedini scroll listener. Na vrhu 
  računa izlaznu fazu i staklo headera, pa tek onda preda kadar varijaciji #2 - tako se to 
  dvoje ne može razići između varijacija

## Pravila za dalji rad
1. Pre bilo koje vizuelne izmene, PROVERI trenutno stanje u index.html (ne pretpostavljaj 
   na osnovu ovog fajla ako je prošlo puno vremena/izmena)
2. Ceo sajt je sada na srpskom i izbrendiran - NEMA više engleskog teksta ni pomena 
   drugih firmi/domena (Kaizen, SBC, SOUL, kaizengaming.com su svi uklonjeni, kao i 
   picsum placeholder slike). Ako se dodaje nov sadržaj, mora biti na srpskom i sa 
   Balkan Bet podacima; pre nego što se javi da je gotovo, grepni sve tri stranice za 
   "kaizen|SOUL|SBC|picsum|Lorem" da ne bi nešto ostalo
3. Kod svake izmene, sačuvaj fajl i napravi screenshot za proveru pre nego što se javi 
   da je gotovo.
   **NAJBOLJI ALAT: PLAYWRIGHT** (traženo eksplicitno da se ne ostaje na headless Chrome-u).
   Ceo sajt je scroll-driven, a headless Chrome ne ume da skroluje - sa njim se hero uopšte 
   ne može proveriti bez sakaćenja stranice privremenom kopijom. Playwright ume, i ume da 
   klikne, izmeri i pročita konzolu u istom prolazu.
   - `npm i playwright` u scratchpad folder, pa `chromium.launch({channel:'chrome'})` - 
     koristi VEĆ INSTALIRAN Google Chrome, pa nema preuzimanja browsera. ⚠ `npx playwright 
     install` NE TREBA i ume da promaši: keširani browseri na ovoj mašini su novijeg builda 
     od onog koji npm paket očekuje, pa `launch()` bez `channel` puca na "Executable 
     doesn't exist"
   - Server je `preview_start {name:'static-preview'}` na `http://localhost:4173`
   - ⚠ SCROLL SE MORA SAČEKATI. Lenis izglađuje vrednost koju hero čita, pa snimak odmah 
     posle `window.scrollTo` uhvati kadar na pola puta. NE spavati fiksno i NE dodavati 
     `window.lenis` u produkcijski kod - čekati IZLAZ: poll-uj `transform` na 
     `#hero-media-box` i `#hero-heading` dok se ne poklope u dva uzastopna frejma
   - Harness koji sve to radi: `shot.mjs` u scratchpad folderu 
     (`node shot.mjs <url> <prefix> <razlomci> --var=2 --w=1440 --h=900`)
4. Ne diraj animiranu pozadinu (.animated-bg) osim ako se eksplicitno ne traži
5. Izmena koja se tiče izgleda komponente ide u styles.css (deli je svih troje stranica), 
   NE u <style> na pojedinačnoj stranici - inače stranice počnu da se razilaze

## Pravilo za efikasno čitanje fajlova (štednja tokena)
- NE čitaj ceo index.html automatski na početku svake sesije "da se podsetiš" - ovaj CLAUDE.md 
  fajl je dovoljan kontekst za opšte razumevanje projekta
- Pre izmene, pročitaj SAMO onaj deo/sekciju fajla koja je relevantna za traženu izmenu 
  (koristi grep/search da nađeš tačan red/sekciju pre nego što učitaš ceo fajl, ako je moguće)
- Ako izmena zahteva razumevanje šire strukture (npr. z-index odnosi između sekcija), tek 
  onda pročitaj ceo fajl - ali eksplicitno navedi ZAŠTO ti je to potrebno pre nego što to uradiš
- Nakon izmene i provere da radi, NE zadržavaj ceo pročitani sadržaj "za svaki slučaj" u 
  narednim porukama ako više nije relevantan za sledeći zadatak
