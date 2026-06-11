"""Shared helpers for PEP sections.ts generation."""
from __future__ import annotations

import re
from typing import Any

HEADER = '''/**
 * 课文章节数据 · PEP 三起点（2024 版）
 * 句子来源：人教版 PEP 教材（三上手工录入；三下–六下由 build_pep_sections.py 生成）
 */

export type SectionKind =
  | 'opening' // 单元开场
  | 'talk'    // Let's talk
  | 'play'    // Let's play
  | 'learn'   // Let's learn（含单词卡）
  | 'chant'   // Let's chant
  | 'sing'    // Let's sing
  | 'do'      // Let's do（动作指令）
  | 'story'   // Story time
  | 'check'   // Let's check
  | 'read'    // Start to read

export interface TextbookSentence {
  id: string
  en: string
  zh: string
  speaker?: string
}

export interface TextbookWord {
  en: string
  zh: string
  emoji?: string
}

export interface TextbookSection {
  id: string
  part?: 'A' | 'B' | 'C'
  kind: SectionKind
  title: string
  emoji: string
  words?: TextbookWord[]
  sentences?: TextbookSentence[]
}

export interface TextbookUnit {
  id: string
  title: string
  subtitle: string
  emoji: string
  sections: TextbookSection[]
}

export interface TextbookBook {
  id: string
  title: string
  subtitle: string
  emoji: string
  units: TextbookUnit[]
}

'''

WORD_EMOJI: dict[str, str] = {
    'cat': '🐱', 'dog': '🐶', 'bird': '🐦', 'fish': '🐟', 'panda': '🐼',
    'apple': '🍎', 'banana': '🍌', 'orange': '🍊', 'grape': '🍇', 'milk': '🥛',
    'bread': '🍞', 'rice': '🍚', 'water': '💧', 'tea': '🍵', 'cake': '🎂',
    'eye': '👁️', 'ear': '👂', 'mouth': '👄', 'hand': '✋', 'arm': '💪',
    'leg': '🦵', 'foot': '🦶', 'head': '🗣️', 'hair': '💇', 'nose': '👃',
    'mother': '👩', 'father': '👨', 'sister': '👧', 'brother': '👦', 'baby': '👶',
    'teacher': '👩‍🏫', 'student': '🧑‍🎓', 'friend': '🤝', 'boy': '👦', 'girl': '👧',
    'man': '👨', 'woman': '👩', 'China': '🇨🇳', 'UK': '🇬🇧', 'USA': '🇺🇸', 'Canada': '🇨🇦',
    'lovely': '😊', 'clever': '🧠', 'young': '🌱', 'strong': '💪', 'kind': '💛',
    'quiet': '🤫', 'happy': '😄', 'sad': '😢', 'angry': '😠', 'tired': '😴',
    'robot': '🤖', 'dance': '💃', 'football': '⚽', 'music': '🎵', 'art': '🎨',
    'tree': '🌳', 'flower': '🌸', 'sun': '☀️', 'rain': '🌧️', 'snow': '❄️',
    'book': '📚', 'pen': '✏️', 'ruler': '📏', 'bag': '🎒', 'toy': '🧸',
}


def dedupe_phrase(text: str) -> str:
    t = text.strip()
    if not t:
        return t
    twin = re.match(r"^(.+?)([.!?])\s+\1\2?$", t)
    if twin:
        return f"{twin.group(1)}{twin.group(2)}"
    for end in ("!", "?", "."):
        if end not in t:
            continue
        parts = [p.strip() for p in t.split(end) if p.strip()]
        if len(parts) >= 2 and all(p == parts[0] for p in parts):
            return f"{parts[0]}{end}"
    return t


def dedupe_phrase_zh(text: str) -> str:
    if not text:
        return text
    t = text.strip()
    for end in ("。", "！", "？"):
        if end not in t:
            continue
        parts = [p.strip() for p in t.split(end) if p.strip()]
        if len(parts) >= 2 and all(p == parts[0] for p in parts):
            return f"{parts[0]}{end}"
    twin = re.match(r"^(.+?)([。！？])\s*\1\2?$", t)
    if twin:
        return f"{twin.group(1)}{twin.group(2)}"
    return t


def s(uid: str, en: str, zh: str, speaker: str | None = None) -> dict:
    d: dict[str, Any] = {
        "id": uid,
        "en": dedupe_phrase(en),
        "zh": dedupe_phrase_zh(zh),
    }
    if speaker:
        d["speaker"] = speaker
    return d


def w(en: str, zh: str, emoji: str | None = None) -> dict:
    key = en.split('(')[0].strip().lower()
    d: dict[str, Any] = {"en": en, "zh": zh}
    d["emoji"] = emoji or WORD_EMOJI.get(key) or WORD_EMOJI.get(en) or '📖'
    return d


def sec(sid: str, kind: str, title: str, emoji: str, part: str | None = None,
        words: list | None = None, sentences: list | None = None) -> dict:
    d: dict[str, Any] = {"id": sid, "kind": kind, "title": title, "emoji": emoji}
    if part:
        d["part"] = part
    if words:
        d["words"] = words
    if sentences:
        d["sentences"] = sentences
    return d


def q(text: str) -> str:
    return text.replace("'", "\\'")


def fmt_unit(unit_id: str, const_name: str, unit: dict) -> str:
    lines = [f"const {const_name}: TextbookUnit = {{"]
    lines.append(f"  id: '{q(unit_id)}',")
    lines.append(f"  title: '{q(unit['title'])}',")
    lines.append(f"  subtitle: '{q(unit['subtitle'])}',")
    lines.append(f"  emoji: '{q(unit['emoji'])}',")
    lines.append("  sections: [")
    for section in unit["sections"]:
        lines.append("    {")
        lines.append(f"      id: '{q(section['id'])}',")
        if section.get("part"):
            lines.append(f"      part: '{q(section['part'])}',")
        lines.append(f"      kind: '{q(section['kind'])}',")
        lines.append(f"      title: '{q(section['title'])}',")
        lines.append(f"      emoji: '{q(section['emoji'])}',")
        if section.get("words"):
            lines.append("      words: [")
            for word in section["words"]:
                if word.get("emoji"):
                    lines.append(
                        f"        {{ en: '{q(word['en'])}', zh: '{q(word['zh'])}', emoji: '{q(word['emoji'])}' }},")
                else:
                    lines.append(f"        {{ en: '{q(word['en'])}', zh: '{q(word['zh'])}' }},")
            lines.append("      ],")
        if section.get("sentences"):
            lines.append("      sentences: [")
            for sent in section["sentences"]:
                sp = f", speaker: '{q(sent['speaker'])}'" if sent.get("speaker") else ""
                lines.append(
                    f"        {{ id: '{q(sent['id'])}', en: '{q(sent['en'])}', zh: '{q(sent['zh'])}'{sp} }},")
            lines.append("      ],")
        lines.append("    },")
    lines.append("  ],")
    lines.append("}")
    return "\n".join(lines)
