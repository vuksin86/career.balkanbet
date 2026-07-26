Originalne ilustracije, onako kako su isporucene (1254x1254, narandzasta pozadina).
NE koriste se direktno na sajtu - cuvaju se samo kao izvor.

Fajlovi u assets/values/ su obradjene verzije: pozadina uklonjena, slika
isecena na sadrzaj i smanjena na 560px (sa ~1.3MB na ~130-270KB po slici).

Mapiranje original -> sajt:
  strast.png      -> pozrtvovanost.png
  postenje.png    -> postenje.png
  timski duh.png  -> timski-rad.png
  kvalitet.png    -> kvalitet.png
  odgovornost.png -> odgovornost.png

Ako se ilustracije menjaju, pozadina se MORA ukloniti flood-fill-om od ivica,
a NE brisanjem svih narandzastih piksela - figure su i same dobrim delom zute
pa bi ih brisanje po boji izbusilo. Sekcija na sajtu nema svoju pozadinu (vidi
se animirana aurora), pa bi svaki ostatak pozadine bio vidljiv kao pravougaonik.
