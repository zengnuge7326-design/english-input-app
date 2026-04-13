#!/bin/bash
# Generate phoneme audio files using macOS say + ffmpeg
# Output: public/phonemes/{phoneme}.mp3
#
# Uses SAMPA notation for macOS say command (Samantha voice)
# Coverage: 44 standard English phonemes (IPA → SAMPA mapping)
#
# Run: bash scripts/gen_phonemes.sh

OUT_DIR="$(dirname "$0")/../public/phonemes"
mkdir -p "$OUT_DIR"

VOICE="Samantha"  # US English, clear pronunciation

# IPA symbol → SAMPA → display label
# Format: "ipa_filename|sampa|display"
declare -a PHONEMES=(
  # ── Consonants ──────────────────────────────────────────────────────────
  "p|p|/p/"
  "b|b|/b/"
  "t|t|/t/"
  "d|d|/d/"
  "k|k|/k/"
  "g|g|/g/"
  "f|f|/f/"
  "v|v|/v/"
  "s|s|/s/"
  "z|z|/z/"
  "h|h|/h/"
  "m|m|/m/"
  "n|n|/n/"
  "l|l|/l/"
  "r|r|/r/"
  "w|w|/w/"
  "j|j|/j/"
  "th_v|D|/ð/"
  "th_f|T|/θ/"
  "sh|S|/ʃ/"
  "zh|Z|/ʒ/"
  "ch|tS|/tʃ/"
  "dj|dZ|/dʒ/"
  "ng|N|/ŋ/"
  # ── Short vowels ─────────────────────────────────────────────────────────
  "ae|{|/æ/"
  "e|e|/e/"
  "ih|I|/ɪ/"
  "oh|Q|/ɒ/"
  "uh|V|/ʌ/"
  "uu|U|/ʊ/"
  "schwa|@|/ə/"
  # ── Long vowels ───────────────────────────────────────────────────────────
  "ee|i:|/iː/"
  "oo|u:|/uː/"
  "ar|A:|/ɑː/"
  "aw|O:|/ɔː/"
  "er|3:|/ɜː/"
  # ── Diphthongs ────────────────────────────────────────────────────────────
  "ay|eI|/eɪ/"
  "eye|aI|/aɪ/"
  "oy|OI|/ɔɪ/"
  "oh_dip|@U|/əʊ/"
  "ow|aU|/aʊ/"
  "ear|I@|/ɪə/"
  "air|e@|/eə/"
  "oor|U@|/ʊə/"
)

echo "Generating ${#PHONEMES[@]} phoneme audio files → $OUT_DIR"
echo ""

SUCCESS=0
FAIL=0

for entry in "${PHONEMES[@]}"; do
  IFS='|' read -r name sampa label <<< "$entry"
  out_mp3="$OUT_DIR/${name}.mp3"
  tmp_aiff="/tmp/ph_${name}.aiff"

  # Skip if already exists
  if [ -f "$out_mp3" ]; then
    echo "  [skip] ${label} (${name}.mp3)"
    continue
  fi

  # Generate with say
  say -v "$VOICE" -o "$tmp_aiff" "[[phoneme SAMPA '${sampa}']]" 2>/dev/null
  if [ $? -ne 0 ] || [ ! -f "$tmp_aiff" ]; then
    echo "  [FAIL] ${label} (SAMPA: ${sampa})"
    FAIL=$((FAIL+1))
    continue
  fi

  # Convert to mp3
  ffmpeg -y -i "$tmp_aiff" -codec:a libmp3lame -qscale:a 3 -ar 22050 "$out_mp3" 2>/dev/null
  if [ $? -eq 0 ]; then
    size=$(ls -lh "$out_mp3" | awk '{print $5}')
    echo "  [OK] ${label} → ${name}.mp3 (${size})"
    SUCCESS=$((SUCCESS+1))
  else
    echo "  [FAIL] ${label} (ffmpeg error)"
    FAIL=$((FAIL+1))
  fi

  rm -f "$tmp_aiff"
done

echo ""
echo "Done: ${SUCCESS} OK, ${FAIL} failed"
echo "Output: $OUT_DIR"
ls "$OUT_DIR"/*.mp3 2>/dev/null | wc -l | xargs -I{} echo "{} mp3 files total"
