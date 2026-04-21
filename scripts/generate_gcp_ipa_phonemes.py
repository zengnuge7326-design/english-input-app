#!/usr/bin/env python3
"""
GCP TTS 批量生成 IPA 音素音频
输出: public/audio/phonemes_gcp/{symbol}.mp3
清单: src/data/phoneme_manifest_gcp.json

用法:
  export GOOGLE_APPLICATION_CREDENTIALS="/path/to/sa.json"
  python3 scripts/generate_gcp_ipa_phonemes.py
"""

import json
import os
import time
from pathlib import Path

try:
    from google.cloud import texttospeech
except ImportError:
    print("pip install google-cloud-texttospeech")
    raise SystemExit(1)

if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
    print('缺少 GOOGLE_APPLICATION_CREDENTIALS 环境变量')
    raise SystemExit(2)

OUT_DIR = Path("public/audio/phonemes_gcp")
MANIFEST = Path("public/data/phoneme_manifest_gcp.json")
OUT_DIR.mkdir(parents=True, exist_ok=True)
MANIFEST.parent.mkdir(parents=True, exist_ok=True)

# IPA symbol → display_file_key
PHONEMES = {
    "p": "p",
    "b": "b",
    "t": "t",
    "d": "d",
    "k": "k",
    "ɡ": "g",
    "g": "g",
    "f": "f",
    "v": "v",
    "s": "s",
    "z": "z",
    "θ": "th",
    "ð": "dh",
    "ʃ": "sh",
    "ʒ": "zh",
    "h": "h",
    "tʃ": "ch",
    "dʒ": "dj",
    "m": "m",
    "n": "n",
    "ŋ": "ng",
    "l": "l",
    "r": "r",
    "w": "w",
    "j": "j",
    "æ": "ae",
    "e": "e",
    "ɪ": "ih",
    "ɒ": "oh",
    "ʌ": "uh",
    "ʊ": "uu",
    "ə": "schwa",
    "iː": "ee",
    "uː": "oo",
    "ɑː": "ar",
    "ɔː": "aw",
    "ɜː": "er",
    "eɪ": "ay",
    "aɪ": "eye",
    "ɔɪ": "oy",
    "əʊ": "oh_dip",
    "aʊ": "ow",
    "ɪə": "ear",
    "eə": "air",
    "ʊə": "oor",
}

client = texttospeech.TextToSpeechClient()
voice = texttospeech.VoiceSelectionParams(
    language_code="en-US",
    name="en-US-Neural2-F",
    ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
)
audio_cfg = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3,
    speaking_rate=0.75,
    sample_rate_hertz=24000,
)

manifest = {}
done = skipped = failed = 0

for ipa, file_key in PHONEMES.items():
    out = OUT_DIR / f"{file_key}.mp3"
    if out.exists():
        skipped += 1
        manifest[ipa] = file_key
        continue
    ssml = f'<speak><phoneme alphabet="ipa" ph="{ipa}">·</phoneme></speak>'
    try:
        resp = client.synthesize_speech(
            input=texttospeech.SynthesisInput(ssml=ssml),
            voice=voice,
            audio_config=audio_cfg,
        )
        out.write_bytes(resp.audio_content)
        manifest[ipa] = file_key
        done += 1
        print(f"  ✓ {ipa} → {file_key}.mp3")
        time.sleep(0.15)
    except Exception as e:
        failed += 1
        print(f"  ✗ {ipa}: {e}")

MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"\n完成: {done} 新生成 / {skipped} 已跳过 / {failed} 失败")
print(f"清单 → {MANIFEST}")
