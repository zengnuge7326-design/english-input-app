#!/usr/bin/env bash
# 生成 26 字母名 MP3（Edge TTS en-US-AvaNeural），供 speakLetter() 本地播放
# 用法: ./scripts/gen_letter_audio.sh [B]   # 不传参则生成全部

set -eo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/audio/letters"
TTS_API="${TTS_API:-https://okenglish.site/api/tts}"
VOICE="${TTS_VOICE:-en-US-AvaNeural}"

mkdir -p "$OUT"

letter_spoken() {
  case "$1" in
    A) echo 'ay' ;;     B) echo 'bee' ;;    C) echo 'see' ;;    D) echo 'dee' ;;
    E) echo 'ee' ;;     F) echo 'eff' ;;   G) echo 'gee' ;;    H) echo 'aitch' ;;
    I) echo 'eye' ;;   J) echo 'jay' ;;   K) echo 'kay' ;;    L) echo 'ell' ;;
    M) echo 'em' ;;    N) echo 'en' ;;    O) echo 'oh' ;;     P) echo 'pee' ;;
    Q) echo 'cue' ;;   R) echo 'ar' ;;    S) echo 'ess' ;;    T) echo 'tee' ;;
    U) echo 'you' ;;   V) echo 'vee' ;;   W) echo 'double you' ;; X) echo 'ex' ;;
    Y) echo 'why' ;;   Z) echo 'zee' ;;   *) echo "$1" ;;
  esac
}

gen_one() {
  local L="$1"
  local text
  text="$(letter_spoken "$L")"
  local out="$OUT/${L}.mp3"
  local tmp
  tmp="$(mktemp /tmp/letter_${L}.XXXXXX.mp3)"

  if command -v edge-tts >/dev/null 2>&1; then
    if edge-tts --voice "$VOICE" --text "$text" --write-media "$tmp" 2>/dev/null && [ -s "$tmp" ]; then
      mv "$tmp" "$out"
      chmod 644 "$out"   # mktemp 默认 600，须放开为 644 否则 nginx 读不到 → 403
      echo "  [OK] $L.mp3 ← \"$text\" (edge-tts, $(wc -c < "$out" | tr -d ' ') bytes)"
      return 0
    fi
    rm -f "$tmp"
    tmp="$(mktemp /tmp/letter_${L}.XXXXXX.mp3)"
  fi

  local enc_text enc_voice url
  enc_text="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$text")"
  enc_voice="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$VOICE")"
  url="${TTS_API}?text=${enc_text}&voice=${enc_voice}"
  if ! curl -fsSL "$url" -o "$tmp"; then
    echo "  [FAIL] $L ($text) — edge-tts + API both failed"
    rm -f "$tmp"
    return 1
  fi
  if [ ! -s "$tmp" ]; then
    echo "  [FAIL] $L ($text) — empty file"
    rm -f "$tmp"
    return 1
  fi
  mv "$tmp" "$out"
  chmod 644 "$out"   # mktemp 默认 600，须放开为 644 否则 nginx 读不到 → 403
  echo "  [OK] $L.mp3 ← \"$text\" (API, $(wc -c < "$out" | tr -d ' ') bytes)"
}

if [ $# -gt 0 ]; then
  for arg in "$@"; do
    L="$(echo "$arg" | tr '[:lower:]' '[:upper:]')"
    gen_one "$L"
  done
else
  for L in $(printf '%s\n' {A..Z}); do
    gen_one "$L"
  done
fi

echo "Done → $OUT"
