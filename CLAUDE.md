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
- **theme-dark.css** - TAMNA VARIJANTA, aditivni sloj i **PODRAZUMEVANA tema**. 
  Učitava se u index.html **i u listanje.html**, posle styles.css. Pravila važe dok 
  `<html>` ima `data-theme="dark"`, a taj atribut stoji ZAKUCAN u markupu obe stranice. 
  oglas-primer.html ga NE učitava i ostaje svetla. Videti sekciju "Tamna varijanta" niže
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

Dodatno, SAMO za sekciju "Proces zapošljavanja" (nigde drugde):
- **Lumiera Handwriting** (assets/fonts/Lumiera Handwriting.otf) - brojevi 01-04. Ime fajla
  ima RAZMAK, u url() mora ostati %20 kodirano
- **Patrick Hand** (assets/fonts/PatrickHand-Regular.ttf) - nazivi koraka
Oba se @font-face-uju u styles.css uz NeoSans. VAŽNO: dve familije se drastično
razlikuju po odnosu ink/em - Lumiera cifre su ~0.48em visoke i ~0.42em široke, Patrick
Hand verzali ~0.66em. Zato brojevi imaju font-size 18.2cqw a labeli 3.64cqw; isti
font-size bi nacrtao brojeve upola manje od reference (izmereno canvas TextMetrics-om)

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
   nav linkovi (Poslovi u lokalima, Posao u centrali, O nama, Život u Balkan Betu, Kontakt) 
   - caps-lock, 16px, Medium, letter-spacing -0.06em, padding 30px levo/desno na celom 
   nav baru; CTA dugme "Pronađi posao" desno - bold, puna žuta #FDB813 sa BELIM slovima 
   (ista boja kao "Prijavi se" dugmad na karticama pozicija). JEDINI CTA na sajtu koji 
   NIJE caps-lock - eksplicitan zahtev. Ranije je imao .cta-gradient pozadinu i uppercase, 
   ne vraćati
