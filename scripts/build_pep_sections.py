#!/usr/bin/env python3
"""Fetch 朗读宝 + merge g3up into sections.ts for PEP g3down–g6down."""
from __future__ import annotations

import html
import json
import re
import urllib.request
from pathlib import Path

from pep_sections_common import HEADER, fmt_unit, q, s, sec, w

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/mobile/textbook/data/sections.ts"
CACHE = ROOT / "scripts/extracted/web_cache"
CACHE.mkdir(parents=True, exist_ok=True)

# ── Book metadata ─────────────────────────────────────────────────────────────
BOOKS = [
    {
        "prefix": "g3down", "book_id": "pep-g3down",
        "book_title": "PEP 英语 · 三年级下册", "book_emoji": "📗",
        "url": "https://yy.suyang123.com/xiaoxue/sannianji/rjbp_xiace_listen{u}.html",
        "units": [
            (1, "Meeting new people", "认识新朋友、国籍与礼貌", "👋"),
            (2, "Expressing yourself", "表达情感与关爱", "💛"),
            (3, "Learning better", "学习工具与感官", "📚"),
            (4, "Healthy food", "健康饮食", "🥗"),
            (5, "Old toys", "旧玩具与分享", "🧸"),
            (6, "Numbers in life", "生活中的数字", "🔢"),
        ],
    },
    {
        "prefix": "g4up", "book_id": "pep-g4up",
        "book_title": "PEP 英语 · 四年级上册", "book_emoji": "📙",
        "url": "https://yy.suyang123.com/xiaoxue/sinianji/rjbp_shangce_listen{u}.html",
        "units": [
            (1, "Helping at home", "家务与家庭分工", "🏠"),
            (2, "My friends", "朋友与性格", "🤝"),
            (3, "Places we live in", "居住场所与社区", "🏘️"),
            (4, "Helping in the community", "社区互助", "🫶"),
            (5, "The weather and us", "天气与生活", "🌤️"),
            (6, "Changing for the seasons", "季节与着装", "🍂"),
        ],
    },
    {
        "prefix": "g4down", "book_id": "pep-g4down",
        "book_title": "PEP 英语 · 四年级下册", "book_emoji": "📒",
        "url": "https://yy.suyang123.com/xiaoxue/sinianji/rjbp_xiace_listen{u}.html",
        "units": [
            (1, "Class rules", "课堂规则", "📋"),
            (2, "Family rules", "家庭规则", "👨‍👩‍👧"),
            (3, "Time for school", "上学时间与作息", "⏰"),
            (4, "Going shopping", "购物与消费", "🛒"),
            (5, "Farms and us", "农场与我们", "🚜"),
            (6, "From farm to table", "从农场到餐桌", "🌾"),
        ],
    },
    {
        "prefix": "g5up", "book_id": "pep-g5up",
        "book_title": "PEP 英语 · 五年级上册", "book_emoji": "📕",
        "url": "https://yy.suyang123.com/xiaoxue/wunianji/rjbp_shangce_listen{u}.html",
        "units": [
            (1, "Different friends", "朋友各不相同", "👫"),
            (2, "My feelings", "情绪与感受", "😊"),
            (3, "Work and play", "学与玩", "⚽"),
            (4, "Healthy habits", "健康习惯", "🏃"),
            (5, "Food we eat", "饮食与食物", "🍽️"),
            (6, "Nature and us", "自然与我们", "🌿"),
        ],
    },
    {
        "prefix": "g5down", "book_id": "pep-g5down",
        "book_title": "PEP 英语 · 五年级下册", "book_emoji": "📓",
        "url": "https://yy.suyang123.com/xiaoxue/wunianji/rjbp_xiace_listen{u}.html",
        "units": [
            (1, "Following the rules", "规则与礼貌", "📋"),
            (2, "My favourite season", "最喜欢的季节", "🍂"),
            (3, "My school calendar", "校历与活动", "📅"),
            (4, "When is the art show?", "艺术节与日期", "🎨"),
            (5, "Whose dog is it?", "物主代词与宠物", "🐕"),
            (6, "Work quietly!", "安静学习与规则", "🤫"),
        ],
    },
    {
        "prefix": "g6up", "book_id": "pep-g6up",
        "book_title": "PEP 英语 · 六年级上册", "book_emoji": "📔",
        "url": "https://yy.suyang123.com/xiaoxue/liunianji/rjbp_shangce_listen{u}.html",
        "units": [
            (1, "Amazing landmarks", "中外地标", "🗼"),
            (2, "Getting together", "聚会与节日", "🎉"),
            (3, "Healthy life", "健康生活", "💪"),
            (4, "Saving money", "理财与消费", "💰"),
            (5, "Exploring space", "探索太空", "🚀"),
            (6, "Saving energy", "节约能源", "⚡"),
        ],
    },
    {
        "prefix": "g6down", "book_id": "pep-g6down",
        "book_title": "PEP 英语 · 六年级下册", "book_emoji": "📰",
        "url": "https://yy.suyang123.com/xiaoxue/liunianji/rjbp_xiace_listen{u}.html",
        "units": [
            (1, "How tall are you?", "比较身高与体型", "📏"),
            (2, "Last weekend", "上周末活动", "📆"),
            (3, "Where did you go?", "假期去向", "✈️"),
            (4, "Then and now", "今昔对比", "🕰️"),
        ],
    },
]

