/* ##########################################################################
   VARIJACIJA #3 — skript (samo index.html)

   Mora da stoji PRE glavnog skripta naslovne: on meri pozicije sekcija
   (measureImpact i ostali), pa sekcija mora već biti na svom mestu kad se meri.
   U varijacijama #1 i #2 ne radi ništa.

   Radi tri stvari koje CSS ne može:
     1. tekst prve rečenice naslova ("Uđi u igru." — markup nosi original #1)
     2. SPUŠTA #razvoj ("Tvoj prostor za razvoj") na pretposlednje mesto,
        odmah iznad futera. Sekcija je ISTA — naslov, tekst koji se ispisuje
        na skrol i obe kartice — samo se premešta; markup ostaje u redosledu
        varijacije #1, koja ne sme da zavisi ni od jednog skripta.
     3. kartica "Posao u centrali" dobija STATIČNU sliku umesto videa
        (traženo). Slika je kadar iz istog snimka (3.5s), pa kartica izgleda
        isto kao pre, samo miruje.
   ########################################################################## */
(function () {
  var root = document.documentElement;
  if (root.getAttribute('data-var') !== '3') return;

  var lead = document.querySelector('#hero-heading .hero-heading__lead');
  if (lead) lead.textContent = 'Uđi u igru.';

  var razvoj = document.getElementById('razvoj');
  var footer = document.querySelector('body > footer');
  if (razvoj && footer) footer.parentNode.insertBefore(razvoj, footer);

  var video = razvoj && razvoj.querySelector('video.footer-cta__media');
  if (video) {
    var img = document.createElement('img');
    img.className = 'footer-cta__media';
    img.src = 'assets/zivot/put-centrala.webp';
    img.alt = 'Balkan Bet centrala';
    // Ista fotografija kao na zivot-u-balkan-betu.html (traženo); položen
    // kadar 3:2, lica su u gornjoj polovini.
    img.style.objectPosition = 'center 30%';
    video.replaceWith(img);
  }

  window.BB_VAR3 = { active: true };
})();
