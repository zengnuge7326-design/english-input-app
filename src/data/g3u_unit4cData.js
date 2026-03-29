// PEP三年级上册 Unit 4 Part C《Story time / Let's check》题库
// 主题：Unit 4 综合复习 (所有动物词汇与指示代词)
// 7种题型，每种5题，共35题

export const quizBankG3U4c = [
  { question: "___ this? It's a pig.", chinese: "这是什么？它是一头猪。", options: ["What's", "Who's", "Where's", "How"], correct: 0, explanation: "问物品用 What's...?", tag: "疑问词" },
  { question: "It's ___ elephant.", chinese: "它是一象。", options: ["a", "an", "the", "two"], correct: 1, explanation: "elephant前用an。", tag: "冠词" },
  { question: "Walk ___ an elephant.", chinese: "像大象一样走路。", options: ["like", "likes", "love", "look"], correct: 0, explanation: "like 在此处作介词，表示“像...一样”。", tag: "介词" },
  { question: "___ that? It's a duck.", chinese: "那是什么？是一只鸭子。", options: ["What's", "Who", "Where", "How"], correct: 0, explanation: "询问远处的物品用 What's that?", tag: "指示代词" },
  { question: "The bear ___ big.", chinese: "这只熊很大。", options: ["is", "am", "are", "be"], correct: 0, explanation: "主语是The bear单数，用is。", tag: "语法" }
]

export const fillblankBankG3U4c = [
  { sentence: "What's ___ (这个)?", answer: "this", chinese: "这是什么？", explanation: "this 这个", tag: "代词" },
  { sentence: "What's ___ (那个)?", answer: "that", chinese: "那是什么？", explanation: "that 那个", tag: "代词" },
  { sentence: "It's an ___ (大象).", answer: "elephant", chinese: "它是一头大象。", explanation: "elephant", tag: "词汇" },
  { sentence: "Act ___ (像) a tiger.", answer: "like", chinese: "像老虎一样表演。", explanation: "like (像...一样)", tag: "介词" },
  { sentence: "The ___ (熊猫) is cute.", answer: "panda", chinese: "大熊猫很可爱。", explanation: "panda", tag: "词汇" }
]

export const listenWordBankG3U4c = [
  { word: "monkey", options: ["money", "donkey", "monkey", "monday"], correct: 2, zh: "猴子" },
  { word: "duck", options: ["duck", "dust", "dark", "truck"], correct: 0, zh: "鸭子" },
  { word: "tiger", options: ["tiger", "fighter", "lighter", "tighter"], correct: 0, zh: "老虎" },
  { word: "bear", options: ["pear", "dear", "bear", "beer"], correct: 2, zh: "熊" },
  { word: "bird", options: ["bed", "bird", "board", "bad"], correct: 1, zh: "鸟" }
]

export const listenSentenceBankG3U4c = [
  { sentence: "What's that?", zh: "那是什么？", options: ["What's this?", "Who's that?", "What's that?", "Where is that?"], correct: 2 },
  { sentence: "It's an elephant.", zh: "它是一头大象。", options: ["It's an eraser.", "It's an elephant.", "It's a tiger.", "It is big."], correct: 1 },
  { sentence: "Walk like a bear.", zh: "像熊一样走路。", options: ["Walk like a duck.", "Act like a tiger.", "Walk like a bear.", "Look at the bear."], correct: 2 },
  { sentence: "Look at the monkey.", zh: "看那只猴子。", options: ["Look at the panda.", "Look at the monkey.", "Look at the duck.", "Look at the pig."], correct: 1 },
  { sentence: "What's this? It's a pig.", zh: "这是什么？它是一头猪。", options: ["What's this? It's a dog.", "What's that? It's a pig.", "What's this? It's a pig.", "What's this? It's a bear."], correct: 2 }
]

export const listenOrderBankG3U4c = [
  { sentence: "What is that?", zh: "那是什么？", words: ["What", "is", "that?"], answer: ["What", "is", "that?"] },
  { sentence: "It is an elephant.", zh: "它是一头大象。", words: ["It", "is", "an", "elephant."], answer: ["It", "is", "an", "elephant."] },
  { sentence: "Look at the monkey.", zh: "看那只猴子。", words: ["Look", "at", "the", "monkey."], answer: ["Look", "at", "the", "monkey."] },
  { sentence: "Walk like a duck.", zh: "像鸭子一样走路。", words: ["Walk", "like", "a", "duck."], answer: ["Walk", "like", "a", "duck."] },
  { sentence: "I love animals.", zh: "我爱动物。", words: ["I", "love", "animals."], answer: ["I", "love", "animals."] }
]

export const listenResponseBankG3U4c = [
  { question: "What's that?", zh: "那是什么？", options: ["It's a tiger.", "I am nine.", "Hello.", "It's blue."], correct: 0 },
  { question: "What's this?", zh: "这是什么？", options: ["It's an elephant.", "Me too.", "See you.", "His name is Mike."], correct: 0 },
  { question: "Look at the panda.", zh: "看大熊猫。", options: ["It's cute.", "I am Mike.", "Good morning.", "Here you are."], correct: 0 },
  { question: "Walk like a duck.", zh: "像鸭子一样走路。", options: ["OK.", "Hello.", "It's a cat.", "Byebye."], correct: 0 },
  { question: "Is it a dog?", zh: "它是一只狗吗？", options: ["Yes, it is.", "No, it is a pen.", "It's red.", "Thank you."], correct: 0 }
]

export const listenTranslateBankG3U4c = [
  { sentence: "What's that?", options: ["这是什么？", "那是什么？", "什么颜色？", "那个人是谁？"], correct: 1 },
  { sentence: "It's an elephant.", options: ["他是一头大象。", "它是一头大象。", "这是一头大象。", "那是一头大象。"], correct: 1 },
  { sentence: "Look at the monkey.", options: ["看那只鸟。", "看那只小鸭子。", "看这只猴子。", "看那只猴子。"], correct: 3 },
  { sentence: "Walk like a duck.", options: ["像飞鸟一样飞。", "像大象一样走。", "像鸭子一样走。", "扮演一只老虎。"], correct: 2 },
  { sentence: "What's this?", options: ["这是什么？", "那是什么？", "在哪？", "这是我的。"], correct: 0 }
]
