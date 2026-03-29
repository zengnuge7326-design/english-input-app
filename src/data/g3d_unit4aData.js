// PEP三年级下册 Unit 4 Part A《Where is my car?》题库
// 主题：介词与物品1 (on, in, under, desk, chair) + Where is my pencil? It's under your book.
// 7种题型，每种5题，共35题

export const quizBankG3D4a = [
  { question: "___ is my pencil?", chinese: "我的铅笔在哪里？", options: ["Where", "What", "Who", "How"], correct: 0, explanation: "询问地点用 Where。", tag: "疑问词" },
  { question: "It's ___ the desk.", chinese: "它在书桌上。", options: ["on", "in", "under", "to"], correct: 0, explanation: "on 表示在表面上。", tag: "介词" },
  { question: "My book is ___ the bag.", chinese: "我的书在书包里。", options: ["in", "on", "under", "of"], correct: 0, explanation: "in 表示在里面。", tag: "介词" },
  { question: "Is it ___ the chair?", chinese: "它在椅子下面吗？", options: ["under", "to", "for", "at"], correct: 0, explanation: "under 表示在下面。", tag: "介词" },
  { question: "Where is the ___?", chinese: "书桌在哪里？", options: ["desk", "under", "on", "in"], correct: 0, explanation: "由于前面有 the，只有 desk 是名词符合语境。", tag: "名词" }
]

export const fillblankBankG3D4a = [
  { sentence: "___ (哪里) is my pencil?", answer: "Where", chinese: "我的铅笔在哪儿？", explanation: "Where 哪里。句首大写。", tag: "疑问句" },
  { sentence: "It's ___ (在...上面) the desk.", answer: "on", chinese: "它在书桌上。", explanation: "on 在...上", tag: "介词" },
  { sentence: "It is ___ (在...里面) the box.", answer: "in", chinese: "它在盒子里。", explanation: "in 在...里", tag: "介词" },
  { sentence: "It's ___ (在...下面) your chair.", answer: "under", chinese: "它在你的椅子下。", explanation: "under 在...下", tag: "介词" },
  { sentence: "Where is my ___ (尺子)?", answer: "ruler", chinese: "我的尺子在哪儿？", explanation: "ruler 尺子", tag: "名词" }
]

export const listenWordBankG3D4a = [
  { word: "on", options: ["in", "on", "no", "of"], correct: 1, zh: "在...上" },
  { word: "in", options: ["on", "it", "in", "is"], correct: 2, zh: "在...里" },
  { word: "under", options: ["uncle", "under", "umbrella", "other"], correct: 1, zh: "在...下" },
  { word: "desk", options: ["duck", "desk", "disk", "dark"], correct: 1, zh: "书桌" },
  { word: "chair", options: ["hair", "chair", "china", "child"], correct: 1, zh: "椅子" }
]

export const listenSentenceBankG3D4a = [
  { sentence: "Where is my pencil?", zh: "我的铅笔在哪里？", options: ["Where is my pen?", "Where is my pencil?", "Where is my book?", "Where is my bag?"], correct: 1 },
  { sentence: "It's on the desk.", zh: "它在书桌上。", options: ["It's on the chair.", "It's under the desk.", "It's on the desk.", "It's in the bag."], correct: 2 },
  { sentence: "It's in the bag.", zh: "它在书包里。", options: ["It's on the bag.", "It's in the desk.", "It's under the bag.", "It's in the bag."], correct: 3 },
  { sentence: "It's under your book.", zh: "它在你的书下面。", options: ["It's on your book.", "It's in your book.", "It's under your desk.", "It's under your book."], correct: 3 },
  { sentence: "Where is my ruler?", zh: "我的尺子在哪儿？", options: ["Where is my ruler?", "Where is my rubber?", "Where is my bag?", "Where is my pen?"], correct: 0 }
]

export const listenOrderBankG3D4a = [
  { sentence: "Where is my pencil?", zh: "我的铅笔在哪里？", words: ["Where", "is", "my", "pencil?"], answer: ["Where", "is", "my", "pencil?"] },
  { sentence: "It is on the desk.", zh: "它在书桌上面。", words: ["It", "is", "on", "the", "desk."], answer: ["It", "is", "on", "the", "desk."] },
  { sentence: "It is under your book.", zh: "它在你的书下面。", words: ["It", "is", "under", "your", "book."], answer: ["It", "is", "under", "your", "book."] },
  { sentence: "Where is the chair?", zh: "椅子在哪里？", words: ["Where", "is", "the", "chair?"], answer: ["Where", "is", "the", "chair?"] },
  { sentence: "It is in the bag.", zh: "它在包里。", words: ["It", "is", "in", "the", "bag."], answer: ["It", "is", "in", "the", "bag."] }
]

export const listenResponseBankG3D4a = [
  { question: "Where is my pencil?", zh: "我的铅笔在哪儿？", options: ["It's on the desk.", "He is my dad.", "I am nine.", "Welcome."], correct: 0 },
  { question: "Where is the book?", zh: "书在哪里？", options: ["It's in the bag.", "Yes, it is.", "No, she isn't.", "Thank you."], correct: 0 },
  { question: "Is it on the chair?", zh: "它在椅子上吗？", options: ["No, it isn't.", "He is a student.", "I see red.", "Me too."], correct: 0 },
  { question: "Where is your ruler?", zh: "你的尺子在哪儿？", options: ["It's under the book.", "Hello.", "It's a big dog.", "Bye."], correct: 0 },
  { question: "Let's go home.", zh: "我们回家吧。", options: ["OK.", "How old are you?", "It's on the desk.", "Welcome."], correct: 0 }
]

export const listenTranslateBankG3D4a = [
  { sentence: "Where is my pencil?", options: ["我的钢笔在哪？", "我的铅笔在哪儿？", "我的书在哪？", "我的书包在哪？"], correct: 1 },
  { sentence: "It's on the desk.", options: ["它在书包里。", "它在椅子下面。", "它在桌子下面。", "它在书桌上。"], correct: 3 },
  { sentence: "It is in the bag.", options: ["它在书下面。", "它在包上面。", "它在书包里面。", "它在桌子上。"], correct: 2 },
  { sentence: "It's under your book.", options: ["它在你的树下面。", "它在你的桌子下。", "它在你的椅子上。", "它在你的书下面。"], correct: 3 },
  { sentence: "Where is the ruler?", options: ["尺子在哪儿？", "铅笔在哪儿？", "橡皮在哪儿？", "桌子在哪儿？"], correct: 0 }
]
