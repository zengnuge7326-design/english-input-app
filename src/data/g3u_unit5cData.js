// PEP三年级上册 Unit 5 Part C《Story time / Let's check》题库
// 主题：Unit 5 综合复习 (所有食物饮料与点餐)
// 7种题型，每种5题，共35题

export const quizBankG3U5c = [
  { question: "Can I ___ some bread, please?", chinese: "请给我一些面包好吗？", options: ["have", "has", "had", "look"], correct: 0, explanation: "情态动词 Can 后接动词原形。", tag: "语法" },
  { question: "Here ___ are.", chinese: "给你。", options: ["I", "you", "he", "it"], correct: 1, explanation: "Here you are (给你)。", tag: "交际" },
  { question: "___, thank you.", chinese: "好的，谢谢你。", options: ["OK", "Not", "To", "Is"], correct: 0, explanation: "OK, thank you.", tag: "交际" },
  { question: "I'd like ___ egg, please.", chinese: "请给我一个鸡蛋。", options: ["a", "an", "the", "some"], correct: 1, explanation: "egg 单数前面用 an。", tag: "冠词" },
  { question: "Cut the ___.", chinese: "切蛋糕。", options: ["water", "juice", "milk", "cake"], correct: 3, explanation: "不可数液体不能 cut，可以切蛋糕。", tag: "生活常识" }
]

export const fillblankBankG3U5c = [
  { sentence: "I'd ___ (想要) some juice, please.", answer: "like", chinese: "请给我一些果汁。", explanation: "I'd like = I would like", tag: "词汇" },
  { sentence: "Can I ___ (要) some water?", answer: "have", chinese: "能给我一些水吗？", explanation: "have 要/吃/喝", tag: "动词" },
  { sentence: "Here you ___ (are).", answer: "are", chinese: "给你。", explanation: "are", tag: "交际" },
  { sentence: "You're ___ (不用谢).", answer: "welcome", chinese: "不用谢。", explanation: "welcome", tag: "交际" },
  { sentence: "Have some ___ (面包).", answer: "bread", chinese: "吃点面包吧。", explanation: "bread", tag: "词汇" }
]

export const listenWordBankG3U5c = [
  { word: "juice", options: ["jump", "juice", "june", "ice"], correct: 1, zh: "果汁" },
  { word: "rice", options: ["nice", "mice", "rice", "ice"], correct: 2, zh: "米饭" },
  { word: "water", options: ["water", "waiter", "winter", "wall"], correct: 0, zh: "水" },
  { word: "fish", options: ["dish", "wish", "fish", "face"], correct: 2, zh: "鱼" },
  { word: "bread", options: ["red", "bread", "head", "bed"], correct: 1, zh: "面包" }
]

export const listenSentenceBankG3U5c = [
  { sentence: "I'd like some juice, please.", zh: "请给我一些果汁。", options: ["I'd like some water, please.", "I'd like some milk, please.", "I'd like some juice, please.", "Can I have some juice, please?"], correct: 2 },
  { sentence: "Can I have some water?", zh: "能给我些水吗？", options: ["Can I have some milk?", "Can I have some juice?", "Can I have some rice?", "Can I have some water?"], correct: 3 },
  { sentence: "Here you are.", zh: "给你。", options: ["Here I am.", "Here it is.", "Here you are.", "You're welcome."], correct: 2 },
  { sentence: "You're welcome.", zh: "不用谢。", options: ["Thank you.", "You're welcome.", "Me too.", "Goodbye."], correct: 1 },
  { sentence: "Have some bread.", zh: "吃点面包。", options: ["Have some cake.", "Have some bread.", "Have some rice.", "Have some fish."], correct: 1 }
]

export const listenOrderBankG3U5c = [
  { sentence: "Can I have some juice?", zh: "能给我一些果汁吗？", words: ["Can", "I", "have", "some", "juice?"], answer: ["Can", "I", "have", "some", "juice?"] },
  { sentence: "I'd like an egg, please.", zh: "请给我一个鸡蛋。", words: ["I'd", "like", "an", "egg,", "please."], answer: ["I'd", "like", "an", "egg,", "please."] },
  { sentence: "Here you are.", zh: "给你。", words: ["Here", "you", "are."], answer: ["Here", "you", "are."] },
  { sentence: "You are welcome.", zh: "不用谢。", words: ["You", "are", "welcome."], answer: ["You", "are", "welcome."] },
  { sentence: "Have some water.", zh: "喝点水吧。", words: ["Have", "some", "water."], answer: ["Have", "some", "water."] }
]

export const listenResponseBankG3U5c = [
  { question: "I'd like some fish, please.", zh: "请给我些鱼。", options: ["Here you are.", "Me too.", "Good morning.", "Hello."], correct: 0 },
  { question: "Thank you.", zh: "谢谢你。", options: ["You're welcome.", "Goodbye.", "Yes.", "I see red."], correct: 0 },
  { question: "Can I have some water?", zh: "能给我一些水吗？", options: ["Here you are.", "It's a cat.", "Bye.", "Me too."], correct: 0 },
  { question: "Have some cake.", zh: "吃点蛋糕吧。", options: ["Thanks.", "I am Mike.", "Goodbye.", "Yes, it is."], correct: 0 },
  { question: "What's that?", zh: "那是什么？", options: ["It's bread.", "My name's Sarah.", "I'm fine.", "Here you are."], correct: 0 }
]

export const listenTranslateBankG3U5c = [
  { sentence: "Can I have some water?", options: ["我可以喝点水吗？", "我可以喝点果汁吗？", "我可以喝点牛奶吗？", "我可以吃面包吗？"], correct: 0 },
  { sentence: "I'd like some rice, please.", options: ["请给我一些鱼。", "请给我一些面包。", "请给我一些米饭。", "请给我一个蛋糕。"], correct: 2 },
  { sentence: "Here you are.", options: ["谢谢。", "不用谢。", "给你。", "他在哪。"], correct: 2 },
  { sentence: "You're welcome.", options: ["你好吗？", "不用谢。", "谢谢你。", "再见。"], correct: 1 },
  { sentence: "Have some fish.", options: ["吃点鱼吧。", "吃点米饭吧。", "喝点水吧。", "切蛋糕。"], correct: 0 }
]
