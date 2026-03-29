// PEP三年级上册 Unit 3 Part B《Let's learn / Let's talk》题库
// 主题：身体部位2 (body, leg, arm, hand, foot) + Let's play. / Very well, thanks.
// 7种题型，每种5题，共35题

export const quizBankG3U3b = [
  { question: "How are you? Very ___, thanks.", chinese: "你好吗？我很好，谢谢。", options: ["well", "good", "fine", "nice"], correct: 0, explanation: "Very well (很好) 也是常见的回答用语。", tag: "交际" },
  { question: "Let's ___.", chinese: "让我们一起玩吧。", options: ["play", "playing", "plays", "played"], correct: 0, explanation: "Let's 后面接动词原形 play。", tag: "语法" },
  { question: "Clap your ___.", chinese: "拍拍你的手。", options: ["hands", "arms", "legs", "feet"], correct: 0, explanation: "clap hands 拍手。", tag: "搭配" },
  { question: "Wave your ___.", chinese: "挥挥你的手臂。", options: ["arms", "legs", "eyes", "ears"], correct: 0, explanation: "wave arms 挥舞手臂。", tag: "固定搭配" },
  { question: "Stamp your ___.", chinese: "跺跺你的脚。", options: ["foot", "feet", "hand", "hands"], correct: 1, explanation: "stamp feet 跺脚。foot的复数是feet。", tag: "不规则复数" }
]

export const fillblankBankG3U3b = [
  { sentence: "Very ___(好), thanks.", answer: "well", chinese: "很好，谢谢。", explanation: "Very well 很好。", tag: "交际" },
  { sentence: "Let's ___ (玩).", answer: "play", chinese: "让我们一起玩。", explanation: "play 玩", tag: "动词" },
  { sentence: "Stamp your ___ (脚, 复数).", answer: "feet", chinese: "跺跺你的双脚。", explanation: "foot 的复数是 feet。", tag: "拼写" },
  { sentence: "Clap your ___ (手, 复数).", answer: "hands", chinese: "拍拍你的双手。", explanation: "hand的复数 hands。", tag: "名词" },
  { sentence: "Shake your ___ (身体).", answer: "body", chinese: "摇摇你的身体。", explanation: "body 身体。", tag: "词汇" }
]

export const listenWordBankG3U3b = [
  { word: "body", options: ["boy", "body", "boat", "box"], correct: 1, zh: "身体" },
  { word: "leg", options: ["let", "leg", "log", "lake"], correct: 1, zh: "腿" },
  { word: "arm", options: ["art", "arm", "are", "aim"], correct: 1, zh: "胳膊/手臂" },
  { word: "hand", options: ["head", "hand", "hard", "hat"], correct: 1, zh: "手" },
  { word: "foot", options: ["food", "foot", "feet", "front"], correct: 1, zh: "脚 (单数)" }
]

export const listenSentenceBankG3U3b = [
  { sentence: "Very well, thanks.", zh: "很好，谢谢。", options: ["I'm fine, thanks.", "Very well, thanks.", "How are you?", "Great, thanks."], correct: 1 },
  { sentence: "Let's play.", zh: "我们一起玩吧。", options: ["Let's go.", "Let's talk.", "Let's see.", "Let's play."], correct: 3 },
  { sentence: "Clap your hands.", zh: "拍拍你的手。", options: ["Wave your arms.", "Clap your hands.", "Stamp your foot.", "Shake your body."], correct: 1 },
  { sentence: "Wave your arms.", zh: "挥挥你的手臂。", options: ["Wave your arms.", "Wave your hand.", "Clap your hands.", "Shake your body."], correct: 0 },
  { sentence: "Stamp your foot.", zh: "跺跺脚。", options: ["Stamp your foot.", "Stamp your feet.", "Shake your legs.", "Clap your hands."], correct: 0 }
]

export const listenOrderBankG3U3b = [
  { sentence: "Very well, thanks.", zh: "非常好，谢谢。", words: ["Very", "well,", "thanks."], answer: ["Very", "well,", "thanks."] },
  { sentence: "Let's play.", zh: "让我们玩吧。", words: ["Let's", "play."], answer: ["Let's", "play."] },
  { sentence: "Clap your hands.", zh: "拍拍你的手。", words: ["Clap", "your", "hands."], answer: ["Clap", "your", "hands."] },
  { sentence: "Wave your arms.", zh: "挥挥你的手臂。", words: ["Wave", "your", "arms."], answer: ["Wave", "your", "arms."] },
  { sentence: "Shake your body.", zh: "摇摇你的身体。", words: ["Shake", "your", "body."], answer: ["Shake", "your", "body."] }
]

export const listenResponseBankG3U3b = [
  { question: "How are you?", zh: "你好吗？", options: ["Very well, thanks.", "Hello.", "Me too.", "Goodbye."], correct: 0 },
  { question: "Let's play.", zh: "让我们玩电脑游戏。", options: ["Great!", "Thank you.", "No.", "Hello."], correct: 0 },
  { question: "Clap your hands.", zh: "拍拍手。", options: ["OK.", "Hello.", "Thank you.", "It's an arm."], correct: 0 },
  { question: "Stamp your foot.", zh: "跺跺脚。", options: ["OK.", "Hello.", "I'm fine.", "Yes."], correct: 0 },
  { question: "Touch your head.", zh: "摸摸你的头。", options: ["OK.", "Thank you.", "Hello.", "Very well."], correct: 0 }
]

export const listenTranslateBankG3U3b = [
  { sentence: "Very well, thanks.", options: ["我很好，谢谢。", "非常好，谢谢。", "再见，谢谢。", "不用谢。"], correct: 1 },
  { sentence: "Let's play.", options: ["让我们去上学。", "让我们涂色。", "让我们玩吧。", "让我们回家吧。"], correct: 2 },
  { sentence: "Clap your hands.", options: ["拍拍你的手。", "挥挥你的手臂。", "跺跺脚。", "转个圈。"], correct: 0 },
  { sentence: "Wave your arms.", options: ["跺跺双脚。", "摇摇身体。", "挥挥你的手臂。", "拍手。"], correct: 2 },
  { sentence: "Stamp your foot.", options: ["坐下。", "把书包放下。", "起立。", "跺跺你的脚。"], correct: 3 }
]
