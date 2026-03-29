// PEP四年级下册 Unit 3 Part B《Let's learn / Let's talk》题库
// 主题：天气特征形容词 (rainy, snowy, windy, cloudy, sunny) + Is it...? 问句 + ar/al 语音
// 7种题型，每种5题，共35题

export const quizBank3b = [
  { question: "Is it ___ (刮风的) in Beijing?", chinese: "北京刮风吗？", options: ["wind", "windy", "rainy", "snow"], correct: 1, explanation: "windy 刮风的。在 Is it... 的句型中要用形容词。", tag: "词汇" },
  { question: "___! It's raining outside.", chinese: "糟糕！外面下雨了。", options: ["Oh, no", "Oh, yes", "Great", "Cool"], correct: 0, explanation: "下雨不能出去玩，所以感叹 Oh, no! (糟糕)。", tag: "交际" },
  { question: "It's ___ in Harbin. We can make a snowman.", chinese: "哈尔滨在下雪。我们可以堆雪人。", options: ["sunny", "cloudy", "snowy", "rainy"], correct: 2, explanation: "堆雪人(make a snowman)需要 snowy(下雪的) 的天气。", tag: "词汇" },
  { question: "Which word has the same 'ar' sound as 'car'?", chinese: "哪个词里的 ar 发音像 car 里的一样？", options: ["arm", "warm", "ward", "war"], correct: 0, explanation: "car 和 arm 中的 ar 都发 /ɑː/ 的音。", tag: "拼读" },
  { question: "How about New York? ___ it rain?", chinese: "纽约怎么样？下雨吗？", options: ["Do", "Is", "Are", "Does"], correct: 1, explanation: "这里是问 Is it rainy? 或 Is it raining? 原文中常用 Is it (表示天气)。如果直接用动词 rain，应为 Does it rain? 但教材主要教形容词形式 Is it rainy?", tag: "语法" }
]

export const fillblankBank3b = [
  { sentence: "It's ___ (晴朗的) today.", answer: "sunny", chinese: "今天很晴朗。", explanation: "sunny 晴朗的。", tag: "词汇" },
  { sentence: "Is it ___ (多云的) in London?", answer: "cloudy", chinese: "伦敦多云吗？", explanation: "cloudy 多云的。", tag: "词汇" },
  { sentence: "No, it ___. It's sunny.", answer: "isn't", chinese: "不，不多云。是晴天。", explanation: "Is it... 否定回答 No, it isn't.", tag: "语法" },
  { sentence: "He is playing with a ___ (球).", answer: "ball", chinese: "他在玩球。", explanation: "ball 球。al 发 /ɔː/。", tag: "拼写" },
  { sentence: "The tall man has a long ___ (手臂).", answer: "arm", chinese: "那个高个子的男人有长手臂。", explanation: "arm 手臂。ar 发 /ɑː/。", tag: "拼读" }
]

export const listenWordBank3b = [
  { word: "windy", options: ["window", "windy", "wendy", "winter"], correct: 1, zh: "刮风的" },
  { word: "snowy", options: ["slowly", "snowy", "now", "snore"], correct: 1, zh: "下雪的" },
  { word: "sunny", options: ["son", "sunny", "funny", "sun"], correct: 1, zh: "晴朗的" },
  { word: "cloudy", options: ["cloud", "could", "cloudy", "crowd"], correct: 2, zh: "多云的" },
  { word: "rainy", options: ["rain", "rainy", "brain", "train"], correct: 1, zh: "多雨的" }
]

export const listenSentenceBank3b = [
  { sentence: "Is it sunny in Beijing?", zh: "北京天晴吗？", options: ["Is it sunny in London?", "Is it snowy in Beijing?", "Is it sunny in Beijing?", "Is it cloudy in Beijing?"], correct: 2 },
  { sentence: "No, it isn't.", zh: "不，不是。", options: ["Yes, it is.", "No, it isn't.", "Yes, I am.", "No, I'm not."], correct: 1 },
  { sentence: "Here's the world weather.", zh: "这是世界天气预报。", options: ["Here is the weather.", "Here's the world weather.", "Where is the weather?", "It's the world weather."], correct: 1 },
  { sentence: "It's rainy in London.", zh: "伦敦在下雨。", options: ["It's snowy in London.", "It's rainy in London.", "It's windy in London.", "It's sunny in London."], correct: 1 },
  { sentence: "How about New York?", zh: "纽约怎么样？", options: ["Where is New York?", "How about New York?", "I like New York.", "New York is big."], correct: 1 }
]

export const listenOrderBank3b = [
  { sentence: "Is it rainy in London?", zh: "伦敦在下雨吗？", words: ["Is", "it", "rainy", "in", "London?"], answer: ["Is", "it", "rainy", "in", "London?"] },
  { sentence: "No, it isn't.", zh: "不，不是。", words: ["No,", "it", "isn't."], answer: ["No,", "it", "isn't."] },
  { sentence: "It's sunny and warm.", zh: "天气晴朗又温暖。", words: ["It's", "sunny", "and", "warm."], answer: ["It's", "sunny", "and", "warm."] },
  { sentence: "How about New York?", zh: "纽约怎么样？", words: ["How", "about", "New", "York?"], answer: ["How", "about", "New", "York?"] },
  { sentence: "The tall man is my father.", zh: "那个高个子的男人是我爸爸。", words: ["The", "tall", "man", "is", "my", "father."], answer: ["The", "tall", "man", "is", "my", "father."] }
]

export const listenResponseBank3b = [
  { question: "Is it snowy in Harbin?", zh: "哈尔滨在下雪吗？", options: ["Yes, it does.", "No, it doesn't.", "Yes, it is.", "I like snow."], correct: 2 },
  { question: "How about Beijing?", zh: "北京的天气怎么样？", options: ["It's rainy and cloudy.", "Beijing is big.", "I live in Beijing.", "Yes, it is."], correct: 0 },
  { question: "What's the weather like?", zh: "天气怎么样？", options: ["I have an apple.", "It's windy.", "It's on the desk.", "It's red."], correct: 1 },
  { question: "Can I go outside?", zh: "我能出去吗？", options: ["Yes. Have a good time.", "No, I don't.", "It's outside.", "I like outside."], correct: 0 },
  { question: "Look at my new kite.", zh: "看看我的新风筝。", options: ["It's beautiful.", "Yes, it is.", "I have a pen.", "A kite."], correct: 0 }
]

export const listenTranslateBank3b = [
  { sentence: "Here's the world weather.", options: ["这是当地天气预报。", "这是世界天气预报。", "我们在世界某处。", "世界那么大。"], correct: 1 },
  { sentence: "Is it cloudy in Singapore?", options: ["新加坡多云吗？", "新加坡下雨吗？", "新加坡刮风吗？", "新加坡天晴吗？"], correct: 0 },
  { sentence: "No, it isn't. It's sunny.", options: ["是的，是多云。", "不，不是。是雨天。", "不，不是。是晴天。", "是的，是晴天。"], correct: 2 },
  { sentence: "How about New York?", options: ["纽约在哪里？", "纽约有多大？", "这是纽约吗？", "纽约怎么样呢？"], correct: 3 },
  { sentence: "It's rainy and cool.", options: ["多雨且凉爽。", "多云且温暖。", "下雪且寒冷。", "晴朗且炎热。"], correct: 0 }
]
