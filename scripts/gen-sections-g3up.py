#!/usr/bin/env python3
"""Generate src/mobile/textbook/data/sections.ts for PEP 2024 Grade 3 Upper."""

from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "src/mobile/textbook/data/sections.ts"

HEADER = '''/**
 * 课文章节数据 · PEP 三起点（2024 版）
 * 句子来源：人教版 PEP 三年级上册（2024）
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


import re as _re


def _dedupe_phrase(text: str) -> str:
    t = text.strip()
    if not t:
        return t
    twin = _re.match(r"^(.+?)([.!?])\s+\1\2?$", t)
    if twin:
        return f"{twin.group(1)}{twin.group(2)}"
    for end in ("!", "?", "."):
        if end not in t:
            continue
        parts = [p.strip() for p in t.split(end) if p.strip()]
        if len(parts) >= 2 and all(p == parts[0] for p in parts):
            return f"{parts[0]}{end}"
    return t


def _dedupe_phrase_zh(text: str) -> str:
    if not text:
        return text
    t = text.strip()
    for end in ("。", "！", "？"):
        if end not in t:
            continue
        parts = [p.strip() for p in t.split(end) if p.strip()]
        if len(parts) >= 2 and all(p == parts[0] for p in parts):
            return f"{parts[0]}{end}"
    twin = _re.match(r"^(.+?)([。！？])\s*\1\2?$", t)
    if twin:
        return f"{twin.group(1)}{twin.group(2)}"
    return t


def s(uid, en, zh, speaker=None):
    d = {"id": uid, "en": _dedupe_phrase(en), "zh": _dedupe_phrase_zh(zh)}
    if speaker:
        d["speaker"] = speaker
    return d


def w(en, zh, emoji=None):
    d = {"en": en, "zh": zh}
    if emoji:
        d["emoji"] = emoji
    return d


def sec(sid, kind, title, emoji, part=None, words=None, sentences=None):
    d = {"id": sid, "kind": kind, "title": title, "emoji": emoji}
    if part:
        d["part"] = part
    if words:
        d["words"] = words
    if sentences:
        d["sentences"] = sentences
    return d


def q(text: str) -> str:
    return text.replace("'", "\\'")


def fmt_unit(unit_id, const_name, unit):
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
                    lines.append(f"        {{ en: '{q(word['en'])}', zh: '{q(word['zh'])}', emoji: '{q(word['emoji'])}' }},")
                else:
                    lines.append(f"        {{ en: '{q(word['en'])}', zh: '{q(word['zh'])}' }},")
            lines.append("      ],")
        if section.get("sentences"):
            lines.append("      sentences: [")
            for sent in section["sentences"]:
                sp = f", speaker: '{q(sent['speaker'])}'" if sent.get("speaker") else ""
                lines.append(f"        {{ id: '{q(sent['id'])}', en: '{q(sent['en'])}', zh: '{q(sent['zh'])}'{sp} }},")
            lines.append("      ],")
        lines.append("    },")
    lines.append("  ],")
    lines.append("}")
    return "\n".join(lines)


# ── Unit 1 ──────────────────────────────────────────────────────────
U1 = {
    "title": "Unit 1 · Making friends",
    "subtitle": "交朋友、问候、身体部位",
    "emoji": "👋",
    "sections": [
        sec("g3up-u1-opening", "opening", "Unit 1 · 走进单元", "✨", sentences=[
            s("g3up-u1-op1", "How do we make friends?", "我们怎样交朋友？"),
            s("g3up-u1-op2", "Are they friends?", "他们是朋友吗？"),
            s("g3up-u1-op3", "What makes you a good friend?", "什么让你成为一个好朋友？"),
            s("g3up-u1-op4", "Who is your friend?", "你的朋友是谁？"),
        ]),
        sec("g3up-u1-a-chant", "chant", "Listen and chant", "🎵", "A", sentences=[
            s("g3up-u1-ac1", "Hello! Hello! Hello! Hello!", "你好！你好！你好！你好！"),
            s("g3up-u1-ac2", "What's your name? What's your name?", "你叫什么名字？你叫什么名字？"),
            s("g3up-u1-ac3", "Nice to meet you. Nice to meet you.", "很高兴认识你。很高兴认识你。"),
            s("g3up-u1-ac4", "Let's play a game! Let's play a game!", "我们来玩游戏吧！我们来玩游戏吧！"),
        ]),
        sec("g3up-u1-a-sing", "sing", "Listen and sing · Nice to meet you!", "🎤", "A", sentences=[
            s("g3up-u1-as1", "Nice to meet you. Nice to meet you.", "很高兴认识你。很高兴认识你。"),
            s("g3up-u1-as2", "Nice to meet you, my new friend.", "很高兴认识你，我的新朋友。"),
            s("g3up-u1-as3", "I am happy. Smile and say \"Hi!\"", "我很开心。微笑着说「嗨！」"),
            s("g3up-u1-as4", "Shake my hand. Let's play a game now.", "握握手。现在我们来玩游戏吧。"),
        ]),
        sec("g3up-u1-a-talk", "talk", "Let's talk", "💬", "A", sentences=[
            s("g3up-u1-at1", "Hello! I'm Mike Black.", "你好！我是 Mike Black。", "Mike Black"),
            s("g3up-u1-at2", "Hi! My name is Wu Binbin.", "嗨！我叫吴斌斌。", "Wu Binbin"),
            s("g3up-u1-at3", "Nice to meet you.", "很高兴认识你。", "Mike Black"),
            s("g3up-u1-at4", "Nice to meet you too.", "我也很高兴认识你。", "Wu Binbin"),
        ]),
        sec("g3up-u1-a-learn", "learn", "Let's learn", "🔤", "A",
            words=[
                w("eye", "眼睛", "👁️"), w("ear", "耳朵", "👂"), w("mouth", "嘴", "👄"),
                w("hand", "手", "✋"), w("arm", "胳膊", "💪"),
            ],
            sentences=[
                s("g3up-u1-al1", "Hello! My name is Mike Black.", "你好！我叫 Mike Black。", "Mike Black"),
                s("g3up-u1-al2", "Hi! I'm Sarah Miller.", "嗨！我是 Sarah Miller。", "Sarah Miller"),
            ]),
        sec("g3up-u1-a-do", "do", "Listen and do", "🙌", "A", sentences=[
            s("g3up-u1-ad1", "Wave your hand. Hello!", "挥挥你的手。你好！"),
            s("g3up-u1-ad2", "Look into my eyes. Hi!", "看着我的眼睛。嗨！"),
            s("g3up-u1-ad3", "Point to your ear. Listen!", "指指你的耳朵。听！"),
            s("g3up-u1-ad4", "Point to your mouth. Smile!", "指指你的嘴。笑一笑！"),
            s("g3up-u1-ad5", "Wave your arm. Bye!", "挥挥你的胳膊。再见！"),
        ]),
        sec("g3up-u1-a-read", "read", "Letters and sounds · Aa–Dd", "🔤", "A", sentences=[
            s("g3up-u1-ar1", "A is for /æ/. /æ/, /æ/, apple. /æ/, /æ/, bag.", "A 发 /æ/ 音。苹果，书包。"),
            s("g3up-u1-ar2", "B is for /b/. /b/, /b/, bed. /b/, /b/, Bob.", "B 发 /b/ 音。床，Bob。"),
            s("g3up-u1-ar3", "C is for /k/. /k/, /k/, cat. /k/, /k/, can.", "C 发 /k/ 音。猫，罐子。"),
            s("g3up-u1-ar4", "D is for /d/. /d/, /d/, dog. /d/, /d/, sad.", "D 发 /d/ 音。狗，难过的。"),
        ]),
        sec("g3up-u1-b-talk", "talk", "Let's talk", "💬", "B", sentences=[
            s("g3up-u1-bt1", "Oh no!", "哦，不！", "Chen Jie"),
            s("g3up-u1-bt2", "It's OK, Chen Jie. We can share.", "没关系，陈杰。我们可以分享。", "Sarah Miller"),
            s("g3up-u1-bt3", "Thanks, Sarah.", "谢谢，Sarah。", "Chen Jie"),
            s("g3up-u1-bt4", "Hey, Sarah! We can share.", "嘿，Sarah！我们可以分享。", "Chen Jie"),
            s("g3up-u1-bt5", "Thank you, Chen Jie.", "谢谢你，陈杰。", "Sarah Miller"),
        ]),
        sec("g3up-u1-b-learn", "learn", "Let's learn", "🔤", "B",
            words=[
                w("smile", "微笑", "😊"), w("listen", "倾听", "👂"), w("help", "帮助", "🤝"), w("share", "分享", "🎁"),
            ],
            sentences=[
                s("g3up-u1-bl1", "I smile.", "我微笑。", "Chen Jie"),
                s("g3up-u1-bl2", "I listen.", "我倾听。", "Sarah Miller"),
                s("g3up-u1-bl3", "I help.", "我帮忙。", "Chen Jie"),
                s("g3up-u1-bl4", "I share.", "我分享。", "Sarah Miller"),
            ]),
        sec("g3up-u1-b-chant", "chant", "Listen and chant", "🎵", "B", sentences=[
            s("g3up-u1-bc1", "Am I a good friend? Yes, I am!", "我是好朋友吗？是的，我是！"),
            s("g3up-u1-bc2", "I listen and say \"Hi!\" I smile too.", "我倾听并说「嗨！」我也微笑。"),
            s("g3up-u1-bc3", "I help and share. I play fair too.", "我帮忙和分享。我也公平玩耍。"),
        ]),
        sec("g3up-u1-b-read", "read", "Start to read", "📝", "B", sentences=[
            s("g3up-u1-br1", "I say \"Hi!\"", "我说「嗨！」"),
            s("g3up-u1-br2", "I listen.", "我倾听。"),
            s("g3up-u1-br3", "I share.", "我分享。"),
            s("g3up-u1-br4", "I help.", "我帮忙。"),
            s("g3up-u1-br5", "I am nice to my friends.", "我对朋友很好。"),
            s("g3up-u1-br6", "Are you a good friend?", "你是好朋友吗？"),
        ]),
        sec("g3up-u1-c-check", "check", "Self-check", "✅", "C", sentences=[
            s("g3up-u1-cc1", "I can greet people and show friendliness.", "我能问候别人并表示友好。"),
            s("g3up-u1-cc2", "I can say the names of body parts.", "我能说出身体部位的名称。"),
            s("g3up-u1-cc3", "I can say different ways to be a good friend.", "我能说出成为好朋友的不同方式。"),
            s("g3up-u1-cc4", "I can read, write and say Aa, Bb, Cc and Dd.", "我能认读、书写并说 Aa、Bb、Cc 和 Dd。"),
        ]),
        sec("g3up-u1-c-story", "story", "Reading time", "📖", "C", sentences=[
            s("g3up-u1-cs1", "Zoom is my new friend.", "Zoom 是我的新朋友。", "Zip"),
            s("g3up-u1-cs2", "Hi! I'm Zip. Nice to meet you.", "嗨！我是 Zip。很高兴认识你。", "Zip"),
            s("g3up-u1-cs3", "Hi! My name is Zoom. Nice to meet you too.", "嗨！我叫 Zoom。我也很高兴认识你。", "Zoom"),
            s("g3up-u1-cs4", "Zoom is nice.", "Zoom 很好。", "Zip"),
            s("g3up-u1-cs5", "We share food.", "我们分享食物。"),
            s("g3up-u1-cs6", "We play together.", "我们一起玩。"),
            s("g3up-u1-cs7", "We listen with care and help each other.", "我们认真倾听并互相帮助。"),
            s("g3up-u1-cs8", "Ouch! My mouth!", "哎哟！我的嘴！", "Zoom"),
            s("g3up-u1-cs9", "Hold my hand.", "握住我的手。", "Zip"),
            s("g3up-u1-cs10", "We are good friends now.", "我们现在是好朋友了。"),
        ]),
    ],
}

# ── Unit 2 ──────────────────────────────────────────────────────────
U2 = {
    "title": "Unit 2 · Different families",
    "subtitle": "家人、家庭大小、亲属称呼",
    "emoji": "👨‍👩‍👧",
    "sections": [
        sec("g3up-u2-opening", "opening", "Unit 2 · 走进单元", "✨", sentences=[
            s("g3up-u2-op1", "What makes a family?", "什么构成一个家庭？"),
            s("g3up-u2-op2", "Why are the people together?", "这些人为什么在一起？"),
            s("g3up-u2-op3", "How are families different?", "家庭有什么不同？"),
            s("g3up-u2-op4", "Who is in your family?", "你家有谁？"),
        ]),
        sec("g3up-u2-a-chant", "chant", "Listen and chant", "🎵", "A", sentences=[
            s("g3up-u2-ac1", "We are a family, A happy family,", "我们是一家人，幸福的一家人，"),
            s("g3up-u2-ac2", "My father, my mother, My sister and me!", "我的爸爸、我的妈妈、我的妹妹和我！"),
        ]),
        sec("g3up-u2-a-sing", "sing", "Listen and sing · My family", "🎤", "A", sentences=[
            s("g3up-u2-as1", "This is my mother. This is my father.", "这是我的妈妈。这是我的爸爸。"),
            s("g3up-u2-as2", "Where am I? Where am I?", "我在哪儿？我在哪儿？"),
            s("g3up-u2-as3", "I am with my sister. I am with my brother.", "我和妹妹在一起。我和弟弟在一起。"),
            s("g3up-u2-as4", "My family and I. My family and I.", "我和我的家人。我和我的家人。"),
            s("g3up-u2-as5", "This is my grandma. This is my grandpa.", "这是我的奶奶。这是我的爷爷。"),
            s("g3up-u2-as6", "I am with my aunt. I am with my uncle.", "我和姑姑在一起。我和叔叔在一起。"),
        ]),
        sec("g3up-u2-a-talk", "talk", "Let's talk", "💬", "A", sentences=[
            s("g3up-u2-at1", "Hi, Sarah.", "嗨，Sarah。", "Chen Jie"),
            s("g3up-u2-at2", "Mum! Dad! This is my friend, Sarah Miller.", "妈妈！爸爸！这是我的朋友 Sarah Miller。", "Chen Jie"),
            s("g3up-u2-at3", "This is my grandma. This is my grandpa.", "这是我的奶奶。这是我的爷爷。", "Chen Jie"),
            s("g3up-u2-at4", "Nice to meet you.", "很高兴认识你。", "Sarah Miller"),
        ]),
        sec("g3up-u2-a-learn", "learn", "Let's learn", "🔤", "A",
            words=[
                w("mother (mum)", "妈妈", "👩"), w("father (dad)", "爸爸", "👨"),
                w("grandmother (grandma)", "奶奶", "👵"), w("grandfather (grandpa)", "爷爷", "👴"),
                w("sister", "姐姐/妹妹", "👧"), w("me", "我", "🙋"),
            ],
            sentences=[
                s("g3up-u2-al1", "Hi, I'm Chen Jie. Look! This is my family. This is my ...", "嗨，我是陈杰。看！这是我的家人。这是我的……", "Chen Jie"),
            ]),
        sec("g3up-u2-a-chant2", "chant", "Listen and chant · 我的家人", "🎵", "A", sentences=[
            s("g3up-u2-ac3", "This is my mum. Hello, hello, hello!", "这是我的妈妈。你好，你好，你好！"),
            s("g3up-u2-ac4", "This is my dad. Hi, hi, hi!", "这是我的爸爸。嗨，嗨，嗨！"),
            s("g3up-u2-ac5", "This is my sister. How are you?", "这是我的妹妹。你好吗？"),
            s("g3up-u2-ac6", "This is my grandma. Nice to meet you.", "这是我的奶奶。很高兴认识你。"),
            s("g3up-u2-ac7", "This is my grandpa. How do you do?", "这是我的爷爷。你好！"),
        ]),
        sec("g3up-u2-a-read", "read", "Letters and sounds · Ee–Hh", "🔤", "A", sentences=[
            s("g3up-u2-ar1", "E is for /e/. /e/, /e/, egg. /e/, /e/, nest.", "E 发 /e/ 音。蛋，鸟巢。"),
            s("g3up-u2-ar2", "F is for /f/. /f/, /f/, fish. /f/, /f/, beef.", "F 发 /f/ 音。鱼，牛肉。"),
            s("g3up-u2-ar3", "G is for /ɡ/. /ɡ/, /ɡ/, girl. /ɡ/, /ɡ/, pig.", "G 发 /ɡ/ 音。女孩，猪。"),
            s("g3up-u2-ar4", "H is for /h/. /h/, /h/, hot. /h/, /h/, hat.", "H 发 /h/ 音。热的，帽子。"),
        ]),
        sec("g3up-u2-b-talk", "talk", "Let's talk", "💬", "B", sentences=[
            s("g3up-u2-bt1", "Sarah, you have a big family. Is this your sister?", "Sarah，你有一个大家庭。这是你姐姐吗？", "Chen Jie"),
            s("g3up-u2-bt2", "No, it's my cousin.", "不，这是我的堂妹。", "Sarah Miller"),
            s("g3up-u2-bt3", "Is that your brother?", "那是你弟弟吗？", "Chen Jie"),
            s("g3up-u2-bt4", "Yes, it is.", "是的。", "Sarah Miller"),
        ]),
        sec("g3up-u2-b-learn", "learn", "Let's learn", "🔤", "B",
            words=[
                w("uncle", "叔叔", "👨"), w("aunt", "姑姑", "👩"), w("cousin", "堂/表兄弟姐妹", "🧒"),
                w("baby sister", "小妹妹", "👶"), w("brother", "哥哥/弟弟", "👦"),
            ],
            sentences=[
                s("g3up-u2-bl1", "My family is big. I have a brother, a baby sister, a cousin ...", "我的家庭很大。我有一个弟弟、一个小妹妹、一个堂妹……", "Sarah Miller"),
            ]),
        sec("g3up-u2-b-chant", "chant", "Listen and chant", "🎵", "B", sentences=[
            s("g3up-u2-bc1", "I have an uncle. I have an aunt.", "我有一个叔叔。我有一个姑姑。"),
            s("g3up-u2-bc2", "I have two cousins too.", "我还有两个堂兄弟姐妹。"),
            s("g3up-u2-bc3", "I have a brother, And a baby sister.", "我有一个弟弟，还有一个小妹妹。"),
            s("g3up-u2-bc4", "They can play with me.", "他们可以和我一起玩。"),
        ]),
        sec("g3up-u2-b-read", "read", "Start to read", "📝", "B", sentences=[
            s("g3up-u2-br1", "This is my mum. And this is my dad.", "这是我的妈妈。这是我的爸爸。"),
            s("g3up-u2-br2", "This family is small. They love each other.", "这个家庭很小。他们彼此相爱。"),
            s("g3up-u2-br3", "This is my family.", "这是我的家人。"),
            s("g3up-u2-br4", "This family is big. They love each other too.", "这个家庭很大。他们也彼此相爱。"),
        ]),
        sec("g3up-u2-c-check", "check", "Self-check", "✅", "C", sentences=[
            s("g3up-u2-cc1", "I can introduce my family to others.", "我能向别人介绍我的家人。"),
            s("g3up-u2-cc2", "I can name different family members.", "我能说出不同的家庭成员。"),
            s("g3up-u2-cc3", "I can say how families are different.", "我能说出家庭有什么不同。"),
            s("g3up-u2-cc4", "I can read, write and say Ee, Ff, Gg and Hh.", "我能认读、书写并说 Ee、Ff、Gg 和 Hh。"),
        ]),
        sec("g3up-u2-c-story", "story", "Reading time", "📖", "C", sentences=[
            s("g3up-u2-cs1", "This is my family. I play with my brother. We share. We listen with care.", "这是我的家人。我和弟弟一起玩。我们分享。我们认真倾听。"),
            s("g3up-u2-cs2", "I have a small family. I love my small family.", "我有一个小家庭。我爱我的小家庭。"),
            s("g3up-u2-cs3", "This is my family. I play with my brothers. I share with my sisters.", "这是我的家人。我和弟弟们一起玩。我和妹妹们分享。"),
            s("g3up-u2-cs4", "I talk with my cousins. We listen with care.", "我和堂兄弟姐妹聊天。我们认真倾听。"),
            s("g3up-u2-cs5", "I have a big family. I love my big family.", "我有一个大家庭。我爱我的大家庭。"),
        ]),
    ],
}

# ── Unit 3 ──────────────────────────────────────────────────────────
U3 = {
    "title": "Unit 3 · Our animal friends",
    "subtitle": "宠物、野生动物、动物特点",
    "emoji": "🐼",
    "sections": [
        sec("g3up-u3-opening", "opening", "Unit 3 · 走进单元", "✨", sentences=[
            s("g3up-u3-op1", "How are animals different?", "动物有什么不同？"),
            s("g3up-u3-op2", "Whose hands are these?", "这是谁的手？"),
            s("g3up-u3-op3", "What animals do you know?", "你知道哪些动物？"),
        ]),
        sec("g3up-u3-a-chant", "chant", "Listen and chant", "🎵", "A", sentences=[
            s("g3up-u3-ac1", "So many animals, Big, tall and small.", "好多动物，大的、高的和小的。"),
            s("g3up-u3-ac2", "Pets and wild animals, We love them all.", "宠物和野生动物，我们都爱它们。"),
        ]),
        sec("g3up-u3-a-sing", "sing", "Listen and sing · Animal song", "🎤", "A", sentences=[
            s("g3up-u3-as1", "A dog says \"woof\". A cat says \"meow\".", "狗说「汪汪」。猫说「喵喵」。"),
            s("g3up-u3-as2", "I watch them run to the top of the hill, And then run down again.", "我看它们跑到山顶，再跑下来。"),
            s("g3up-u3-as3", "A lion says \"roar\". A tiger says \"growl\".", "狮子说「吼」。老虎说「Growl」。"),
        ]),
        sec("g3up-u3-a-talk", "talk", "Let's talk", "💬", "A", sentences=[
            s("g3up-u3-at1", "Good morning, Mike!", "早上好，Mike！", "Chen Jie"),
            s("g3up-u3-at2", "Good morning! Come in.", "早上好！请进。", "Mike Black"),
            s("g3up-u3-at3", "I like your dog.", "我喜欢你的狗。", "Chen Jie"),
            s("g3up-u3-at4", "Thanks. Do you have a pet?", "谢谢。你有宠物吗？", "Mike Black"),
            s("g3up-u3-at5", "No, I don't.", "不，我没有。", "Chen Jie"),
            s("g3up-u3-at6", "Yes, I do. I have a cat.", "是的，我有。我有一只猫。", "Mike Black"),
        ]),
        sec("g3up-u3-a-learn", "learn", "Let's learn", "🔤", "A",
            words=[
                w("fish", "鱼", "🐟"), w("cat", "猫", "🐱"), w("bird", "鸟", "🐦"),
                w("rabbit", "兔子", "🐰"), w("dog", "狗", "🐶"),
            ],
            sentences=[
                s("g3up-u3-al1", "I like fish.", "我喜欢鱼。", "Mike Black"),
                s("g3up-u3-al2", "I like cats.", "我喜欢猫。", "Sarah Miller"),
                s("g3up-u3-al3", "I like birds.", "我喜欢鸟。", "Chen Jie"),
                s("g3up-u3-al4", "I like rabbits.", "我喜欢兔子。", "Wu Binbin"),
                s("g3up-u3-al5", "I like my dog.", "我喜欢我的狗。", "Mike Black"),
            ]),
        sec("g3up-u3-a-do", "do", "Listen and do", "🙌", "A", sentences=[
            s("g3up-u3-ad1", "Run, run, run like a dog.", "跑啊跑，像狗一样跑。"),
            s("g3up-u3-ad2", "Sleep, sleep, sleep like a cat.", "睡啊睡，像猫一样睡。"),
            s("g3up-u3-ad3", "Sing, sing, sing like a bird.", "唱啊唱，像鸟一样唱。"),
            s("g3up-u3-ad4", "Hop, hop, hop like a rabbit.", "跳啊跳，像兔子一样跳。"),
            s("g3up-u3-ad5", "Swim, swim, swim like a fish.", "游啊游，像鱼一样游。"),
        ]),
        sec("g3up-u3-a-read", "read", "Letters and sounds · Ii–Ll", "🔤", "A", sentences=[
            s("g3up-u3-ar1", "I is for /ɪ/. /ɪ/, /ɪ/, ill. /ɪ/, /ɪ/, kid.", "I 发 /ɪ/ 音。生病的，小孩。"),
            s("g3up-u3-ar2", "J is for /ʤ/. /ʤ/, /ʤ/, job. /ʤ/, /ʤ/, jet.", "J 发 /ʤ/ 音。工作，喷气式飞机。"),
            s("g3up-u3-ar3", "K is for /k/. /k/, /k/, Kim. /k/, /k/, kite.", "K 发 /k/ 音。Kim，风筝。"),
            s("g3up-u3-ar4", "L is for /l/. /l/, /l/, leg. /l/, /l/, lion.", "L 发 /l/ 音。腿，狮子。"),
        ]),
        sec("g3up-u3-b-talk", "talk", "Let's talk", "💬", "B", sentences=[
            s("g3up-u3-bt1", "Let's go to the zoo!", "我们去动物园吧！", "Mike Black"),
            s("g3up-u3-bt2", "Great!", "太好了！", "Wu Binbin"),
            s("g3up-u3-bt3", "Look! What's this?", "看！这是什么？", "Mike Black"),
            s("g3up-u3-bt4", "It's a fox.", "是一只狐狸。", "Wu Binbin"),
            s("g3up-u3-bt5", "Miss White, what's that?", "怀特老师，那是什么？", "Chen Jie"),
            s("g3up-u3-bt6", "It's a red panda.", "是一只小熊猫。", "Miss White"),
            s("g3up-u3-bt7", "It's cute!", "好可爱！", "Sarah Miller"),
        ]),
        sec("g3up-u3-b-learn", "learn", "Let's learn", "🔤", "B",
            words=[
                w("panda", "大熊猫", "🐼"), w("elephant", "大象", "🐘"), w("monkey", "猴子", "🐒"),
                w("tiger", "老虎", "🐯"), w("lion", "狮子", "🦁"), w("fox", "狐狸", "🦊"),
            ],
            sentences=[
                s("g3up-u3-bl1", "It's a panda.", "是一只熊猫。", "Miss White"),
                s("g3up-u3-bl2", "It's an elephant.", "是一头大象。", "Miss White"),
                s("g3up-u3-bl3", "It's a monkey.", "是一只猴子。", "Miss White"),
                s("g3up-u3-bl4", "It's a tiger.", "是一只老虎。", "Miss White"),
                s("g3up-u3-bl5", "It's a lion.", "是一头狮子。", "Miss White"),
            ]),
        sec("g3up-u3-b-chant", "chant", "Listen and chant", "🎵", "B", sentences=[
            s("g3up-u3-bc1", "What's this? It's an elephant.", "这是什么？是一头大象。"),
            s("g3up-u3-bc2", "What's this? It's a monkey.", "这是什么？是一只猴子。"),
            s("g3up-u3-bc3", "What's this? It's a panda.", "这是什么？是一只熊猫。"),
            s("g3up-u3-bc4", "What's this? It's a lion!", "这是什么？是一头狮子！"),
            s("g3up-u3-bc5", "What's this? It's a tiger! Run!", "这是什么？是一只老虎！快跑！"),
        ]),
        sec("g3up-u3-b-read", "read", "Start to read", "📝", "B", sentences=[
            s("g3up-u3-br1", "The giraffe is tall!", "长颈鹿很高！"),
            s("g3up-u3-br2", "The lion is fast!", "狮子跑得很快！"),
            s("g3up-u3-br3", "The elephant is big!", "大象很大！"),
            s("g3up-u3-br4", "The fish is small!", "鱼很小！"),
            s("g3up-u3-br5", "I like fish!", "我喜欢鱼！", "Mike Black"),
        ]),
        sec("g3up-u3-c-check", "check", "Self-check", "✅", "C", sentences=[
            s("g3up-u3-cc1", "I can tell others about my pets.", "我能告诉别人我的宠物。"),
            s("g3up-u3-cc2", "I can talk about wild animals.", "我能谈论野生动物。"),
            s("g3up-u3-cc3", "I can group different animals.", "我能给不同的动物分类。"),
            s("g3up-u3-cc4", "I can read, write and say Ii, Jj, Kk and Ll.", "我能认读、书写并说 Ii、Jj、Kk 和 Ll。"),
        ]),
        sec("g3up-u3-c-story", "story", "Reading time", "📖", "C", sentences=[
            s("g3up-u3-cs1", "Fish are amazing. Are we amazing, Dad?", "鱼真神奇。我们神奇吗，爸爸？", "Little Fish"),
            s("g3up-u3-cs2", "Mum, what makes us great?", "妈妈，什么让我们很棒？", "Little Fish"),
            s("g3up-u3-cs3", "Yes. We're big.", "是的。我们很大。", "Dad"),
            s("g3up-u3-cs4", "We are big. But whale sharks are big too.", "我们很大。但鲸鲨也很大。", "Mum"),
            s("g3up-u3-cs5", "We're fast. But squids are fast too.", "我们很快。但鱿鱼也很快。", "Dad"),
            s("g3up-u3-cs6", "We can jump. But sea lions can jump too.", "我们会跳。但海狮也会跳。", "Mum"),
            s("g3up-u3-cs7", "We eat a lot. Pandas eat a lot too.", "我们吃很多。熊猫也吃很多。", "Dad"),
            s("g3up-u3-cs8", "I know! We sing! Our songs are special.", "我知道了！我们会唱歌！我们的歌很特别。", "Little Fish"),
            s("g3up-u3-cs9", "Yes! That is amazing!", "是的！太神奇了！", "Mum"),
        ]),
    ],
}

# ── Unit 4 ──────────────────────────────────────────────────────────
U4 = {
    "title": "Unit 4 · Plants around us",
    "subtitle": "水果、植物、人与自然",
    "emoji": "🌱",
    "sections": [
        sec("g3up-u4-opening", "opening", "Unit 4 · 走进单元", "✨", sentences=[
            s("g3up-u4-op1", "How do plants and people help each other?", "植物和人怎样互相帮助？"),
            s("g3up-u4-op2", "What plants do you see?", "你看到了什么植物？"),
            s("g3up-u4-op3", "What fruit do you like?", "你喜欢什么水果？"),
        ]),
        sec("g3up-u4-a-chant", "chant", "Listen and chant", "🎵", "A", sentences=[
            s("g3up-u4-ac1", "I see an apple. I see grapes.", "我看见一个苹果。我看见葡萄。"),
            s("g3up-u4-ac2", "I like fruit. Let's eat!", "我喜欢水果。我们吃吧！"),
            s("g3up-u4-ac3", "I have a garden. I have water.", "我有一个花园。我有水。"),
            s("g3up-u4-ac4", "I like apples. Let's grow an apple tree!", "我喜欢苹果。我们来种一棵苹果树吧！"),
        ]),
        sec("g3up-u4-a-sing", "sing", "Listen and sing · Plants and us", "🎤", "A", sentences=[
            s("g3up-u4-as1", "I can water my plants. I can give them sun.", "我能给植物浇水。我能给它们阳光。"),
            s("g3up-u4-as2", "I can help them grow. I help them grow alright!", "我能帮它们生长。我帮它们好好生长！"),
            s("g3up-u4-as3", "Plants can give me air. Plants can give me food.", "植物能给我空气。植物能给我食物。"),
            s("g3up-u4-as4", "Plants can help me grow, grow, grow.", "植物能帮我长大、长大、长大。"),
        ]),
        sec("g3up-u4-a-talk", "talk", "Let's talk", "💬", "A", sentences=[
            s("g3up-u4-at1", "Mike, do you like apples?", "Mike，你喜欢苹果吗？", "Sarah Miller"),
            s("g3up-u4-at2", "Yes, I do. And you?", "是的，我喜欢。你呢？", "Mike Black"),
            s("g3up-u4-at3", "No, I don't. I like bananas.", "不，我不喜欢。我喜欢香蕉。", "Sarah Miller"),
            s("g3up-u4-at4", "Do you like the farm?", "你喜欢农场吗？", "Miss White"),
            s("g3up-u4-at5", "Yes, Miss White. I like the fresh air.", "是的，怀特老师。我喜欢新鲜的空气。", "Mike Black"),
        ]),
        sec("g3up-u4-a-learn", "learn", "Let's learn", "🔤", "A",
            words=[
                w("apple", "苹果", "🍎"), w("banana", "香蕉", "🍌"),
                w("grape", "葡萄", "🍇"), w("orange", "橙子", "🍊"),
            ],
            sentences=[
                s("g3up-u4-al1", "Do you like apples?", "你喜欢苹果吗？", "Sarah Miller"),
                s("g3up-u4-al2", "No, I don't. I like bananas.", "不，我不喜欢。我喜欢香蕉。", "Mike Black"),
            ]),
        sec("g3up-u4-a-chant2", "chant", "Listen and chant · 水果", "🎵", "A", sentences=[
            s("g3up-u4-ac5", "Grapes are small. Bananas are long.", "葡萄小小的。香蕉长长的。"),
            s("g3up-u4-ac6", "Apples and oranges make you strong.", "苹果和橙子让你强壮。"),
            s("g3up-u4-ac7", "Trees grow and give us things:", "树木生长并给我们东西："),
            s("g3up-u4-ac8", "Fresh air, flowers and leaves in spring.", "春天的新鲜空气、花朵和树叶。"),
        ]),
        sec("g3up-u4-a-read", "read", "Letters and sounds · Mm–Pp", "🔤", "A", sentences=[
            s("g3up-u4-ar1", "M is for /m/. /m/, /m/, map. /m/, /m/, mum.", "M 发 /m/ 音。地图，妈妈。"),
            s("g3up-u4-ar2", "N is for /n/. /n/, /n/, new. /n/, /n/, fan.", "N 发 /n/ 音。新的，扇子。"),
            s("g3up-u4-ar3", "O is for /ɒ/. /ɒ/, /ɒ/, orange. /ɒ/, /ɒ/, fox.", "O 发 /ɒ/ 音。橙子，狐狸。"),
            s("g3up-u4-ar4", "P is for /p/. /p/, /p/, pen. /p/, /p/, cup.", "P 发 /p/ 音。钢笔，杯子。"),
        ]),
        sec("g3up-u4-b-talk", "talk", "Let's talk", "💬", "B", sentences=[
            s("g3up-u4-bt1", "The school gardens need help.", "学校花园需要帮助。", "Miss White"),
            s("g3up-u4-bt2", "We can water the flowers.", "我们可以浇花。", "Chen Jie"),
            s("g3up-u4-bt3", "We can water the grass.", "我们可以浇草。", "Wu Binbin"),
            s("g3up-u4-bt4", "Nice. And?", "很好。还有呢？", "Miss White"),
            s("g3up-u4-bt5", "We can plant new trees.", "我们可以种新树。", "Mike Black"),
        ]),
        sec("g3up-u4-b-learn", "learn", "Let's learn", "🔤", "B",
            words=[
                w("sun", "阳光", "☀️"), w("air", "空气", "💨"), w("water", "水", "💧"),
                w("tree", "树", "🌳"), w("flower", "花", "🌸"), w("grass", "草", "🌿"),
            ],
            sentences=[
                s("g3up-u4-bl1", "Plants need air, water and sun.", "植物需要空气、水和阳光。"),
            ]),
        sec("g3up-u4-b-chant", "chant", "Listen and chant", "🎵", "B", sentences=[
            s("g3up-u4-bc1", "Air, water and sun. These can all help plants grow.", "空气、水和阳光。这些都能帮助植物生长。"),
            s("g3up-u4-bc2", "Plant, water, cut and turn. These are some things I know.", "种植、浇水、修剪和翻土。这些是我知道的一些事情。"),
        ]),
        sec("g3up-u4-b-read", "read", "Start to read", "📝", "B", sentences=[
            s("g3up-u4-br1", "Plants can give us many things. We need plants.", "植物能给我们很多东西。我们需要植物。"),
            s("g3up-u4-br2", "Plants need air, water and sun. Can we help them?", "植物需要空气、水和阳光。我们能帮助它们吗？"),
            s("g3up-u4-br3", "Flowers need air, water and sun.", "花朵需要空气、水和阳光。"),
            s("g3up-u4-br4", "We can help them. We can ...", "我们能帮助它们。我们可以……"),
        ]),
        sec("g3up-u4-c-check", "check", "Self-check", "✅", "C", sentences=[
            s("g3up-u4-cc1", "I can ask about fruit and say the fruit I like.", "我能询问水果并说出我喜欢的水果。"),
            s("g3up-u4-cc2", "I can name some plants and talk about how they grow.", "我能说出一些植物并谈论它们怎样生长。"),
            s("g3up-u4-cc3", "I can say how we help plants and plants help us.", "我能说出我们怎样帮助植物，植物怎样帮助我们。"),
            s("g3up-u4-cc4", "I can read, write and say Mm, Nn, Oo and Pp.", "我能认读、书写并说 Mm、Nn、Oo 和 Pp。"),
        ]),
        sec("g3up-u4-c-story", "story", "Reading time", "📖", "C", sentences=[
            s("g3up-u4-cs1", "I am an apple tree. My new family help me.", "我是一棵苹果树。我的新家人帮助我。", "Apple Tree"),
            s("g3up-u4-cs2", "I need air, water and sun. My family water me.", "我需要空气、水和阳光。我的家人给我浇水。"),
            s("g3up-u4-cs3", "It is cold. They help me.", "天冷了。他们帮助我。"),
            s("g3up-u4-cs4", "My family like me. I love the fresh air.", "我的家人喜欢我。我喜欢新鲜的空气。"),
            s("g3up-u4-cs5", "The flowers are so beautiful!", "花儿真漂亮！"),
            s("g3up-u4-cs6", "I am big now. I give apples to my family. We are all happy!", "我现在长大了。我把苹果给我的家人。我们都很开心！"),
        ]),
    ],
}

# ── Unit 5 ──────────────────────────────────────────────────────────
U5 = {
    "title": "Unit 5 · The colourful world",
    "subtitle": "颜色、混色、色彩的意义",
    "emoji": "🎨",
    "sections": [
        sec("g3up-u5-opening", "opening", "Unit 5 · 走进单元", "✨", sentences=[
            s("g3up-u5-op1", "Why are colours important?", "颜色为什么重要？"),
            s("g3up-u5-op2", "What colours do you see?", "你看到了什么颜色？"),
            s("g3up-u5-op3", "What colours do you like?", "你喜欢什么颜色？"),
        ]),
        sec("g3up-u5-a-chant", "chant", "Listen and chant", "🎵", "A", sentences=[
            s("g3up-u5-ac1", "The sun is orange. Grass is green.", "太阳是橙色的。草是绿色的。"),
            s("g3up-u5-ac2", "What about the sky and sea?", "天空和大海呢？"),
            s("g3up-u5-ac3", "Roses are red. Snow is white.", "玫瑰是红色的。雪是白色的。"),
            s("g3up-u5-ac4", "Please, please tell me why!", "请告诉我为什么！"),
        ]),
        sec("g3up-u5-a-sing", "sing", "Listen and sing · Colour song", "🎤", "A", sentences=[
            s("g3up-u5-as1", "Red and orange and yellow and green,", "红色、橙色、黄色和绿色，"),
            s("g3up-u5-as2", "Purple and then I see blue.", "紫色，然后我看见蓝色。"),
            s("g3up-u5-as3", "I can see a rainbow, see a rainbow.", "我能看见彩虹，看见彩虹。"),
            s("g3up-u5-as4", "Can you see one too?", "你也能看见吗？"),
        ]),
        sec("g3up-u5-a-talk", "talk", "Let's talk", "💬", "A", sentences=[
            s("g3up-u5-at1", "What colour is it?", "它是什么颜色？", "Sarah Miller"),
            s("g3up-u5-at2", "It's green.", "是绿色的。", "Chen Jie"),
            s("g3up-u5-at3", "Look! Red and blue make purple.", "看！红色和蓝色变成紫色。", "Sarah Miller"),
            s("g3up-u5-at4", "It's orange.", "是橙色的。", "Chen Jie"),
            s("g3up-u5-at5", "Wow!", "哇！", "Sarah Miller"),
        ]),
        sec("g3up-u5-a-learn", "learn", "Let's learn", "🔤", "A",
            words=[
                w("yellow duck", "黄色的鸭子", "🦆"), w("brown bear", "棕色的熊", "🐻"),
                w("green grass", "绿色的草", "🌿"), w("purple flower", "紫色的花", "💜"),
                w("blue sea", "蓝色的大海", "🌊"),
            ],
            sentences=[
                s("g3up-u5-al1", "I see colours here and there.", "我到处看见颜色。"),
            ]),
        sec("g3up-u5-a-chant2", "chant", "Listen and chant · 颜色", "🎵", "A", sentences=[
            s("g3up-u5-ac5", "Purple flowers, green grass and blue sea.", "紫色的花、绿色的草和蓝色的大海。"),
            s("g3up-u5-ac6", "A big brown bear. What else can you see?", "一只棕色的大熊。你还能看见什么？"),
        ]),
        sec("g3up-u5-a-read", "read", "Letters and sounds · Qq–Uu", "🔤", "A", sentences=[
            s("g3up-u5-ar1", "Q goes with u, /kw/, /kw/, quiet. /kw/, /kw/, queen.", "Q 和 u 一起，安静的，女王。"),
            s("g3up-u5-ar2", "R is for /r/. /r/, /r/, red. /r/, /r/, ruler.", "R 发 /r/ 音。红色的，尺子。"),
            s("g3up-u5-ar3", "S is for /s/. /s/, /s/, see. /s/, /s/, bus.", "S 发 /s/ 音。看见，公共汽车。"),
            s("g3up-u5-ar4", "T is for /t/. /t/, /t/, Ted. /t/, /t/, sit.", "T 发 /t/ 音。Ted，坐下。"),
            s("g3up-u5-ar5", "U is for /ʌ/. /ʌ/, /ʌ/, up. /ʌ/, /ʌ/, run.", "U 发 /ʌ/ 音。起来，跑。"),
        ]),
        sec("g3up-u5-b-talk", "talk", "Let's talk", "💬", "B", sentences=[
            s("g3up-u5-bt1", "What colours do you like?", "你喜欢什么颜色？", "Chen Jie"),
            s("g3up-u5-bt2", "I like red and pink.", "我喜欢红色和粉色。", "Sarah Miller"),
            s("g3up-u5-bt3", "OK. Let's draw some red and pink flowers.", "好的。我们来画一些红色和粉色的花。", "Chen Jie"),
            s("g3up-u5-bt4", "And the birds?", "鸟呢？", "Sarah Miller"),
            s("g3up-u5-bt5", "Let's draw some purple and brown birds.", "我们来画一些紫色和棕色的鸟。", "Chen Jie"),
        ]),
        sec("g3up-u5-b-learn", "learn", "Let's learn", "🔤", "B",
            words=[
                w("pink", "粉色", "🩷"), w("orange", "橙色", "🟠"), w("red", "红色", "🔴"),
                w("white", "白色", "⚪"), w("black", "黑色", "⚫"),
            ],
            sentences=[]),
        sec("g3up-u5-b-do", "do", "Listen and do", "🙌", "B", sentences=[
            s("g3up-u5-bd1", "Black, black, sit down.", "黑色，黑色，坐下。"),
            s("g3up-u5-bd2", "White, white, turn around.", "白色，白色，转一圈。"),
            s("g3up-u5-bd3", "Pink and red, touch the ground.", "粉色和红色，摸摸地面。"),
            s("g3up-u5-bd4", "Orange and red, jump up and down.", "橙色和红色，上下跳。"),
        ]),
        sec("g3up-u5-b-read", "read", "Start to read", "📝", "B", sentences=[
            s("g3up-u5-br1", "It's red. Red can say \"No!\"", "是红色的。红色表示「不行！」"),
            s("g3up-u5-br2", "It's green. Green can say \"Go!\"", "是绿色的。绿色表示「走！」"),
            s("g3up-u5-br3", "It's blue. Blue can say \"Use again!\"", "是蓝色的。蓝色表示「再利用！」"),
            s("g3up-u5-br4", "It's yellow. Yellow can say \"Be careful!\"", "是黄色的。黄色表示「小心！」"),
        ]),
        sec("g3up-u5-c-check", "check", "Self-check", "✅", "C", sentences=[
            s("g3up-u5-cc1", "I can tell others about the colours I see and like.", "我能告诉别人我看见和喜欢的颜色。"),
            s("g3up-u5-cc2", "I can tell the colour of things.", "我能说出东西的颜色。"),
            s("g3up-u5-cc3", "I can talk about what colours mean.", "我能谈论颜色的含义。"),
            s("g3up-u5-cc4", "I can read, write and say Qq, Rr, Ss, Tt and Uu.", "我能认读、书写并说 Qq、Rr、Ss、Tt 和 Uu。"),
        ]),
        sec("g3up-u5-c-story", "story", "Reading time", "📖", "C", sentences=[
            s("g3up-u5-cs1", "I am a sunflower. I am tall and green.", "我是一朵向日葵。我又高又绿。", "Sunflower"),
            s("g3up-u5-cs2", "Then I am green and yellow.", "然后我变得又绿又黄。"),
            s("g3up-u5-cs3", "Now I am a big yellow flower. Bees come. They are yellow and black.", "现在我是一朵大大的黄花。蜜蜂来了。它们是黄黑相间的。"),
            s("g3up-u5-cs4", "I give them food.", "我给它们食物。"),
            s("g3up-u5-cs5", "Now it is cold. I am green and brown.", "现在天冷了。我又绿又棕。"),
            s("g3up-u5-cs6", "I am gone. But my children grow.", "我消失了。但我的孩子们长大了。"),
        ]),
    ],
}

# Fix U5 b-learn empty sentences - remove empty or add one
U5["sections"][9]["sentences"] = [
    s("g3up-u5-bl1", "I like red and pink.", "我喜欢红色和粉色。", "Sarah Miller"),
]

# ── Unit 6 ──────────────────────────────────────────────────────────
U6 = {
    "title": "Unit 6 · Useful numbers",
    "subtitle": "数字、年龄、购物",
    "emoji": "🔢",
    "sections": [
        sec("g3up-u6-opening", "opening", "Unit 6 · 走进单元", "✨", sentences=[
            s("g3up-u6-op1", "Why are numbers important?", "数字为什么重要？"),
            s("g3up-u6-op2", "What numbers do you see?", "你看见了什么数字？"),
            s("g3up-u6-op3", "Where do you see numbers?", "你在哪里看见数字？"),
        ]),
        sec("g3up-u6-a-chant", "chant", "Listen and chant", "🎵", "A", sentences=[
            s("g3up-u6-ac1", "One boy, two boys, Three boys, four!", "一个男孩，两个男孩，三个男孩，四个！"),
            s("g3up-u6-ac2", "Five boys, six boys, Seven boys, more!", "五个男孩，六个男孩，七个男孩，还有更多！"),
        ]),
        sec("g3up-u6-a-sing", "sing", "Listen and sing · Numbers", "🎤", "A", sentences=[
            s("g3up-u6-as1", "How old are you, my friend?", "你几岁了，我的朋友？"),
            s("g3up-u6-as2", "I can count up from one to ten.", "我能从一数到十。"),
            s("g3up-u6-as3", "How old are you, my friend?", "你几岁了，我的朋友？"),
            s("g3up-u6-as4", "I can count back again.", "我能再倒着数。"),
            s("g3up-u6-as5", "How can numbers help us out?", "数字怎样帮助我们？"),
            s("g3up-u6-as6", "We can sort and solve and count.", "我们能分类、解决问题和数数。"),
        ]),
        sec("g3up-u6-a-talk", "talk", "Let's talk", "💬", "A", sentences=[
            s("g3up-u6-at1", "Binbin, this is my brother, Sam.", "斌斌，这是我弟弟 Sam。", "Xinxin"),
            s("g3up-u6-at2", "Hi, Sam! This is my sister, Xinxin.", "嗨，Sam！这是我妹妹欣欣。", "Wu Binbin"),
            s("g3up-u6-at3", "Hello, Xinxin! Hi, Sam!", "你好，欣欣！嗨，Sam！", "Sam"),
            s("g3up-u6-at4", "How old are you?", "你几岁了？", "Wu Binbin"),
            s("g3up-u6-at5", "I'm five years old.", "我五岁了。", "Sam"),
            s("g3up-u6-at6", "Me too.", "我也是。", "Xinxin"),
        ]),
        sec("g3up-u6-a-learn", "learn", "Let's learn", "🔤", "A",
            words=[
                w("one", "一", "1️⃣"), w("two", "二", "2️⃣"), w("three", "三", "3️⃣"),
                w("four", "四", "4️⃣"), w("five", "五", "5️⃣"),
            ],
            sentences=[
                s("g3up-u6-al1", "Jump! Jump! Jump! One, two, three!", "跳！跳！跳！一、二、三！"),
            ]),
        sec("g3up-u6-a-chant2", "chant", "Listen and chant · 数字", "🎵", "A", sentences=[
            s("g3up-u6-ac3", "Jump! Jump! Jump! Three, two, one!", "跳！跳！跳！三、二、一！"),
            s("g3up-u6-ac4", "Four and five! Four and five!", "四和五！四和五！"),
            s("g3up-u6-ac5", "Jump up high! Jump up high!", "高高跳！高高跳！"),
            s("g3up-u6-ac6", "Five! Four! Three, two, one! Jump! Jump! It's such fun!", "五！四！三、二、一！跳！跳！真好玩！"),
        ]),
        sec("g3up-u6-a-read", "read", "Letters and sounds · Vv–Zz", "🔤", "A", sentences=[
            s("g3up-u6-ar1", "V is for /v/. /v/, /v/, van. /v/, /v/, vet.", "V 发 /v/ 音。货车，兽医。"),
            s("g3up-u6-ar2", "W is for /w/. /w/, /w/, we. /w/, /w/, win.", "W 发 /w/ 音。我们，赢。"),
            s("g3up-u6-ar3", "X is for /ks/. /ks/, /ks/, box. /ks/, /ks/, six.", "X 发 /ks/ 音。盒子，六。"),
            s("g3up-u6-ar4", "Y is for /j/. /j/, /j/, yellow. /j/, /j/, yo-yo.", "Y 发 /j/ 音。黄色的，溜溜球。"),
            s("g3up-u6-ar5", "Z is for /z/. /z/, /z/, Zip. /z/, /z/, quiz.", "Z 发 /z/ 音。Zip，测验。"),
        ]),
        sec("g3up-u6-b-talk", "talk", "Let's talk", "💬", "B", sentences=[
            s("g3up-u6-bt1", "How many apples?", "有多少个苹果？", "Sarah Miller"),
            s("g3up-u6-bt2", "Two.", "两个。", "Chen Jie"),
            s("g3up-u6-bt3", "How many bananas?", "有多少根香蕉？", "Sarah Miller"),
            s("g3up-u6-bt4", "Three. And one orange.", "三根。还有一个橙子。", "Chen Jie"),
            s("g3up-u6-bt5", "OK. I have ten yuan.", "好的。我有十元。", "Sarah Miller"),
            s("g3up-u6-bt6", "I have six yuan.", "我有六元。", "Chen Jie"),
            s("g3up-u6-bt7", "Great! Let's go to the shop!", "太好了！我们去商店吧！", "Sarah Miller"),
        ]),
        sec("g3up-u6-b-learn", "learn", "Let's learn", "🔤", "B",
            words=[
                w("six", "六", "6️⃣"), w("seven", "七", "7️⃣"), w("eight", "八", "8️⃣"),
                w("nine", "九", "9️⃣"), w("ten", "十", "🔟"),
            ],
            sentences=[
                s("g3up-u6-bl1", "That's ten yuan, please.", "请付十元。", "Shopkeeper"),
                s("g3up-u6-bl2", "Here you are.", "给你。", "Chen Jie"),
            ]),
        sec("g3up-u6-b-chant", "chant", "Listen and chant", "🎵", "B", sentences=[
            s("g3up-u6-bc1", "One head, two legs, ten toes. I am a child.", "一个头，两条腿，十个脚趾。我是一个孩子。"),
            s("g3up-u6-bc2", "One head, eight eyes, eight legs. I am a spider.", "一个头，八只眼睛，八条腿。我是一只蜘蛛。"),
            s("g3up-u6-bc3", "One head, four wings, six legs. I am a bee.", "一个头，四只翅膀，六条腿。我是一只蜜蜂。"),
        ]),
        sec("g3up-u6-b-read", "read", "Start to read", "📝", "B", sentences=[
            s("g3up-u6-br1", "It's seven o'clock. Hurry!", "七点了。快点！"),
            s("g3up-u6-br2", "Happy birthday!", "生日快乐！"),
            s("g3up-u6-br3", "Three cuts. Let's eat!", "切三刀。我们吃吧！"),
            s("g3up-u6-br4", "One orange, two apples and three bananas.", "一个橙子、两个苹果和三根香蕉。"),
            s("g3up-u6-br5", "Dogs don't eat cake, Sam!", "狗不吃蛋糕，Sam！", "Xinxin"),
            s("g3up-u6-br6", "Oh, one more cut for the dog.", "哦，再给狗切一块。", "Sam"),
        ]),
        sec("g3up-u6-c-check", "check", "Self-check", "✅", "C", sentences=[
            s("g3up-u6-cc1", "I can ask about age and number.", "我能询问年龄和数量。"),
            s("g3up-u6-cc2", "I can count things with the numbers 1 to 10.", "我能用一到十数数。"),
            s("g3up-u6-cc3", "I can use the numbers 1 to 10 in different places.", "我能在不同场合使用一到十。"),
            s("g3up-u6-cc4", "I can read, write and say Vv, Ww, Xx, Yy and Zz.", "我能认读、书写并说 Vv、Ww、Xx、Yy 和 Zz。"),
        ]),
        sec("g3up-u6-c-story", "story", "Reading time", "📖", "C", sentences=[
            s("g3up-u6-cs1", "How many cards?", "有多少张卡片？", "Teacher"),
            s("g3up-u6-cs2", "Six.", "六张。", "Student"),
            s("g3up-u6-cs3", "What's this?", "这是什么？", "Teacher"),
            s("g3up-u6-cs4", "Six.", "六。", "Student"),
            s("g3up-u6-cs5", "Right.", "对了。", "Teacher"),
            s("g3up-u6-cs6", "What's this? Hmm, six?", "这是什么？嗯，六？", "Teacher"),
            s("g3up-u6-cs7", "You're right again.", "你又对了。", "Teacher"),
            s("g3up-u6-cs8", "It's six in Chinese.", "这是中文的「六」。", "Teacher"),
            s("g3up-u6-cs9", "What about this? I don't know.", "这个呢？我不知道。", "Student"),
            s("g3up-u6-cs10", "This is six too. It's a Jiaguwen number.", "这也是六。这是甲骨文数字。", "Teacher"),
            s("g3up-u6-cs11", "Jiaguwen is over 3,000 years old!", "甲骨文有三千多年的历史了！", "Teacher"),
            s("g3up-u6-cs12", "Wow!", "哇！", "Student"),
        ]),
    ],
}

UNITS = [
    ("g3up-u1", "g3up_u1", U1),
    ("g3up-u2", "g3up_u2", U2),
    ("g3up-u3", "g3up_u3", U3),
    ("g3up-u4", "g3up_u4", U4),
    ("g3up-u5", "g3up_u5", U5),
    ("g3up-u6", "g3up_u6", U6),
]

PLACEHOLDER_BOOKS = [
    ("pep-g3down", "PEP 英语 · 三年级下册", "📗", [
        (1, "Meeting new people"), (2, "Expressing yourself"), (3, "Learning better"),
        (4, "Healthy food"), (5, "Old toys"), (6, "Numbers in life"),
    ]),
    ("pep-g4up", "PEP 英语 · 四年级上册", "📙", [
        (1, "Helping at home"), (2, "My friends"), (3, "Places we live in"),
        (4, "Helping in the community"), (5, "The weather and us"), (6, "Changing for the seasons"),
    ]),
    ("pep-g4down", "PEP 英语 · 四年级下册", "📒", [
        (1, "My school"), (2, "What time is it?"), (3, "Weather"),
        (4, "At the farm"), (5, "My clothes"), (6, "Shopping"),
    ]),
    ("pep-g5up", "PEP 英语 · 五年级上册", "📕", [
        (1, "Different friends"), (2, "My community"), (3, "My favourite season"),
        (4, "Planting trees is good for us"), (5, "There is a big bed"), (6, "In a nature park"),
    ]),
    ("pep-g5down", "PEP 英语 · 五年级下册", "📓", [
        (1, "Meeting new people"), (2, "My favourite season"), (3, "My school calendar"),
        (4, "When is the art show?"), (5, "Whose dog is it?"), (6, "Work quietly!"),
    ]),
    ("pep-g6up", "PEP 英语 · 六年级上册", "📔", [
        (1, "How do you feel?"), (2, "Ways to be healthy"), (3, "Interesting jobs"),
        (4, "Helping the community"), (5, "Save the animals"), (6, "Review"),
    ]),
    ("pep-g6down", "PEP 英语 · 六年级下册", "📰", [
        (1, "Visiting Canada"), (2, "Chinese festivals"), (3, "Summer activities"),
        (4, "Then and now"), (5, "Going shopping"), (6, "Farewell"),
    ]),
]

parts = [HEADER]
for uid, cname, unit in UNITS:
    parts.append(fmt_unit(uid, cname, unit))
    parts.append("")

parts.append("const placeholderUnit = (id: string, n: number, title: string, emoji: string): TextbookUnit => ({")
parts.append("  id, emoji, title: `Unit ${n} · ${title}`,")
parts.append("  subtitle: '内容即将上线',")
parts.append("  sections: [],")
parts.append("})")
parts.append("")

parts.append("const placeholderBook = (id: string, title: string, emoji: string, units: [number, string][]): TextbookBook => ({")
parts.append("  id, title, subtitle: '内容即将上线', emoji,")
parts.append("  units: units.map(([n, t]) => placeholderUnit(`${id}-u${n}`, n, t, '📖')),")
parts.append("})")
parts.append("")

parts.append("export const TEXTBOOK_BOOKS: TextbookBook[] = [")
parts.append("  {")
parts.append("    id: 'pep-g3up',")
parts.append("    title: 'PEP 英语 · 三年级上册',")
parts.append("    subtitle: '人教版 PEP（2024）',")
parts.append("    emoji: '📘',")
parts.append("    units: [g3up_u1, g3up_u2, g3up_u3, g3up_u4, g3up_u5, g3up_u6],")
parts.append("  },")

for bid, btitle, bemoji, bunits in PLACEHOLDER_BOOKS:
    unit_str = ", ".join(f"[{n}, '{t}']" for n, t in bunits)
    parts.append(f"  placeholderBook('{bid}', '{btitle}', '{bemoji}', [{unit_str}]),")

parts.append("]")
parts.append("")

OUT.write_text("\n".join(parts), encoding="utf-8")

# Stats
total_sections = sum(len(u["sections"]) for _, _, u in UNITS)
total_sentences = 0
total_words = 0
for _, _, u in UNITS:
    for sec_item in u["sections"]:
        total_sentences += len(sec_item.get("sentences") or [])
        total_words += len(sec_item.get("words") or [])

print(f"Wrote {OUT}")
print(f"Units: 6, Sections: {total_sections}, Sentences: {total_sentences}, Words: {total_words}")