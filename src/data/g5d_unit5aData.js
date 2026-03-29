// PEP五年级下册 Unit 5 Part A《Whose dog is it?》题库
// 主题：名词性物主代词 (mine, yours, his, hers, theirs, ours) + Whose dog is it? It's his.
// 7种题型，每种5题，共35题

export const quizBankG5D5a = [
  { question: "___ dog is it?", chinese: "这是谁的狗？", options: ["Whose", "Who", "What", "Where"], correct: 0, explanation: "对物主提问用 Whose (谁的)。", tag: "疑问词" },
  { question: "The yellow picture is ___.", chinese: "这幅黄色的画是我的。", options: ["mine", "my", "me", "I"], correct: 0, explanation: "作表语指代“我的画”，用名词性物主代词 mine。", tag: "代词" },
  { question: "Are these books ___?", chinese: "这些书是你们的吗？", options: ["yours", "your", "you", "yourselves"], correct: 0, explanation: "指代“你的(书)”，作表语，用 yours。", tag: "代词" },
  { question: "That is ___ dog.", chinese: "那是他的狗。", options: ["his", "him", "he", "hers"], correct: 0, explanation: "修饰名词 dog，用形容词性物主代词 his。", tag: "代词" },
  { question: "This is her cat. The cat is ___.", chinese: "这是她的猫。这只猫是她的。", options: ["hers", "her", "she", "his"], correct: 0, explanation: "作表语指代“她的猫”，用 hers。", tag: "代词" }
]

export const fillblankBankG5D5a = [
  { sentence: "___ (谁的) dog is it?", answer: "Whose", chinese: "这是谁的狗？", explanation: "Whose", tag: "疑问代词" },
  { sentence: "These books are ___ (我们的).", answer: "ours", chinese: "这些书是我们的。", explanation: "ours 我们的（名词性）", tag: "代词" },
  { sentence: "The red pen is ___ (我的).", answer: "mine", chinese: "那支红色的笔是我的。", explanation: "mine 我的（名词性）", tag: "代词" },
  { sentence: "The shoes are ___ (他们的).", answer: "theirs", chinese: "这些鞋子是他们的。", explanation: "theirs 他们的（名词性）", tag: "代词" },
  { sentence: "Are these ___ (你的名词性)?", answer: "yours", chinese: "这些是你们的吗？", explanation: "yours 你的（名词性）", tag: "代词" }
]

export const listenWordBankG5D5a = [
  { word: "whose", options: ["who", "whose", "whom", "where"], correct: 1, zh: "谁的" },
  { word: "mine", options: ["my", "me", "mine", "mind"], correct: 2, zh: "我的" },
  { word: "yours", options: ["your", "young", "yours", "you"], correct: 2, zh: "你的/你们的" },
  { word: "theirs", options: ["there", "their", "theirs", "these"], correct: 2, zh: "他(她/它)们的" },
  { word: "ours", options: ["our", "ours", "out", "own"], correct: 1, zh: "我们的" }
]

export const listenSentenceBankG5D5a = [
  { sentence: "Whose dog is it?", zh: "这是谁的狗？", options: ["Who is the dog?", "Whose dog is it?", "What dog is it?", "Where is the dog?"], correct: 1 },
  { sentence: "It's his.", zh: "是他的。", options: ["It's hers.", "It's his.", "It's mine.", "It's ours."], correct: 1 },
  { sentence: "The yellow picture is mine.", zh: "黄色的画是我的。", options: ["The yellow picture is mine.", "The red picture is mine.", "The yellow picture is yours.", "The blue picture is his."], correct: 0 },
  { sentence: "Are these yours?", zh: "这些是你的/你们的吗？", options: ["Are these yours?", "Are these ours?", "Are these theirs?", "Are those yours?"], correct: 0 },
  { sentence: "That cat is hers.", zh: "那只猫是她的。", options: ["That dog is hers.", "This cat is hers.", "That cat is hers.", "That cat is his."], correct: 2 }
]

export const listenOrderBankG5D5a = [
  { sentence: "Whose dog is it?", zh: "这是谁的狗？", words: ["Whose", "dog", "is", "it?"], answer: ["Whose", "dog", "is", "it?"] },
  { sentence: "It is his.", zh: "它是他的。", words: ["It", "is", "his."], answer: ["It", "is", "his."] },
  { sentence: "The yellow picture is mine.", zh: "黄色的画是我的。", words: ["The", "yellow", "picture", "is", "mine."], answer: ["The", "yellow", "picture", "is", "mine."] },
  { sentence: "Are these yours?", zh: "这些是你们的吗？", words: ["Are", "these", "yours?"], answer: ["Are", "these", "yours?"] },
  { sentence: "The books are ours.", zh: "这些书是我们的。", words: ["The", "books", "are", "ours."], answer: ["The", "books", "are", "ours."] }
]

export const listenResponseBankG5D5a = [
  { question: "Whose dog is it?", zh: "这是谁的狗？", options: ["It's his.", "Yes, it is.", "He is ten.", "I like dogs."], correct: 0 },
  { question: "Is this yours?", zh: "这是你的吗？", options: ["Yes, it is mine.", "No, they aren't.", "Thank you.", "It's yellow."], correct: 0 },
  { question: "Whose bag is this?", zh: "这是谁的包？", options: ["It's hers.", "I like bags.", "My name is Tom.", "Yes, it is."], correct: 0 },
  { question: "Are these books ours?", zh: "这些书是我们的吗？", options: ["Yes, they are.", "No, it isn't.", "Because I am tall.", "Me too."], correct: 0 },
  { question: "Whose picture is the yellow one?", zh: "黄色的画是谁的？", options: ["It's mine.", "It is a picture.", "I can draw.", "Thanks."], correct: 0 }
]

export const listenTranslateBankG5D5a = [
  { sentence: "Whose dog is it?", options: ["谁有狗？", "你的狗在哪里？", "这是谁的狗？", "那只狗多大？"], correct: 2 },
  { sentence: "It's his.", options: ["是他的。", "是她的。", "是我的。", "是我们的。"], correct: 0 },
  { sentence: "The yellow picture is mine.", options: ["这幅画是黄色的。", "黄色的画是我的。", "你的画是黄色的。", "这副黄色的画很美。"], correct: 1 },
  { sentence: "Are these yours?", options: ["这些是他们的吗？", "这些是你的吗？", "这件毛衣是你的吗？", "那些是我们的吗？"], correct: 1 },
  { sentence: "These books are theirs.", options: ["这些书是我们的。", "这些书是她的。", "这些书是他们的。", "书都在桌子上。"], correct: 2 }
]
