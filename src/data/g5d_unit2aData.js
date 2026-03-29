// PEP五年级下册 Unit 2 Part A《My favourite season》题库
// 主题：四季与偏好 (spring, summer, autumn, winter, season, which, best) + Which season do you like best?
// 7种题型，每种5题，共35题

export const quizBankG5D2a = [
  { question: "___ season do you like best?", chinese: "你最喜欢哪个季节？", options: ["Which", "What", "When", "Who"], correct: 0, explanation: "询问哪一个，用哪一个 Which。", tag: "疑问词" },
  { question: "I like spring ___.", chinese: "我最喜欢春天。", options: ["best", "better", "good", "well"], correct: 0, explanation: "最喜欢：like ... best。", tag: "副词最高级" },
  { question: "Summer is ___.", chinese: "夏天很热。", options: ["hot", "cold", "cool", "warm"], correct: 0, explanation: "summer 的特征是 hot。", tag: "形容词" },
  { question: "There are four ___ in a year.", chinese: "一年有四季。", options: ["seasons", "season", "days", "months"], correct: 0, explanation: "There are 后接复数，一年借指四季 (seasons)。", tag: "名词复数" },
  { question: "Autumn is beautiful. The colors are ___.", chinese: "秋天很美。颜色很美丽。", options: ["pretty", "hot", "cold", "warm"], correct: 0, explanation: "pretty 美丽的（用来形容颜色或风景）。", tag: "形容词" }
]

export const fillblankBankG5D2a = [
  { sentence: "___ (哪一个) season do you like best?", answer: "Which", chinese: "你最喜欢哪个季节？", explanation: "Which 哪一个", tag: "疑问代词" },
  { sentence: "I like ___ (春天) best.", answer: "spring", chinese: "我最喜欢春天。", explanation: "spring 春天", tag: "名词" },
  { sentence: "___ (夏天) is hot.", answer: "Summer", chinese: "夏天很热。", explanation: "Summer", tag: "名词" },
  { sentence: "___ (秋天) is golden.", answer: "Autumn", chinese: "秋天是金黄的。", explanation: "Autumn", tag: "名词" },
  { sentence: "___ (冬天) is cold.", answer: "Winter", chinese: "冬天很冷。", explanation: "Winter", tag: "名词" }
]

export const listenWordBankG5D2a = [
  { word: "season", options: ["reason", "season", "sea", "see"], correct: 1, zh: "季节" },
  { word: "spring", options: ["string", "spring", "sing", "bring"], correct: 1, zh: "春天" },
  { word: "summer", options: ["sun", "summer", "supper", "mother"], correct: 1, zh: "夏天" },
  { word: "autumn", options: ["august", "autumn", "auto", "about"], correct: 1, zh: "秋天" },
  { word: "winter", options: ["water", "winner", "winter", "wind"], correct: 2, zh: "冬天" }
]

export const listenSentenceBankG5D2a = [
  { sentence: "Which season do you like best?", zh: "你最喜欢哪个季节？", options: ["What season do you like?", "Which season do you like best?", "Which color do you like best?", "Which fruit do you like best?"], correct: 1 },
  { sentence: "I like spring best.", zh: "我最喜欢春天。", options: ["I like summer best.", "I like spring best.", "I like autumn best.", "I like winter best."], correct: 1 },
  { sentence: "Winter is very cold.", zh: "冬天非常冷。", options: ["Winter is very cool.", "Summer is very hot.", "Winter is very cold.", "Spring is very warm."], correct: 2 },
  { sentence: "There are four seasons.", zh: "有四个季节。", options: ["There are four seasons.", "There are five days.", "We have four seasons.", "They are four children."], correct: 0 },
  { sentence: "Summer is hot.", zh: "夏天很热。", options: ["Spring is warm.", "Winter is cold.", "Autumn is cool.", "Summer is hot."], correct: 3 }
]

export const listenOrderBankG5D2a = [
  { sentence: "Which season do you like best?", zh: "你最喜欢哪个季节？", words: ["Which", "season", "do", "you", "like", "best?"], answer: ["Which", "season", "do", "you", "like", "best?"] },
  { sentence: "I like summer best.", zh: "我最喜欢夏天。", words: ["I", "like", "summer", "best."], answer: ["I", "like", "summer", "best."] },
  { sentence: "Autumn is very beautiful.", zh: "秋天非常漂亮。", words: ["Autumn", "is", "very", "beautiful."], answer: ["Autumn", "is", "very", "beautiful."] },
  { sentence: "Winter is cold.", zh: "冬天很冷。", words: ["Winter", "is", "cold."], answer: ["Winter", "is", "cold."] },
  { sentence: "It is very warm.", zh: "天气非常温暖。", words: ["It", "is", "very", "warm."], answer: ["It", "is", "very", "warm."] }
]

export const listenResponseBankG5D2a = [
  { question: "Which season do you like best?", zh: "你最喜欢哪个季节？", options: ["Winter. It's cold.", "Apples.", "I like monkeys.", "Red."], correct: 0 },
  { question: "Do you like spring?", zh: "你喜欢春天吗？", options: ["Yes, I do.", "No, she doesn't.", "Because it's warm.", "Spring."], correct: 0 },
  { question: "How many seasons are there in a year?", zh: "一年有几个季节？", options: ["Four.", "Seven.", "Twelve.", "Many."], correct: 0 },
  { question: "Is summer cold?", zh: "夏天很冷吗？", options: ["No, it's hot.", "Yes, it is.", "It's autumn.", "I like it."], correct: 0 },
  { question: "I like autumn best.", zh: "我最喜欢秋天。", options: ["Me too.", "It's a tree.", "No, I am not.", "Thanks."], correct: 0 }
]

export const listenTranslateBankG5D2a = [
  { sentence: "Which season do you like best?", options: ["你想要哪个季节？", "你最喜欢哪个季节？", "你喜欢什么运动？", "一年有几个季节？"], correct: 1 },
  { sentence: "I like spring best.", options: ["他最喜欢春天。", "我最喜欢夏天。", "我最爱春天。", "大家都爱春天。"], correct: 2 },
  { sentence: "There are four seasons.", options: ["这里有四个季节。", "中国有四个季节。", "一年有四个星期。", "有四个季节。"], correct: 3 },
  { sentence: "Winter is very cold.", options: ["冬天非常冷。", "冬天十分美。", "夏天非常热。", "我的手冷。"], correct: 0 },
  { sentence: "It is warm in spring.", options: ["春天风很大。", "春天很温暖。", "他在春季很热。", "春暖花开。"], correct: 1 }
]
