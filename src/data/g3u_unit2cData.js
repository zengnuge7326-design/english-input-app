// PEP三年级上册 Unit 2 Part C《Story time / Let's check》题库
// 主题：Unit 2 综合复习 (所有颜色、打招呼、动作指令)
// 7种题型，每种5题，共35题

export const quizBankG3U2c = [
  { question: "___ afternoon, Miss White.", chinese: "下午好，怀特老师。", options: ["Good", "Goodbye", "Morning", "Hello"], correct: 0, explanation: "下午好是 Good afternoon.", tag: "交际" },
  { question: "___ up, please.", chinese: "请起立。", options: ["Sit", "Stand", "Turn", "Touch"], correct: 1, explanation: "Stand up 表示起立。", tag: "动作" },
  { question: "Colour ___ yellow.", chinese: "把它涂成黄色。", options: ["it", "he", "she", "I"], correct: 0, explanation: "指代某个物品用 it。", tag: "代词" },
  { question: "I ___ green.", chinese: "我看见了绿色。", options: ["look", "see", "show", "touch"], correct: 1, explanation: "I see... = 我看见了...", tag: "词汇" },
  { question: "Nice to meet ___, too.", chinese: "我也很高兴见到你。", options: ["me", "you", "your", "I"], correct: 1, explanation: "回应 Nice to meet you 时说 Nice to meet you, too.", tag: "交际" }
]

export const fillblankBankG3U2c = [
  { sentence: "Good ___ (早上)!", answer: "morning", chinese: "早上好！", explanation: "morning 早上", tag: "时间" },
  { sentence: "Good ___ (下午)!", answer: "afternoon", chinese: "下午好！", explanation: "afternoon 下午", tag: "时间" },
  { sentence: "___ (把它涂色) it red.", answer: "Colour", chinese: "把它涂成红色。", explanation: "Colour 涂色。首字母大写。", tag: "动作" },
  { sentence: "Nice to ___ (遇见) you.", answer: "meet", chinese: "很高兴见到你。", explanation: "meet 遇见", tag: "动词" },
  { sentence: "___ (给...看) me blue.", answer: "Show", chinese: "给我看蓝色。", explanation: "Show", tag: "动作" }
]

export const listenWordBankG3U2c = [
  { word: "afternoon", options: ["morning", "afternoon", "evening", "often"], correct: 1, zh: "下午" },
  { word: "stand", options: ["sit", "stand", "star", "stop"], correct: 1, zh: "站立" },
  { word: "turn", options: ["ten", "turn", "torn", "town"], correct: 1, zh: "转弯/转动" },
  { word: "colour", options: ["cover", "colour", "column", "collar"], correct: 1, zh: "颜色/涂色" },
  { word: "brown", options: ["down", "town", "brown", "broom"], correct: 2, zh: "棕色的" }
]

export const listenSentenceBankG3U2c = [
  { sentence: "Nice to meet you, too.", zh: "我也很高兴见到你。", options: ["Nice to meet you.", "Nice to meet you, too.", "Nice to see you.", "Good morning."], correct: 1 },
  { sentence: "Colour it black.", zh: "把它涂成黑色。", options: ["Colour it brown.", "Colour it white.", "Colour it black.", "Colour it red."], correct: 2 },
  { sentence: "Stand up.", zh: "起立。", options: ["Sit down.", "Stand up.", "Turn around.", "Touch the ground."], correct: 1 },
  { sentence: "I see orange.", zh: "我看见了橙色。", options: ["I see an orange.", "I see orange.", "I see brown.", "I see red."], correct: 1 },
  { sentence: "Good afternoon.", zh: "下午好。", options: ["Good morning.", "Good night.", "Goodbye.", "Good afternoon."], correct: 3 }
]

export const listenOrderBankG3U2c = [
  { sentence: "Nice to meet you, too.", zh: "我也很高兴见到你。", words: ["Nice", "to", "meet", "you,", "too."], answer: ["Nice", "to", "meet", "you,", "too."] },
  { sentence: "Colour it black.", zh: "把它涂黑。", words: ["Colour", "it", "black."], answer: ["Colour", "it", "black."] },
  { sentence: "Good afternoon, children.", zh: "下午好，孩子们。", words: ["Good", "afternoon,", "children."], answer: ["Good", "afternoon,", "children."] },
  { sentence: "I see yellow.", zh: "我看见了黄色。", words: ["I", "see", "yellow."], answer: ["I", "see", "yellow."] },
  { sentence: "Show me red.", zh: "给我看看红色。", words: ["Show", "me", "red."], answer: ["Show", "me", "red."] }
]

export const listenResponseBankG3U2c = [
  { question: "Nice to meet you.", zh: "见到你很高兴。", options: ["Nice to meet you, too.", "Good morning.", "Hello.", "Me too."], correct: 0 },
  { question: "Colour it blue.", zh: "把它涂成蓝色。", options: ["OK.", "Thank you.", "It's blue.", "Me too."], correct: 0 },
  { question: "Good afternoon.", zh: "下午好。", options: ["Good afternoon.", "Good morning.", "Goodbye.", "Hello."], correct: 0 },
  { question: "Show me your red crayon.", zh: "把你的红蜡笔给我看。", options: ["Here you are.", "I see red.", "Colour it red.", "Thank you."], correct: 0 },
  { question: "I see green.", zh: "我看到了绿色。", options: ["Me too.", "It's a book.", "Good morning.", "Bye."], correct: 0 }
]

export const listenTranslateBankG3U2c = [
  { sentence: "Colour it black.", options: ["把它涂成黑色。", "把它涂成白色。", "把它涂成棕色。", "把它涂成蓝色。"], correct: 0 },
  { sentence: "Nice to meet you, too.", options: ["很高兴见到你。", "我也很高兴见到你。", "早上好。", "下午好。"], correct: 1 },
  { sentence: "Stand up.", options: ["坐下。", "把手放下。", "起立。", "转圈。"], correct: 2 },
  { sentence: "Good afternoon.", options: ["下午好。", "早上好。", "晚上好。", "再见。"], correct: 0 },
  { sentence: "I see orange.", options: ["我有一个橘子。", "我喜欢橙色。", "我看见了橙色。", "我看见了绿色。"], correct: 2 }
]
