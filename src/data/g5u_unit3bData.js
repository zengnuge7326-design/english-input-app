// PEP五年级上册 Unit 3 Part B《What would you like?》题库
// 主题：食物特征 (fresh, healthy, delicious, hot, sweet) + What's your favourite food?
// 7种题型，每种5题，共35题

export const quizBankG5U3b = [
  { question: "What's your ___ food?", chinese: "你最喜欢的食物是什么？", options: ["favourite", "like", "eat", "good"], correct: 0, explanation: "favourite 最喜欢的。", tag: "形容词" },
  { question: "I love ice cream. It's ___.", chinese: "我喜欢冰淇淋。它很甜。", options: ["sweet", "hot", "healthy", "fresh"], correct: 0, explanation: "冰淇淋的特点是甜 (sweet)。", tag: "形容词" },
  { question: "Salad is very ___.", chinese: "沙拉非常健康。", options: ["healthy", "hot", "sweet", "bad"], correct: 0, explanation: "healthy 健康的。沙拉是健康食品。", tag: "形容词" },
  { question: "The fish is ___. I like it.", chinese: "这鱼很美味。我很喜欢。", options: ["delicious", "bad", "hot", "sweet"], correct: 0, explanation: "delicious 美味的。", tag: "形容词" },
  { question: "They love ___ food.", chinese: "他们喜欢热/辣的食物。", options: ["hot", "sweet", "fresh", "ice"], correct: 0, explanation: "hot 可以指热的，也可以指辣的。", tag: "形容词" }
]

export const fillblankBankG5U3b = [
  { sentence: "What's your ___ (最喜欢的) food?", answer: "favourite", chinese: "你最喜欢的食物是什么？", explanation: "favourite", tag: "形容词" },
  { sentence: "Ice cream is ___ (甜的).", answer: "sweet", chinese: "冰淇淋是甜的。", explanation: "sweet", tag: "形容词" },
  { sentence: "Salad is ___ (健康的).", answer: "healthy", chinese: "沙拉是健康的。", explanation: "healthy", tag: "形容词" },
  { sentence: "The food is ___ (美味的).", answer: "delicious", chinese: "食物很美味。", explanation: "delicious", tag: "形容词" },
  { sentence: "The apples are ___ (新鲜的).", answer: "fresh", chinese: "苹果很新鲜。", explanation: "fresh", tag: "形容词" }
]

export const listenWordBankG5U3b = [
  { word: "favourite", options: ["favour", "favourite", "flavor", "flower"], correct: 1, zh: "最喜爱的" },
  { word: "healthy", options: ["health", "healthy", "heavy", "head"], correct: 1, zh: "健康的" },
  { word: "delicious", options: ["delay", "delicious", "deliver", "delete"], correct: 1, zh: "美味的" },
  { word: "fresh", options: ["fish", "flesh", "fresh", "flash"], correct: 2, zh: "新鲜的" },
  { word: "sweet", options: ["sweat", "sweet", "seat", "meat"], correct: 1, zh: "甜的" }
]

export const listenSentenceBankG5U3b = [
  { sentence: "What's your favourite food?", zh: "你最喜欢的食物是什么？", options: ["What's your favourite drink?", "What's your favourite food?", "What's your favourite fruit?", "What's your favourite colour?"], correct: 1 },
  { sentence: "My favourite food is noodles.", zh: "我最喜欢的食物是面条。", options: ["My favourite food is fish.", "My favourite food is beef.", "My favourite food is noodles.", "My favourite food is chicken."], correct: 2 },
  { sentence: "They are delicious.", zh: "它们很美味。", options: ["They are fresh.", "They are healthy.", "They are sweet.", "They are delicious."], correct: 3 },
  { sentence: "Ice cream is sweet.", zh: "冰淇淋很甜。", options: ["Ice cream is hot.", "Ice cream is healthy.", "Ice cream is sweet.", "Ice cream is cold."], correct: 2 },
  { sentence: "I don't like beef.", zh: "我不喜欢牛肉。", options: ["I like beef.", "I don't like beef.", "I don't like pork.", "I like pork."], correct: 1 }
]

export const listenOrderBankG5U3b = [
  { sentence: "What is your favourite food?", zh: "你最喜欢的食物是什么？", words: ["What", "is", "your", "favourite", "food?"], answer: ["What", "is", "your", "favourite", "food?"] },
  { sentence: "Noodles. They are delicious.", zh: "面条。它们很美味。", words: ["Noodles.", "They", "are", "delicious."], answer: ["Noodles.", "They", "are", "delicious."] },
  { sentence: "Ice cream is sweet.", zh: "冰淇淋是甜的。", words: ["Ice", "cream", "is", "sweet."], answer: ["Ice", "cream", "is", "sweet."] },
  { sentence: "Salad is very healthy.", zh: "沙拉非常健康。", words: ["Salad", "is", "very", "healthy."], answer: ["Salad", "is", "very", "healthy."] },
  { sentence: "I do not like beef.", zh: "我不喜欢牛肉。", words: ["I", "do", "not", "like", "beef."], answer: ["I", "do", "not", "like", "beef."] }
]

export const listenResponseBankG5U3b = [
  { question: "What's your favourite food?", zh: "你最喜爱的食物是什么？", options: ["Noodles. They are delicious.", "I like red.", "Here you are.", "Thank you."], correct: 0 },
  { question: "What's your favourite drink?", zh: "你最喜爱的饮品是什么？", options: ["Milk. It's healthy.", "Ice cream. It's sweet.", "I like reading.", "Yes, please."], correct: 0 },
  { question: "Do you like salad?", zh: "你喜欢沙拉吗？", options: ["Yes. It's healthy.", "I'd like a hamburger.", "No, it isn't.", "Thank you."], correct: 0 },
  { question: "What would you like to eat?", zh: "你想吃什么？", options: ["I'd like a sandwich.", "I like monkeys.", "It is sweet.", "Yes, I do."], correct: 0 },
  { question: "Are they delicious?", zh: "它们好吃吗？", options: ["Yes, they are.", "Yes, it is.", "He is tall.", "Thanks."], correct: 0 }
]

export const listenTranslateBankG5U3b = [
  { sentence: "What's your favourite food?", options: ["你想要什么食物？", "你最喜欢的食物是什么？", "你喜欢吃什么？", "这是什么食物？"], correct: 1 },
  { sentence: "Noodles. They are delicious.", options: ["米饭。它们很好吃。", "面条。他们很健康。", "面条。它们很美味。", "饺子。它们很新鲜。"], correct: 2 },
  { sentence: "Ice cream is sweet.", options: ["冰淇淋是冷的。", "冰淇淋很好吃。", "我是甜的。", "冰淇淋是甜的。"], correct: 3 },
  { sentence: "Salad is very healthy.", options: ["沙拉是酸的。", "沙拉非常健康。", "沙拉很新鲜。", "三明治很美味。"], correct: 1 },
  { sentence: "I love fresh apples.", options: ["我喜欢红苹果。", "我想要一个苹果。", "我喜欢新鲜的苹果。", "我喜欢甜苹果。"], correct: 2 }
]
