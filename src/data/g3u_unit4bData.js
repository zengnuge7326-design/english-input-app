// PEP三年级上册 Unit 4 Part B《Let's learn / Let's talk》题库
// 主题：动物2 (elephant, monkey, bird, tiger, panda) + What's that?
// 7种题型，每种5题，共35题

export const quizBankG3U4b = [
  { question: "What's ___?", chinese: "那是什么？", options: ["that", "this", "it", "these"], correct: 0, explanation: "指远处的物品用 that。", tag: "指示代词" },
  { question: "It's ___ elephant.", chinese: "它是一头大象。", options: ["a", "an", "the", "two"], correct: 1, explanation: "elephant 以元音音素开头，用 an。", tag: "冠词" },
  { question: "Look at the ___.", chinese: "看这只猴子。", options: ["dog", "monkey", "duck", "pig"], correct: 1, explanation: "结合选项，本单元新学的有机灵的动物 monkey。", tag: "词汇" },
  { question: "Act like a ___.", chinese: "扮演一只老虎。", options: ["tiger", "apple", "book", "hand"], correct: 0, explanation: "Act like 后面接动物。tiger 最合适。", tag: "搭配" },
  { question: "The ___ is black and white.", chinese: "大熊猫是黑白相间的。", options: ["bear", "cat", "panda", "bird"], correct: 2, explanation: "大熊猫 panda 的颜色是 black and white。", tag: "常识" }
]

export const fillblankBankG3U4b = [
  { sentence: "What's ___ (那个)?", answer: "that", chinese: "那是什么？", explanation: "that 那个，指远处。", tag: "代词" },
  { sentence: "It is an ___ (大象).", answer: "elephant", chinese: "它是一头大象。", explanation: "elephant 大象", tag: "词汇" },
  { sentence: "It is a ___ (猴子).", answer: "monkey", chinese: "它是一只猴子。", explanation: "monkey 猴子", tag: "词汇" },
  { sentence: "It is a ___ (鸟).", answer: "bird", chinese: "它是一只鸟。", explanation: "bird 鸟", tag: "词汇" },
  { sentence: "It is a ___ (熊猫).", answer: "panda", chinese: "它是一只大熊猫。", explanation: "panda 熊猫", tag: "词汇" }
]

export const listenWordBankG3U4b = [
  { word: "elephant", options: ["elegant", "elephant", "element", "eleven"], correct: 1, zh: "大象" },
  { word: "monkey", options: ["money", "monkey", "donkey", "moon"], correct: 1, zh: "猴子" },
  { word: "bird", options: ["bed", "bird", "board", "bad"], correct: 1, zh: "鸟" },
  { word: "tiger", options: ["tiger", "taller", "tired", "together"], correct: 0, zh: "老虎" },
  { word: "panda", options: ["pencil", "panda", "pasta", "pizza"], correct: 1, zh: "熊猫" }
]

export const listenSentenceBankG3U4b = [
  { sentence: "What's that?", zh: "那是什么？", options: ["What's this?", "What's that?", "Who's that?", "Where is that?"], correct: 1 },
  { sentence: "It's an elephant.", zh: "它是一头大象。", options: ["It's an elephant.", "It's an eraser.", "It's a monkey.", "It's an egg."], correct: 0 },
  { sentence: "Act like a bird.", zh: "模仿一只鸟。", options: ["Act like a tiger.", "Act like a bird.", "Act like a monkey.", "Act like a bear."], correct: 1 },
  { sentence: "It's a tiger.", zh: "它是一只老虎。", options: ["It's a lion.", "It's a cat.", "It's a tiger.", "It's a pig."], correct: 2 },
  { sentence: "Look at the panda.", zh: "看那只大熊猫。", options: ["Look at the panda.", "Look at the monkey.", "Look at the pig.", "Look at the duck."], correct: 0 }
]

export const listenOrderBankG3U4b = [
  { sentence: "What's that?", zh: "那是什么？", words: ["What's", "that?"], answer: ["What's", "that?"] },
  { sentence: "It is an elephant.", zh: "它是一头大象。", words: ["It", "is", "an", "elephant."], answer: ["It", "is", "an", "elephant."] },
  { sentence: "Act like a monkey.", zh: "做猴子的动作。", words: ["Act", "like", "a", "monkey."], answer: ["Act", "like", "a", "monkey."] },
  { sentence: "It's a tiger.", zh: "它是一只老虎。", words: ["It's", "a", "tiger."], answer: ["It's", "a", "tiger."] },
  { sentence: "Look at the panda.", zh: "看那只熊猫。", words: ["Look", "at", "the", "panda."], answer: ["Look", "at", "the", "panda."] }
]

export const listenResponseBankG3U4b = [
  { question: "What's that?", zh: "那是什么？", options: ["It's a monkey.", "My name's John.", "I'm a boy.", "Yes, it is."], correct: 0 },
  { question: "Look at the tiger.", zh: "看这只老虎。", options: ["It's big.", "Thank you.", "Hello.", "Goodbye."], correct: 0 },
  { question: "What's this?", zh: "这是什么？", options: ["It's an elephant.", "Me too.", "He is a student.", "Show me."], correct: 0 },
  { question: "Act like a bird.", zh: "模仿一只鸟。", options: ["OK. Tweet tweet.", "Nice to meet you.", "Hello.", "I see black."], correct: 0 },
  { question: "What colour is the panda?", zh: "熊猫是什么颜色的？", options: ["Black and white.", "Yes, it is.", "It's a bear.", "See you."], correct: 0 }
]

export const listenTranslateBankG3U4b = [
  { sentence: "What's that?", options: ["那是什么？", "这是什么？", "这是你的吗？", "那谁是？"], correct: 0 },
  { sentence: "It's an elephant.", options: ["它是一头大象。", "它是一只虎。", "它是一只鸟。", "它是一只鸭子。"], correct: 0 },
  { sentence: "It's a monkey.", options: ["它是一只小猫。", "它是一头大象。", "它是一只大熊猫。", "它是一只猴子。"], correct: 3 },
  { sentence: "Look at the tiger.", options: ["看那只猫。", "看那只猪。", "看那只狗。", "看那只老虎。"], correct: 3 },
  { sentence: "Act like a panda.", options: ["扮演一只老虎。", "扮演一只熊猫。", "扮演一只猴子。", "扮演一只鸭子。"], correct: 1 }
]
