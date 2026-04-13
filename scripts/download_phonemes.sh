#!/bin/bash
# Downloads canonical IPA phoneme audio from Wikipedia Commons (recorded by phoneticians)
# Converts OGG → MP3 for browser compatibility
# Output: /public/audio/phonemes/{symbol}.mp3

OUT="/Users/hong/english-input-app/public/audio/phonemes"
mkdir -p "$OUT"

OK=0; FAIL=0

dl() {
  local symbol="$1"
  local wikifile="$2"
  local out="$OUT/${symbol}.mp3"

  if [ -f "$out" ]; then
    echo "  skip  $symbol  (exists)"
    OK=$((OK+1))
    return
  fi

  # Wikipedia Commons URL = hash-based path
  local hash=$(echo -n "$wikifile" | python3 -c "import sys,hashlib; s=sys.stdin.read().strip(); h=hashlib.md5(s.encode()).hexdigest(); print(h[0]+'/'+h[:2])")
  local url="https://upload.wikimedia.org/wikipedia/commons/${hash}/${wikifile}"

  # Download OGG, convert to MP3 (trim 0.15s end to remove breath noise)
  if curl -sf --max-time 20 "$url" -o "/tmp/_ph.ogg"; then
    if ffmpeg -y -loglevel error -i /tmp/_ph.ogg -af "atrim=0:1.2,afade=t=out:st=0.9:d=0.3" -ar 44100 -ab 64k "$out"; then
      echo "  OK    $symbol  ← $wikifile"
      OK=$((OK+1))
    else
      echo "  FAIL  $symbol  (ffmpeg error)"
      FAIL=$((FAIL+1))
    fi
  else
    echo "  FAIL  $symbol  (download error: $url)"
    FAIL=$((FAIL+1))
  fi
}

echo "=== Downloading phoneme audio from Wikipedia Commons ==="

# ── Plosives ────────────────────────────────────────────────────────────────
dl "p"  "Voiceless_bilabial_plosive.ogg"
dl "b"  "Voiced_bilabial_plosive.ogg"
dl "t"  "Voiceless_alveolar_plosive.ogg"
dl "d"  "Voiced_alveolar_plosive.ogg"
dl "k"  "Voiceless_velar_plosive.ogg"
dl "g"  "Voiced_velar_plosive.ogg"

# ── Fricatives ──────────────────────────────────────────────────────────────
dl "f"  "Voiceless_labiodental_fricative.ogg"
dl "v"  "Voiced_labiodental_fricative.ogg"
dl "th" "Voiceless_dental_fricative.ogg"
dl "dh" "Voiced_dental_fricative.ogg"
dl "s"  "Voiceless_alveolar_sibilant.ogg"
dl "z"  "Voiced_alveolar_sibilant.ogg"
dl "sh" "Voiceless_palato-alveolar_sibilant.ogg"
dl "zh" "Voiced_palato-alveolar_sibilant.ogg"
dl "h"  "Voiceless_glottal_fricative.ogg"

# ── Affricates ──────────────────────────────────────────────────────────────
dl "ch" "Voiceless_palato-alveolar_affricate.ogg"
dl "dj" "Voiced_palato-alveolar_affricate.ogg"

# ── Nasals ──────────────────────────────────────────────────────────────────
dl "m"  "Bilabial_nasal.ogg"
dl "n"  "Alveolar_nasal.ogg"
dl "ng" "Velar_nasal.ogg"

# ── Liquids & approximants ──────────────────────────────────────────────────
dl "l"  "Alveolar_lateral_approximant.ogg"
dl "r"  "Voiced_alveolar_approximant.ogg"
dl "w"  "Voiced_labio-velar_approximant.ogg"
dl "j"  "Palatal_approximant.ogg"

# ── Short vowels ────────────────────────────────────────────────────────────
dl "ae"    "Near-open_front_unrounded_vowel.ogg"
dl "e"     "Open-mid_front_unrounded_vowel.ogg"
dl "ih"    "Near-close_near-front_unrounded_vowel.ogg"
dl "oh"    "Open_back_rounded_vowel.ogg"
dl "uh"    "Open-mid_back_unrounded_vowel.ogg"
dl "uu"    "Near-close_near-back_rounded_vowel.ogg"
dl "schwa" "Mid-central_vowel.ogg"

# ── Long vowels ─────────────────────────────────────────────────────────────
dl "ee" "Close_front_unrounded_vowel.ogg"
dl "oo" "Close_back_rounded_vowel.ogg"
dl "ar" "Open_back_unrounded_vowel.ogg"
dl "aw" "Open-mid_back_rounded_vowel.ogg"
dl "er" "Open-mid_central_unrounded_vowel.ogg"

# ── Diphthongs ──────────────────────────────────────────────────────────────
dl "ay"     "English_Vowel_Sound_eI.ogg"
dl "eye"    "English_Vowel_Sound_aI.ogg"
dl "oy"     "English_Vowel_Sound_OI.ogg"
dl "oh_dip" "English_Vowel_Sound_oU.ogg"
dl "ow"     "English_Vowel_Sound_aU.ogg"
dl "ear"    "English_Vowel_Sound_Ie.ogg"
dl "air"    "English_Vowel_Sound_Ee.ogg"
dl "oor"    "English_Vowel_Sound_Ue.ogg"

echo ""
echo "=== Done: ${OK} OK, ${FAIL} failed ==="
ls -la "$OUT" | wc -l