SKIP_EN = re.compile(
    r"^(翻译：|版本：|英语朗读宝|人教版|使用微信|免费下载|课文音频|必背单词|"
    r"^Part [ABC]$|^A |^B |^C |Conversation \d|Self-check$|Reading time$|Look and think$|"
    r"^Listen and chant$|^Listen and sing$|^Let's talk$|^Let's learn$|^Let's spell$|"
    r"^Listen and do$|^Read and write$|^Start to read$|"
    r"Do a survey$|Play a guessing game$|Choose and say$|Read, listen|Then listen|"
    r"Project:|Make your|Share your|Food Festival$|Nihao!$|Sawat di|"
    r"RUSSIA$|EGYPT$|CANADA$|CHINA$|^Unit \d|Appendix|Revision|最新|小宝|"
    r"^\d+\.\s*$|^[A-Z]{2,}$|What's your name\?$|Where are you from\?$|How old)",
    re.I,
)

SECTION_RULES: list[tuple[str, str, str, str | None, str]] = [
    (r"Look and think", "opening", "Unit {u} · 走进单元", None, "✨"),
    (r"Listen and chant", "chant", "Listen and chant", "A", "🎵"),
    (r"Listen and sing", "sing", "Listen and sing", "A", "🎤"),
    (r"Let's talk", "talk", "Let's talk", "A", "💬"),
    (r"Let's learn", "learn", "Let's learn", "A", "🔤"),
    (r"Let's spell", "read", "Let's spell", "A", "🔤"),
    (r"Listen and do", "do", "Listen and do", "B", "🙌"),
    (r"Read and write|Start to read", "read", "Read and write", "B", "📝"),
    (r"Self-check|Self-assessment", "check", "Self-check", "C", "✅"),
    (r"Reading time|Story time", "story", "Reading time", "C", "📖"),
    (r"Let's play", "play", "Let's play", "B", "🎮"),
]


def fetch_page(url: str) -> str:
    cache_key = re.sub(r"[^\w]+", "_", url)
    cache_file = CACHE / f"{cache_key}.html"
    if cache_file.exists():
        return cache_file.read_text(encoding="utf-8", errors="ignore")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read().decode("utf-8", errors="ignore")
    cache_file.write_text(raw, encoding="utf-8")
    return raw


def clean_span(text: str) -> str:
    text = html.unescape(text)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    return re.sub(r"\s+", " ", text).strip()


