#!/bin/bash
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/audio/phonemes"
mkdir -p "$OUT_DIR"

VOICE="Samantha"

declare -a PHONEMES=(
  "p|p|/p/" "b|b|/b/" "t|t|/t/" "d|d|/d/" "k|k|/k/" "g|g|/ɡ/"
  "f|f|/f/" "v|v|/v/" "s|s|/s/" "z|z|/z/"
  "th|T|/θ/" "dh|D|/ð/" "sh|S|/ʃ/" "zh|Z|/ʒ/" "h|h|/h/"
  "ch|tS|/tʃ/" "dj|dZ|/dʒ/"
  "m|m|/m/" "n|n|/n/" "ng|N|/ŋ/"
  "l|l|/l/" "r|r|/r/" "w|w|/w/" "j|j|/j/"
  "ae|{|/æ/" "e|e|/e/" "ih|I|/ɪ/" "oh|Q|/ɒ/" "uh|V|/ʌ/" "uu|U|/ʊ/" "schwa|@|/ə/"
  "ee|i:|/iː/" "oo|u:|/uː/" "ar|A:|/ɑː/" "aw|O:|/ɔː/" "er|3:|/ɜː/"
  "ay|eI|/eɪ/" "eye|aI|/aɪ/" "oy|OI|/ɔɪ/" "oh_dip|@U|/əʊ/" "ow|aU|/aʊ/"
  "ear|I@|/ɪə/" "air|e@|/eə/" "oor|U@|/ʊə/"
)

SUCCESS=0; FAIL=0

for entry in "${PHONEMES[@]}"; do
  IFS='|' read -r name sampa label <<< "$entry"
  out_mp3="$OUT_DIR/${name}.mp3"
  tmp_aiff="/tmp/ph_hq_${name}.aiff"

  say -v "$VOICE" -r 130 -o "$tmp_aiff" "[[phoneme SAMPA '${sampa}']]" 2>/dev/null
  if [ $? -ne 0 ] || [ ! -s "$tmp_aiff" ]; then
    echo "  [FAIL] ${label} — say error"
    FAIL=$((FAIL+1)); rm -f "$tmp_aiff"; continue
  fi

  ffmpeg -y -loglevel error \
    -i "$tmp_aiff" \
    -af "loudnorm=I=-14:LRA=3:TP=-1,afade=t=out:st=0.6:d=0.08" \
    -ar 44100 -codec:a libmp3lame -b:a 128k \
    "$out_mp3" 2>/dev/null

  if [ $? -eq 0 ] && [ -s "$out_mp3" ]; then
    size=$(ls -lh "$out_mp3" | awk '{print $5}')
    echo "  [OK]   ${label} → ${name}.mp3  (${size})"
    SUCCESS=$((SUCCESS+1))
  else
    echo "  [FAIL] ${label} — ffmpeg error"
    FAIL=$((FAIL+1))
  fi
  rm -f "$tmp_aiff"
done

echo ""
echo "=== Done: ${SUCCESS} OK, ${FAIL} failed ==="
