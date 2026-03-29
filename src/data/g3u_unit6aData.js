// PEP三年级上册 Unit 6 Part A《Happy birthday!》题库
// 主题：数字 (one, two, three, four, five) + How many plates?
// 7种题型，每种5题，共35题

export const quizBankG3U6a = [
  { question: "___ many plates?", chinese: "多少个盘子？", options: ["How", "What", "Who", "Where"], correct: 0, explanation: "How many 表示“多少”。", tag: "疑问词" },
  { question: "Show me ___.", chinese: "给我看六。", options: ["six", "sick", "box", "sing"], correct: 0, explanation: "数字 six (六)。", tag: "词汇" },
  { question: "I have ___ apples.", chinese: "我有五个苹果。", options: ["five", "fly", "fine", "fire"], correct: 0, explanation: "数字 five (五)。", tag: "词汇" },
  { question: "How many ___?", chinese: "买几块蛋糕？", options: ["cakes", "cake", "meat", "water"], correct: 0, explanation: "How many 后面跟可数名词的复数形式。cakes 是复数。", tag: "单复数" },
  { question: "Jump ___ times.", chinese: "跳四下。", options: ["four", "five", "one", "two"], correct: 0, explanation: "times在这里表示“次/下”，选项中最符合题意的是数字。", tag: "词汇" }
]

export const fillblankBankG3U6a = [
  { sentence: "How ___ (多少) plates?", answer: "many", chinese: "多少个盘子？", explanation: "How many 多少", tag: "疑问词" },
  { sentence: "Two and two is ___ (四).", answer: "four", chinese: "二加二等于四。", explanation: "four 四。", tag: "数字" },
  { sentence: "I see ___ (三) birds.", answer: "three", chinese: "我看见三只鸟。", explanation: "three 三。", tag: "数字" },
  { sentence: "Give me ___ (五).", answer: "five", chinese: "给我五个/击个掌。", explanation: "five 五。", tag: "数字" },
  { sentence: "We have ___ (一) cake.", answer: "one", chinese: "我们有一个蛋糕。", explanation: "one 一。", tag: "数字" }
]

export const listenWordBankG3U6a = [
  { word: "one", options: ["on", "one", "won", "own"], correct: 1, zh: "一" },
  { word: "two", options: ["too", "to", "two", "ten"], correct: 2, zh: "二" },
  { word: "three", options: ["tree", "three", "there", "free"], correct: 1, zh: "三" },
  { word: "four", options: ["for", "far", "four", "floor"], correct: 2, zh: "四" },
  { word: "five", options: ["fine", "fire", "five", "file"], correct: 2, zh: "五" }
]

export const listenSentenceBankG3U6a = [
  { sentence: "How many plates?", zh: "几个盘子？", options: ["How many pens?", "How many books?", "How many plates?", "How many bags?"], correct: 2 },
  { sentence: "Five.", zh: "五个。", options: ["Four.", "Five.", "Six.", "One."], correct: 1 },
  { sentence: "Show me three.", zh: "给我看看三。", options: ["Show me four.", "Show me two.", "Show me three.", "Show me one."], correct: 2 },
  { sentence: "I see five pencils.", zh: "我看见了五支铅笔。", options: ["I see four pencils.", "I see five pens.", "I see five pencils.", "I see three pencils."], correct: 2 },
  { sentence: "One, two, three, four, five.", zh: "一，二，三，四，五。", options: ["One, two, three.", "Five, four, three.", "One, two, three, four, five.", "Six, seven, eight."], correct: 2 }
]

export const listenOrderBankG3U6a = [
  { sentence: "How many plates?", zh: "多少个盘子？", words: ["How", "many", "plates?"], answer: ["How", "many", "plates?"] },
  { sentence: "I see five.", zh: "我看见五个。", words: ["I", "see", "five."], answer: ["I", "see", "five."] },
  { sentence: "Show me four.", zh: "给我看四。", words: ["Show", "me", "four."], answer: ["Show", "me", "four."] },
  { sentence: "This one, please.", zh: "请给我这个。", words: ["This", "one,", "please."], answer: ["This", "one,", "please."] },
  { sentence: "We have three.", zh: "我们有三个。", words: ["We", "have", "three."], answer: ["We", "have", "three."] }
]

export const listenResponseBankG3U6a = [
  { question: "How many plates?", zh: "几个盘子？", options: ["Five.", "It's red.", "My name's John.", "Yes."], correct: 0 },
  { question: "Show me three.", zh: "让我看数字三。", options: ["OK.", "Hello.", "Me too.", "It's a book."], correct: 0 },
  { question: "How many apples?", zh: "几个苹果？", options: ["Four.", "I'm fine.", "Bye.", "Nice to meet you."], correct: 0 },
  { question: "What's this?", zh: "这是什么？", options: ["It's plate.", "Four.", "Show me.", "Hello."], correct: 0 },
  { question: "I see five ducks.", zh: "我看见五只鸭子。", options: ["Ten.", "Yes.", "Me too.", "How many?"], correct: 2 }
]

export const listenTranslateBankG3U6a = [
  { sentence: "How many plates?", options: ["几本书？", "多少个盘子？", "多少个苹果？", "在哪？"], correct: 1 },
  { sentence: "Show me four.", options: ["给我看三。", "给我看五。", "给我看四。", "给我看十。"], correct: 2 },
  { sentence: "I have five crayons.", options: ["我有一支红蜡笔。", "我有两支铅笔。", "我有五支蜡笔。", "我有四把尺子。"], correct: 2 },
  { sentence: "One, two, three...", options: ["二，三，四...", "一，二，四...", "一，三，五...", "一，二，三..."], correct: 3 },
  { sentence: "We have two.", options: ["我们有三个。", "我们有两个。", "我们有五个。", "我们有一个。"], correct: 1 }
]
