// PEP四年级上册 Unit 2 Part B《Let's learn / Let's talk》题库
// 主题：包里的物品 (candy, notebook, toy, key) + What colour is it? It's blue. + i-e 发音规则
// 7种题型，每种5题，共35题

export const quizBankG4U2b = [
  { question: "I lost my schoolbag. What ___ is it?", chinese: "我的书包丢了。它是什么颜色的？", options: ["time", "colour", "about", "book"], correct: 1, explanation: "问颜色用 What colour。", tag: "句型" },
  { question: "It's ___ and white.", chinese: "它是蓝白相间的。", options: ["colour", "blue", "candy", "toy"], correct: 1, explanation: "blue 是颜色，符合语境。", tag: "词汇" },
  { question: "Here it ___. Thank you so much!", chinese: "它在这里。非常感谢！", options: ["is", "are", "am", "be"], correct: 0, explanation: "Here it is. (它在这里) 是固定搭配。", tag: "句型" },
  { question: "I have three ___ in my schoolbag.", chinese: "我书包里有三颗糖果。", options: ["candy", "candys", "candies", "toy"], correct: 2, explanation: "candy的复数把 y 改 i 再加 es：candies。", tag: "语法" },
  { question: "Which word has the 'i-e' sound like in 'kite'?", chinese: "哪个词里面的 i-e 发音和 kite 里的发音相同？", options: ["pig", "five", "six", "big"], correct: 1, explanation: "i-e结构中 i 发它字母本身的双元音 /aɪ/。five 符合此规则。", tag: "拼读" }
]

export const fillblankBankG4U2b = [
  { sentence: "What ___ (颜色) is it?", answer: "colour", chinese: "它是什么颜色的？", explanation: "colour 颜色。", tag: "词汇" },
  { sentence: "I lost my ___ (钥匙).", answer: "key", chinese: "我弄丢了我的钥匙。", explanation: "key 钥匙。", tag: "词汇" },
  { sentence: "I have a ___ (笔记本).", answer: "notebook", chinese: "我有一本笔记本。", explanation: "notebook 笔记本。", tag: "词汇" },
  { sentence: "I have two ___ (玩具) in my bag.", answer: "toys", chinese: "我包里有两个玩具。", explanation: "toy的复数直接加s：toys。", tag: "拼写" },
  { sentence: "I have some ___ (糖果).", answer: "candies", chinese: "我有一些糖果。", explanation: "candy 复数 candies。", tag: "词汇" }
]

export const listenWordBankG4U2b = [
  { word: "candy", options: ["candle", "candy", "can", "canned"], correct: 1, zh: "糖果" },
  { word: "notebook", options: ["storybook", "notebook", "no", "book"], correct: 1, zh: "笔记本" },
  { word: "toy", options: ["boy", "toy", "joy", "toe"], correct: 1, zh: "玩具" },
  { word: "key", options: ["kite", "key", "keep", "kid"], correct: 1, zh: "钥匙" },
  { word: "colour", options: ["car", "cover", "column", "colour"], correct: 3, zh: "颜色" }
]

export const listenSentenceBankG4U2b = [
  { sentence: "What colour is it?", zh: "它是啥颜色的？", options: ["What time is it?", "What colour is it?", "Where is it?", "Who is it?"], correct: 1 },
  { sentence: "It's blue and white.", zh: "它是蓝白相间的。", options: ["It's red and white.", "It's blue and white.", "It's black and white.", "It's green and white."], correct: 1 },
  { sentence: "I have three candies.", zh: "我有三颗糖果。", options: ["I have three keys.", "I have three notebooks.", "I have three toys.", "I have three candies."], correct: 3 },
  { sentence: "Here it is.", zh: "它在这里。", options: ["Here it is.", "There it is.", "Where is it?", "It's here."], correct: 0 },
  { sentence: "I lost my schoolbag.", zh: "我丢了我的书包。", options: ["I have a schoolbag.", "I lost my schoolbag.", "I like my schoolbag.", "Where is my schoolbag?"], correct: 1 }
]

export const listenOrderBankG4U2b = [
  { sentence: "What colour is it?", zh: "它是什么颜色的？", words: ["What", "colour", "is", "it?"], answer: ["What", "colour", "is", "it?"] },
  { sentence: "It is blue and white.", zh: "它是蓝白相间的。", words: ["It", "is", "blue", "and", "white."], answer: ["It", "is", "blue", "and", "white."] },
  { sentence: "I lost my schoolbag.", zh: "我弄丢了我的书包。", words: ["I", "lost", "my", "schoolbag."], answer: ["I", "lost", "my", "schoolbag."] },
  { sentence: "Here it is.", zh: "它在这里。", words: ["Here", "it", "is."], answer: ["Here", "it", "is."] },
  { sentence: "Thank you so much.", zh: "非常感谢你。", words: ["Thank", "you", "so", "much."], answer: ["Thank", "you", "so", "much."] }
]

export const listenResponseBankG4U2b = [
  { question: "I lost my schoolbag.", zh: "我的书包丢了。", options: ["Thank you.", "What colour is it?", "Here it is.", "It is blue."], correct: 1 },
  { question: "What colour is it?", zh: "它是什么颜色的？", options: ["It's in the desk.", "It's a schoolbag.", "It's green.", "It is heavy."], correct: 2 },
  { question: "What's in it?", zh: "里面有什么？", options: ["A notebook and two toys.", "It is blue.", "I lost my bag.", "Yes, it is."], correct: 0 },
  { question: "Here it is.", zh: "它在这里。", options: ["What colour is it?", "Thank you so much.", "It's near the window.", "It's red."], correct: 1 },
  { question: "How many candies do you have?", zh: "你有几颗糖果？", options: ["I have five.", "They are sweet.", "It's red.", "Yes, I have."], correct: 0 }
]

export const listenTranslateBankG4U2b = [
  { sentence: "What colour is it?", options: ["它在哪里？", "它是什么颜色的？", "它是什么？", "你的书包是什么颜色的？"], correct: 1 },
  { sentence: "I lost my notebook.", options: ["我有一本笔记本。", "我的玩具丢了。", "我的书包丢了。", "我的笔记本丢了。"], correct: 3 },
  { sentence: "It's blue and white.", options: ["它是黑白相间的。", "它是红白相间的。", "它是蓝白相间的。", "它是绿白相间的。"], correct: 2 },
  { sentence: "Here it is.", options: ["它在那里。", "它在这里。", "那是你的。", "它是红色的。"], correct: 1 },
  { sentence: "I have some keys.", options: ["我有一些玩具。", "我有一些糖果。", "我有一些钥匙。", "我有一把钥匙。"], correct: 2 }
]
