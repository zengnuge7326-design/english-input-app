// PEP三年级上册 Unit 5 Part A《Let's eat!》题库
// 主题：食物与饮料1 (bread, juice, egg, milk) + I'd like some... / Here you are.
// 7种题型，每种5题，共35题

export const quizBankG3U5a = [
  { question: "I'd like ___ juice, please.", chinese: "请给我一些果汁。", options: ["some", "a", "an", "two"], correct: 0, explanation: "juice是不可数名词，用some修饰。", tag: "语法" },
  { question: "Here you ___.", chinese: "给你。", options: ["are", "is", "am", "do"], correct: 0, explanation: "Here you are 是固定搭配，表示“给你”。", tag: "交际" },
  { question: "Have ___ bread.", chinese: "吃点面包吧。", options: ["some", "a", "an", "the"], correct: 0, explanation: "bread为不可数名词，用some修饰。", tag: "语法" },
  { question: "I'd like an ___.", chinese: "我想要一个鸡蛋。", options: ["egg", "milk", "bread", "juice"], correct: 0, explanation: "an修饰元音音素开头的单数名词，egg符合。", tag: "冠词" },
  { question: "___, thank you.", chinese: "好的，谢谢你。", options: ["No", "Yes", "OK", "Not"], correct: 2, explanation: "OK, thank you (好的，谢谢你)。", tag: "交际" }
]

export const fillblankBankG3U5a = [
  { sentence: "I'd like some ___ (果汁), please.", answer: "juice", chinese: "请给我一些果汁。", explanation: "juice 果汁", tag: "词汇" },
  { sentence: "I'd like some ___ (面包).", answer: "bread", chinese: "我想要些面包。", explanation: "bread 面包", tag: "词汇" },
  { sentence: "Have some ___ (牛奶).", answer: "milk", chinese: "喝点牛奶吧。", explanation: "milk 牛奶", tag: "词汇" },
  { sentence: "I'd like an ___ (鸡蛋).", answer: "egg", chinese: "我想要一个鸡蛋。", explanation: "egg 鸡蛋", tag: "词汇" },
  { sentence: "Here you ___ (是).", answer: "are", chinese: "给你。", explanation: "Here you are 给你。", tag: "交际" }
]

export const listenWordBankG3U5a = [
  { word: "juice", options: ["juice", "jump", "blue", "shoes"], correct: 0, zh: "果汁" },
  { word: "bread", options: ["red", "read", "head", "bread"], correct: 3, zh: "面包" },
  { word: "milk", options: ["silk", "milk", "walk", "make"], correct: 1, zh: "牛奶" },
  { word: "egg", options: ["leg", "egg", "eight", "elephant"], correct: 1, zh: "鸡蛋" },
  { word: "some", options: ["come", "same", "some", "sun"], correct: 2, zh: "一些" }
]

export const listenSentenceBankG3U5a = [
  { sentence: "I'd like some juice, please.", zh: "请给我一些果汁。", options: ["I'd like some milk, please.", "I'd like some juice, please.", "I'd like some water, please.", "I'd like some bread, please."], correct: 1 },
  { sentence: "Here you are.", zh: "给你。", options: ["Here it is.", "Here you are.", "Thank you.", "Excuse me."], correct: 1 },
  { sentence: "Have some bread.", zh: "吃点面包。", options: ["Have some milk.", "Have some eggs.", "Have some cake.", "Have some bread."], correct: 3 },
  { sentence: "I'd like an egg, please.", zh: "请给我一个鸡蛋。", options: ["I'd like an apple, please.", "I'd like an egg, please.", "I'd like a pear, please.", "I'd like an eraser."], correct: 1 },
  { sentence: "OK, thank you.", zh: "好的，谢谢你。", options: ["No, thank you.", "OK, thank you.", "You're welcome.", "Goodbye."], correct: 1 }
]

export const listenOrderBankG3U5a = [
  { sentence: "I'd like some juice.", zh: "我想要些果汁。", words: ["I'd", "like", "some", "juice."], answer: ["I'd", "like", "some", "juice."] },
  { sentence: "Here you are.", zh: "给你。", words: ["Here", "you", "are."], answer: ["Here", "you", "are."] },
  { sentence: "Have some bread.", zh: "吃点面包吧。", words: ["Have", "some", "bread."], answer: ["Have", "some", "bread."] },
  { sentence: "I'd like an egg, please.", zh: "请给我一个鸡蛋。", words: ["I'd", "like", "an", "egg,", "please."], answer: ["I'd", "like", "an", "egg,", "please."] },
  { sentence: "OK, thank you.", zh: "好的，谢谢你。", words: ["OK,", "thank", "you."], answer: ["OK,", "thank", "you."] }
]

export const listenResponseBankG3U5a = [
  { question: "I'd like some juice, please.", zh: "请给我来些果汁。", options: ["Here you are.", "Me too.", "Goodbye.", "What's this?"], correct: 0 },
  { question: "Have some bread.", zh: "吃点面包吧。", options: ["Thank you.", "It's a pig.", "Yes, it is.", "Hello."], correct: 0 },
  { question: "Here you are.", zh: "给你。", options: ["Thank you.", "Goodbye.", "Yes.", "I am Jack."], correct: 0 },
  { question: "I'd like an egg.", zh: "我想要一个鸡蛋。", options: ["Here you are.", "It's a bird.", "Good morning.", "No."], correct: 0 },
  { question: "Have some milk.", zh: "喝点牛奶吧。", options: ["Thanks.", "Me too.", "I'm OK.", "See you."], correct: 0 }
]

export const listenTranslateBankG3U5a = [
  { sentence: "I'd like some juice, please.", options: ["请给我一些水。", "请给我一些果汁。", "请给我一些牛奶。", "请给我一些面包。"], correct: 1 },
  { sentence: "Here you are.", options: ["给你。", "他在哪。", "你在哪。", "那是你的。"], correct: 0 },
  { sentence: "Have some bread.", options: ["吃点蛋糕吧。", "吃点米饭吧。", "喝点果汁吧。", "吃点面包吧。"], correct: 3 },
  { sentence: "I'd like an egg.", options: ["我想要一个苹果。", "我想要一个鸡蛋。", "我想要一些面包。", "我想要一些牛奶。"], correct: 1 },
  { sentence: "Thank you.", options: ["你好。", "不用谢。", "很好。", "谢谢你。"], correct: 3 }
]
