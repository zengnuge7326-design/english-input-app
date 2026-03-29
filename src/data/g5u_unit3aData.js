// PEP五年级上册 Unit 3 Part A《What would you like?》题库
// 主题：食物与饮料 (ice cream, tea, hamburger, sandwich, salad) + What would you like to eat/drink? I'd like...
// 7种题型，每种5题，共35题

export const quizBankG5U3a = [
  { question: "What would you like to ___?", chinese: "你想吃什么？", options: ["eat", "drink", "have", "see"], correct: 0, explanation: "eat指“吃”。drink指“喝”。", tag: "动词" },
  { question: "I'd like a ___, please.", chinese: "我想要一个三明治。", options: ["sandwich", "tea", "ice cream", "salad"], correct: 0, explanation: "a 修饰可数名词单数，sandwich 是三明治。", tag: "名词" },
  { question: "What would you like to ___?", chinese: "你想喝什么？", options: ["drink", "eat", "play", "do"], correct: 0, explanation: "drink 是喝。", tag: "动词" },
  { question: "I'd like some ___, please.", chinese: "我想要些茶。", options: ["tea", "hamburger", "sandwich", "apple"], correct: 0, explanation: "some 后接不可数名词或可数名词复数，tea (茶)是不可数名词，符合some的用法。", tag: "名词" },
  { question: "Here ___ are.", chinese: "给你们（给你）。", options: ["you", "I", "they", "we"], correct: 0, explanation: "Here you are. 是常用交际用语“给你/你们”。", tag: "口语交际" }
]

export const fillblankBankG5U3a = [
  { sentence: "What would you like to ___ (吃)?", answer: "eat", chinese: "你想吃什么？", explanation: "eat 吃", tag: "动词" },
  { sentence: "I'd like ___ (冰淇淋).", answer: "ice cream", chinese: "我想要冰淇淋。", explanation: "ice cream", tag: "名词" },
  { sentence: "What would you like to ___ (喝)?", answer: "drink", chinese: "你想喝什么？", explanation: "drink 喝", tag: "动词" },
  { sentence: "I'd like a ___ (汉堡包).", answer: "hamburger", chinese: "我想要一个汉堡包。", explanation: "hamburger", tag: "名词" },
  { sentence: "I'd like some ___ (沙拉).", answer: "salad", chinese: "我想要些沙拉。", explanation: "salad", tag: "名词" }
]

export const listenWordBankG5U3a = [
  { word: "sandwich", options: ["salad", "sandwich", "sausage", "sweet"], correct: 1, zh: "三明治" },
  { word: "hamburger", options: ["hot dog", "hamburger", "hungry", "healthy"], correct: 1, zh: "汉堡包" },
  { word: "ice cream", options: ["ice", "cream", "ice cream", "idea"], correct: 2, zh: "冰淇淋" },
  { word: "tea", options: ["tree", "tea", "sea", "eat"], correct: 1, zh: "茶/茶水" },
  { word: "drink", options: ["drink", "eat", "draw", "duck"], correct: 0, zh: "喝/饮料" }
]

export const listenSentenceBankG5U3a = [
  { sentence: "What would you like to eat?", zh: "你想吃什么？", options: ["What would you like to drink?", "What would you like to eat?", "What do you like to eat?", "Where would you like to eat?"], correct: 1 },
  { sentence: "I'd like a sandwich, please.", zh: "请给我一个三明治。", options: ["I'd like a hamburger, please.", "I'd like a hot dog, please.", "I'd like a sandwich, please.", "I'd like a salad, please."], correct: 2 },
  { sentence: "What would you like to drink?", zh: "你想喝什么？", options: ["What would you like to eat?", "What would you like to drink?", "What do you drink?", "Where do you drink?"], correct: 1 },
  { sentence: "I'd like some tea, please.", zh: "请给我一些茶。", options: ["I'd like some milk, please.", "I'd like some tea, please.", "I'd like some water, please.", "I'd like some juice, please."], correct: 1 },
  { sentence: "Here you are.", zh: "给你。", options: ["Here you are.", "Here it is.", "Thank you.", "You're welcome."], correct: 0 }
]

export const listenOrderBankG5U3a = [
  { sentence: "What would you like to eat?", zh: "你想吃什么？", words: ["What", "would", "you", "like", "to", "eat?"], answer: ["What", "would", "you", "like", "to", "eat?"] },
  { sentence: "I would like a sandwich.", zh: "我想要一个三明治。", words: ["I", "would", "like", "a", "sandwich."], answer: ["I", "would", "like", "a", "sandwich."] },
  { sentence: "What would you like to drink?", zh: "你想喝点什么？", words: ["What", "would", "you", "like", "to", "drink?"], answer: ["What", "would", "you", "like", "to", "drink?"] },
  { sentence: "I would like some tea.", zh: "我想要一些茶。", words: ["I", "would", "like", "some", "tea."], answer: ["I", "would", "like", "some", "tea."] },
  { sentence: "Here you are.", zh: "给你。", words: ["Here", "you", "are."], answer: ["Here", "you", "are."] }
]

export const listenResponseBankG5U3a = [
  { question: "What would you like to eat?", zh: "你想吃什么？", options: ["I'd like a hamburger.", "I like tea.", "I'd like some juice.", "Yes, please."], correct: 0 },
  { question: "What would you like to drink?", zh: "你想喝什么？", options: ["I'd like some tea.", "I'd like a sandwich.", "I like apples.", "No, thanks."], correct: 0 },
  { question: "Here you are.", zh: "给你。", options: ["Thank you.", "Here you are.", "Me too.", "Goodbye."], correct: 0 },
  { question: "Would you like some ice cream?", zh: "你想要些冰淇淋吗？", options: ["Yes, please.", "I like tea.", "It's big.", "Here."], correct: 0 },
  { question: "What's he like?", zh: "他是个什么样的人？", options: ["He's funny.", "I'd like tea.", "She's kind.", "He likes tea."], correct: 0 }
]

export const listenTranslateBankG5U3a = [
  { sentence: "What would you like to eat?", options: ["你喜欢吃什么？", "你想吃什么？", "你想喝什么？", "你要做什么？"], correct: 1 },
  { sentence: "I'd like a sandwich.", options: ["我想要一个三明治。", "我喜欢三明治。", "给我一个汉堡包。", "这是三明治。"], correct: 0 },
  { sentence: "What would you like to drink?", options: ["你要喝水吗？", "你喜欢什么饮料？", "你想吃什么？", "你想喝什么？"], correct: 3 },
  { sentence: "I'd like some tea.", options: ["我想要一些咖啡。", "我想要一些茶。", "我想喝水。", "我喜欢茶。"], correct: 1 },
  { sentence: "Here you are.", options: ["谢谢你。", "你在这里。", "给你们（给你）。", "再见。"], correct: 2 }
]
