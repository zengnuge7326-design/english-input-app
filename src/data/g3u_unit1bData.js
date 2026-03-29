// PEP三年级上册 Unit 1 Part B《Let's learn / Let's talk》题库
// 主题：文具与道别 (bag, book, pencil box, crayon) + What's your name? My name's... Goodbye.
// 7种题型，每种5题，共35题

export const quizBankG3U1b = [
  { question: "What's ___ name?", chinese: "你叫什么名字？", options: ["your", "you", "I", "my"], correct: 0, explanation: "What's your name? 是询问名字的固定句型。", tag: "语法" },
  { question: "My ___ John.", chinese: "我的名字叫约翰。", options: ["name", "name's", "names", "is"], correct: 1, explanation: "name's 是 name is 的缩写。My name's John. (我的名字是约翰)", tag: "语法" },
  { question: "Open your ___.", chinese: "打开你的文具盒。", options: ["pencil box", "door", "window", "ruler"], correct: 0, explanation: "pencil box 是文具盒（铅笔盒）。", tag: "词汇" },
  { question: "___! See you.", chinese: "再见！回头见。", options: ["Hello", "Hi", "Goodbye", "Morning"], correct: 2, explanation: "Goodbye 是再见的意思。", tag: "交际" },
  { question: "I have a ___.", chinese: "我有一支蜡笔。", options: ["eraser", "apple", "crayon", "elephant"], correct: 2, explanation: "空前是 a，说明后面跟辅音音素开头的单词，crayon (蜡笔) 符合。", tag: "冠词" }
]

export const fillblankBankG3U1b = [
  { sentence: "What's ___ (你的) name?", answer: "your", chinese: "你叫什么名字？", explanation: "your 你的。", tag: "代词" },
  { sentence: "My ___ (名字的缩写) Mike.", answer: "name's", chinese: "我叫迈克。", explanation: "name's = name is", tag: "句型" },
  { sentence: "Close your ___ (书).", answer: "book", chinese: "合上你的书。", explanation: "book 书", tag: "词汇" },
  { sentence: "Carry your ___ (书包).", answer: "bag", chinese: "背上你的书包。", explanation: "bag 包", tag: "词汇" },
  { sentence: "___ (再见)!", answer: "Goodbye", chinese: "再见！", explanation: "Goodbye 或者是 Bye", tag: "交际" }
]

export const listenWordBankG3U1b = [
  { word: "bag", options: ["bad", "bat", "bag", "big"], correct: 2, zh: "包/书包" },
  { word: "book", options: ["look", "book", "cook", "box"], correct: 1, zh: "书" },
  { word: "pencil box", options: ["pencil box", "pencil", "book box", "box"], correct: 0, zh: "铅笔盒" },
  { word: "crayon", options: ["crown", "crayon", "carpet", "carrot"], correct: 1, zh: "蜡笔" },
  { word: "name", options: ["name", "nine", "same", "game"], correct: 0, zh: "名字" }
]

export const listenSentenceBankG3U1b = [
  { sentence: "What's your name?", zh: "你叫什么名字？", options: ["What's your name?", "What's my name?", "What's his name?", "What's her name?"], correct: 0 },
  { sentence: "My name's John.", zh: "我的名字是约翰。", options: ["My name's Jack.", "My name's John.", "I'm John.", "His name is John."], correct: 1 },
  { sentence: "Open your pencil box.", zh: "打开你的铅笔盒。", options: ["Open your book.", "Open your pencil box.", "Close your pencil box.", "Close your book."], correct: 1 },
  { sentence: "Carry your bag.", zh: "背上你的书包。", options: ["Open your bag.", "Carry your bag.", "Close your bag.", "Show me your bag."], correct: 1 },
  { sentence: "Goodbye!", zh: "再见！", options: ["Hello!", "Goodbye!", "Good morning!", "Hi!"], correct: 1 }
]

export const listenOrderBankG3U1b = [
  { sentence: "What's your name?", zh: "你叫什么名字？", words: ["What's", "your", "name?"], answer: ["What's", "your", "name?"] },
  { sentence: "My name is John.", zh: "我的名字叫约翰。", words: ["My", "name", "is", "John."], answer: ["My", "name", "is", "John."] },
  { sentence: "Open your pencil box.", zh: "打开你的铅笔盒。", words: ["Open", "your", "pencil", "box."], answer: ["Open", "your", "pencil", "box."] },
  { sentence: "Goodbye, Miss White.", zh: "再见，怀特老师。", words: ["Goodbye,", "Miss", "White."], answer: ["Goodbye,", "Miss", "White."] },
  { sentence: "Carry your bag.", zh: "背上书包。", words: ["Carry", "your", "bag."], answer: ["Carry", "your", "bag."] }
]

export const listenResponseBankG3U1b = [
  { question: "What's your name?", zh: "你叫什么名字？", options: ["I have a pen.", "My name's Sarah.", "Goodbye.", "Hello."], correct: 1 },
  { question: "Goodbye, John.", zh: "再见，约翰。", options: ["Hello.", "Bye, Miss White.", "I have a book.", "My name is John."], correct: 1 },
  { question: "I have a crayon.", zh: "我有一支蜡笔。", options: ["Me too.", "Goodbye.", "What's your name?", "My name is Mike."], correct: 0 },
  { question: "What's your name?", zh: "你叫什么名字？", options: ["I'm Mike.", "Hello.", "Goodbye.", "I have a pencil box."], correct: 0 },
  { question: "Close your book.", zh: "合上你的书。", options: ["OK.", "Hello.", "My name is John.", "Bye."], correct: 0 }
]

export const listenTranslateBankG3U1b = [
  { sentence: "What's your name?", options: ["他的名字是什么？", "你的名字是什么？", "她的名字是什么？", "这是什么？"], correct: 1 },
  { sentence: "My name's Mike.", options: ["我叫迈克。", "他叫迈克。", "你叫迈克。", "我是迈克吗？"], correct: 0 },
  { sentence: "Open your pencil box.", options: ["打开你的书。", "合上你的书。", "打开你的铅笔盒。", "合上你的铅笔盒。"], correct: 2 },
  { sentence: "Carry your bag.", options: ["打开你的书包。", "背上你的书包。", "合上你的书包。", "给我看你的书包。"], correct: 1 },
  { sentence: "Goodbye!", options: ["你好！", "早安！", "再见！", "谢谢！"], correct: 2 }
]
