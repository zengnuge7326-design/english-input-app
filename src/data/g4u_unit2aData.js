// PEP四年级上册 Unit 2 Part A《My schoolbag》题库
// 主题：书包里的物品 (schoolbag, math book, English book, Chinese book, storybook) + What's in your schoolbag?
// 7种题型，每种5题，共35题

export const quizBankG4U2a = [
  { question: "I have a new ___.", chinese: "我有一个新书包。", options: ["schoolbag", "classroom", "window", "door"], correct: 0, explanation: "本课主题是书包，I have a new schoolbag是经典开场句。", tag: "词汇" },
  { question: "What's ___ your schoolbag?", chinese: "你书包里有什么？", options: ["on", "in", "under", "near"], correct: 1, explanation: "在书包里面用介词 in。", tag: "介词" },
  { question: "An English book, a math book and ___ storybooks.", chinese: "一本英语书，一本数学书和三本故事书。", options: ["three", "a", "an", "one"], correct: 0, explanation: "storybooks 是复数，前面只能跟大于1的数词如 three。", tag: "语法" },
  { question: "Put ___ your Chinese book.", chinese: "收起你的语文书。", options: ["on", "away", "in", "up"], correct: 1, explanation: "put away 指把东西收起来放好。", tag: "短语" },
  { question: "___ English book is it? It's blue.", chinese: "这是一本什么样（或者哪一本）的英语书？不，原意应为：一本英语书。", options: ["An", "A", "The", "Some"], correct: 0, explanation: "English 以元音音素开头，前面用冠词 An。", tag: "语法" }
]

export const fillblankBankG4U2a = [
  { sentence: "What's in your ___ (书包)?", answer: "schoolbag", chinese: "你书包里有什么？", explanation: "schoolbag 书包。", tag: "词汇" },
  { sentence: "I have a ___ (语文) book.", answer: "Chinese", chinese: "我有一本语文书。", explanation: "Chinese book 语文书。注意首字母大写。", tag: "词汇" },
  { sentence: "Put away your ___ (数学) book.", answer: "math", chinese: "收起你的数学书。", explanation: "math 数学。", tag: "词汇" },
  { sentence: "I have an ___ (英语) book.", answer: "English", chinese: "我有一本英语书。", explanation: "English 英语。", tag: "词汇" },
  { sentence: "I have three ___ (故事书).", answer: "storybooks", chinese: "我有三本故事书。", explanation: "storybook 的复数是 storybooks。", tag: "拼写" }
]

export const listenWordBankG4U2a = [
  { word: "schoolbag", options: ["schoolbag", "school", "sandbox", "shoe"], correct: 0, zh: "书包" },
  { word: "math", options: ["map", "match", "math", "mouth"], correct: 2, zh: "数学" },
  { word: "English", options: ["English", "Spanish", "Finish", "Relish"], correct: 0, zh: "英语" },
  { word: "Chinese", options: ["China", "Chinese", "Cheese", "Children"], correct: 1, zh: "语文 / 中文" },
  { word: "storybook", options: ["notebook", "storybook", "textbook", "guidebook"], correct: 1, zh: "故事书" }
]

export const listenSentenceBankG4U2a = [
  { sentence: "I have a new schoolbag.", zh: "我有一个新书包。", options: ["I have a new schoolbag.", "I have a red schoolbag.", "I have a big schoolbag.", "I have a new book."], correct: 0 },
  { sentence: "What's in your schoolbag?", zh: "你书包里面有什么？", options: ["What's in your desk?", "Where is your schoolbag?", "What's in your schoolbag?", "Is it in your schoolbag?"], correct: 2 },
  { sentence: "An English book and a math book.", zh: "一本英语书和一本数学书。", options: ["A Chinese book and a math book.", "An English book and a math book.", "An English book and a storybook.", "Two storybooks and a math book."], correct: 1 },
  { sentence: "Put away your books.", zh: "把你的书收起来。", options: ["Take out your books.", "Put away your books.", "Open your books.", "Close your books."], correct: 1 },
  { sentence: "It is heavy.", zh: "它很重。", options: ["It is big.", "It is nice.", "It is heavy.", "It is light."], correct: 2 }
]

export const listenOrderBankG4U2a = [
  { sentence: "I have a new schoolbag.", zh: "我有一个新书包。", words: ["I", "have", "a", "new", "schoolbag."], answer: ["I", "have", "a", "new", "schoolbag."] },
  { sentence: "What is in your schoolbag?", zh: "你的书包里有什么？", words: ["What", "is", "in", "your", "schoolbag?"], answer: ["What", "is", "in", "your", "schoolbag?"] },
  { sentence: "An English book and a math book.", zh: "一本英语书和一本数学书。", words: ["An", "English", "book", "and", "a", "math", "book."], answer: ["An", "English", "book", "and", "a", "math", "book."] },
  { sentence: "It is very heavy.", zh: "它非常重。", words: ["It", "is", "very", "heavy."], answer: ["It", "is", "very", "heavy."] },
  { sentence: "Put away your books.", zh: "收起你的书。", words: ["Put", "away", "your", "books."], answer: ["Put", "away", "your", "books."] }
]

export const listenResponseBankG4U2a = [
  { question: "What's in your schoolbag?", zh: "你书包里有什么？", options: ["It's heavy.", "An English book and a math book.", "It's a schoolbag.", "I like books."], correct: 1 },
  { question: "I have a new schoolbag.", zh: "我有一个新书包。", options: ["Really? May I see it?", "It's a book.", "Where is it?", "Thank you."], correct: 0 },
  { question: "Is your schoolbag heavy?", zh: "你的书包重吗？", options: ["Yes, it is.", "It is blue.", "I have three books.", "No, it is a bag."], correct: 0 },
  { question: "Where is the math book?", zh: "数学书在哪里？", options: ["It is heavy.", "It's in the schoolbag.", "I have a math book.", "It is a math book."], correct: 1 },
  { question: "What colour is your schoolbag?", zh: "你的书包是什么颜色的？", options: ["It's black and white.", "It's on the desk.", "An English book.", "It's heavy."], correct: 0 }
]

export const listenTranslateBankG4U2a = [
  { sentence: "What's in your schoolbag?", options: ["书包在哪里？", "书桌里有什么？", "你书包里有什么？", "这是你的书包吗？"], correct: 2 },
  { sentence: "An English book and a math book.", options: ["一本语文书和一本数学书。", "一本故事书和一本英语书。", "一本英语书和一本数学书。", "一本英语书和一本语文书。"], correct: 2 },
  { sentence: "I have a new schoolbag.", options: ["我有一本新书。", "我有一个新书包。", "这是一个旧书包。", "你的书包是新的。"], correct: 1 },
  { sentence: "Put away your books.", options: ["拿出你的书。", "打开你的书。", "合上你的书。", "把你的书收好。"], correct: 3 },
  { sentence: "It's very heavy.", options: ["它非常轻。", "它非常重。", "它非常新。", "它非常好。"], correct: 1 }
]
