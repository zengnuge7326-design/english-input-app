// PEP三年级上册 Unit 2 Part B《Let's learn / Let's talk》题库
// 主题：颜色延伸 (black, white, orange, brown) + Colour it brown.
// 7种题型，每种5题，共35题

export const quizBankG3U2b = [
  { question: "Good afternoon, ___.", chinese: "下午好，吴斌斌。", options: ["am", "morning", "afternoon", "Wu Binbin"], correct: 3, explanation: "打完招呼后跟人名。", tag: "交际" },
  { question: "___ it brown.", chinese: "把它涂成棕色。", options: ["Colour", "Show", "See", "Look"], correct: 0, explanation: "Colour it... 表示“把...涂色”。", tag: "词汇" },
  { question: "Stand ___.", chinese: "起立。", options: ["down", "up", "in", "on"], correct: 1, explanation: "Stand up 是“起立”。", tag: "短语" },
  { question: "Sit ___.", chinese: "坐下。", options: ["up", "on", "in", "down"], correct: 3, explanation: "Sit down 是“坐下”。", tag: "短语" },
  { question: "___ around.", chinese: "转个圈。", options: ["Sit", "Stand", "Turn", "Touch"], correct: 2, explanation: "Turn around 是“转身/转圈”。", tag: "短语" }
]

export const fillblankBankG3U2b = [
  { sentence: "___ (把...涂成) it brown.", answer: "Colour", chinese: "把它涂成棕色。", explanation: "Colour 动词：涂色。首字母大写。", tag: "词汇" },
  { sentence: "I see ___ (黑色的).", answer: "black", chinese: "我看见了黑色。", explanation: "black 黑色。", tag: "词汇" },
  { sentence: "I see ___ (白色的).", answer: "white", chinese: "我看见了白色。", explanation: "white 白色。", tag: "词汇" },
  { sentence: "I see ___ (橙色的).", answer: "orange", chinese: "我看见了橙色。", explanation: "orange 橙色。", tag: "词汇" },
  { sentence: "Good ___ (下午).", answer: "afternoon", chinese: "下午好。", explanation: "afternoon 下午。", tag: "交际" }
]

export const listenWordBankG3U2b = [
  { word: "black", options: ["back", "black", "block", "blank"], correct: 1, zh: "黑色的" },
  { word: "white", options: ["what", "write", "white", "wait"], correct: 2, zh: "白色的" },
  { word: "orange", options: ["arrange", "orange", "organ", "origin"], correct: 1, zh: "橙色的 / 橘子" },
  { word: "brown", options: ["down", "crown", "brown", "broom"], correct: 2, zh: "棕色的" },
  { word: "colour", options: ["car", "cover", "column", "colour"], correct: 3, zh: "涂色 / 颜色" }
]

export const listenSentenceBankG3U2b = [
  { sentence: "Colour it brown.", zh: "把它涂成棕色。", options: ["Colour it black.", "Colour it white.", "Colour it brown.", "Colour it orange."], correct: 2 },
  { sentence: "Good afternoon.", zh: "下午好。", options: ["Good morning.", "Goodbye.", "Good afternoon.", "Good night."], correct: 2 },
  { sentence: "Stand up.", zh: "起立。", options: ["Sit down.", "Stand up.", "Turn around.", "Touch the ground."], correct: 1 },
  { sentence: "Sit down.", zh: "坐下。", options: ["Stand up.", "Sit down.", "Touch your head.", "Turn around."], correct: 1 },
  { sentence: "Black, black. Stand up.", zh: "黑色黑色。起立。", options: ["White, white. Sit down.", "Black, black. Stand up.", "Brown, brown. Turn around.", "Orange, orange. Touch the ground."], correct: 1 }
]

export const listenOrderBankG3U2b = [
  { sentence: "Colour it brown.", zh: "把它涂成棕色。", words: ["Colour", "it", "brown."], answer: ["Colour", "it", "brown."] },
  { sentence: "Good afternoon, Wu Binbin.", zh: "下午好，吴斌斌。", words: ["Good", "afternoon,", "Wu", "Binbin."], answer: ["Good", "afternoon,", "Wu", "Binbin."] },
  { sentence: "I see black and white.", zh: "我看见了黑色和白色。", words: ["I", "see", "black", "and", "white."], answer: ["I", "see", "black", "and", "white."] },
  { sentence: "Stand up, please.", zh: "请起立。", words: ["Stand", "up,", "please."], answer: ["Stand", "up,", "please."] },
  { sentence: "Turn around.", zh: "转个圈。", words: ["Turn", "around."], answer: ["Turn", "around."] }
]

export const listenResponseBankG3U2b = [
  { question: "Good afternoon.", zh: "下午好。", options: ["Good morning.", "Good afternoon.", "Goodbye.", "Hello."], correct: 1 },
  { question: "Colour it orange.", zh: "把它涂成橙色。", options: ["OK.", "Thank you.", "Hello.", "I see orange."], correct: 0 },
  { question: "Nice to meet you.", zh: "很高兴见到你。", options: ["Good afternoon.", "Nice to meet you, too.", "Me too.", "Stand up."], correct: 1 },
  { question: "Stand up, please.", zh: "请起立。", options: ["Brown.", "OK.", "Good morning.", "Hello."], correct: 1 },
  { question: "What colour is the bag?", zh: "包是什么颜色的？", options: ["It's heavy.", "It's brown.", "Yes, it is.", "No, it isn't."], correct: 1 }
]

export const listenTranslateBankG3U2b = [
  { sentence: "Colour it brown.", options: ["把它涂成黑色。", "把它涂成白色。", "把它涂成棕色。", "把它涂成橙色。"], correct: 2 },
  { sentence: "Good afternoon.", options: ["早上好。", "晚上好。", "下午好。", "再见。"], correct: 2 },
  { sentence: "Stand up.", options: ["坐下。", "起立。", "转圈。", "摸地。"], correct: 1 },
  { sentence: "Sit down.", options: ["起立。", "坐下。", "把手放下。", "闭上眼睛。"], correct: 1 },
  { sentence: "I see orange.", options: ["我看见了红色。", "我看见了黑色。", "我看见了白色。", "我看见了橙色。"], correct: 3 }
]
