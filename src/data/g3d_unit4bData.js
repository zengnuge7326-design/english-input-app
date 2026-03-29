// PEP三年级下册 Unit 4 Part B《Let's learn / Let's talk》题库
// 主题：玩具与物品 (cap, ball, car, boat, map) + Is it in your bag? Yes, it is. / No, it isn't.
// 7种题型，每种5题，共35题

export const quizBankG3D4b = [
  { question: "Is it in your bag? Yes, ___.", chinese: "它在你的书包里吗？是的，它在。", options: ["it is", "it doesn't", "is it", "I am"], correct: 0, explanation: "Is it...? 的肯定回答是 Yes, it is.", tag: "语法" },
  { question: "Is the ___ on the desk? No, it isn't.", chinese: "球在书桌上吗？不，不在。", options: ["ball", "in", "red", "under"], correct: 0, explanation: "句中需要主语名词，ball (球) 符合。", tag: "名词" },
  { question: "Bounce the ___.", chinese: "拍球。", options: ["ball", "car", "cap", "boat"], correct: 0, explanation: "Bounce 意思是拍打反弹。拍球是 bounce the ball。", tag: "动作" },
  { question: "Drive a ___.", chinese: "开车。", options: ["car", "boat", "cap", "map"], correct: 0, explanation: "drive 驾驶，搭配 car (汽车)。", tag: "搭配" },
  { question: "Put on a ___.", chinese: "戴上帽子。", options: ["cap", "boat", "map", "ball"], correct: 0, explanation: "put on 穿、戴，搭配 cap (帽子)。", tag: "搭配" }
]

export const fillblankBankG3D4b = [
  { sentence: "___ (是) it in your bag?", answer: "Is", chinese: "它在你的包里吗？", explanation: "Is it...?", tag: "疑问句" },
  { sentence: "No, it ___ (不是).", answer: "isn't", chinese: "不，它不在。", explanation: "isn't = is not", tag: "否定" },
  { sentence: "Bounce a ___ (球).", answer: "ball", chinese: "拍球。", explanation: "ball 球", tag: "词汇" },
  { sentence: "Drive a ___ (小汽车).", answer: "car", chinese: "开小汽车。", explanation: "car 汽车", tag: "词汇" },
  { sentence: "Row a ___ (小船).", answer: "boat", chinese: "划小船。", explanation: "boat 船", tag: "词汇" }
]

export const listenWordBankG3D4b = [
  { word: "cap", options: ["cat", "cap", "cup", "map"], correct: 1, zh: "帽子" },
  { word: "ball", options: ["tall", "ball", "wall", "call"], correct: 1, zh: "球" },
  { word: "car", options: ["cat", "car", "can", "cap"], correct: 1, zh: "小汽车" },
  { word: "boat", options: ["coat", "goat", "boat", "boot"], correct: 2, zh: "小船" },
  { word: "map", options: ["cap", "map", "man", "mat"], correct: 1, zh: "地图" }
]

export const listenSentenceBankG3D4b = [
  { sentence: "Is it in your bag?", zh: "它在你的书包里吗？", options: ["Is it on your desk?", "Is it in your bag?", "Is it under your chair?", "Is it in your hand?"], correct: 1 },
  { sentence: "Yes, it is.", zh: "是的，它在。", options: ["Yes, she is.", "No, it isn't.", "Yes, it is.", "No, I'm not."], correct: 2 },
  { sentence: "Bounce a ball.", zh: "拍球。", options: ["Drive a car.", "Row a boat.", "Bounce a ball.", "Read a map."], correct: 2 },
  { sentence: "Drive a car.", zh: "开车。", options: ["Put on a cap.", "Bounce a ball.", "Drive a car.", "Row a boat."], correct: 2 },
  { sentence: "Where is my boat?", zh: "我的小船在哪儿？", options: ["Where is my car?", "Where is my cap?", "Where is my ball?", "Where is my boat?"], correct: 3 }
]

export const listenOrderBankG3D4b = [
  { sentence: "Is it in your bag?", zh: "它在你的书包里吗？", words: ["Is", "it", "in", "your", "bag?"], answer: ["Is", "it", "in", "your", "bag?"] },
  { sentence: "Yes, it is.", zh: "是的，它在。", words: ["Yes,", "it", "is."], answer: ["Yes,", "it", "is."] },
  { sentence: "No, it isn't.", zh: "不，它不在。", words: ["No,", "it", "isn't."], answer: ["No,", "it", "isn't."] },
  { sentence: "Bounce a ball.", zh: "拍一下球。", words: ["Bounce", "a", "ball."], answer: ["Bounce", "a", "ball."] },
  { sentence: "Read a map.", zh: "看地图。", words: ["Read", "a", "map."], answer: ["Read", "a", "map."] }
]

export const listenResponseBankG3D4b = [
  { question: "Is it in your bag?", zh: "它在你的包里吗？", options: ["Yes, it is.", "He is my dad.", "I'm ten.", "Here you are."], correct: 0 },
  { question: "Is it on the desk?", zh: "它在书桌上吗？", options: ["No, it isn't.", "She is tall.", "It's a cat.", "Thank you."], correct: 0 },
  { question: "Where is my car?", zh: "我的车在哪？", options: ["It's under the chair.", "Yes, it is.", "I like juice.", "No."], correct: 0 },
  { question: "Look at my cap.", zh: "看我的帽子。", options: ["How beautiful!", "Yes.", "Thank you.", "Where are you?"], correct: 0 },
  { question: "Have a good time!", zh: "玩得开心！", options: ["Thanks.", "Me too.", "It's small.", "Bye."], correct: 0 }
]

export const listenTranslateBankG3D4b = [
  { sentence: "Is it in your bag?", options: ["它在桌子上吗？", "它在包下面吗？", "它在你的书包里吗？", "它在你手里吗？"], correct: 2 },
  { sentence: "Yes, it is.", options: ["是的，它是的。", "不，它不在。", "不，我不喜欢。", "是的，我是。"], correct: 0 },
  { sentence: "No, it isn't.", options: ["是的，它是。", "不，她不是。", "不，它不在。", "不，他不是。"], correct: 2 },
  { sentence: "Bounce a ball.", options: ["看书。", "开车。", "划船。", "拍球。"], correct: 3 },
  { sentence: "Row a boat.", options: ["划船。", "看地图。", "戴帽子。", "开车。"], correct: 0 }
]
