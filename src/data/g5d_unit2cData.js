// PEP五年级下册 Unit 2 Part C《Story time / Let's check》题库
// 主题：Unit 2 综合复习 (Which season... / Why, Because... / 描述喜爱季节原因)
// 7种题型，每种5题，共35题

export const quizBankG5D2c = [
  { question: "___ do you like best?", chinese: "你最喜欢什么？", options: ["What", "Why", "When", "Because"], correct: 0, explanation: "对事物提问用What。(例如 What colors / What animals)", tag: "疑问词" },
  { question: "___ do you like winter?", chinese: "你为什么喜欢冬天？", options: ["Why", "What", "When", "Who"], correct: 0, explanation: "原因提问用Why。", tag: "疑问词" },
  { question: "___ I like snow.", chinese: "因为我喜欢雪。", options: ["Because", "So", "But", "And"], correct: 0, explanation: "回答Why必定用Because或者直接陈述。", tag: "连词" },
  { question: "It is ___ in winter.", chinese: "冬天很冷。", options: ["cold", "hot", "cool", "warm"], correct: 0, explanation: "winter 冷。cold 冷。", tag: "形容词" },
  { question: "We can play ___ the snow.", chinese: "我们能在雪里玩。", options: ["in", "on", "with", "at"], correct: 0, explanation: "play in the snow 在雪地里玩。", tag: "介词" }
]

export const fillblankBankG5D2c = [
  { sentence: "___ (因为) it's warm.", answer: "Because", chinese: "因为它很温暖。", explanation: "Because", tag: "连词" },
  { sentence: "I like ___ (秋天) best.", answer: "autumn", chinese: "我最喜欢秋天。", explanation: "autumn 或者 fall", tag: "名词" },
  { sentence: "It is very ___ (寒冷的).", answer: "cold", chinese: "它非常冷。", explanation: "cold 寒冷", tag: "形容词" },
  { sentence: "We can plant ___ (树).", answer: "trees", chinese: "我们可以植树。", explanation: "trees 树木", tag: "名词" },
  { sentence: "The ___ (花) are beautiful.", answer: "flowers", chinese: "花儿很美丽。", explanation: "flowers（填复数）", tag: "名词" }
]

export const listenWordBankG5D2c = [
  { word: "because", options: ["before", "behind", "because", "become"], correct: 2, zh: "因为" },
  { word: "which", options: ["when", "what", "where", "which"], correct: 3, zh: "哪一个" },
  { word: "best", options: ["rest", "best", "test", "pest"], correct: 1, zh: "最好地" },
  { word: "cold", options: ["cool", "cold", "old", "coat"], correct: 1, zh: "寒冷的" },
  { word: "warm", options: ["worm", "warm", "word", "work"], correct: 1, zh: "温暖的" }
]

export const listenSentenceBankG5D2c = [
  { sentence: "Which season do you like best?", zh: "你最喜欢哪个季节？", options: ["What season do you like?", "Which subject do you like best?", "Which season do you like best?", "Why do you like the season?"], correct: 2 },
  { sentence: "Why do you like winter?", zh: "你为什么喜欢冬天？", options: ["When do you like winter?", "Why do you like summer?", "Why do you like spring?", "Why do you like winter?"], correct: 3 },
  { sentence: "Because I can sleep all day.", zh: "因为我能睡一整天。", options: ["Because I can play all day.", "Because I can sleep all day.", "Because I can eat all day.", "Because I can read all day."], correct: 1 },
  { sentence: "I like summer best.", zh: "我最喜欢夏天。", options: ["I like summer best.", "I like spring best.", "I like autumn best.", "I like winter best."], correct: 0 },
  { sentence: "We can plant trees.", zh: "我们可以种树。", options: ["We can plant flowers.", "We can pick apples.", "We can plant trees.", "They can make a snowman."], correct: 2 }
]

export const listenOrderBankG5D2c = [
  { sentence: "Which season do you like best?", zh: "你最喜欢哪个季节？", words: ["Which", "season", "do", "you", "like", "best?"], answer: ["Which", "season", "do", "you", "like", "best?"] },
  { sentence: "Why do you like summer?", zh: "你为什么喜欢夏天？", words: ["Why", "do", "you", "like", "summer?"], answer: ["Why", "do", "you", "like", "summer?"] },
  { sentence: "Because I can swim.", zh: "因为我能游泳。", words: ["Because", "I", "can", "swim."], answer: ["Because", "I", "can", "swim."] },
  { sentence: "The flowers are beautiful.", zh: "这些花很漂亮。", words: ["The", "flowers", "are", "beautiful."], answer: ["The", "flowers", "are", "beautiful."] },
  { sentence: "I like autumn best.", zh: "我最喜欢秋天。", words: ["I", "like", "autumn", "best."], answer: ["I", "like", "autumn", "best."] }
]

export const listenResponseBankG5D2c = [
  { question: "Why do you like autumn best?", zh: "你为什么最喜欢秋天？", options: ["Because I can pick apples.", "Summer is hot.", "Yes, I do.", "Autumn."], correct: 0 },
  { question: "Which season is cold?", zh: "哪个季节冷？", options: ["Winter.", "Spring.", "Hot.", "Because it's white."], correct: 0 },
  { question: "What can you do in winter?", zh: "你在冬天能干什么？", options: ["I can play in the snow.", "I like summer.", "Yes, I can.", "Because I sleep."], correct: 0 },
  { question: "Do you like spring?", zh: "你喜欢春天吗？", options: ["Yes, the flowers are pretty.", "No, I am not.", "I am twelve.", "Nice to meet you."], correct: 0 },
  { question: "I like summer best. What about you?", zh: "我最喜欢夏天。你呢？", options: ["I like spring best.", "Yes, it is.", "Thank you.", "Because it is hot."], correct: 0 }
]

export const listenTranslateBankG5D2c = [
  { sentence: "Which season do you like best?", options: ["你喜欢那本书？", "你最喜欢哪个季节？", "你最喜欢什么树？", "你为什么喜欢冬天？"], correct: 1 },
  { sentence: "Why do you like winter?", options: ["你最不爱冬天吗？", "你讨厌什么季节？", "你为什么喜欢秋天？", "你为什么喜欢冬天？"], correct: 3 },
  { sentence: "Because I like snow.", options: ["因为太热了。", "因为这儿很美。", "因为我能玩雪。", "因为我喜欢雪。"], correct: 3 },
  { sentence: "I like autumn best.", options: ["我最喜欢春天。", "秋天是金黄的。", "我最喜欢秋天。", "大家喜欢秋天。"], correct: 2 },
  { sentence: "We can plant trees.", options: ["我们可以扫地。", "人们去旅行。", "我们可以去野营。", "我们可以种树。"], correct: 3 }
]
