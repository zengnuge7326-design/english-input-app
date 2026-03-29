// PEP三年级下册 Unit 4 Part C《Story time / Let's check》题库
// 主题：Unit 4 综合复习 (物品、介词、寻找物品的对答)
// 7种题型，每种5题，共35题

export const quizBankG3D4c = [
  { question: "___ is the map?", chinese: "地图在哪儿？", options: ["Where", "Who", "What", "How"], correct: 0, explanation: "询问位置用 Where。", tag: "疑问词" },
  { question: "It's ___ the wall.", chinese: "它在墙上。", options: ["on", "in", "under", "to"], correct: 0, explanation: "在墙的表面用 on the wall。", tag: "介词" },
  { question: "___ it under the desk?", chinese: "它在书桌下面吗？", options: ["Is", "Are", "Am", "Do"], correct: 0, explanation: "主语是it，用Is提问。", tag: "动词的结构" },
  { question: "Yes, it ___.", chinese: "是的，它在。", options: ["is", "isn't", "are", "do"], correct: 0, explanation: "肯定回答 Yes, it is.", tag: "语法" },
  { question: "Silly ___!", chinese: "傻孩子！ / 傻小熊！", options: ["me", "I", "my", "mine"], correct: 0, explanation: "Silly me! 指“我真傻！”这是常用感叹。", tag: "口语" }
]

export const fillblankBankG3D4c = [
  { sentence: "___ (哪里) is the ball?", answer: "Where", chinese: "球在哪里？", explanation: "Where 哪里。", tag: "疑问词" },
  { sentence: "It's ___ (在...上) the desk.", answer: "on", chinese: "它在书桌上。", explanation: "on", tag: "介词" },
  { sentence: "It's ___ (在...下) the chair.", answer: "under", chinese: "它在椅子下面。", explanation: "under", tag: "介词" },
  { sentence: "___ (是) it in the bag?", answer: "Is", chinese: "它在包里吗？", explanation: "Is，首字母大写。", tag: "疑问词" },
  { sentence: "Silly ___ (我)!", answer: "me", chinese: "我真傻！", explanation: "Silly me!", tag: "感叹" }
]

export const listenWordBankG3D4c = [
  { word: "where", options: ["what", "where", "who", "when"], correct: 1, zh: "哪里" },
  { word: "under", options: ["uncle", "under", "umbrella", "other"], correct: 1, zh: "在...下面" },
  { word: "desk", options: ["duck", "desk", "disk", "dark"], correct: 1, zh: "书桌" },
  { word: "boat", options: ["boat", "coat", "goat", "boot"], correct: 0, zh: "小船" },
  { word: "map", options: ["cap", "map", "man", "mat"], correct: 1, zh: "地图" }
]

export const listenSentenceBankG3D4c = [
  { sentence: "Where is the map?", zh: "地图在哪里？", options: ["Where is the cap?", "Where is the car?", "Where is the map?", "Where is the ball?"], correct: 2 },
  { sentence: "Is it in the desk?", zh: "它在书桌里面吗？", options: ["Is it on the desk?", "Is it in the desk?", "Is it under the desk?", "Is it near the desk?"], correct: 1 },
  { sentence: "Yes, it is.", zh: "是的，它在。", options: ["No, it isn't.", "Yes, it is.", "Yes, he is.", "No, she isn't."], correct: 1 },
  { sentence: "It's under the chair.", zh: "它在椅子下面。", options: ["It's on the chair.", "It's under the desk.", "It's under the chair.", "It's in the bag."], correct: 2 },
  { sentence: "Silly me!", zh: "我真傻！", options: ["Excuse me!", "Silly me!", "Pardon me?", "Lucky me!"], correct: 1 }
]

export const listenOrderBankG3D4c = [
  { sentence: "Where is my car?", zh: "我的汽车在哪里？", words: ["Where", "is", "my", "car?"], answer: ["Where", "is", "my", "car?"] },
  { sentence: "Is it in your bag?", zh: "它在你的包里吗？", words: ["Is", "it", "in", "your", "bag?"], answer: ["Is", "it", "in", "your", "bag?"] },
  { sentence: "Yes, it is.", zh: "是的，它是的。", words: ["Yes,", "it", "is."], answer: ["Yes,", "it", "is."] },
  { sentence: "It is under the chair.", zh: "它在椅子下。", words: ["It", "is", "under", "the", "chair."], answer: ["It", "is", "under", "the", "chair."] },
  { sentence: "Let's go home.", zh: "我们回家吧。", words: ["Let's", "go", "home."], answer: ["Let's", "go", "home."] }
]

export const listenResponseBankG3D4c = [
  { question: "Where is my map?", zh: "我的地图在哪儿？", options: ["It's on the wall.", "I am nine.", "Welcome.", "Goodbye."], correct: 0 },
  { question: "Is it under the desk?", zh: "它在书桌下面吗？", options: ["No, it isn't.", "Me too.", "It is a duck.", "See you."], correct: 0 },
  { question: "Silly me!", zh: "我真傻！", options: ["Haha.", "I'm ten.", "Here you are.", "Yes, he is."], correct: 0 },
  { question: "Have a good time!", zh: "玩得开心！", options: ["Thanks.", "Me too.", "It's big.", "No."], correct: 0 },
  { question: "Let's play.", zh: "我们玩吧。", options: ["OK.", "Hello.", "It's red.", "Bye."], correct: 0 }
]

export const listenTranslateBankG3D4c = [
  { sentence: "Where is my car?", options: ["我的车在哪儿？", "我的帽子在哪儿？", "我的球在哪儿？", "我的船在哪儿？"], correct: 0 },
  { sentence: "Is it in your bag?", options: ["它在桌子下吗？", "它在你的包里吗？", "它在椅子上吗？", "它在包下面吗？"], correct: 1 },
  { sentence: "It's under the chair.", options: ["它在桌子上。", "它在椅子下面。", "它在椅子上面。", "它在书包里。"], correct: 1 },
  { sentence: "Yes, it is.", options: ["是的，它在。", "不，它不在。", "是的，我是。", "是的，他在。"], correct: 0 },
  { sentence: "No, it isn't.", options: ["不，她不是。", "是的，他在。", "不，这不是。", "不，它不在。"], correct: 3 }
]