def parse_p_w_items(page_html: str) -> list[tuple[str, str]]:
    """Parse ordered en/zh items including section headers from 朗读宝 HTML."""
    items: list[tuple[str, str]] = []
    for m in re.finditer(r'<div class="p-w-item"[^>]*>([\s\S]*?)</div>', page_html):
        block = m.group(1)
        en_m = re.search(r'<span class="en"[^>]*>([\s\S]*?)</span>', block)
        if not en_m:
            continue
        en = clean_span(en_m.group(1)).lstrip("-—").strip()
        zh = ""
        cn_m = re.search(r'<span class="cn"[^>]*>([\s\S]*?)</span>', block)
        if cn_m:
            zh = clean_span(cn_m.group(1)).replace("翻译：", "").strip()
        if not en:
            continue
        items.append((en, zh))
    return items


def html_to_lines(page_html: str) -> list[tuple[str, str]]:
    items = parse_p_w_items(page_html)
    if items:
        return items

    pairs: list[tuple[str, str]] = []
    pattern = re.compile(
        r'<span class="en"[^>]*>([\s\S]*?)</span>\s*<span class="cn"[^>]*>\s*翻译：([\s\S]*?)</span>',
        re.I,
    )
    for en_raw, zh_raw in pattern.findall(page_html):
        en = clean_span(en_raw).lstrip("-—").strip()
        zh = clean_span(zh_raw)
        if len(en) < 1 or len(zh) < 1 or SKIP_EN.match(en):
            continue
        pairs.append((en, zh))
    return pairs


def guess_speaker(en: str) -> tuple[str, str | None]:
    m = re.match(r"^([A-Z][A-Za-z .'-]{1,30}):\s*(.+)$", en)
    if m:
        return m.group(2).strip(), m.group(1).strip()
    m2 = re.match(r"^([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+(.+)$", en)
    if m2 and m2.group(1) in {"Miss White", "Chen Jie", "Zhang Peng", "Wu Binbin", "Sarah Miller",
                                "Mike Black", "Amy Green", "John Baker", "Oliver", "Robin", "Zoom", "Zip"}:
        return m2.group(2).strip(), m2.group(1)
    return en, None


def is_vocab_line(en: str, zh: str) -> bool:
    if len(en.split()) > 4:
        return False
    if re.search(r"[.!?]", en):
        return False
    if len(zh) > 28:
        return False
    if re.match(r"^\d+\.", en):
        return False
    return True


def is_section_header(en: str) -> str | None:
    e = en.strip()
    headers = {
        "look and think": "opening_hdr",
        "listen and chant": "chant",
        "listen and sing": "sing",
        "let's talk": "talk",
        "let's learn": "learn",
        "let's spell": "spell",
        "listen and do": "do",
        "read and write": "read",
        "start to read": "read",
        "self-check": "check",
        "self-assessment": "check",
        "reading time": "story",
        "story time": "story",
        "let's play": "play",
        "listen, repeat and chant.": "spell",
        "do a survey": "skip",
        "choose and say": "skip",
        "look, choose and write.": "skip",
        "read, look and match.": "skip",
        "play a guessing game": "skip",
        "look and role-play.": "skip",
        "look, say and guess": "skip",
    }
    low = e.lower().rstrip(".")
    if low in headers:
        return headers[low]
    if re.match(r"^[abc]\s+.+", low):
        return "part_hdr"
    if re.match(r"^project:", low):
        return "project"
    if re.match(r"^\d+\s+the children", low):
        return "skip"
    return None


