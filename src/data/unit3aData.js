// PEP四年级下册 Unit 3 Part A《Weather》题库
// 主题：天气状况的表达 (cold, warm, hot, cool) + What's the weather like?
// 7种题型，每种5题，共35题

export const quizBank3a = [
  { question: "What's the weather ___ in Beijing?", chinese: "北京的天气怎么样？", options: ["like", "look", "love", "light"], correct: 0, explanation: "What's the weather like? 是询问天气情况的固定句型。", tag: "句型" },
  { question: "It's ___ outside. Put on your coat.", chinese: "外面很冷。穿上你的外套。", options: ["hot", "cold", "warm", "cool"], correct: 1, explanation: "需要穿外套，说明天气很cold（冷）。", tag: "词汇" },
  { question: "___ you fly a kite? Yes, I can.", chinese: "你会放风筝吗？是的，我会。", options: ["Are", "Do", "Can", "Is"], correct: 2, explanation: "回答是 Yes, I can. 问句一定是用 Can 提问：Can you...?", tag: "语法" },
  { question: "It's very hot in ___.", chinese: "这里很热。", options: ["here", "there", "where", "hear"], correct: 0, explanation: "in here 在这里（强调在里面）。", tag: "词汇" },
  { question: "The weather is ___. We can go swimming.", chinese: "天气很热。我们可以去游泳。", options: ["cold", "cool", "hot", "warm"], correct: 2, explanation: "去游泳(go swimming)通常因为天气 hot（热）。", tag: "词组" }
]

export const fillblankBank3a = [
  { sentence: "What's the weather ___ in London?", answer: "like", chinese: "伦敦的天气怎么样？", explanation: "询问天气：What's the weather like?", tag: "句型" },
  { sentence: "It's cold ___ (在外面)!", answer: "outside", chinese: "外面很冷！", explanation: "outside 外面。", tag: "词汇" },
  { sentence: "It's ___ (凉爽的) today.", answer: "cool", chinese: "今天很凉爽。", explanation: "cool 凉爽的。", tag: "词汇" },
  { sentence: "Is it ___ (温暖的) in Beijing?", answer: "warm", chinese: "北京暖和吗？", explanation: "warm 温暖的。", tag: "词汇" },
  { sentence: "Can I ___ (穿上) my shirt?", answer: "put on", chinese: "我可以穿上我的衬衫吗？", explanation: "put on 穿上（表示动作）。", tag: "短语" }
]

export const listenWordBank3a = [
  { word: "weather", options: ["weather", "whether", "water", "father"], correct: 0, zh: "天气" },
  { word: "cold", options: ["cool", "cold", "old", "coat"], correct: 1, zh: "冷的" },
  { word: "warm", options: ["warm", "worm", "warn", "wall"], correct: 0, zh: "温暖的" },
  { word: "hot", options: ["hat", "hit", "hot", "hut"], correct: 2, zh: "热的" },
  { word: "outside", options: ["inside", "outside", "aside", "outset"], correct: 1, zh: "在外面" }
]

export const listenSentenceBank3a = [
  { sentence: "What's the weather like?", zh: "天气怎么样？", options: ["What's the weather like?", "How's the weather?", "What's your name?", "What time is it?"], correct: 0 },
  { sentence: "It's cold and windy.", zh: "天气又冷又刮风。", options: ["It's hot and sunny.", "It's cool and rainy.", "It's cold and windy.", "It's warm and cloudy."], correct: 2 },
  { sentence: "Can I go outside now?", zh: "我现在能出去吗？", options: ["Can I go inside now?", "Can I go outside now?", "Can you go outside?", "Are you outside?"], correct: 1 },
  { sentence: "No, you can't. It's too cold.", zh: "不，你不能。太冷了。", options: ["Yes, you can.", "No, you can't. It's too cold.", "No, it's not hot.", "No, you can't. It's late."], correct: 1 },
  { sentence: "Have some hot soup.", zh: "喝点热汤吧。", options: ["Have some hot soup.", "Have some cold water.", "Have some hot tea.", "Drink some hot soup."], correct: 0 }
]

export const listenOrderBank3a = [
  { sentence: "What's the weather like in New York?", zh: "纽约的天气怎么样？", words: ["What's", "the", "weather", "like", "in", "New", "York?"], answer: ["What's", "the", "weather", "like", "in", "New", "York?"] },
  { sentence: "It's warm and sunny today.", zh: "今天温暖又晴朗。", words: ["It's", "warm", "and", "sunny", "today."], answer: ["It's", "warm", "and", "sunny", "today."] },
  { sentence: "Can I go outside?", zh: "我能出去吗？", words: ["Can", "I", "go", "outside?"], answer: ["Can", "I", "go", "outside?"] },
  { sentence: "Yes, you can.", zh: "是的，你可以。", words: ["Yes,", "you", "can."], answer: ["Yes,", "you", "can."] },
  { sentence: "It's time for lunch.", zh: "该吃午饭了。", words: ["It's", "time", "for", "lunch."], answer: ["It's", "time", "for", "lunch."] }
]

export const listenResponseBank3a = [
  { question: "What's the weather like?", zh: "天气怎么样？", options: ["It's my book.", "It's rainy.", "I like apples.", "It's 10 o'clock."], correct: 1 },
  { question: "Can I have some soup?", zh: "我能喝点汤吗？", options: ["Yes, you can.", "I am a student.", "Soup is hot.", "No, it is."], correct: 0 },
  { question: "Is it cold in Beijing?", zh: "北京冷吗？", options: ["Yes, it is.", "Yes, Beijing.", "It is a city.", "No, it's a cat."], correct: 0 },
  { question: "What time is it?", zh: "几点了？", options: ["It's hot.", "It's time for school.", "It's seven o'clock.", "It's windy."], correct: 2 },
  { question: "It's very cold outside.", zh: "外面很冷。", options: ["Put on your hat.", "Take off your shoes.", "Let's go swimming.", "I like ice cream."], correct: 0 }
]

export const listenTranslateBank3a = [
  { sentence: "What's the weather like in Sydney?", options: ["悉尼的天气怎么样？", "伦敦的天气怎么样？", "北京的天气怎么样？", "新加坡的天气怎么样？"], correct: 0 },
  { sentence: "It's hot and sunny.", options: ["今天是阴天。", "天气又热又晴朗。", "天气又冷又下雪。", "天气很凉爽。"], correct: 1 },
  { sentence: "Be careful! It's very hot.", options: ["当心！这里很冷。", "小心！这个很热。", "慢慢走！天黑了。", "闭嘴！太吵了。"], correct: 1 },
  { sentence: "Can I have some warm water?", options: ["我能喝点冰水吗？", "我能喝点热水吗？", "我能喝点温水吗？", "我能吃点温的食物吗？"], correct: 2 },
  { sentence: "Put on your jacket.", options: ["脱下你的大衣。", "穿上你的夹克。", "穿上你的鞋子。", "拿走你的书。"], correct: 1 }
]
