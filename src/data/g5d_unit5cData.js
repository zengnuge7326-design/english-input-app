// PEP五年级下册 Unit 5 Part C《Story time / Let's check》题库
// 主题：Unit 5 综合复习 (名词性物主代词综合、现在进行时综合)
// 7种题型，每种5题，共35题

export const quizBankG5D5c = [
  { question: "___ are the animals doing?", chinese: "动物们正在干什么？", options: ["What", "Where", "Whose", "Who"], correct: 0, explanation: "对正在干的事情提问用 What。", tag: "疑问词" },
  { question: "They ___ eating.", chinese: "他们正在吃东西。", options: ["are", "is", "am", "do"], correct: 0, explanation: "主语是 They，进行时助动词用 are。", tag: "系动词" },
  { question: "This is his book. The book is ___.", chinese: "这是他的书。这书是他的。", options: ["his", "him", "he", "hers"], correct: 0, explanation: "作表语指代 his book，名词性物主代词还是 his。", tag: "代词" },
  { question: "Is the cat ___?", chinese: "猫正在睡觉吗？", options: ["sleeping", "sleep", "sleeps", "to sleep"], correct: 0, explanation: "现在进行时的疑问句，谓语动词要加 ing。", tag: "现在进行时" },
  { question: "Whose carrot is it? It's ___.", chinese: "这是谁的胡萝卜？是她的。", options: ["hers", "her", "she", "his"], correct: 0, explanation: "作表语，指代她的胡萝卜，用hers。", tag: "代词" }
]

export const fillblankBankG5D5c = [
  { sentence: "___ (什么) are they doing?", answer: "What", chinese: "他们正在干什么？", explanation: "What", tag: "疑问词" },
  { sentence: "They are ___ (玩耍).", answer: "playing", chinese: "他们正在玩耍。", explanation: "playing", tag: "分词" },
  { sentence: "___ (谁的) book is this?", answer: "Whose", chinese: "这是谁的书？", explanation: "Whose", tag: "疑问代词" },
  { sentence: "The book is ___ (她的).", answer: "hers", chinese: "这本书是她的。", explanation: "hers (名词性物主代词)", tag: "代词" },
  { sentence: "He is ___ (喝) water.", answer: "drinking", chinese: "他正在喝水。", explanation: "drinking", tag: "分词" }
]

export const listenWordBankG5D5c = [
  { word: "whose", options: ["who", "whose", "where", "what"], correct: 1, zh: "谁的" },
  { word: "hers", options: ["her", "hers", "his", "he"], correct: 1, zh: "她的(物品)" },
  { word: "theirs", options: ["their", "there", "these", "theirs"], correct: 3, zh: "他们的(物品)" },
  { word: "playing", options: ["playing", "praying", "paying", "planning"], correct: 0, zh: "玩耍(ing)" },
  { word: "sleeping", options: ["sweeping", "sleeping", "swimming", "shopping"], correct: 1, zh: "睡觉(ing)" }
]

export const listenSentenceBankG5D5c = [
  { sentence: "What are they doing?", zh: "他们正在干嘛？", options: ["What is he doing?", "Where are they doing?", "What are they doing?", "What are you doing?"], correct: 2 },
  { sentence: "They are eating.", zh: "他们正在吃东西。", options: ["They are drinking.", "They are eating.", "They are climbing.", "They are sleeping."], correct: 1 },
  { sentence: "Whose book is it?", zh: "这是谁的书？", options: ["Whose dog is it?", "Whose bag is it?", "Whose book is it?", "Who is reading the book?"], correct: 2 },
  { sentence: "The book is hers.", zh: "这本书是她的。", options: ["The book is his.", "The book is mine.", "The book is hers.", "The book is yours."], correct: 2 },
  { sentence: "Here you are.", zh: "给你。", options: ["Here it is.", "Here you are.", "Here I am.", "There they are."], correct: 1 }
]

export const listenOrderBankG5D5c = [
  { sentence: "What are they doing?", zh: "他们正在干什么？", words: ["What", "are", "they", "doing?"], answer: ["What", "are", "they", "doing?"] },
  { sentence: "They are playing.", zh: "他们正在玩。", words: ["They", "are", "playing."], answer: ["They", "are", "playing."] },
  { sentence: "Whose book is it?", zh: "这是谁的书？", words: ["Whose", "book", "is", "it?"], answer: ["Whose", "book", "is", "it?"] },
  { sentence: "It is hers.", zh: "那是她的。", words: ["It", "is", "hers."], answer: ["It", "is", "hers."] },
  { sentence: "He is drinking water.", zh: "他正在喝水。", words: ["He", "is", "drinking", "water."], answer: ["He", "is", "drinking", "water."] }
]

export const listenResponseBankG5D5c = [
  { question: "What are the dogs doing?", zh: "那些狗正在干吗？", options: ["They are playing.", "It is his.", "I have a dog.", "Yes, they are."], correct: 0 },
  { question: "Whose apples are these?", zh: "这些是谁的苹果？", options: ["They are ours.", "Because I like apples.", "At 8:00.", "They are red."], correct: 0 },
  { question: "Is he eating?", zh: "他正在吃吗?", options: ["Yes, he is.", "No, she isn't.", "Thank you.", "It's a cake."], correct: 0 },
  { question: "Are they sleeping?", zh: "它们正在睡觉吗？", options: ["No, they aren't.", "It's on Monday.", "Winter is cold.", "She is running."], correct: 0 },
  { question: "This is my pencil.", zh: "这是我的铅笔。", options: ["Oh, it's yours.", "It's yellow.", "She is swimming.", "Me too."], correct: 0 }
]

export const listenTranslateBankG5D5c = [
  { sentence: "What are they doing?", options: ["他在干什么？", "他们是谁？", "他们正在干什么？", "这是什么？"], correct: 2 },
  { sentence: "They are playing.", options: ["他们赢了。", "他们正在玩耍。", "他们在跳舞。", "他们在跑步。"], correct: 1 },
  { sentence: "Whose book is it?", options: ["谁在看书？", "这是哪本书？", "这是谁的狗？", "这是谁的书？"], correct: 3 },
  { sentence: "It is hers.", options: ["它是我的。", "它是她的。", "它是他的。", "它是你的。"], correct: 1 },
  { sentence: "He is drinking water.", options: ["他在喝果汁。", "他想喝水。", "他正在喝水。", "他们正在喝水。"], correct: 2 }
]
