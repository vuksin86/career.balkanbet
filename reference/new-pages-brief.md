# DIZAJN BRIF — Stranice "Poslovi u lokalima" i "Detalji oglasa"

## Kontekst
Dodajemo dve nove stranice na Balkan Bet careers sajt: (1) listing stranicu otvorenih 
pozicija u lokalima, dostupnu preko CTA "Pronađi posao" iz navigacije, i (2) stranicu 
pojedinačnog oglasa sa formom za prijavu. Ove stranice moraju biti vizuelno i tehnički 
DEO ISTE CELINE kao postojeći homepage — isti brend jezik, isti font, ista paleta, 
isti nivo pažnje na detalj (animacije, hover stanja, spacing).

## Princip dizajna (senior UI/UX vodilja)
Ne kopiramo referentne slike doslovno — koristimo ih SAMO za STRUKTURU I SADRŽAJ 
(koje sekcije postoje, koja polja forma ima, koji tekst kartice nose). VIZUELNI STIL 
(boje, tipografija, radius, spacing, senke, dugmad) MORA pratiti već uspostavljen 
Balkan Bet dizajn sistem sa homepage-a, ne generički stil sa referentnih slika.

## Stranica 1 — "Poslovi u lokalima" (listing)

### Struktura
1. **Hero traka** (tamna pozadina #231F20, isti header/nav nastavlja se odozgo):
   - Naslov "Pronađi svoj posao" (Bold, belo)
   - Podnaslov - NAPISATI PRAVI TEKST na srpskom (referenca ima Lorem ipsum - IGNORISATI, 
     napisati npr. "Pridruži se timu od preko 1000 zaposlenih širom Srbije. Pretraži 
     otvorene pozicije u lokalima Balkan Bet-a.")
   - Filter bar (bela/svetla kartica na tamnoj pozadini): polja "Grad", "Pozicija", "Tip" 
     (dropdown, default "Lokali"), checkbox "Bez CV-ja", dugme "Pretraži" (brend gradijent, 
     isti kao CTA dugme u navu)
   - Ispod filtera - NAPISATI PRAVI TEKST (ne lorem ipsum), npr. kratka napomena o brzoj 
     prijavi bez CV-a

2. **"Poslovi u lokalima" sekcija** (svetla pozadina #ECECEC ili bela):
   - Naslov sekcije + "Pronašli smo X pozicija" (dinamički broj, koliko kartica ima)
   - Grid kartica (3 po redu), svaka kartica: naziv pozicije (Bold), grad (sa pin ikonicom, 
     brend boja), tip zaposlenja (sa sat ikonicom), dugme "Pogledaj oglas →" (brend 
     gradijent pozadina, tamni tekst)
   - Koristi gradove i pozicije IZ REFERENTNE SLIKE 1 tačno (Beograd, Novi Sad, Niš, 
     Jagodina, Paraćin, Kruševac, Kragujevac, Čačak, Zlatibor, Pirot, Novi Banovci, 
     Batajnica, Subotica, Ruma, Šabac, Nova Pazova - pozicije: Operater u lokalu, Konobar, 
     Higijeničar, Radnik obezbeđenja)

3. **Dve kartice na dnu** (tamna pozadina #231F20, dve kolone):
   - "Rad u lokalu" (sa ikonicom) - tekst iz reference, dugme "Saznaj više →"
   - "Rad u centrali" (sa ikonicom) - tekst iz reference, dugme "Saznaj više →"

### Interaktivnost (mockup nivo, klijentska strana, bez backend-a)
Filter bar (Grad/Pozicija/Tip) treba da STVARNO FILTRIRA prikazane kartice u realnom 
vremenu koristeći JavaScript (bez servera) - ovo je impresivan, lako izvodljiv detalj 
za prezentaciju koji pokazuje "funkcionalnost" bez potrebe za pravim backend-om.

## Stranica 2 — Detalji oglasa (template za jedan oglas, koristi "Operater u lokalu, 
Beograd" kao primer)

### Struktura
1. **Hero traka** (tamna #231F20):
   - Naziv pozicije (Bold, veliki), lokacija sa pin ikonicom
   - Dva tag/badge elementa: "Smene 8h" (sa ikonicom sata), "Bez CV-ja" (zelena ili brend 
     boja, sa ikonicom dokumenta)
   - Dugme "Prijavi se sada" (brend gradijent)
   - Desno: placeholder okvir "Foto zaposlenog" (zamenjuje se pravom slikom kasnije)

2. **Opis pozicije** (bela pozadina):
   - Uvodni pasus o kompaniji (koristi tekst iz reference, ISPRAVITI da je smisleno - 
     reference ima "25 godina", "1000 zaposlenih", "90 lokala u 13 gradova", "sponzor 
     Olimpijskog tima Srbije" - ZADRŽATI ove brojeve/činjenice, prilagoditi ton)
   - Podnaslov pozicije velikim slovima (npr. "OPERATER/KA U KLADIONICI I AUTOMAT KLUBU")
   - Opisni pasusi + naslov "Kako izgleda rad u kompaniji Balkan Bet?"
   - Bullet lista benefita - KORISTITI TEKST IZ REFERENCE ALI UKLONITI DUPLIKAT 
     (referenca ima dupliran bullet "Dobijaš stimulacije..." i "Cenimo tvoje ideje..." 
     dva puta - ukloniti duplikat, zadržati svaki bullet samo jednom)
   - Završni pasus o iskustvu/predznanju

3. **Forma za prijavu** (tamna pozadina #231F20, izdvojena sekcija):
   - Badge "PRIJAVA" (brend boja) + naslov "Prijavi se za 1 minut – bez CV-ja!"
   - Forma sa poljima (iz reference): Pozicija (dropdown, prepopulisan), Lokacija (dropdown, 
     prepopulisan), Ime, Prezime, E-mail, Telefon (+381 prefiks), Datum rođenja, 
     Obrazovanje (dropdown), Kratak opis radnog iskustva (textarea), Priloži CV (opciono, 
     file upload), Da li ste radili u Balkan Bet-u ranije (dropdown)
   - Checkbox saglasnosti sa uslovima korišćenja
   - Dugme "Pošalji prijavu" (brend gradijent)
   - VAŽNO: forma ne mora stvarno da šalje podatke nikuda (nema backend) - dovoljno je 
     da vizuelno i interaktivno radi (polja se mogu popuniti, checkbox čekira, dropdown 
     otvara), submit dugme može prikazati jednostavnu potvrdu poruku ("Hvala, javićemo 
     vam se uskoro!") bez stvarnog slanja

4. **"Pretraži druge pozicije"** - manji filter bar (isti stil kao stranica 1), za 
   navigaciju ka drugim oglasima

5. **"Saznaj više o nama"** - 3 kartice (Rad u lokalu, Život u Balkan Bet-u, O nama), 
   svaka sa ikonicom, kratkim tekstom, i "Pogledaj više →" linkom

## Brend konzistentnost (OBAVEZNO)
- Font: NeoSansW1G svuda (Bold naslovi, Medium dugmad/labele, Regular tekst)
- Boje: #FDB813/#FDB913/#FAA61A (akcenti/dugmad), #231F20 (tamne sekcije), #FFFFFF/#ECECEC 
  (svetle sekcije)
- Dugmad: isti stil kao postojeća na homepage-u (pill/rounded shape, gradijent na primary 
  dugmadima)
- Ikonice: koristiti isti set/stil ikonica kao ostatak sajta (linijske/outline, ne filled)
- Header/navigacija: IDENTIČNA kao na homepage-u, nastavlja se na obe nove stranice
- Ako postoji .animated-bg na homepage-u, razmotriti da li ima smisla i na ovim stranicama 
  (verovatno DA na hero traci tamne boje, radi konzistentnosti) - proveri i primeni 
  dosledno
- Footer: isti kao na homepage-u

## Tehnički zahtevi
- Nove stranice kao odvojeni HTML fajlovi (npr. poslovi-u-lokalima.html, oglas-primer.html) 
  koji dele isti CSS/font/brend setup kao index.html - proveri da li index.html ima 
  inline <style> (ako da, ili kopirati taj isti <style> blok u nove fajlove, ili 
  izdvojiti u zajednički styles.css koji svi fajlovi include-uju - IZABRATI pristup 
  koji zahteva manje dupliranja koda)
- Linkovi u navigaciji (CTA "Pronađi posao") treba da vode na poslovi-u-lokalima.html
- Dugme "Pogledaj oglas" na karticama treba da vodi na oglas-primer.html (ili generisati 
  po jedan HTML fajl po oglasu ako je izvodljivo bez prevelikog dupliranja - ali za MVP 
  mockup dovoljno je da SVA dugmad trenutno vode na isti primer oglasa, uz napomenu u 
  komentaru koda da će se kasnije generisati zasebne stranice po pravoj poziciji)
