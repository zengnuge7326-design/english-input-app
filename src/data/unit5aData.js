// PEP四年级下册 Unit 5 Part A《My clothes》题库
// 主题：衣服名词 (clothes, hat, skirt, pants, dress) + Are these yours? / Is this John's?
// 7种题型，每种5题，共35题

export const quizBank5a = [
  { question: "Are these ___? Yes, they are.", chinese: "这些是你的（裤子）吗？是的。", options: ["your", "yours", "you", "my"], correct: 1, explanation: "yours = your pants，是名词性物主代词。在这句话中做表语。", tag: "语法" },
  { question: "Is this ___ shirt?", chinese: "这是约翰的衬衫吗？", options: ["John", "Johns", "John's", "John is"], correct: 2, explanation: "John's 表示'约翰的'，名词所有格接名词 shirt。", tag: "语法" },
  { question: "It's time to put on your ___.", chinese: "该穿你的裙子了。", options: ["skirt", "sky", "shirt", "shoe"], correct: 0, explanation: "skirt 是短裙/半身裙。", tag: "词汇" },
  { question: "Are these ___? No, they aren't.", chinese: "这些是他的吗？不，不是。", options: ["he", "him", "his", "she"], correct: 2, explanation: "his 既可以作形容词性物主代词，也可以作名词性物主代词。在这指'他的衣服'。", tag: "语法" },
  { question: "Look at my ___. They are new.", chinese: "看看我的裤子。它们是新的。", options: ["pant", "pants", "hat", "dress"], correct: 1, explanation: "pants (裤子) 是复数名词，因为句子后半句用了 They are，所以排除单数的 hat 和 dress。", tag: "语法" }
]

export const fillblankBank5a = [
  { sentence: "Are these ___ (你的)?", answer: "yours", chinese: "这些是你的吗？", explanation: "yours，表示你的东西/衣物。", tag: "词汇" },
  { sentence: "Is this ___ (迈克的) hat?", answer: "Mike's", chinese: "这是迈克的帽子吗？", explanation: "Mike's 名词所有格表示'某人的'。", tag: "语法" },
  { sentence: "___ (穿上) your pants.", answer: "Put on", chinese: "穿上你的裤子。", explanation: "put on 穿上。", tag: "短语" },
  { sentence: "They are my ___ (衣服).", answer: "clothes", chinese: "它们是我的衣服。", explanation: "clothes 衣服，通常以复数形式出现。", tag: "拼写" },
  { sentence: "Are these his? Yes, they ___.", answer: "are", chinese: "这些是他的吗？是的。", explanation: "Are these... 肯定回答：Yes, they are.", tag: "语法" }
]

export const listenWordBank5a = [
  { word: "clothes", options: ["clothes", "close", "cloth", "cloud"], correct: 0, zh: "衣服" },
  { word: "pants", options: ["plants", "pants", "paint", "pans"], correct: 1, zh: "裤子" },
  { word: "skirt", options: ["shirt", "short", "skirt", "skip"], correct: 2, zh: "短裙" },
  { word: "dress", options: ["dress", "desk", "guess", "press"], correct: 0, zh: "连衣裙" },
  { word: "yours", options: ["your", "yours", "you", "young"], correct: 1, zh: "你的(衣物)" }
]

export const listenSentenceBank5a = [
  { sentence: "Are these yours?", zh: "这些是你的吗？", options: ["Are these you?", "Are these yours?", "Is this yours?", "Are those yours?"], correct: 1 },
  { sentence: "Is this John's?", zh: "这是约翰的吗？", options: ["Is this John's?", "Is that John's?", "Where is John?", "Is this John?"], correct: 0 },
  { sentence: "No, they aren't.", zh: "不，它们不是。", options: ["No, it isn't.", "Yes, they are.", "No, they aren't.", "Yes, it is."], correct: 2 },
  { sentence: "Wash your skirt.", zh: "洗你的裙子。", options: ["Wash your shirt.", "Wash your pants.", "Watch your skirt.", "Wash your skirt."], correct: 3 },
  { sentence: "Put on your dress.", zh: "穿上你的连衣裙。", options: ["Put on your shoes.", "Put on your hat.", "Put on your dress.", "Take off your dress."], correct: 2 }
]

export const listenOrderBank5a = [
  { sentence: "Are these yours?", zh: "这些是你的吗？", words: ["Are", "these", "yours?"], answer: ["Are", "these", "yours?"] },
  { sentence: "Is this John's hat?", zh: "这是约翰的帽子吗？", words: ["Is", "this", "John's", "hat?"], answer: ["Is", "this", "John's", "hat?"] },
  { sentence: "Put on your new pants.", zh: "穿上你的新裤子。", words: ["Put", "on", "your", "new", "pants."], answer: ["Put", "on", "your", "new", "pants."] },
  { sentence: "No, they aren't.", zh: "不，它们不是。", words: ["No,", "they", "aren't."], answer: ["No,", "they", "aren't."] },
  { sentence: "They are my clothes.", zh: "它们是我的衣服。", words: ["They", "are", "my", "clothes."], answer: ["They", "are", "my", "clothes."] }
]

export const listenResponseBank5a = [
  { question: "Are these yours?", zh: "这些是你的吗？", options: ["It is my hat.", "No, they aren't.", "Yes, it is.", "I am yours."], correct: 1 },
  { question: "Is this John's?", zh: "这是约翰的吗？", options: ["Yes, he is.", "He is John.", "Yes, it is.", "No, they aren't."], correct: 2 },
  { question: "What are those?", zh: "那些是什么？", options: ["They are pants.", "Yes, they are.", "No, it isn't.", "I like pants."], correct: 0 },
  { question: "Where is my skirt?", zh: "我的短裙在哪里？", options: ["It's blue.", "It is on the bed.", "Yes, you are.", "My skirt is new."], correct: 1 },
  { question: "Are they his?", zh: "它们是他的吗？", options: ["Yes, they are.", "Yes, he is.", "No, it isn't.", "I don't know him."], correct: 0 }
]

export const listenTranslateBank5a = [
  { sentence: "Are these yours?", options: ["这些是什么？", "这是你的吗？", "这些是你的吗？", "那些是你的吗？"], correct: 2 },
  { sentence: "Is this John's?", options: ["这是约翰的帽子吗？", "这是约翰吗？", "约翰在哪里？", "这是约翰的吗？"], correct: 3 },
  { sentence: "Put on your pants.", options: ["脱掉你的连衣裙。", "洗你的袜子。", "脱掉你的裤子。", "穿上你的裤子。"], correct: 3 },
  { sentence: "They are my clothes.", options: ["这是我的衣服。", "它们是我的鞋子。", "它们是我的衣服。", "那是我的裤子。"], correct: 2 },
  { sentence: "No, they aren't. They're Mike's.", options: ["不，它们不是。它们是迈克的。", "是的，它们是。它们是迈克的。", "不，不是。这是迈克的。", "是的，它是。这是迈克的。"], correct: 0 }
]