def build_unit_from_pairs(prefix: str, unit_num: int, title_en: str, subtitle: str, emoji: str,
                          pairs: list[tuple[str, str]], page_html: str) -> dict:
    uid = f"{prefix}-u{unit_num}"
    current_part = "A"
    opening: list[tuple[str, str]] = []
    chunks: list[tuple[str, str | None, list[tuple[str, str]]]] = []
    current_kind: str | None = None
    current_items: list[tuple[str, str]] = []

    def flush():
        nonlocal current_kind, current_items
        if current_kind and current_items:
            chunks.append((current_kind, current_part, current_items))
        current_kind = None
        current_items = []

    for en, zh in pairs:
        hdr = is_section_header(en)
        if hdr == "skip":
            continue
        if hdr == "opening_hdr":
            flush()
            current_kind = "opening_collect"
            current_items = []
            continue
        if hdr == "part_hdr":
            flush()
            if en.strip().lower().startswith("b"):
                current_part = "B"
            elif en.strip().lower().startswith("c"):
                current_part = "C"
            else:
                current_part = "A"
            qm = re.match(r"^[ABC]\s+(.+\?)\s*$", en.strip())
            if qm and len(opening) < 4:
                opening.append((qm.group(1), zh or qm.group(1)))
            continue
        if hdr == "project":
            flush()
            current_part = "C"
            current_kind = "project"
            current_items = []
            continue
        if hdr:
            flush()
            current_kind = hdr
            current_items = []
            continue
        if current_kind == "opening_collect":
            if en.endswith("?") and len(en) > 8:
                opening.append((en, zh))
            continue
        if current_kind is None:
            if en.endswith("?") and len(en) > 12 and len(opening) < 4:
                opening.append((en, zh))
            continue
        current_items.append((en, zh))
    flush()

    sections: list[dict] = []
    if opening:
        sections.append(sec(
            f"{uid}-opening", "opening", f"Unit {unit_num} · 走进单元", "✨",
            sentences=[s(f"{uid}-op{i+1}", en, zh) for i, (en, zh) in enumerate(opening[:4])],
        ))

    sec_counters: dict[str, int] = {}
    kind_map = {
        "chant": ("chant", "Listen and chant", "🎵"),
        "sing": ("sing", "Listen and sing", "🎤"),
        "talk": ("talk", "Let's talk", "💬"),
        "learn": ("learn", "Let's learn", "🔤"),
        "spell": ("read", "Let's spell", "🔤"),
        "do": ("do", "Listen and do", "🙌"),
        "read": ("read", "Read and write", "📝"),
        "check": ("check", "Self-check", "✅"),
        "story": ("story", "Reading time", "📖"),
        "play": ("play", "Let's play", "🎮"),
        "project": ("play", "Project", "🎨"),
    }

    for kind_key, part, block_pairs in chunks:
        if not block_pairs:
            continue
        kind, title, emoji_sec = kind_map.get(kind_key, ("talk", "Let's talk", "💬"))
        key = f"{part}-{kind_key}"
        sec_counters[key] = sec_counters.get(key, 0) + 1
        idx = sec_counters[key]
        part_letter = part.lower()
        abbr = {"chant": "c", "sing": "s", "talk": "t", "learn": "l", "do": "d",
                "read": "r", "spell": "sp", "check": "cc", "story": "cs", "play": "p",
                "project": "pj"}.get(kind_key, "x")
        sid = f"{uid}-{part_letter}-{abbr}{idx}" if idx > 1 else f"{uid}-{part_letter}-{abbr}"

        sentences: list[dict] = []
        words: list[dict] = []
        if kind == "learn":
            vocab = [(en, zh) for en, zh in block_pairs if is_vocab_line(en, zh)]
            for en, zh in vocab[:6]:
                words.append(w(en, zh))
            for en, zh in block_pairs:
                if (en, zh) in vocab:
                    continue
                text, speaker = guess_speaker(en)
                sentences.append(s(f"{sid}-s{len(sentences)+1}", text, zh, speaker))
        else:
            for en, zh in block_pairs:
                if kind in {"talk", "story", "chant", "sing"} and is_vocab_line(en, zh) and len(en.split()) <= 2:
                    if kind != "learn":
                        continue
                text, speaker = guess_speaker(en)
                sentences.append(s(f"{sid}-{len(sentences)+1}", text, zh, speaker))

        if not sentences and not words:
            continue
        sections.append(sec(sid, kind, title, emoji_sec, part, words=words or None, sentences=sentences or None))

    if len(sections) < 2 and pairs:
        talk_sents = []
        for i, (en, zh) in enumerate(pairs[:24]):
            if is_section_header(en):
                continue
            text, speaker = guess_speaker(en)
            talk_sents.append(s(f"{uid}-at{i+1}", text, zh, speaker))
        if talk_sents:
            sections.append(sec(f"{uid}-a-talk", "talk", "Let's talk", "💬", "A", sentences=talk_sents))

    return {
        "title": f"Unit {unit_num} · {title_en}",
        "subtitle": subtitle,
        "emoji": emoji,
        "sections": sections,
    }


