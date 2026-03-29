// PEP四年级下册 Unit 3 Part C《Story time / Let's check》题库
// 主题：Unit 3 综合复习 (天气 + 穿衣搭配)
// 7种题型，每种5题，共35题

export const quizBank3c = [
  { question: "___ you swim? No, I can't.", chinese: "你会游泳吗？不，我不会。", options: ["Can", "Do", "Are", "Is"], correct: 0, explanation: "回答是 No, I can't，所以问句是 Can you...?", tag: "语法" },
  { question: "Is it ___ the desk?", chinese: "它在书桌上面吗？", options: ["on", "in", "to", "at"], correct: 0, explanation: "在...上面是 on。", tag: "介词" },
  { question: "Look at the ___. It's a sunny day.", chinese: "看看太阳。今天是个晴天。", options: ["sun", "cloud", "rain", "snow"], correct: 0, explanation: "sunny (晴朗的) 是由于看到 sun (太阳)。", tag: "词汇" },
  { question: "It's cold. You should ___ your hat.", chinese: "很冷。你应该戴上帽子。", options: ["put on", "take off", "look at", "go out"], correct: 0, explanation: "冷的时候要 put on (穿上/戴上) 衣物。", tag: "短语" },
  { question: "The weather is very ___. I can fly my kite.", chinese: "天气风很大。我可以放风筝。", options: ["windy", "snowy", "rainy", "hot"], correct: 0, explanation: "放风筝需要有风 (windy)。", tag: "常识" }
]

export const fillblankBank3c = [
  { sentence: "What's the ___ (天气) like in Beijing?", answer: "weather", chinese: "北京的天气怎么样？", explanation: "weather 天气。", tag: "词汇" },
  { sentence: "It's ___ (温暖的) and sunny.", answer: "warm", chinese: "天气温暖又晴朗。", explanation: "warm 温暖的。", tag: "拼写" },
  { sentence: "Can I wear my new ___ (衬衫)?", answer: "shirt", chinese: "我可以穿我的新衬衫吗？", explanation: "shirt 衬衫。", tag: "词汇" },
  { sentence: "Yes, you ___. It's hot.", answer: "can", chinese: "是的，你可以。天气很热。", explanation: "肯定回答 Yes, you can.", tag: "语法" },
  { sentence: "It's cold! ___ (关上) the window, please.", answer: "Close", chinese: "好冷！请关上窗户。", explanation: "close 关上。", tag: "短语" }
]

export const listenWordBank3c = [
  { word: "weather", options: ["sweater", "weather", "feather", "leather"], correct: 1, zh: "天气" },
  { word: "sunny", options: ["son", "sunny", "sun", "Sunday"], correct: 1, zh: "晴朗的" },
  { word: "cold", options: ["coat", "code", "cold", "old"], correct: 2, zh: "冷的" },
  { word: "outside", options: ["outside", "inside", "out", "side"], correct: 0, zh: "外面" },
  { word: "fly", options: ["fly", "fry", "cry", "try"], correct: 0, zh: "飞/放" }
]

export const listenSentenceBank3c = [
  { sentence: "What's the weather like?", zh: "天气怎么样？", options: ["What's the weather like?", "What time is it?", "How are you?", "What's your name?"], correct: 0 },
  { sentence: "It's warm and sunny.", zh: "温暖且晴朗。", options: ["It's cold and snowy.", "It's cool and windy.", "It's hot and sunny.", "It's warm and sunny."], correct: 3 },
  { sentence: "Can I wear my shirt?", zh: "我可以穿衬衫吗？", options: ["Can I wear my skirt?", "Can I wear my pants?", "Can I wear my shirt?", "Can I wear my hat?"], correct: 2 },
  { sentence: "Yes, you can.", zh: "是的，你可以。", options: ["No, you can't.", "Yes, you can.", "Yes, I am.", "No, it isn't."], correct: 1 },
  { sentence: "It's cold outside.", zh: "外面很冷。", options: ["It's cold inside.", "It's hot outside.", "It's cold outside.", "It's warm outside."], correct: 2 }
]

export const listenOrderBank3c = [
  { sentence: "What's the weather like today?", zh: "今天天气怎么样？", words: ["What's", "the", "weather", "like", "today?"], answer: ["What's", "the", "weather", "like", "today?"] },
  { sentence: "It's warm and sunny.", zh: "温暖又晴朗。", words: ["It's", "warm", "and", "sunny."], answer: ["It's", "warm", "and", "sunny."] },
  { sentence: "Can I go outside?", zh: "我能出去吗？", words: ["Can", "I", "go", "outside?"], answer: ["Can", "I", "go", "outside?"] },
  { sentence: "Put on your hat.", zh: "戴上你的帽子。", words: ["Put", "on", "your", "hat."], answer: ["Put", "on", "your", "hat."] },
  { sentence: "Have some warm water.", zh: "喝点温水。", words: ["Have", "some", "warm", "water."], answer: ["Have", "some", "warm", "water."] }
]

export const listenResponseBank3c = [
  { question: "What's the weather like in New York?", zh: "纽约天气怎么样？", options: ["I like New York.", "It's rainy.", "Yes, it is.", "No, it doesn't."], correct: 1 },
  { question: "Is it cold outside?", zh: "外面冷吗？", options: ["Yes, it is. Put on a coat.", "I am cold.", "It's a coat.", "No, it is."], correct: 0 },
  { question: "Can I have some soup?", zh: "我能喝点汤吗？", options: ["Yes, you can.", "Soup is good.", "It is hot.", "I don't know."], correct: 0 },
  { question: "What are you doing?", zh: "你在做什么？", options: ["I am reading a book.", "It's raining.", "This is a book.", "Yes, I am."], correct: 0 },
  { question: "Let's fly a kite.", zh: "我们去放风筝吧。", options: ["Great!", "No, I am not.", "It is a kite.", "Windy."], correct: 0 }
]

export const listenTranslateBank3c = [
  { sentence: "What's the weather like in Beijing?", options: ["北京天气怎么样？", "北京在哪里？", "你喜欢北京吗？", "北京冷吗？"], correct: 0 },
  { sentence: "It's hot and sunny.", options: ["又热又晴朗。", "又冷又下雪。", "又凉爽又多风。", "又暖和又多云。"], correct: 0 },
  { sentence: "Can I go outside now?", options: ["我现在能回家吗？", "我现在能出去吗？", "我现在能进来吗？", "我现在能玩吗？"], correct: 1 },
  { sentence: "No, you can't. It's too cold.", options: ["是的，你可以。天气很热。", "不，你不能。太热了。", "不，你不能。太冷了。", "是的，外边很冷。"], correct: 2 },
  { sentence: "Put on your coat.", options: ["脱掉你的外套。", "穿上你的外套。", "戴上你的帽子。", "穿上你的鞋子。"], correct: 1 }
]
