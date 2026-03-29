// PEP三年级上册 Unit 3 Part A《Look at me!》题库
// 主题：身体部位1 (head, face, nose, mouth, eye, ear) + Look at me. This is my face.
// 7种题型，每种5题，共35题

export const quizBankG3U3a = [
  { question: "___ at me.", chinese: "看看我。", options: ["Look", "See", "Watch", "Show"], correct: 0, explanation: "Look at... 看着...。", tag: "短语" },
  { question: "This ___ my face.", chinese: "这是我的脸。", options: ["is", "are", "am", "be"], correct: 0, explanation: "This(这) 是单数，谓语动词用 is。", tag: "语法" },
  { question: "Touch your ___.", chinese: "摸摸你的鼻子。", options: ["nose", "book", "bag", "pencil"], correct: 0, explanation: "nose 是鼻子，属于本单元学习的身体部位。", tag: "词汇" },
  { question: "Close your ___.", chinese: "闭上你的眼睛。", options: ["eyes", "nose", "ear", "head"], correct: 0, explanation: "眼睛有两只，一般用复数 eyes。闭眼睛：Close your eyes.", tag: "词汇" },
  { question: "How ___ you? I'm fine, thank you.", chinese: "你好吗？我很好，谢谢你。", options: ["is", "am", "are", "do"], correct: 2, explanation: "How are you? 是固定的问候语。", tag: "交际" }
]

export const fillblankBankG3U3a = [
  { sentence: "Look ___ (看) me.", answer: "at", chinese: "看着我。", explanation: "look at 看", tag: "介词" },
  { sentence: "This is my ___ (脸).", answer: "face", chinese: "这是我的脸。", explanation: "face 脸。", tag: "词汇" },
  { sentence: "Touch your ___ (鼻子).", answer: "nose", chinese: "摸摸你的鼻子。", explanation: "nose 鼻子。", tag: "词汇" },
  { sentence: "Touch your ___ (耳朵复数).", answer: "ears", chinese: "摸摸你的耳朵。", explanation: "耳朵复数 ears。", tag: "名词" },
  { sentence: "Open your ___ (嘴巴).", answer: "mouth", chinese: "张开你的嘴巴。", explanation: "mouth 嘴巴。", tag: "词汇" }
]

export const listenWordBankG3U3a = [
  { word: "face", options: ["face", "fact", "fake", "far"], correct: 0, zh: "脸" },
  { word: "nose", options: ["note", "nose", "noise", "rose"], correct: 1, zh: "鼻子" },
  { word: "mouth", options: ["mouse", "mouth", "month", "math"], correct: 1, zh: "嘴巴" },
  { word: "ear", options: ["ear", "year", "hear", "near"], correct: 0, zh: "耳朵" },
  { word: "eye", options: ["I", "ice", "eye", "ear"], correct: 2, zh: "眼睛" }
]

export const listenSentenceBankG3U3a = [
  { sentence: "Look at me.", zh: "看着我。", options: ["Look at me.", "Look at him.", "Look at you.", "Look at it."], correct: 0 },
  { sentence: "This is my face.", zh: "这是我的脸。", options: ["This is my nose.", "This is my eye.", "This is my face.", "This is my mouth."], correct: 2 },
  { sentence: "How are you?", zh: "你好吗？", options: ["Who are you?", "How are you?", "Where are you?", "How old are you?"], correct: 1 },
  { sentence: "I'm fine, thank you.", zh: "我很好，谢谢你。", options: ["I'm fine, thank you.", "I'm Mike.", "I'm sorry.", "Me too."], correct: 0 },
  { sentence: "Touch your nose.", zh: "摸摸你的鼻子。", options: ["Touch your eye.", "Touch your ear.", "Touch your face.", "Touch your nose."], correct: 3 }
]

export const listenOrderBankG3U3a = [
  { sentence: "Look at me.", zh: "看着我。", words: ["Look", "at", "me."], answer: ["Look", "at", "me."] },
  { sentence: "This is my face.", zh: "这是我的脸。", words: ["This", "is", "my", "face."], answer: ["This", "is", "my", "face."] },
  { sentence: "How are you?", zh: "你好吗？", words: ["How", "are", "you?"], answer: ["How", "are", "you?"] },
  { sentence: "I'm fine, thank you.", zh: "我很好，谢谢。", words: ["I'm", "fine,", "thank", "you."], answer: ["I'm", "fine,", "thank", "you."] },
  { sentence: "Touch your ear.", zh: "摸摸你的耳朵。", words: ["Touch", "your", "ear."], answer: ["Touch", "your", "ear."] }
]

export const listenResponseBankG3U3a = [
  { question: "How are you?", zh: "你好吗？", options: ["I'm fine, thank you.", "Nice to meet you.", "Hello.", "Goodbye."], correct: 0 },
  { question: "Look at me.", zh: "看着我。", options: ["OK.", "I'm fine.", "Thank you.", "Me too."], correct: 0 },
  { question: "Touch your ear.", zh: "摸你的耳朵。", options: ["OK.", "Hello.", "It's an ear.", "Thank you."], correct: 0 },
  { question: "Let's make a puppet.", zh: "让我们做个木偶吧。", options: ["Great!", "How are you?", "Goodbye.", "I see red."], correct: 0 },
  { question: "This is my face.", zh: "这是我的脸。", options: ["Nice to meet you.", "Oh, it's nice.", "Thank you.", "I am Mike."], correct: 1 }
]

export const listenTranslateBankG3U3a = [
  { sentence: "Look at me.", options: ["看看他。", "看看我。", "看着书。", "看黑板。"], correct: 1 },
  { sentence: "This is my face.", options: ["这是我的鼻子。", "这是我的嘴巴。", "这是我的脸色。", "这是我的脸。"], correct: 3 },
  { sentence: "How are you?", options: ["你是谁？", "你好吗？", "你多大？", "你要去哪？"], correct: 1 },
  { sentence: "I'm fine, thank you.", options: ["我也很好。", "不用谢。", "我很好，谢谢你。", "谢谢。"], correct: 2 },
  { sentence: "Touch your nose.", options: ["摸摸你的脸。", "张开你的嘴巴。", "闭上你的眼睛。", "摸摸你的鼻子。"], correct: 3 }
]
