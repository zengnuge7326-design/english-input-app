// PEP三年级上册 Unit 1 Part C《Story time / Let's check》题库
// 主题：Unit 1 综合复习 (文具、自我介绍与告别)
// 7种题型，每种5题，共35题

export const quizBankG3U1c = [
  { question: "I ___ a book.", chinese: "我有一本书。", options: ["have", "has", "am", "is"], correct: 0, explanation: "I 后面接 have 表示“有”。", tag: "语法" },
  { question: "___ me your pen.", chinese: "把你的钢笔给我看看。", options: ["Show", "Open", "Close", "Carry"], correct: 0, explanation: "Show me... 表示“给我看...”。", tag: "交际" },
  { question: "What's ___ name?", chinese: "你叫什么名字？", options: ["you", "your", "my", "I"], correct: 1, explanation: "询问名字用 your name (你的名字)。", tag: "语法" },
  { question: "Me ___.", chinese: "我也是。", options: ["to", "two", "too", "ten"], correct: 2, explanation: "Me too (我也是)的正确拼写是 too。", tag: "拼写" },
  { question: "Bye! ___.", chinese: "拜拜！回头见。", options: ["See you", "Hello", "Hi", "I'm"], correct: 0, explanation: "道别除了Bye，还能用 See you。", tag: "交际" }
]

export const fillblankBankG3U1c = [
  { sentence: "This is a ___ (书包).", answer: "bag", chinese: "这是一个书包。", explanation: "bag 书包", tag: "词汇" },
  { sentence: "I have a ___ (蜡笔).", answer: "crayon", chinese: "我有一支蜡笔。", explanation: "crayon 蜡笔", tag: "词汇" },
  { sentence: "___ (打开) your book.", answer: "Open", chinese: "打开你的书。", explanation: "Open 打开。注意句首大写。", tag: "动词" },
  { sentence: "___ (合上) your book.", answer: "Close", chinese: "合上你的书。", explanation: "Close 合上。", tag: "动词" },
  { sentence: "See ___ (你)!", answer: "you", chinese: "再见！(回头见)", explanation: "See you!", tag: "交际" }
]

export const listenWordBankG3U1c = [
  { word: "book", options: ["look", "book", "cook", "box"], correct: 1, zh: "书" },
  { word: "open", options: ["open", "often", "over", "ocean"], correct: 0, zh: "打开" },
  { word: "close", options: ["class", "close", "clean", "cross"], correct: 1, zh: "合上/关上" },
  { word: "bag", options: ["big", "bat", "bad", "bag"], correct: 3, zh: "包" },
  { word: "hello", options: ["hello", "yellow", "hollow", "hero"], correct: 0, zh: "你好" }
]

export const listenSentenceBankG3U1c = [
  { sentence: "Open your book.", zh: "打开你的书。", options: ["Close your book.", "Open your book.", "Open your bag.", "Close your bag."], correct: 1 },
  { sentence: "Close your pencil box.", zh: "合上你的铅笔盒。", options: ["Open your pencil box.", "Close your bag.", "Close your pencil box.", "Close your book."], correct: 2 },
  { sentence: "See you!", zh: "再见！", options: ["Hello!", "See you!", "Good morning!", "Hi!"], correct: 1 },
  { sentence: "I have a bag.", zh: "我有一个书包。", options: ["I have a book.", "I have a pen.", "I have a bag.", "I have a crayon."], correct: 2 },
  { sentence: "Show me your crayon.", zh: "你的蜡笔给我看。", options: ["Show me your pen.", "Show me your ruler.", "Show me your bag.", "Show me your crayon."], correct: 3 }
]

export const listenOrderBankG3U1c = [
  { sentence: "Close your book.", zh: "合上你的书。", words: ["Close", "your", "book."], answer: ["Close", "your", "book."] },
  { sentence: "I have a crayon.", zh: "我有一支蜡笔。", words: ["I", "have", "a", "crayon."], answer: ["I", "have", "a", "crayon."] },
  { sentence: "What's your name?", zh: "你叫什么名字？", words: ["What's", "your", "name?"], answer: ["What's", "your", "name?"] },
  { sentence: "See you!", zh: "回头见！", words: ["See", "you!"], answer: ["See", "you!"] },
  { sentence: "Show me your bag.", zh: "你的书包给我看看。", words: ["Show", "me", "your", "bag."], answer: ["Show", "me", "your", "bag."] }
]

export const listenResponseBankG3U1c = [
  { question: "What's your name?", zh: "你叫什么名字？", options: ["My name's Zoom.", "Bye.", "Me too.", "Hello."], correct: 0 },
  { question: "I have a bag.", zh: "我有一个包。", options: ["What's your name?", "See you.", "Goodbye.", "Me too."], correct: 3 },
  { question: "Goodbye!", zh: "再见！", options: ["Hello!", "Bye!", "Me too.", "I'm Mike."], correct: 1 },
  { question: "Show me your book.", zh: "把你的书给我看。", options: ["OK.", "Hello.", "See you.", "My name is John."], correct: 0 },
  { question: "Hello, I'm Zip.", zh: "你好，我是Zip。", options: ["Bye, Zip.", "Hi, I'm Zoom.", "Me too.", "See you."], correct: 1 }
]

export const listenTranslateBankG3U1c = [
  { sentence: "Close your book.", options: ["打开你的书包。", "打开你的书。", "合上你的书包。", "合上你的书。"], correct: 3 },
  { sentence: "See you!", options: ["回头见！", "你好！", "谢谢！", "我也是。"], correct: 0 },
  { sentence: "I have a bag.", options: ["我有一支笔。", "我有一个包。", "我有一本书。", "我有一块橡皮。"], correct: 1 },
  { sentence: "Show me your crayon.", options: ["给我看你的书。", "给我看你的铅笔盒。", "给我看你的蜡笔。", "给我看你的钢笔。"], correct: 2 },
  { sentence: "My name's Zoom.", options: ["我是迈克。", "我是萨拉。", "我的名字叫拉链。", "我的名字叫祖姆。"], correct: 3 }
]
