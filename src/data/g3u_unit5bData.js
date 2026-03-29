// PEP三年级上册 Unit 5 Part B《Let's learn / Let's talk》题库
// 主题：食物与饮料2 (water, cake, fish, rice) + Can I have some...? You're welcome.
// 7种题型，每种5题，共35题

export const quizBankG3U5b = [
  { question: "Can I ___ some water, please?", chinese: "请给我一些水好吗？", options: ["have", "has", "eat", "look"], correct: 0, explanation: "Can I have... 是固定请求句型，意为“我能要一些...吗”。", tag: "语法" },
  { question: "___ welcome.", chinese: "不用谢。", options: ["You", "Your", "You're", "I'm"], correct: 2, explanation: "You're welcome 意为“不用谢”。", tag: "交际" },
  { question: "Have some ___.", chinese: "吃点米饭吧。", options: ["rice", "water", "juice", "milk"], correct: 0, explanation: "虽然可以喝奶/汁/水，但米饭也是不可数名词且常用于此处搭配食用的语境。", tag: "词汇" },
  { question: "Here ___ are.", chinese: "给你。", options: ["you", "your", "I", "me"], correct: 0, explanation: "Here you are.", tag: "交际" },
  { question: "Cut the ___.", chinese: "切蛋糕。", options: ["cake", "water", "rice", "juice"], correct: 0, explanation: "只有 cake (蛋糕) 适合 cut (切) 这个动作。", tag: "生活常识" }
]

export const fillblankBankG3U5b = [
  { sentence: "Can I ___ (有/要) some water, please?", answer: "have", chinese: "请给我一些水好吗？", explanation: "have 这里指要、吃喝。", tag: "动词" },
  { sentence: "You're ___ (受欢迎的/不用谢).", answer: "welcome", chinese: "不用谢。", explanation: "You're welcome", tag: "交际" },
  { sentence: "Have some ___ (鱼肉).", answer: "fish", chinese: "吃点鱼吧。", explanation: "fish 鱼", tag: "词汇" },
  { sentence: "Have some ___ (米饭).", answer: "rice", chinese: "吃点米饭吧。", explanation: "rice 米饭", tag: "词汇" },
  { sentence: "Cut the ___ (蛋糕).", answer: "cake", chinese: "切蛋糕。", explanation: "cake 蛋糕", tag: "词汇" }
]

export const listenWordBankG3U5b = [
  { word: "water", options: ["waiter", "water", "watch", "wall"], correct: 1, zh: "水" },
  { word: "cake", options: ["lake", "take", "make", "cake"], correct: 3, zh: "蛋糕" },
  { word: "fish", options: ["dish", "wish", "face", "fish"], correct: 3, zh: "鱼" },
  { word: "rice", options: ["nice", "mice", "ice", "rice"], correct: 3, zh: "米饭" },
  { word: "welcome", options: ["welcome", "income", "window", "woman"], correct: 0, zh: "不用谢/欢迎" }
]

export const listenSentenceBankG3U5b = [
  { sentence: "Can I have some water, please?", zh: "请给我一些水好吗？", options: ["Can I have some milk, please?", "Can I have some water, please?", "Can I have some juice, please?", "I'd like some water, please."], correct: 1 },
  { sentence: "You're welcome.", zh: "不用谢。", options: ["Thank you.", "You're welcome.", "Here you are.", "Yes, please."], correct: 1 },
  { sentence: "Have some fish.", zh: "吃点鱼吧。", options: ["Have some rice.", "Have some meat.", "Have some cake.", "Have some fish."], correct: 3 },
  { sentence: "Cut the cake.", zh: "切蛋糕。", options: ["Eat the cake.", "Make a cake.", "Cut the cake.", "Buy a cake."], correct: 2 },
  { sentence: "Eat some rice.", zh: "吃点米饭。", options: ["Drink some water.", "Have some fish.", "Eat some rice.", "Cut the cake."], correct: 2 }
]

export const listenOrderBankG3U5b = [
  { sentence: "Can I have some water?", zh: "你能给我一些水吗？", words: ["Can", "I", "have", "some", "water?"], answer: ["Can", "I", "have", "some", "water?"] },
  { sentence: "You are welcome.", zh: "不用谢。", words: ["You", "are", "welcome."], answer: ["You", "are", "welcome."] },
  { sentence: "Have some fish.", zh: "吃点鱼吧。", words: ["Have", "some", "fish."], answer: ["Have", "some", "fish."] },
  { sentence: "Cut the cake.", zh: "切开这个蛋糕。", words: ["Cut", "the", "cake."], answer: ["Cut", "the", "cake."] },
  { sentence: "Here you are.", zh: "给你。", words: ["Here", "you", "are."], answer: ["Here", "you", "are."] }
]

export const listenResponseBankG3U5b = [
  { question: "Can I have some water, please?", zh: "请给我一些水好吗？", options: ["Here you are.", "Me too.", "No, it isn't.", "Hello."], correct: 0 },
  { question: "Here you are.", zh: "给你。", options: ["Thank you.", "Hello.", "See you.", "Goodbye."], correct: 0 },
  { question: "Thank you.", zh: "谢谢你。", options: ["You're welcome.", "Me too.", "It's a cake.", "Goodbye."], correct: 0 },
  { question: "Have some cake.", zh: "吃点蛋糕吧。", options: ["Thanks.", "I am Mike.", "Good morning.", "Bye."], correct: 0 },
  { question: "What's this?", zh: "这是什么？", options: ["It's rice.", "My name's John.", "I have some water.", "Yes, it is."], correct: 0 }
]

export const listenTranslateBankG3U5b = [
  { sentence: "Can I have some water, please?", options: ["我可以喝点果汁吗？", "我可以喝点水吗？", "我能吃点面包吗？", "我想要一块蛋糕。"], correct: 1 },
  { sentence: "You're welcome.", options: ["你好吗？", "给你。", "不用谢。", "很高兴认识你。"], correct: 2 },
  { sentence: "Have some fish.", options: ["吃点小鱼干。", "吃只烤鸭。", "吃点猪肉。", "吃点鱼吧。"], correct: 3 },
  { sentence: "Cut the cake.", options: ["切蛋糕。", "吃蛋糕。", "这是一个蛋糕。", "我喜欢蛋糕。"], correct: 0 },
  { sentence: "Eat some rice.", options: ["喝点汤。", "吃点面包。", "喝点水。", "吃点米饭。"], correct: 3 }
]