def load_g3up_ts() -> str:
    src = OUT.read_text(encoding="utf-8")
    m = re.search(r"(const g3up_u1: TextbookUnit = \{[\s\S]*?^const g3down_u1)", src, re.M)
    if not m:
        m = re.search(r"(const g3up_u1: TextbookUnit = \{[\s\S]*?^const g3down)", src, re.M)
    if not m:
        m = re.search(r"(const g3up_u1: TextbookUnit = \{[\s\S]*?^export const TEXTBOOK_BOOKS)", src, re.M)
    if not m:
        raise RuntimeError("g3up block not found in sections.ts")
    block = m.group(1)
    block = re.sub(r"\nconst (g3down|placeholderUnit|export const TEXTBOOK_BOOKS).*$", "", block, flags=re.M).strip()
    return block


def main():
    g3up_block = load_g3up_ts()

    all_unit_vars: list[tuple[str, str, dict]] = []
    book_exports: list[dict] = []

    for book in BOOKS:
        prefix = book["prefix"]
        unit_vars = []
        for unit_num, title_en, subtitle, emoji in book["units"]:
            url = book["url"].format(u=unit_num)
            try:
                page = fetch_page(url)
                pairs = html_to_lines(page)
                if len(pairs) < 5:
                    print(f"[warn] {prefix} u{unit_num}: only {len(pairs)} pairs from {url}")
                unit = build_unit_from_pairs(prefix, unit_num, title_en, subtitle, emoji, pairs, page)
            except Exception as e:
                print(f"[error] {prefix} u{unit_num}: {e}")
                unit = {
                    "title": f"Unit {unit_num} · {title_en}",
                    "subtitle": subtitle,
                    "emoji": emoji,
                    "sections": [],
                }
            cname = f"{prefix}_u{unit_num}"
            uid = f"{prefix}-u{unit_num}"
            unit_vars.append(cname)
            all_unit_vars.append((uid, cname, unit))
        book_exports.append({
            "id": book["book_id"],
            "title": book["book_title"],
            "emoji": book["book_emoji"],
            "units": unit_vars,
        })

    parts = [HEADER.rstrip(), ""]
    parts.append(g3up_block)
    parts.append("")

    for uid, cname, unit in all_unit_vars:
        parts.append(fmt_unit(uid, cname, unit))
        parts.append("")

    parts.append("export const TEXTBOOK_BOOKS: TextbookBook[] = [")
    parts.append("  {")
    parts.append("    id: 'pep-g3up',")
    parts.append("    title: 'PEP 英语 · 三年级上册',")
    parts.append("    subtitle: '人教版 PEP（2024）',")
    parts.append("    emoji: '📘',")
    parts.append("    units: [g3up_u1, g3up_u2, g3up_u3, g3up_u4, g3up_u5, g3up_u6],")
    parts.append("  },")
    for b in book_exports:
        units_csv = ", ".join(b["units"])
        parts.append("  {")
        parts.append(f"    id: '{b['id']}',")
        parts.append(f"    title: '{q(b['title'])}',")
        parts.append("    subtitle: '人教版 PEP（2024）',")
        parts.append(f"    emoji: '{b['emoji']}',")
        parts.append(f"    units: [{units_csv}],")
        parts.append("  },")
    parts.append("]")
    parts.append("")

    OUT.write_text("\n".join(parts), encoding="utf-8")

    stats = {"books": len(book_exports), "units": 0, "sections": 0, "sentences": 0}
    for _, _, unit in all_unit_vars:
        stats["units"] += 1
        for sec_item in unit["sections"]:
            stats["sections"] += 1
            stats["sentences"] += len(sec_item.get("sentences") or [])
    print(json.dumps(stats, ensure_ascii=False, indent=2))
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
