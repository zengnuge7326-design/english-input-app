// PEP四年级下册 Unit 6 Part B《Let's learn / Let's talk》题库
// 主题：评价物品及询问价格 (pretty, expensive, cheap, nice) + How much is it/are they? + er发音
// 7种题型，每种5题，共35题

export const quizBank6b = [
  { question: "___ do you like this skirt?", chinese: "你觉得这条裙子怎么样？", options: ["What", "How", "Where", "Who"], correct: 1, explanation: "How do you like...? = 你觉得...怎么样？常用于征求对某物的评价。", tag: "句型" },
  { question: "It's very ___. I like the colour.", chinese: "它非常漂亮。我喜欢这个颜色。", options: ["pretty", "expensive", "cheap", "too"], correct: 0, explanation: "pretty 漂亮的。后面的 I like the colour 也表达了正面评价。", tag: "词汇" },
  { question: "How ___ is this dress?", chinese: "这件连衣裙多少钱？", options: ["many", "much", "old", "long"], correct: 1, explanation: "How much 问价格。How many 问数量。", tag: "句型" },
  { question: "It's 89 ___. It's too expensive.", chinese: "它要89美元。太贵了。", options: ["yuan", "dollars", "RMB", "coins"], correct: 1, explanation: "在英文购物语境中常用 dollars (美元)。", tag: "词汇" },
  { question: "Which word has the 'er' sound like in 'water'?", chinese: "哪个词的 er 发音和 water 里的发音相同？", options: ["tiger", "her", "term", "verb"], correct: 0, explanation: "water 和 tiger 词尾的 er 发弱读短音 /ə/。其他发长音 /ɜː/。", tag: "拼读" }
]

export const fillblankBank6b = [
  { sentence: "How ___ (多) is this shirt?", answer: "much", chinese: "这件衬衫多少钱？", explanation: "How much 问价格。", tag: "句型" },
  { sentence: "It's very ___ (漂亮的).", answer: "pretty", chinese: "它非常漂亮。", explanation: "pretty 漂亮的。", tag: "词汇" },
  { sentence: "They are too ___ (昂贵的)!", answer: "expensive", chinese: "它们太贵了！", explanation: "expensive 昂贵的。", tag: "词汇" },
  { sentence: "This coat is ___ (便宜的).", answer: "cheap", chinese: "这件外套很便宜。", explanation: "cheap 便宜的。", tag: "词汇" },
  { sentence: "I'll ___ (买，拿) it.", answer: "take", chinese: "我买了。", explanation: "I'll take it. 我买了(我拿下它了)。", tag: "交际" }
]

export const listenWordBank6b = [
  { word: "pretty", options: ["pity", "pretty", "party", "petty"], correct: 1, zh: "漂亮的" },
  { word: "expensive", options: ["expansive", "extensive", "expensive", "inexpensive"], correct: 2, zh: "昂贵的" },
  { word: "cheap", options: ["cheap", "sheep", "chip", "keep"], correct: 0, zh: "便宜的" },
  { word: "much", options: ["march", "match", "much", "mash"], correct: 2, zh: "多少(钱)" },
  { word: "dollars", options: ["doctors", "dollars", "collars", "colours"], correct: 1, zh: "美元" }
]

export const listenSentenceBank6b = [
  { sentence: "How do you like this skirt?", zh: "你觉得这条短裙怎么样？", options: ["How do you like this shirt?", "How do you like this skirt?", "What do you like?", "How much is this skirt?"], correct: 1 },
  { sentence: "It's very pretty.", zh: "它非常漂亮。", options: ["It's very cheap.", "It's very pretty.", "It's very expensive.", "They are very pretty."], correct: 1 },
  { sentence: "How much is this dress?", zh: "这件连衣裙多少钱？", options: ["How much is this shirt?", "How much is this dress?", "How much are these shoes?", "How much is that dress?"], correct: 1 },
  { sentence: "It's eighty-nine dollars.", zh: "它89美元。", options: ["It's ninety-eight dollars.", "It's eighty-nine yuan.", "It's eighty-nine dollars.", "It's eighteen dollars."], correct: 2 },
  { sentence: "It's too expensive.", zh: "它太贵了。", options: ["It's too cheap.", "It's too big.", "It's too small.", "It's too expensive."], correct: 3 }
]

export const listenOrderBank6b = [
  { sentence: "How do you like this skirt?", zh: "你觉得这条短裙怎么样？", words: ["How", "do", "you", "like", "this", "skirt?"], answer: ["How", "do", "you", "like", "this", "skirt?"] },
  { sentence: "It's very pretty.", zh: "它非常漂亮。", words: ["It's", "very", "pretty."], answer: ["It's", "very", "pretty."] },
  { sentence: "How much is it?", zh: "它多少钱？", words: ["How", "much", "is", "it?"], answer: ["How", "much", "is", "it?"] },
  { sentence: "It's too expensive.", zh: "太贵了。", words: ["It's", "too", "expensive."], answer: ["It's", "too", "expensive."] },
  { sentence: "I will take it.", zh: "我买了。", words: ["I", "will", "take", "it."], answer: ["I", "will", "take", "it."] }
]

export const listenResponseBank6b = [
  { question: "How do you like this skirt?", zh: "你觉得这条短裙怎么样？", options: ["It's 89 dollars.", "It's very pretty.", "I like skirts.", "It is blue."], correct: 1 },
  { question: "How much is this shirt?", zh: "这件衬衫多少钱？", options: ["It's too big.", "It's very cheap.", "It's 50 yuan.", "Yes, it is."], correct: 2 },
  { question: "That dress is 300 dollars.", zh: "那件连衣裙要300美元。", options: ["It's very cheap.", "It's too expensive!", "It is pretty.", "I don't like dollars."], correct: 1 },
  { question: "Can I help you?", zh: "我能帮你吗？", options: ["Yes. How much is this?", "Help me.", "I am fine.", "Thank you."], correct: 0 },
  { question: "The sunglasses are 10 yuan.", zh: "这副太阳镜10元。", options: ["They are nice and cheap. I'll take them.", "Too expensive.", "I don't like sunglasses.", "It is cheap."], correct: 0 }
]

export const listenTranslateBank6b = [
  { sentence: "How do you like this skirt?", options: ["你觉得这条裙子怎么样？", "你为什么喜欢这条裙子？", "这条裙子多少钱？", "你喜欢这条裙子吗？"], correct: 0 },
  { sentence: "It's eighty-nine dollars.", options: ["它是89元。", "它89美元。", "它98美元。", "它是18美元。"], correct: 1 },
  { sentence: "It's too expensive.", options: ["它太大了。", "它太小了。", "它太贵了。", "它太便宜了。"], correct: 2 },
  { sentence: "That's cheap. I'll take it.", options: ["那太贵了。我不买了。", "那很漂亮。我买了。", "那很便宜。我买了。", "那很便宜。我要换一个。"], correct: 2 },
  { sentence: "How much are those shoes?", options: ["那双鞋子多少钱？", "这双鞋子多少钱？", "那条裙子多少钱？", "这件衣服多少钱？"], correct: 0 }
]
