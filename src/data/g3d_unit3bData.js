// PEP三年级下册 Unit 3 Part B《Let's learn / Let's talk》题库
// 主题：动物特征2 (small, big, long, short, giraffe) + It has a long nose.
// 7种题型，每种5题，共35题

export const quizBankG3D3b = [
  { question: "It ___ a long nose.", chinese: "它有一个长鼻子。", options: ["has", "have", "had", "is"], correct: 0, explanation: "主语是 It (第三人称单数)，用 has。", tag: "动词" },
  { question: "The elephant has a ___ nose.", chinese: "大象有一个长鼻子。", options: ["long", "short", "small", "tall"], correct: 0, explanation: "大象的鼻子很长，选 long。", tag: "形容词" },
  { question: "A monkey has a ___ tail.", chinese: "猴子有一条长尾巴。", options: ["long", "short", "big", "fat"], correct: 0, explanation: "猴子的尾巴长。", tag: "形容词" },
  { question: "The bear is ___. The mouse is small.", chinese: "熊很大。老鼠很小。", options: ["big", "long", "short", "thin"], correct: 0, explanation: "与 small (小) 相对的体型是 big (大)。", tag: "反义词" },
  { question: "Make your arms ___.", chinese: "让你的双臂变短。", options: ["short", "tall", "fat", "small"], correct: 0, explanation: "arm (手臂)的长度用 long 或 short。", tag: "搭配" }
]

export const fillblankBankG3D3b = [
  { sentence: "It ___ (有) a long nose.", answer: "has", chinese: "它有一个长鼻子。", explanation: "主语 It 是单数，动词用 has。", tag: "动词" },
  { sentence: "It has a ___ (长的) tail.", answer: "long", chinese: "它有一根长尾巴。", explanation: "long 长的", tag: "形容词" },
  { sentence: "The bear is ___ (大的).", answer: "big", chinese: "这只熊很大。", explanation: "big 大的", tag: "形容词" },
  { sentence: "The mouse is ___ (小的).", answer: "small", chinese: "这只老鼠很小。", explanation: "small 小的", tag: "形容词" },
  { sentence: "The rabbit has ___ (短的) ears? No, long ears! It has a short tail.", answer: "short", chinese: "它有短的尾巴。", explanation: "short 短的", tag: "形容词" }
]

export const listenWordBankG3D3b = [
  { word: "small", options: ["smell", "small", "smile", "smart"], correct: 1, zh: "小的" },
  { word: "big", options: ["pig", "bag", "big", "dig"], correct: 2, zh: "大的" },
  { word: "long", options: ["song", "long", "log", "look"], correct: 1, zh: "长的" },
  { word: "short", options: ["shirt", "short", "shoes", "shot"], correct: 1, zh: "短的/矮的" },
  { word: "giraffe", options: ["giraffe", "elephant", "tiger", "bear"], correct: 0, zh: "长颈鹿" }
]

export const listenSentenceBankG3D3b = [
  { sentence: "It has a long nose.", zh: "它有一个长鼻子。", options: ["It has a short tail.", "It has a long nose.", "It has a big head.", "It has small eyes."], correct: 1 },
  { sentence: "It has a short tail.", zh: "它有一条短尾巴。", options: ["It has a long tail.", "It has a short tail.", "It has small ears.", "It has big eyes."], correct: 1 },
  { sentence: "The elephant is big.", zh: "大象很大。", options: ["The monkey is small.", "The elephant is big.", "The bear is fat.", "The pig is big."], correct: 1 },
  { sentence: "Come here, children.", zh: "到这儿来，孩子们。", options: ["Look at the animals.", "Come here, children.", "Wait a minute.", "Have some apples."], correct: 1 },
  { sentence: "Make your eyes big.", zh: "把你的眼睛睁大。", options: ["Make your eyes small.", "Make your arms long.", "Make your eyes big.", "Make your arms short."], correct: 2 }
]

export const listenOrderBankG3D3b = [
  { sentence: "It has a long nose.", zh: "它有一个长鼻子。", words: ["It", "has", "a", "long", "nose."], answer: ["It", "has", "a", "long", "nose."] },
  { sentence: "It has a short tail.", zh: "它有一条短尾巴。", words: ["It", "has", "a", "short", "tail."], answer: ["It", "has", "a", "short", "tail."] },
  { sentence: "The elephant is big.", zh: "大象很大。", words: ["The", "elephant", "is", "big."], answer: ["The", "elephant", "is", "big."] },
  { sentence: "The mouse is small.", zh: "老鼠很小。", words: ["The", "mouse", "is", "small."], answer: ["The", "mouse", "is", "small."] },
  { sentence: "Make your eyes big.", zh: "把眼睛睁大。", words: ["Make", "your", "eyes", "big."], answer: ["Make", "your", "eyes", "big."] }
]

export const listenResponseBankG3D3b = [
  { question: "Look at the elephant.", zh: "看那头大象。", options: ["Wow! It has a long nose.", "It's red.", "I'm ten.", "Goodbye."], correct: 0 },
  { question: "Look at the mouse.", zh: "看这只小老鼠。", options: ["It's so small.", "He's my brother.", "I like juice.", "Thank you."], correct: 0 },
  { question: "What's that?", zh: "那是什么？", options: ["It's a giraffe. It has a long neck.", "She is my sister.", "It's big.", "See you."], correct: 0 },
  { question: "It has a short tail.", zh: "它有一根短尾巴。", options: ["Is it a rabbit?", "It has a long tail.", "You're welcome.", "No."], correct: 0 },
  { question: "Is the bear big?", zh: "那只熊大吗？", options: ["Yes, it is very big.", "It has a short tail.", "Hello.", "It's thin."], correct: 0 }
]

export const listenTranslateBankG3D3b = [
  { sentence: "It has a long nose.", options: ["它有一根短尾巴。", "他有一个大头。", "它有一个长鼻子。", "它有多高啊！"], correct: 2 },
  { sentence: "It has a short tail.", options: ["它有一只大耳朵。", "它有一条短尾巴。", "它有一条长尾巴。", "它有一个小鼻子。"], correct: 1 },
  { sentence: "The elephant is big.", options: ["猴子很瘦。", "老鼠很小。", "大象很高。", "大象很大。"], correct: 3 },
  { sentence: "Come here.", options: ["去那里。", "到这里来。", "回去。", "再见。"], correct: 1 },
  { sentence: "Make your arms long.", options: ["把手臂伸长。", "把腿缩短。", "睁大眼睛。", "站直。"], correct: 0 }
]
