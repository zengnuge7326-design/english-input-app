// PEP五年级下册 Unit 6 Part C《Story time / Let's check》题库
// 主题：Unit 6 综合复习 (现在进行时复习、各项指令标志牌)
// 7种题型，每种5题，共35题

export const quizBankG5D6c = [
  { question: "Is the bear ___?", chinese: "这只熊正在游泳吗？", options: ["swimming", "swim", "swims", "swam"], correct: 0, explanation: "现在进行时疑问句，动词加ing，且双写m：swimming。", tag: "现在进行时" },
  { question: "Shh. Please talk ___.", chinese: "嘘，请小声说话。", options: ["quietly", "quiet", "loudly", "quickly"], correct: 0, explanation: "修饰动词talk用副词quietly。", tag: "副词" },
  { question: "They ___ playing in the park.", chinese: "他们正在公园里玩耍。", options: ["are", "is", "am", "do"], correct: 0, explanation: "They后面的系动词用 are。", tag: "系动词" },
  { question: "What is she ___?", chinese: "她正在干什么？", options: ["doing", "do", "does", "done"], correct: 0, explanation: "进行时结构，What is she doing?。", tag: "现在进行时" },
  { question: "___ your desk clean.", chinese: "保持你的书桌干净。", options: ["Keep", "Make", "Let", "Take"], correct: 0, explanation: "用 Keep 引导的祈使句表保持状态。", tag: "动词用法" }
]

export const fillblankBankG5D6c = [
  { sentence: "Is the baby ___ (睡觉)?", answer: "sleeping", chinese: "宝宝正在睡觉吗？", explanation: "sleep的ing形式", tag: "分词" },
  { sentence: "What ___ (是) the birds doing?", answer: "are", chinese: "鸟儿们正在干什么？", explanation: "主语the birds为复数，用are。", tag: "系动词" },
  { sentence: "Take ___ (轮流/按顺序).", answer: "turns", chinese: "请轮流进行。", explanation: "take turns", tag: "名词复数" },
  { sentence: "Keep ___ (到) the right.", answer: "to", chinese: "靠右行。", explanation: "keep to the right", tag: "介词" },
  { sentence: "They are ___ (玩耍) games.", answer: "playing", chinese: "他们正在玩游戏。", explanation: "playing", tag: "分词" }
]

export const listenWordBankG5D6c = [
  { word: "quietly", options: ["quickly", "quietly", "quite", "quit"], correct: 1, zh: "安静地" },
  { word: "swimming", options: ["sweeping", "swimming", "sleeping", "singing"], correct: 1, zh: "游泳(ing)" },
  { word: "doing", options: ["going", "drawing", "doing", "drinking"], correct: 2, zh: "做(ing)" },
  { word: "clean", options: ["class", "clear", "clean", "climb"], correct: 2, zh: "干净的" },
  { word: "turns", options: ["towns", "turns", "terms", "teams"], correct: 1, zh: "轮流(复数)" }
]

export const listenSentenceBankG5D6c = [
  { sentence: "Is the bear swimming?", zh: "这只熊正在游泳吗？", options: ["Is the bear sleeping?", "Is the bear swimming?", "Is the dog swimming?", "Is the elephant drinking?"], correct: 1 },
  { sentence: "Please talk quietly.", zh: "请小声说话。", options: ["Please walk quietly.", "Please read quietly.", "Please talk quietly.", "Please talk loudly."], correct: 2 },
  { sentence: "They are playing in the park.", zh: "他们正在公园玩。", options: ["He is playing in the park.", "They are playing in the park.", "They are walking in the park.", "We are playing in the park."], correct: 1 },
  { sentence: "What is she doing?", zh: "她正在干嘛？", options: ["What is he doing?", "What are they doing?", "What is she doing?", "Where is she going?"], correct: 2 },
  { sentence: "Keep your desk clean.", zh: "保持书桌干净。", options: ["Keep your room clean.", "Keep your hands clean.", "Keep to the right.", "Keep your desk clean."], correct: 3 }
]

export const listenOrderBankG5D6c = [
  { sentence: "Is the bear swimming?", zh: "这只熊正在游泳吗？", words: ["Is", "the", "bear", "swimming?"], answer: ["Is", "the", "bear", "swimming?"] },
  { sentence: "Please talk quietly.", zh: "请小声点说。", words: ["Please", "talk", "quietly."], answer: ["Please", "talk", "quietly."] },
  { sentence: "What is she doing?", zh: "她正在干什么？", words: ["What", "is", "she", "doing?"], answer: ["What", "is", "she", "doing?"] },
  { sentence: "They are playing.", zh: "他们正在玩耍。", words: ["They", "are", "playing."], answer: ["They", "are", "playing."] },
  { sentence: "Keep your desk clean.", zh: "保持你的书桌干净。", words: ["Keep", "your", "desk", "clean."], answer: ["Keep", "your", "desk", "clean."] }
]

export const listenResponseBankG5D6c = [
  { question: "Is the bear swimming?", zh: "熊正在游泳吗？", options: ["No, it isn't.", "Yes, they are.", "It is big.", "Thank you."], correct: 0 },
  { question: "What are the elephants doing?", zh: "大象们正在干嘛？", options: ["They are drinking water.", "It's an elephant.", "Because they are big.", "Yes, they are."], correct: 0 },
  { question: "Please talk quietly.", zh: "请小声交谈。", options: ["Oh, sorry.", "Yes, it is.", "He is young.", "I can talk."], correct: 0 },
  { question: "Are they eating?", zh: "他们正在吃东西吗？", options: ["Yes, they are.", "No, she isn't.", "At 12:00.", "I am full."], correct: 0 },
  { question: "What is that sign?", zh: "那个标志是什么？", options: ["It says 'No eating'.", "It is yellow.", "I like swimming.", "Thanks!"], correct: 0 }
]

export const listenTranslateBankG5D6c = [
  { sentence: "Is the bear swimming?", options: ["这只狗在游泳吗？", "这只熊在洗澡吗？", "这只熊正在游泳吗？", "它会游泳吗？"], correct: 2 },
  { sentence: "Please talk quietly.", options: ["请保持安静。", "请别说话。", "请大点声读。", "请小声讲话。"], correct: 3 },
  { sentence: "They are playing in the park.", options: ["他们在公园里睡觉。", "他们在操场上玩耍。", "他们在操场上跑步。", "他们正在公园里玩耍。"], correct: 3 },
  { sentence: "What is she doing?", options: ["他正在做什么？", "她在去哪里？", "她正在干什么？", "这是什么？"], correct: 2 },
  { sentence: "Keep your desk clean.", options: ["打扫这间教室。", "保持你的课桌整洁。", "帮我整理课桌。", "向右转。"], correct: 1 }
]
