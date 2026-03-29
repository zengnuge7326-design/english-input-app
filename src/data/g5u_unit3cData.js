// PEP五年级上册 Unit 3 Part C《Story time / Let's check》题库
// 主题：Unit 3 综合复习 (What would you like? / favourite food / delicious, healthy etc.)
// 7种题型，每种5题，共35题

export const quizBankG5U3c = [
  { question: "___ your favourite food?", chinese: "你最喜欢的食物是什么？", options: ["What's", "Who's", "Where's", "How's"], correct: 0, explanation: "What's = What is，对事物提问用What。", tag: "疑问词" },
  { question: "I'd like ___ ice cream.", chinese: "我想要一个冰淇淋。", options: ["an", "a", "some", "any"], correct: 0, explanation: "ice cream 前可用 an 表示一个，如果不可数用 some，这里 an 刚好配元音发音。", tag: "冠词" },
  { question: "They ___ delicious.", chinese: "他们/它们很美味。", options: ["are", "is", "am", "be"], correct: 0, explanation: "They 是复数，连系动词用 are。", tag: "系动词" },
  { question: "Salad is ___.", chinese: "沙拉是健康的。", options: ["healthy", "health", "healthily", "healths"], correct: 0, explanation: "系动词is后接形容词healthy。", tag: "形容词" },
  { question: "What would you like ___ drink?", chinese: "你想喝点什么？", options: ["to", "for", "with", "on"], correct: 0, explanation: "would like to do sth. 想要做某事。", tag: "介词/不定式" }
]

export const fillblankBankG5U3c = [
  { sentence: "What ___ (你想/你会) you like to eat?", answer: "would", chinese: "你想吃什么？", explanation: "would like 想要", tag: "助动词" },
  { sentence: "What's your ___ (最喜爱的) food?", answer: "favourite", chinese: "你最喜爱的食物是什么？", explanation: "favourite 最喜爱的", tag: "形容词" },
  { sentence: "I love hamburgers. They are ___ (美味的).", answer: "delicious", chinese: "我爱汉堡。它们很美味。", explanation: "delicious 美味的", tag: "形容词" },
  { sentence: "Vegetables are ___ (健康的).", answer: "healthy", chinese: "蔬菜很健康。", explanation: "healthy 健康的", tag: "形容词" },
  { sentence: "I'd like to ___ (喝) some tea.", answer: "drink", chinese: "我想喝些茶。", explanation: "drink", tag: "动词" }
]

export const listenWordBankG5U3c = [
  { word: "favourite", options: ["favour", "favourite", "flavor", "flower"], correct: 1, zh: "最喜爱的" },
  { word: "delicious", options: ["delight", "delicious", "deliver", "delete"], correct: 1, zh: "美味的" },
  { word: "healthy", options: ["health", "healthy", "heavy", "head"], correct: 1, zh: "健康的" },
  { word: "hamburger", options: ["hot dog", "hamburger", "hungry", "healthy"], correct: 1, zh: "汉堡包" },
  { word: "sandwich", options: ["salad", "sandwich", "sausage", "sweet"], correct: 1, zh: "三明治" }
]

export const listenSentenceBankG5U3c = [
  { sentence: "What would you like to eat?", zh: "你想吃什么？", options: ["What would you like to drink?", "What do you like to eat?", "What would you like to eat?", "Where would you like to eat?"], correct: 2 },
  { sentence: "I'd like a sandwich.", zh: "我想要一个三明治。", options: ["I'd like a salad.", "I'd like a hamburger.", "I'd like a sandwich.", "I'd like some tea."], correct: 2 },
  { sentence: "What's your favourite food?", zh: "你最喜欢的食物是什么？", options: ["What's your favourite drink?", "What's your favourite fruit?", "What's your favourite class?", "What's your favourite food?"], correct: 3 },
  { sentence: "Ice cream. It's sweet.", zh: "冰淇淋。它很甜。", options: ["Salad. It's healthy.", "Ice cream. It's sweet.", "Tea. It's fresh.", "Hamburger. It's delicious."], correct: 1 },
  { sentence: "They are delicious.", zh: "它们很美味。", options: ["They are sweet.", "They are fresh.", "They are healthy.", "They are delicious."], correct: 3 }
]

export const listenOrderBankG5U3c = [
  { sentence: "What would you like to eat?", zh: "你想吃什么？", words: ["What", "would", "you", "like", "to", "eat?"], answer: ["What", "would", "you", "like", "to", "eat?"] },
  { sentence: "I would like a hamburger.", zh: "我想要一个汉堡包。", words: ["I", "would", "like", "a", "hamburger."], answer: ["I", "would", "like", "a", "hamburger."] },
  { sentence: "What is your favourite food?", zh: "你最喜欢什么食物？", words: ["What", "is", "your", "favourite", "food?"], answer: ["What", "is", "your", "favourite", "food?"] },
  { sentence: "Noodles. They are delicious.", zh: "面条。它们很好吃。", words: ["Noodles.", "They", "are", "delicious."], answer: ["Noodles.", "They", "are", "delicious."] },
  { sentence: "Salad is very healthy.", zh: "沙拉非常健康。", words: ["Salad", "is", "very", "healthy."], answer: ["Salad", "is", "very", "healthy."] }
]

export const listenResponseBankG5U3c = [
  { question: "What would you like to drink?", zh: "你想喝什么？", options: ["I'd like some tea, please.", "I'd like a hamburger.", "They are sweet.", "I like books."], correct: 0 },
  { question: "What's your favourite food?", zh: "你最喜欢的食物是什么？", options: ["Salad. It's healthy.", "Tea. It's hot.", "I am fine.", "Thank you."], correct: 0 },
  { question: "Are they delicious?", zh: "它们好吃吗？", options: ["Yes, they are.", "No, it isn't.", "Here you are.", "What about you?"], correct: 0 },
  { question: "Would you like some ice cream?", zh: "你要一些冰淇淋吗？", options: ["Yes, please.", "I like red.", "It's a cat.", "Bye."], correct: 0 },
  { question: "Here you are.", zh: "给你。", options: ["Thank you.", "Yes, please.", "I'm ten.", "I like it."], correct: 0 }
]

export const listenTranslateBankG5U3c = [
  { sentence: "What would you like to eat?", options: ["你喜欢吃什么？", "你正在吃什么？", "你想吃点什么？", "你想喝什么？"], correct: 2 },
  { sentence: "I'd like a hamburger and some salad.", options: ["我想要一个汉堡包和一些沙拉。", "我想要一个三明治和一些茶。", "我想吃水果。", "给我冰淇淋。"], correct: 0 },
  { sentence: "What's your favourite food?", options: ["这是你最喜欢的食物吗？", "你最喜欢的饮料是什么？", "你想吃什么食物？", "你最喜欢的食物是什么？"], correct: 3 },
  { sentence: "Salad. It's healthy.", options: ["沙拉。它很有营养。", "沙拉。它很健康。", "茶。它很健康。", "苹果。它们很甜。"], correct: 1 },
  { sentence: "They are delicious.", options: ["它们很酸。", "它们很辣。", "它们很甜。", "它们很美味。"], correct: 3 }
]
