// PEP三年级上册 Unit 1 Part A《Hello!》题库
// 主题：文具与打招呼 (pen, pencil, ruler, eraser) + Hello! I'm...
// 7种题型，每种5题，共35题

export const quizBankG3U1a = [
  { question: "I have a ___.", chinese: "我有一支铅笔。", options: ["pencil", "book", "bag", "ruler"], correct: 0, explanation: "铅笔是 pencil。", tag: "词汇" },
  { question: "Hello, ___ Wu Binbin.", chinese: "你好，我是吴斌斌。", options: ["I'm", "my", "is", "he"], correct: 0, explanation: "自我介绍用 I'm (I am)。", tag: "语法" },
  { question: "Show ___ your ruler.", chinese: "把你的尺子给我看看。", options: ["I", "my", "me", "mine"], correct: 2, explanation: "Show sb sth (给某人看某物)，动词后用宾格 me。", tag: "代词" },
  { question: "I have ___ eraser.", chinese: "我有一块橡皮。", options: ["a", "an", "the", "two"], correct: 1, explanation: "eraser是以元音发音开头的单词，前面用 an。", tag: "冠词" },
  { question: "___! I'm Miss White.", chinese: "你好！我是怀特老师。", options: ["Goodbye", "Bye", "Hello", "See"], correct: 2, explanation: "打招呼用 Hello/Hi。", tag: "交际" }
]

export const fillblankBankG3U1a = [
  { sentence: "I have a ___ (尺子).", answer: "ruler", chinese: "我有一把尺子。", explanation: "ruler 尺子", tag: "词汇" },
  { sentence: "I have a ___ (钢笔).", answer: "pen", chinese: "我有一支钢笔。", explanation: "pen 钢笔", tag: "词汇" },
  { sentence: "I have an ___ (橡皮).", answer: "eraser", chinese: "我有一块橡皮。", explanation: "eraser 橡皮", tag: "词汇" },
  { sentence: "Hello, ___ (我是) Chen Jie.", answer: "I'm", chinese: "你好，我是陈洁。", explanation: "I'm 也就是 I am (我是)", tag: "语法" },
  { sentence: "___ (给我看) me your pencil.", answer: "Show", chinese: "给我看看你的铅笔。", explanation: "Show 给...看", tag: "动词" }
]

export const listenWordBankG3U1a = [
  { word: "pencil", options: ["pencil", "pen", "apple", "purple"], correct: 0, zh: "铅笔" },
  { word: "ruler", options: ["rubber", "reader", "ruler", "roller"], correct: 2, zh: "尺子" },
  { word: "eraser", options: ["elephant", "error", "eraser", "easier"], correct: 2, zh: "橡皮" },
  { word: "pen", options: ["pet", "pan", "pen", "pin"], correct: 2, zh: "钢笔" },
  { word: "show", options: ["shoe", "show", "slow", "snow"], correct: 1, zh: "展示/给...看" }
]

export const listenSentenceBankG3U1a = [
  { sentence: "I have a pencil.", zh: "我有一支铅笔。", options: ["I have a pen.", "I have a pencil.", "I have a ruler.", "I have an eraser."], correct: 1 },
  { sentence: "Hello, I'm Mike.", zh: "你好，我是迈克。", options: ["Hi, I'm Mike.", "Hello, I'm Mike.", "Hello, I'm Sarah.", "Goodbye, Mike."], correct: 1 },
  { sentence: "Show me your ruler.", zh: "你的尺子给我看看。", options: ["Show me your pen.", "Show me your ruler.", "Show me your pencil.", "Show me your eraser."], correct: 1 },
  { sentence: "I have an eraser.", zh: "我有一块橡皮。", options: ["I have an apple.", "I have an eraser.", "I have a ruler.", "I have a pen."], correct: 1 },
  { sentence: "Me too.", zh: "我也是。", options: ["Me two.", "Me to.", "Me too.", "You too."], correct: 2 }
]

export const listenOrderBankG3U1a = [
  { sentence: "I have a pencil.", zh: "我有一支铅笔。", words: ["I", "have", "a", "pencil."], answer: ["I", "have", "a", "pencil."] },
  { sentence: "Hello, I'm Mike.", zh: "你好，我是迈克。", words: ["Hello,", "I'm", "Mike."], answer: ["Hello,", "I'm", "Mike."] },
  { sentence: "Show me your ruler.", zh: "把你尺子给我看。", words: ["Show", "me", "your", "ruler."], answer: ["Show", "me", "your", "ruler."] },
  { sentence: "I have an eraser.", zh: "我有一块橡皮。", words: ["I", "have", "an", "eraser."], answer: ["I", "have", "an", "eraser."] },
  { sentence: "Me too.", zh: "我也是。", words: ["Me", "too."], answer: ["Me", "too."] }
]

export const listenResponseBankG3U1a = [
  { question: "Hello, I'm Mike.", zh: "你好，我是迈克。", options: ["Hi, I'm John.", "Goodbye.", "Me too.", "I have a pen."], correct: 0 },
  { question: "I have a ruler.", zh: "我有一把尺子。", options: ["Hello.", "Me too.", "Goodbye.", "Yes, it is."], correct: 1 },
  { question: "Show me your pen.", zh: "你的钢笔给我看看。", options: ["Here you are.", "I am Mike.", "Hello.", "Thank you."], correct: 0 },
  { question: "Hi, I'm Sarah.", zh: "你好，我是萨拉。", options: ["Me too.", "I have a pen.", "Hello, I'm Chen Jie.", "Goodbye."], correct: 2 },
  { question: "I have an eraser.", zh: "我有一块橡皮。", options: ["Me too.", "I'm Mike.", "Show me your pen.", "Hi."], correct: 0 }
]

export const listenTranslateBankG3U1a = [
  { sentence: "I have a pencil.", options: ["我有一支钢笔。", "我有一块橡皮。", "我有一把尺子。", "我有一支铅笔。"], correct: 3 },
  { sentence: "Hello, I'm Mike.", options: ["你好，我是迈克。", "再见，我是迈克。", "我是不是迈克？", "你好，迈克。"], correct: 0 },
  { sentence: "Show me your ruler.", options: ["你的铅笔给我看看。", "你的橡皮给我看看。", "你的尺子给我看看。", "你的钢笔给我看看。"], correct: 2 },
  { sentence: "I have an eraser.", options: ["我有一支铅笔。", "我有一支钢笔。", "我有一块橡皮。", "我有一把尺子。"], correct: 2 },
  { sentence: "Me too.", options: ["你也是。", "我也是。", "给我看看。", "我有一个。"], correct: 1 }
]
