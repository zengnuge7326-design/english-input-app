// PEP四年级下册 Unit 6 Part C《Story time / Let's check》题库
// 主题：Unit 6 综合复习 (衣物 + 购物对话 + 价格)
// 7种题型，每种5题，共35题

export const quizBank6c = [
  { question: "___ I help you?", chinese: "我能帮你吗？", options: ["Can", "Do", "Are", "Is"], correct: 0, explanation: "Can I help you? 是购物时的常用欢迎语。", tag: "交际" },
  { question: "Are they ___?", chinese: "它们合适(大小)吗？", options: ["good", "nice", "OK", "cheap"], correct: 2, explanation: "Are they OK? 试穿衣服时问'它们大小合适吗？'。", tag: "短语" },
  { question: "They're too small. They are 200 dollars. They're too ___.", chinese: "它们太小了。它们200美元，太贵了。", options: ["cheap", "nice", "expensive", "pretty"], correct: 2, explanation: "200美元通常是昂贵的 (expensive)。", tag: "词汇" },
  { question: "Look at that scarf. It's very ___.", chinese: "看那条围巾。它非常好看。", options: ["pretty", "handsome", "much", "many"], correct: 0, explanation: "形容围巾好看用 pretty 比较恰当。", tag: "词汇" },
  { question: "I'll ___ them.", chinese: "我买下它们了。", options: ["buy", "take", "bring", "make"], correct: 1, explanation: "I'll take it/them. 是去商店决定购买时的固定说法。", tag: "短语" }
]

export const fillblankBank6c = [
  { sentence: "How ___ (多) is this umbrella?", answer: "much", chinese: "这把雨伞多少钱？", explanation: "问价格用 How much。", tag: "句型" },
  { sentence: "Can I ___ (试穿) it on?", answer: "try", chinese: "我可以试穿它吗？", explanation: "试穿 try on。", tag: "短语" },
  { sentence: "It's 10 ___ (美元).", answer: "dollars", chinese: "它10美元。", explanation: "美元的复数是 dollars。", tag: "拼写" },
  { sentence: "They're ___ (廉价的).", answer: "cheap", chinese: "它们很便宜。", explanation: "便宜的 cheap。", tag: "词汇" },
  { sentence: "The ___ (手套) are too big.", answer: "gloves", chinese: "手套太大了。", explanation: "手套 gloves，发音含 /v/。", tag: "词汇" }
]

export const listenWordBank6c = [
  { word: "expensive", options: ["expensive", "express", "expect", "expand"], correct: 0, zh: "昂贵的" },
  { word: "cheap", options: ["cheap", "keep", "sheep", "chip"], correct: 0, zh: "便宜的" },
  { word: "take", options: ["make", "take", "lake", "cake"], correct: 1, zh: "买下 / 拿走" },
  { word: "dollars", options: ["colors", "dollars", "doctors", "doors"], correct: 1, zh: "美元" },
  { word: "sunglasses", options: ["sunny", "glasses", "sunglasses", "summer"], correct: 2, zh: "太阳镜" }
]

export const listenSentenceBank6c = [
  { sentence: "Can I help you?", zh: "我能帮你吗？", options: ["Can I help you?", "Can you help me?", "Do you need help?", "Can I see it?"], correct: 0 },
  { sentence: "I want a scarf.", zh: "我想要一条围巾。", options: ["I want a skirt.", "I want a scarf.", "I want a shirt.", "I want some gloves."], correct: 1 },
  { sentence: "How do you like this one?", zh: "你觉得这条怎么样？", options: ["How do you like this one?", "How much is this one?", "Do you like this one?", "What is this one?"], correct: 0 },
  { sentence: "It's five dollars.", zh: "它5美元。", options: ["It's fine, doctor.", "It's five dollars.", "It's fifty dollars.", "I have five dollars."], correct: 1 },
  { sentence: "That's cheap. I'll take it.", zh: "那很便宜。我买了。", options: ["That's cheap. I'll take it.", "That's expensive. I'll take it.", "That's cheap. I won't take it.", "That's nice. I'll take it."], correct: 0 }
]

export const listenOrderBank6c = [
  { sentence: "Can I help you?", zh: "我能帮你吗？", words: ["Can", "I", "help", "you?"], answer: ["Can", "I", "help", "you?"] },
  { sentence: "How much are these gloves?", zh: "这些手套多少钱？", words: ["How", "much", "are", "these", "gloves?"], answer: ["How", "much", "are", "these", "gloves?"] },
  { sentence: "They're too expensive.", zh: "它们太贵了。", words: ["They're", "too", "expensive."], answer: ["They're", "too", "expensive."] },
  { sentence: "How do you like this skirt?", zh: "这条短裙你觉得怎么样？", words: ["How", "do", "you", "like", "this", "skirt?"], answer: ["How", "do", "you", "like", "this", "skirt?"] },
  { sentence: "I will take them.", zh: "我买下它们了。", words: ["I", "will", "take", "them."], answer: ["I", "will", "take", "them."] }
]

export const listenResponseBank6c = [
  { question: "Can I help you?", zh: "我能帮你吗？", options: ["Yes, these shoes are nice.", "You can help.", "Yes, I am a nurse.", "I have an umbrella."], correct: 0 },
  { question: "How do you like this scarf?", zh: "你觉得这条围巾怎么样？", options: ["It's 10 yuan.", "It's very pretty.", "Yes, I like it.", "It is a scarf."], correct: 1 },
  { question: "How much are those gloves?", zh: "那些手套多少钱？", options: ["It's 5 dollars.", "They are 20 dollars.", "No, they aren't.", "They're cheap."], correct: 1 },
  { question: "Are they OK?", zh: "它们合适吗？（大小）", options: ["They're too small.", "Yes, it is.", "They're blue.", "I'll take it."], correct: 0 },
  { question: "This is 50 dollars.", zh: "这个50美元。", options: ["Too cheap.", "Too expensive!", "I'm 50.", "It is red."], correct: 1 }
]

export const listenTranslateBank6c = [
  { sentence: "Can I try these on?", options: ["我能试试这双吗？", "我能买这个吗？", "这双多少钱？", "你能帮我吗？"], correct: 0 },
  { sentence: "How do you like this umbrella?", options: ["你喜欢那把雨伞吗？", "你觉得这把雨伞怎么样？", "这把雨伞多少钱？", "你的雨伞好看吗？"], correct: 1 },
  { sentence: "They're ten dollars.", options: ["它10美元。", "它们10美元。", "它100美元。", "它们100美元。"], correct: 1 },
  { sentence: "They're too expensive.", options: ["它们太便宜了。", "它们太大了。", "它们太重了。", "它们太贵了。"], correct: 3 },
  { sentence: "I'll take it.", options: ["我不买了。", "我带走它了。", "我买下它了。", "请把它给我。"], correct: 2 }
]