2. Hero - h1 naslov "USKOČI / U IGRU. / BUDI DEO / TIMA." (4 reda, Bold, letter-spacing 
   -0.06em, belo), scroll-driven animacija: 
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
   - #hero-scroll-ball - mala loptica (gradijent iz logotipa preko .cta-gradient klase) 
     koja skakuće, horizontalno centrirana, bottom: 8vh. Zamenjuje klasičnu "scroll down" 
     strelicu. Izlazi iz ekrana po ISTOM headT kao h1 (isti opacity i isti pomeraj gore). 
     z-index 3 je namerno ISPOD media boxa (5) da je video prekrije dok se diže - inače 
     bi delovalo kao da lebdi po videu. Bounce je CSS animacija na UNUTRAŠNJEM span-u, 
     a scroll transform ide na spoljni div - da se CSS animacija i JS transform ne tuku.
     Loptica NIJE CSS gradijent nego INLINE SVG prekopiran doslovno iz BalkanBetLogo.svg 
     (ista putanja, isti stopovi I isti gradientTransform, viewBox 0 0 158.03 158.03). 
     CSS radial-gradient ovde ne može - transform rotira gradijent za 72° i skalira ga 
     van centra, pa je svaki "circle at x% y%" samo aproksimacija. NE vraćati na .cta-gradient.
     ⚠ LOPTICA JE `<button>`, NE div - KLIKABILNA JE. Klik skroluje na SNAP PAUZU, tj. na 
     `HERO_PHASE.p2End`: to je tačan frejm kad video stigne preko celog ekrana sa search 
     barom na sebi (p2End→p3End je pauza, pa bi dublje odredište već jelo pauzu). Cilj se 
     računa iz istih keširanih mera na kojima radi updateHero (`heroOffsetTop + p2End * 
     heroScrollable`) i čita se U TRENUTKU KLIKA, pa resize u međuvremenu ne traži ništa 
     dodatno. Ide kroz `lenis.scrollTo(..., { duration: 1.4 })` - native scrollTo bi 
     iskočio iz Lenisove izglađene vrednosti i razbio koreografiju.
     Pošto je kontrola, a ne ukras: NEMA aria-hidden, ima aria-label, i CSS mora da resetuje 
     browserov button chrome (padding/border/background) pre nego što raspored znači išta. 
     Kad se ispari (headT >= 1), updateHero joj postavlja `hidden` - providno dugme bi i 
     dalje hvatalo Tab i klik preko videa. Upis je čuvan (samo na dva frejma kad se menja), 
     ne na svaki scroll tick.
     Loptica NEMA box-shadow; umesto toga ima zasebnu bačenu senku (.hero-scroll-ball__ 
     shadow) prikovanu za pod. I veličina I vidljivost prate udaljenost: daleko = široka 
     i malo prisutnija, blizu = uska i skoro nevidljiva. Ceo raspon opacity-ja je NAMERNO 
     nizak (.05-.17) - loptica je mala i stoji na živoj narandžastoj pozadini, pa sve jače 
     od toga prestaje da liči na bačenu senku i deluje kao druga tamna mrlja. Njena animacija 
     ima ISTE keyframe tačke i trajanje kao bounce - ako se menja jedno, mora i drugo, 
     inače senka počne da "kuca" po svom ritmu
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
3. **"NAJNOVIJE POZICIJE"** (#openings) - PRVA sekcija posle videa, ona koju video 
   otkriva pri izlasku. Zato ONA nosi margin-top: -130vh (vezano za tajming izlaska 
   videa, videti tačku 2) - to pravilo pripada "prvom slotu posle heroja", ne konkretnoj 
   sekciji; ako se redosled opet menja, margina se seli sa slotom. Margina je PUNIH 130vh 
   (koliko i HERO_EXIT_TRAVEL) namerno: tako je razmak između donje ivice videa i vrha 
   sekcije NULA na svakoj visini ekrana - sekcija jaše na donjoj ivici videa i čita se kao 
   da je video gura gore. Ranije je tu ostajalo 30px donjeg inseta media box-a; otkad je 
   video fullscreen (videti tačku 2), tog inseta nema. 
   Zbog toga sekcija ima ASIMETRIČAN padding - 119px gore i 140px dole (do belog 
   #impact panela); oba razmaka ČITAJU se kao 140px (raniji 200px, stegnut za 30%). 
   Gornjih 119px je izvedeno: traženih 140px se meri od ivice videa do 
   VRHA SLOVA naslova, a ne do vrha njegovog box-a, pa se oduzima 
   21px sopstvenog leading-a naslova (84px line-height na 56px fontu = 7px half-leading, 
   plus 14px koliko ascender fonta prelazi visinu verzala; mereno iz font metrike). 
   140 - 21 = 119 važi SAMO za ovaj font-size/line-height - ako se naslov menja, 
   premeriti. Bilo je 89px dok se oduzimalo i 30px inseta videa; kad je video otišao u 
   fullscreen, tih 30px se vratilo na padding, pa razmak koji se vidi nije promenjen. Unutrašnji razmaci su takođe stegnuti za 20%: naslov→kartice 51px 
   (mb-[51px]), kartice→link 45px (mt-[45px]). Ako se margina smanji, ostatak (130 - |margina|)vh se dodaje na razmak i 
   on opet počne da raste sa visinom ekrana. 
   Sekcija NEMA pozadinu 
   ni zaobljeni panel (aurora se vidi kroz nju), naslov i link su BELI: naslov centriran 
   iznad, a "POGLEDAJ SVE POZICIJE" (beo caps-lock tekst link sa belom podvlakom 
   border-b-2) je ISPOD reda kartica, ne ispod naslova. Ta podvlaka od 2px je referenca 
   za balkanbet.rs link u futeru - držati ih usklađene. 4 kartice 
   pozicija (Beograd, Novi Sad, Niš, Kragujevac), bele: 12px radijus, 28px padding, 
   naslov ~26px, dugme "Prijavi se" (NIJE caps-lock, za razliku od ostalih CTA na sajtu 
   - eksplicitan zahtev). Stagger kaskada s leva na desno; PONAVLJA SE svaki put kad se 
   sekcija vrati u vidno polje
4. **"ŽIVOT U BALKAN BET-U"** (#impact) - ISPOD pozicija, na BELOJ pozadini 
   (section-panel + rounded-[32px] + bg-white). Tri dela:
   - h2 "Život u Balkan Bet-u" - običan naslov, taman, caps-lock, ISTI font-size clamp 
     kao naslov "Najnovije pozicije" (clamp(1.75rem, 4.4vw, 3.5rem)) - dva naslova treba 
     da čitaju kao isti nivo, držati clampove usklađene
   - PODNASLOV = stari scroll-scrubbed reveal reč-po-reč (id ostaje #impact-heading, 
     sada <p> a ne <h2>): reči kreću svetlo sive (brand-dark na 0.28 alfe) i popunjavaju 
     se u tamno kako sekcija prolazi kroz svoj prozor, a TEK kad se sve popuni, poslednja 
     rečenica "Zajedno možemo mnogo više." dobija žuti marker. Tekst je prelomljen u 
     4 reda (ranije 5). 
     TAJMING: popunjavanje NE počinje dok ceo pasus nije na ekranu - start je zakačen 
     za trenutak kad poslednji red pređe donju ivicu (+32px), kraj kad pasus dođe 350px 
     ispod headera; na niskim ekranima se run poda na IMPACT_MIN_RUN (260px). 
     measureImpact() se OBAVEZNO poziva ponovo na kraju skripte (i na 'load' i na 
     document.fonts.ready) - blok koji renderuje kartice pozicija stoji ISPOD IMPACT 
     bloka, pa je prvo merenje ~300px kraće od stvarnog
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
5. **"PROCES ZAPOŠLJAVANJA"** (#proces) - rekonstrukcija klijentskog crteža, ispisuje se 
   na scroll. Zamenila slider sa ikonicom u žutom krugu + dots navigacijom i 5 koraka; 
   crtež ima ČETIRI koraka i podnaslov ih broji ("4 koraka do karijere u Balkan Bet-u") - 
   držati usklađeno. Sekcija NEMA pozadinu (aurora se vidi kroz nju), koraci su tamni 
   #231F20 direktno na narandžastom.
   - PODNASLOV IDE IZNAD NASLOVA (čita se kao kicker) - na referentnom crtežu je bilo 
     obrnuto, ovaj redosled je traženo posle. Razmake drži LINE-HEIGHT, ne margina: oba 
     reda inače naslede line-height 1.5, što parkira ~9px pod baseline kickera i ~10px 
     nad linijom verzala naslova, pa stezanje samo margine skoro ništa ne promeni. Zato 
     kicker ima leading-tight a naslov leading-[1.05] + mt-3 (rezultat: 26px od baseline 
     kickera do verzala naslova, ranije 37px). Naslov→koraci je mt-6 md:mt-8 
     (51px od baseline naslova do prvog tuša, prvobitno 120px)
   - VELIČINE su smanjene za 0.85 (broj 18.2→15.5cqw, labela 3.64→3.1cqw, širina strelice 
     8.2→7cqw) i koraci su RAZMAKNUTI po X: svaki komad, u redosledu ispisivanja, nosi 
     jedan procenat stage-a više od prethodnog (s1 +0, a1 +1, s2 +2 ... s4 +6), a prvi 
     korak je povučen 1% ka levoj ivici. Kompozicija sad ide 1.2% → ~98% umesto 2.2% → 92%. 
     --y cik-cak nije diran.
     ⚠ Sve TRI veličine skaliraju ZAJEDNO - to je jedino što drži `stroke-width: 4.3` na 
     strelicama i dalje tačnim bez preračunavanja (taj broj je odnos Lumierinog pera i 
     viewBox jedinice strelice, pa preživi svaku promenu koja pomera oba za isti faktor). 
     Ako se menja samo jedna, ponoviti deljenje opisano niže
   - GEOMETRIJA: #proces-stage je box fiksnog aspect-ratio 1380/320 sa container-type: 
     inline-size. Svaki --x/--y u markupu je PROCENAT tog box-a, uzet sa crteža 
     (koordinatni početak u gornjem levom uglu pojasa koraka). Sve veličine tipografije 
     su u `cqw` - zato se cela kompozicija skalira kao JEDAN crtež na svakoj širini, 
     umesto da se prelama. Koraci idu cik-cak: 01 srednje, 02 visoko, 03 nisko, 04 visoko
   - line-height .5 na brojevima je NOSEĆI, ne kozmetički: Lumiera prijavljuje content 
     box od 1.57em, pa default (ili ranijih .8) ostavlja ogroman prazan pojas ispod svake 
     cifre, koji onda diktira visinu flex reda i izbaci korak 03 kroz dno stage-a
   - ISPISIVANJE: svaki komad "tuša" (broj, red labela, strelica) je .proc-ink i dobija 
     --w 0→1 iz updateProcess(); CSS odlučuje šta to znači - tekst maska koja putuje s 
     leva (MASK, ne clip-path, da se ascenderi/descenderi nikad ne odsecaju), strelice 
     stroke-dashoffset. Redosled je DOKUMENTNI REDOSLED .proc-ink elemenata, zato je 
     markup napisan u redosledu ispisivanja (01, "Pronađi", "poziciju", strelica, 02...) 
     iako je sve absolute i DOM redosled ne utiče na poziciju. Premeštanje tih nodova 
     menja redosled animacije
   - --len strelica se MERI u JS-u preko getTotalLength(); hardkodovan dasharray obmota 
     pattern i strelica bljesne cela odjednom
   - DEBLJINA STRELICA je uparena sa Lumierinim perom, nije birana na oko: njen stroke 
     meri 0.02 x font-size (skenirano sa canvas rendera), pa na 18.2cqw brojeva to je 
     0.364cqw; jedna viewBox jedinica strelice je 8.2/96 = 0.0854cqw, odakle 
     stroke-width: 4.3. Ako se menja širina strelice ILI veličina brojeva, ponoviti to 
     deljenje - sve teže od toga i strelice izgledaju kao da su crtane debljim flomasterom
   - TRAJANJE i START: ispisivanje kreće čim VRH kompozicije pređe donju ivicu za 
     PROC_LEAD (70px) - ranije se čekalo da ceo stage bude na ekranu, pa su koraci stajali 
     prazni pre nego što se nešto pokrene. Run je pola ekrana (procRun = vh*0.5, clamp 
     280..520), ~450px na 900px ekranu za svih 15 komada - namerno kratko (klijent je 
     tražio da 4 koraka ne traju dugo) i dovoljno kratko da se, iako počinje na prvi 
     piksel, završi dok je kompozicija još cela u kadru (na 900px: stage na y 380-629)
   - PADDING sekcije je ASIMETRIČAN (pt-[192px] / pb-[103px]) da bi VIZUELNO bio simetričan 
     na 150px. Sekcija je na ranijem cilju od 96px (py-24 ritam ostatka sajta) delovala 
     zgusnuto, pa je cilj podignut; bilo je pt-[138px] / pb-[49px]. Mereno od ivice suseda 
     do IVICE TUŠA: gore se 
     dodaje 42px jer .panel-overlap je već pojeo 48px a box prvog reda (sada kickera) 
     počinje ~6px iznad linije verzala; dole se oduzima 47px jer ispod ne sledi ivica 
     pozadine nego footer, koji nosi svoj -48px overlap i 80px pt-20, plus ~15px 
     neiskorišćene visine stage-a ispod najnižeg koraka. 
     Te dve KOREKCIJE (+42 / -47) su svojstvo suseda i tipografije, NE cilja - ako se 150 
     kasnije diže ili spušta, oba broja se pomeraju za isti iznos, ne izvode se ispočetka. 
     Važe SAMO za ove veličine tipografije i ovaj ratio stage-a
   - Ispod ~700px cik-cak se gasi: stage postaje običan stack, strelice display:none i 
     ISPADAJU iz sekvence (measureProcess filtrira po offsetParent), inače bi njihovi 
     slotovi bili mrtve pauze između koraka
6. Footer - IZBRENDIRAN, kompletno na srpskom. Otvaraju ga DVE CTA kartice sa medijem 
   (.footer-cta): "Poslovi u lokalima" (fotografija storage-profili.png, podnaslov 
   "Pogledaj otvorene pozicije u Balkan Betu.", vodi na listanje.html) i 
   "Posao u centrali" (isti video kao kartica centrale u mozaiku, pa ne košta dodatan 
   download; podnaslov "Postani deo našeg tima"). Ranije je tu bila jedna slika + tekst 
   box "Postani deo našeg tima?" - ne vraćati.
   HOVER je NAMERNO ISTI MEHANIZAM kao klikabilne kartice mozaika (.zivot-tile__cta): 
   žuti (#FDB913) panel pune veličine miruje ispod kartice i diže se preko medija, 
   ZAMENJUJUĆI ga - isti translateY(18%) start, ista trajanja, medij se uveća 1.06. 
   Raniji zakošeni panel do 60% visine je UKLONJEN; ova dva hovera treba da se čitaju kao 
   isti gest. Razlika od kartica mozaika: tekst NE živi u žutom panelu - naslov i 
   podnaslov su u jednom bloku centriranom po OBE ose (i u miru i na hover) i samo menjaju 
   boju u tamnu, pa ništa ne poskakuje kad panel dođe. Pilula je jedino što se pojavljuje, 
   i pojavljuje se ZAUZIMAJUĆI PROSTOR (.footer-cta__pillwrap animira grid-template-rows 
   0fr -> 1fr), pa potiskuje naslov i podnaslov gore i sva tri ostaju centrirana zajedno. 
   To je cela svrha tog wrappera - običan opacity fade bi ostavio tekst van centra kad se 
   dugme pojavi. :focus-visible pali isto stanje (dostupno sa tastature). Pilula 
   **"Saznaj više"** (ranije "Pogledaj pozicije", promenjeno na zahtev) NEMA strelicu i 
   NIJE caps-lock (ista izuzetak-grupa kao header CTA, "Prijavi se" i "Saznaj više o 
   nama") - ne vraćati ni jedno ni drugo. ⚠ Tekst je isti u OBE kartice i, pošto je futer 
   byte-identičan, na SVE TRI stranice - menja se na sva četiri mesta odjednom. 
   Ne mešati sa `.zivot-tile__cta` u mozaiku, koje i dalje pišu "Pogledaj pozicije" - to 
   je druga komponenta i nije bila deo zahteva.
   Ispod kartica kolone "Pun pogodak" (balkanbet.rs link ima border-b-2 punu belu 
   podvlaku, istu kao "POGLEDAJ SVE POZICIJE" u #openings), "Navigacija" (linkovi su 
   BOLD), "Prati nas".
   Donji red je grid od TRI kolone (ne justify-between, da bi srednja bila centrirana 
   prema futeru a ne prema dužini bočnih tekstova): levo copyright "©2026 Balkan Bet. 
   Sva prava zadržana.", u sredini "Nazad na vrh", desno "Dizajn i razvoj" + 
   assets/logo/smartweb-logo.svg. Taj logo je VEĆ ceo beo (fill="#fff"), ne treba mu 
   filter; visina je 1.15em da prati font reda. "Politika privatnosti" je UKLONJENA.

### Uklonjene sekcije (NE vraćati bez eksplicitnog zahteva)
- **"Naših 5 vrednosti"** (#values) - uklonjena zajedno sa .value-card CSS-om i VALUES 
  JS blokom. Slike i dalje stoje u assets/values/ (+ originali u assets/values/original/) 
  ako zatrebaju
- **"Recognized for Excellence"** (awards grid) - uklonjena sa svojim JS blokom; bili su 
  Kaizen sertifikati, nikad izbrendirani
- **"Latest events"** (carousel) - uklonjena sa svojim JS blokom; bili su Kaizen/SBC 
  eventi, nikad izbrendirani
- Ranije uklonjeno: "Naše poslovnice" (Leaflet mapa Srbije, zajedno sa Leaflet CDN-om)

## listanje.html (listing)
**TAMNA JE PODRAZUMEVANA I OVDE** - stranica učitava theme-dark.css i nosi 
`data-theme="dark"` zakucan na `<html>`, isto kao naslovna (videti "Tamna varijanta" niže).
Struktura: hero BEZ PODLOGE (.page-hero--flush) sa naslovom "Postani deo Balkan Bet tima" → 
search bar (.search-band) → svetli panel sa 16 kartica pozicija (4 u redu) + CTA za 
otvorenu prijavu na dnu panela → footer.
- naslov je `pt-[140px]` od vrha (bilo 190px), a podnaslov NEMA margin-top - h1 i pasus 
  su jedan blok, razmak drži line-height naslova. Oboje traženo eksplicitno
- HTML tekst naslova je "Postani deo Balkan Bet tima" u rečeničnom slučaju; verzali dolaze 
  iz `uppercase` klase, po opštem pravilu sajta (ne menjati sam tekst u markupu)

### Hero traka - FULL-BLEED, BEZ RADIJUSA, BEZ PODLOGE
`.page-hero.page-hero--flush` - NEMA .section-panel inset, NEMA mt-6 i NEMA zaobljene 
uglove ni na jednoj strani, a od skora NEMA NI POZADINU: ni tamnu #231F20 traku ni corner 
glow. Naslov stoji direktno na animiranoj aurori, isto kao hero naslov na naslovnoj. 
Ranije je imala `rounded-b-[32px]` - UKLONJENO, ne vraćati.
- ZAŠTO JE TRAKA OTIŠLA: search bar je sada sticky i po skrolu IZLAZI iz ove sekcije. 
  Traka koja bi se završavala iznad njega čitala bi se kao odsečen panel. Uz to, aurora 
  ionako radi posao koji je glow radio, pa je i on obrisan (`background: none` gasi i 
  boju i background-image; `::after` je i dalje `content: none`)
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

## Tamna varijanta (theme-dark.css)
⚠ **TAMNA JE PODRAZUMEVANA.** Naslovna I LISTANJE se otvaraju tamni; svetla i dalje postoji 
cela i do nje se stiže prekidačem ili preko `?tema=light`. Obe varijante žive na ISTIM 
fajlovima. Nije napravljen drugi `index-dark.html` NAMERNO: header i footer moraju ostati 
na tri byte-identične kopije, a duplikat bi ih digao na četiri i svaku buduću ispravku 
udvostručio. Markup stranica se za temu NE dira uopšte osim `<html>` taga i `<head>`-a.

⚠ NAJVEĆI DEO LISTANJA NE TRAŽI NIJEDNO PRAVILO IZ OVOG FAJLA, i to je namerno: aurora, 
header, futer i žuta CTA dugmad su isti zajednički elementi kao na naslovnoj, pa ih hvataju 
pravila koja tu već postoje. Ono što je stvarno specifično za listanje - `.page-hero--flush` 
bez podloge i sticky `.search-dock` - pisano je BEZ TEME, u styles.css, jer izgleda isto u 
obe varijante. Jedino stvarno novo pravilo je izuzetak za hover:
- `[data-theme="dark"] .job-card a.bg-brand-cta:hover` vraća SVETLOTEMSKI hover 
  (brightness .95, bez haloa). "Prijavi se" na listanju je jedina žuta CTA koja i u tamnoj 
  temi stoji na BELOJ kartici, jer panel sa rezultatima ostaje svetao; opšte tamno pravilo 
  (posvetljenje + žuti halo) bi joj na belom nacrtalo prljav oreol
- Uključuje je atribut `data-theme="dark"` na `<html>`, koji STOJI ZAKUCAN U MARKUPU. Tako 
  važi od prvog pixela - pre nego što se izvrši ijedna linija JS-a, i onda kad JS ne radi. 
  Ranije ga je postavljao boot skript, pa je postojao rizik od bleska svetle teme
- Boot skript u `<head>`-u (odmah posle `<link>`-a) radi OBRNUTO od ranijeg: on je samo 
  IZLAZ iz tamne, tj. SKIDA atribut kad je tražena svetla (`?tema=light` ili localStorage 
  ključ `bb-tema`). MORA ostati u `<head>`-u - skidanje kasnije daje blesak tamne pre svetle
- URL parametar pobeđuje zapamćeni izbor, da se varijanta može poslati kao link
- Prekidač (`.theme-toggle`, KRUŽNO dugme 44px dole desno, SAMO IKONICA) PRAVI JS na dnu 
  index.html I listanje.html, ne stoji u markupu. Tekstualna oznaka ("Svetla varijanta") je uklonjena na 
  zahtev, pa značenje nosi samo glif - `aria-label` i `title` su jedini tekst i moraju se 
  održavati uz ikonicu. Dimenzije su fiksne, ne padding: bez teksta unutra pilula bi se 
  stegla na širinu glifa i ispala ovalna umesto okrugla. Njegov CSS je u theme-dark.css ali IZVAN `[data-theme]` opsega - mora se videti 
  i u svetloj temi. To je DEMO kontrola, ne deo dizajna sajta
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
  - hero h1 je RAZDVOJEN po rečenicama: prva ("Uskoči u igru.") je ŽUTA (#FDB813), druga 
    ("Budi deo Balkan Bet tima.") je BELA. Zato u markupu prva rečenica ima svoj 
    `<span class="hero-heading__lead">` - ostatak nasleđuje text-white iz h1 i isti je u 
    obe varijante. Kratko je ceo naslov bio žut; ne vraćati
  - TEKST U SVIM ŽUTIM CTA DUGMADIMA je TAMAN (u svetloj je beo) - i "Pronađi posao" u 
    navigaciji i "Prijavi se" na karticama pozicija. Žuta pilula na skoro crnoj stranici, 
    belo na žutom bi bio najslabiji kontrast na ekranu
  - ŽUTA DUGMAD IMAJU SVOJ HOVER: u svetloj temi je `hover:brightness-95`, dakle 
    potamnjenje, što na tamnoj stranici deluje kao da se dugme gasi. Ovde ide obrnuto - 
    brightness(1.07) + meki žuti halo (box-shadow 4px na .16 alfe), pa dugme zasvetli. 
    Selektor je specifičniji od Tailwindove hover klase, pa se markup ne dira
  - TRI KARTICE U FUTERU nose istu podlogu i okvir kao kartice pozicija (--dk-glass + 
    --dk-line). Ranije su bile rgba(255,255,255,.05), tj. svetle staklene pločice - drugi 
    materijal na istoj stranici
  - linkovi "POGLEDAJ SVE POZICIJE" (#openings) i "SAZNAJ VIŠE O NAMA" (#impact) su ŽUTI 
    zajedno sa svojim border-b-2 podvlakama, hover im se vraća u belo - isto rešenje kao 
    balkanbet.rs u futeru
  - u futeru su ŽUTI i glifovi društvenih mreža i link balkanbet.rs (taj zajedno sa svojom 
    border-b-2 podvlakom - da je požuteo samo tekst, bela linija bi ostala da visi). 
    Hover balkanbet.rs se vraća u BELO, jer opšte pravilo `hover:text-brand-dark` → žuto 
    na već žutom linku ne bi dalo nikakav odziv
  - senka loptice je ŽUTA i tražena je kao ODRAZ, ne kao senka - loptica koja svetli 
    ostavlja mrvicu svog svetla na podu. Zato ima SVOJ keyframe set 
    (`hero-ball-reflection`), alfe ~40% od svetle teme (.02-.07): alfe do .17 bi kao žuta 
    bile jarka mrlja. ⚠ Stopovi (0/12/50/88/100), easing po stopu i trajanje 1.15s MORAJU 
    ostati identični sa hero-ball-bounce, isto pravilo kao u svetloj temi
  - u sekciji Proces se koraci i strelice RAZILAZE: brojevi i labeli su ŽUTI, strelice 
    ostaju BELE. Žuto nosi sadržaj, belo samo veze, pa se čita redosled a ne jedna žuta 
    masa. Kratko su oboje bili beli - ne vraćati
- SEARCH BAR NEMA tamni skin - stilski je IDENTIČAN u obe varijante (žuti okvir, BELI 
  tabovi, crno dugme "Pretraži", beli meni). Imao ga je (tamne pločice + svetlo dugme); 
  uklonjen na eksplicitan zahtev, ne vraćati
- Aurora ostaje sa istom geometrijom i animacijama, samo prigušena (.18/.14/.11) i u 
  #FAA61A umesto #FFCB05 - hladnija žuta na crnom čita zelenkasto
- ⚠ `hover:text-brand-dark` / `hover:border-brand-dark` je kroz naslovnu hover-potamnjenje; 
  na tamnoj podlozi bi link na hover NESTAO, pa se globalno prevodi u žutu. Izuzetak je CTA 
  "Saznaj više o nama", koji na hover menja i podlogu - njegovo pravilo je specifičnije
- Proces zapošljavanja: tuš (#231F20) ide u #F5F1EC, pa rukopis čita kao kreda. Debljina 
  strelica se NE dira - uparena je sa Lumierinim perom i ne zavisi od boje
- ⚠ OPSEG JE NASLOVNA + LISTANJE. Ostaje SAMO `oglas-primer.html`, koja ovaj fajl ne 
  učitava i otvara se svetla - vidljiv nesklad kad se sa tamnog listanja klikne "Prijavi 
  se". Za širenje i na nju treba: kopirati `<link>` + boot skript + `data-theme` na 
  `<html>`, dopisati pravila za `.fld-*` (forma) i `.info-card` (tri kartice "Saznaj više 
  o nama"), i odlučiti da li njen `.page-hero` (bez `--flush`, dakle sa tamnom trakom) 
  ostaje takav ili i on ide na auroru
- ⚠ `?tema=` i localStorage ključ `bb-tema` su ZAJEDNIČKI za obe stranice, pa izbor 
  napravljen na jednoj važi i na drugoj. Prekidač (`.theme-toggle`) pravi skript na dnu 
  OBE stranice - ako se menja, menja se na oba mesta
- KAD SE VARIJANTA ZAKLJUČA: tamna → pravila se presipaju u styles.css, a theme-dark.css, 
  boot skript i prekidač nestaju; svetla → briše se theme-dark.css, `<link>`, boot skript, 
  `data-theme` sa `<html>` i blok prekidača na dnu index.html

## Pravila za dalji rad
1. Pre bilo koje vizuelne izmene, PROVERI trenutno stanje u index.html (ne pretpostavljaj 
   na osnovu ovog fajla ako je prošlo puno vremena/izmena)
2. Ceo sajt je sada na srpskom i izbrendiran - NEMA više engleskog teksta ni pomena 
   drugih firmi/domena (Kaizen, SBC, SOUL, kaizengaming.com su svi uklonjeni, kao i 
   picsum placeholder slike). Ako se dodaje nov sadržaj, mora biti na srpskom i sa 
   Balkan Bet podacima; pre nego što se javi da je gotovo, grepni sve tri stranice za 
   "kaizen|SOUL|SBC|picsum|Lorem" da ne bi nešto ostalo
3. Kod svake izmene, sačuvaj fajl i po mogućnosti napravi screenshot za proveru pre 
   nego što se javi da je gotovo. Ako Browser pane ne radi, radi headless Chrome:
   `& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu 
   --hide-scrollbars --force-prefers-reduced-motion --virtual-time-budget=10000 
   --window-size=1280,4300 --user-data-dir=<temp> --screenshot=<out.png> file:///<путanja>`
   (`--force-prefers-reduced-motion` je bitan - inače se ulazne animacije uhvate 
   nedovršene i tekst izgleda providno; vidi reduced-motion blok u styles.css). 
   Praktično iskustvo: dodaj i `--no-sandbox` (bez njega Chrome često ne napiše PNG), 
   a ako neki raniji headless proces visi, ubij SAMO njega 
   (`Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | ? CommandLine -like '*--headless*'`) 
   - ne diraj korisnikov Chrome. Headless ne ume da skroluje: za snimak sekcija ispod 
   heroja napravi PRIVREMENU kopiju (npr. _shot.html u root-u, da relativne putanje rade) 
   sa `#hero-spacer{height:0}` `#hero-stage{display:none}` `#openings{margin-top:0}`, 
   snimi je u visokom prozoru (npr. 1440x3400) i OBRIŠI kopiju posle
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
