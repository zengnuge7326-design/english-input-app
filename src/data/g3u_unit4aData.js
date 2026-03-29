// PEP三年级上册 Unit 4 Part A《We love animals》题库
// 主题：动物1 (pig, bear, cat, duck, dog) + What's this? It's a...
// 7种题型，每种5题，共35题

export const quizBankG3U4a = [
  { question: "What's ___?", chinese: "这是什么？", options: ["this", "that", "it", "these"], correct: 0, explanation: "指近处的物品用 this。", tag: "指示代词" },
  { question: "___ is a dog.", chinese: "它是一只狗。", options: ["It", "Its", "He", "This"], correct: 0, explanation: "回答 What's this? 时，通常用 It's a... 或 It is a...", tag: "代词" },
  { question: "Look at the ___.", chinese: "看那只猪。", options: ["pig", "bag", "book", "pen"], correct: 0, explanation: "pig 是本单元动物词汇，符合语境。", tag: "词汇" },
  { question: "It's ___ bear.", chinese: "它是一只熊。", options: ["a", "an", "the", "two"], correct: 0, explanation: "bear 前面加辅音前冠词 a。", tag: "冠词" },
  { question: "I like the ___.", chinese: "我喜欢这只猫。", options: ["cat", "car", "cap", "can"], correct: 0, explanation: "cat 是小猫。", tag: "词汇" }
]

export const fillblankBankG3U4a = [
  { sentence: "What's ___ (这个)?", answer: "this", chinese: "这是什么？", explanation: "this 这个，指近处事物。", tag: "代词" },
  { sentence: "It is a ___ (鸭子).", answer: "duck", chinese: "它是一只鸭子。", explanation: "duck 鸭子。", tag: "词汇" },
  { sentence: "Look at the ___ (狗).", answer: "dog", chinese: "看那只狗。", explanation: "dog 狗。", tag: "词汇" },
  { sentence: "It's a ___ (猪).", answer: "pig", chinese: "它是一头猪。", explanation: "pig 猪", tag: "词汇" },
  { sentence: "It's a ___ (熊).", answer: "bear", chinese: "它是一只熊。", explanation: "bear 熊", tag: "词汇" }
]

export const listenWordBankG3U4a = [
  { word: "pig", options: ["big", "pig", "dig", "peg"], correct: 1, zh: "猪" },
  { word: "bear", options: ["pear", "dear", "bear", "beer"], correct: 2, zh: "熊" },
  { word: "cat", options: ["bat", "rat", "cat", "hat"], correct: 2, zh: "猫" },
  { word: "duck", options: ["duck", "luck", "truck", "dark"], correct: 0, zh: "鸭子" },
  { word: "dog", options: ["log", "frog", "dog", "dot"], correct: 2, zh: "狗" }
]

export const listenSentenceBankG3U4a = [
  { sentence: "What's this?", zh: "这是什么？", options: ["What's this?", "What's that?", "What colour is it?", "Who is this?"], correct: 0 },
  { sentence: "It's a duck.", zh: "它是一只鸭子。", options: ["It's a dog.", "It's a duck.", "It's a pig.", "It's a cat."], correct: 1 },
  { sentence: "It is a dog.", zh: "它是一只狗。", options: ["It is a bag.", "It is a dog.", "It is a log.", "It is a cat."], correct: 1 },
  { sentence: "Look at the cat.", zh: "看这只猫。", options: ["Look at the dog.", "Look at the rat.", "Look at the cat.", "Look at the hat."], correct: 2 },
  { sentence: "It's a bear.", zh: "它是一只熊。", options: ["It's a bird.", "It's a pear.", "It's a pig.", "It's a bear."], correct: 3 }
]

export const listenOrderBankG3U4a = [
  { sentence: "What's this?", zh: "这是什么？", words: ["What's", "this?"], answer: ["What's", "this?"] },
  { sentence: "It is a dog.", zh: "它是一条狗。", words: ["It", "is", "a", "dog."], answer: ["It", "is", "a", "dog."] },
  { sentence: "It's a pig.", zh: "它是一头猪。", words: ["It's", "a", "pig."], answer: ["It's", "a", "pig."] },
  { sentence: "Look at the cat.", zh: "看那只猫。", words: ["Look", "at", "the", "cat."], answer: ["Look", "at", "the", "cat."] },
  { sentence: "I like the duck.", zh: "我喜欢这只鸭子。", words: ["I", "like", "the", "duck."], answer: ["I", "like", "the", "duck."] }
]

export const listenResponseBankG3U4a = [
  { question: "What's this?", zh: "这是什么？", options: ["It's a duck.", "My name's John.", "I'm fine.", "Yes, it is."], correct: 0 },
  { question: "Look at the dog.", zh: "看这只狗。", options: ["It's big.", "Thank you.", "Hello.", "Goodbye."], correct: 0 },
  { question: "Is this a pig?", zh: "这是一只猪吗？", options: ["Yes, it is.", "It's a duck.", "Hello.", "Me too."], correct: 0 },
  { question: "What's your name?", zh: "你叫什么名字？", options: ["It's a cat.", "My name's Mike.", "I see red.", "Thank you."], correct: 1 },
  { question: "How are you?", zh: "你好吗？", options: ["Very well, thanks.", "It's a bear.", "See you.", "Yes."], correct: 0 }
]

export const listenTranslateBankG3U4a = [
  { sentence: "What's this?", options: ["那是什么？", "这是什么？", "这是你的吗？", "它是一只猫吗？"], correct: 1 },
  { sentence: "It's a duck.", options: ["它是一只狗。", "它是一头猪。", "它是一只猫。", "它是一只鸭子。"], correct: 3 },
  { sentence: "Look at the bear.", options: ["这是一只熊。", "看这只熊。", "我喜欢这只熊。", "熊很大。"], correct: 1 },
  { sentence: "It is a dog.", options: ["这是一只猫。", "它是一只鸭子。", "这是猪。", "它是一只狗。"], correct: 3 },
  { sentence: "What's that?", options: ["这是什么？", "看那里。", "那是什么？", "在哪儿？"], correct: 2 }
]
