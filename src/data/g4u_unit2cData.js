// PEP四年级上册 Unit 2 Part C《Story time / Let's check》题库
// 主题：Unit 2 综合复习 (书包、文具、颜色、物品数量)
// 7种题型，每种5题，共35题

export const quizBankG4U2c = [
  { question: "What's in ___ schoolbag?", chinese: "你的书包里有什么？", options: ["you", "your", "yours", "I"], correct: 1, explanation: "前面需要形容词性物主代词 your (你的)。", tag: "语法" },
  { question: "Excuse me. I ___ my schoolbag.", chinese: "打扰了。我弄丢了我的书包。", options: ["lost", "lose", "loses", "losing"], correct: 0, explanation: "弄丢了是发生过的事情，用过去式 lost。", tag: "语法" },
  { question: "___ are your notebooks?", chinese: "你的笔记本在哪里？", options: ["What", "Who", "Where", "How"], correct: 2, explanation: "询问在哪里用 Where。", tag: "疑问词" },
  { question: "My schoolbag is heavy. What's in ___?", chinese: "我的书包很重。里面有什么？", options: ["it", "they", "them", "its"], correct: 0, explanation: "指代单数的 schoolbag 用 it。在...里面用 in it。", tag: "代词" },
  { question: "Put ___ your books.", chinese: "把你的书收起来。", options: ["away", "on", "in", "at"], correct: 0, explanation: "put away 收起来。", tag: "短语" }
]

export const fillblankBankG4U2c = [
  { sentence: "What's in your ___ (书包)?", answer: "schoolbag", chinese: "你书包里有什么？", explanation: "schoolbag书包", tag: "词汇" },
  { sentence: "I have an ___ (英语) book.", answer: "English", chinese: "我有一本英语书。", explanation: "English 英语", tag: "词汇" },
  { sentence: "It is black and ___ (白色的).", answer: "white", chinese: "它黑白相间。", explanation: "white 白色的", tag: "词汇" },
  { sentence: "Here it ___ (是).", answer: "is", chinese: "它在这儿。", explanation: "Here it is 固定搭配。", tag: "句型" },
  { sentence: "I have three ___ (玩具).", answer: "toys", chinese: "我有三个玩具。", explanation: "toy的复数 toys", tag: "拼写" }
]

export const listenWordBankG4U2c = [
  { word: "heavy", options: ["heavy", "have", "happy", "head"], correct: 0, zh: "重的" },
  { word: "lost", options: ["last", "lost", "lot", "let"], correct: 1, zh: "丢失" },
  { word: "math", options: ["mask", "map", "math", "mass"], correct: 2, zh: "数学" },
  { word: "candy", options: ["candy", "can", "car", "cat"], correct: 0, zh: "糖果" },
  { word: "storybook", options: ["notebook", "storybook", "book", "storybook"], correct: 1, zh: "故事书" }
]

export const listenSentenceBankG4U2c = [
  { sentence: "What is in your schoolbag?", zh: "你的书包里有什么？", options: ["What is in your schoolbag?", "Where is your schoolbag?", "What colour is your schoolbag?", "This is your schoolbag."], correct: 0 },
  { sentence: "I lost my English book.", zh: "我丢了我的英语书。", options: ["I lost my math book.", "I lost my Chinese book.", "I lost my English book.", "I lost my notebook."], correct: 2 },
  { sentence: "What colour is it?", zh: "它是什么颜色的？", options: ["What colour is it?", "What is it?", "Where is it?", "How is it?"], correct: 0 },
  { sentence: "It is black and white.", zh: "它黑白相间。", options: ["It is blue and white.", "It is red and white.", "It is black and white.", "It is green and white."], correct: 2 },
  { sentence: "Here you are.", zh: "给你。", options: ["Here it is.", "Here you are.", "Thank you.", "Excuse me."], correct: 1 }
]

export const listenOrderBankG4U2c = [
  { sentence: "What is in your schoolbag?", zh: "你的书包里有什么？", words: ["What", "is", "in", "your", "schoolbag?"], answer: ["What", "is", "in", "your", "schoolbag?"] },
  { sentence: "It is black and white.", zh: "它是黑白相间的。", words: ["It", "is", "black", "and", "white."], answer: ["It", "is", "black", "and", "white."] },
  { sentence: "I lost my English book.", zh: "我把英语书弄丢了。", words: ["I", "lost", "my", "English", "book."], answer: ["I", "lost", "my", "English", "book."] },
  { sentence: "My schoolbag is very heavy.", zh: "我的书包很重。", words: ["My", "schoolbag", "is", "very", "heavy."], answer: ["My", "schoolbag", "is", "very", "heavy."] },
  { sentence: "Here it is.", zh: "它在这里。", words: ["Here", "it", "is."], answer: ["Here", "it", "is."] }
]

export const listenResponseBankG4U2c = [
  { question: "What colour is your schoolbag?", zh: "你的书包是什么颜色的？", options: ["It's heavy.", "It's black and white.", "An English book.", "Yes, it is."], correct: 1 },
  { question: "What's in it?", zh: "里面有什么？", options: ["Fifty storybooks.", "It's a desk.", "It's black.", "I lost it."], correct: 0 },
  { question: "I lost my schoolbag.", zh: "我弄丢了书包。", options: ["What colour is it?", "Thank you.", "It's heavy.", "OK."], correct: 0 },
  { question: "Here it is.", zh: "它在这里。", options: ["Yes, it is.", "Thank you so much.", "What colour is it?", "It's a book."], correct: 1 },
  { question: "Is it heavy?", zh: "它重吗？", options: ["Yes, it's very heavy.", "It's blue.", "A math book.", "I lost it."], correct: 0 }
]

export const listenTranslateBankG4U2c = [
  { sentence: "What's in your schoolbag?", options: ["书包是什么颜色的？", "书桌里有什么？", "你书包里有什么？", "那是谁的书包？"], correct: 2 },
  { sentence: "I have a math book and a toy.", options: ["我有一本英语书和一个玩具。", "我有一本数学书和一个玩具。", "我有一本数学书和一颗糖。", "我有一本语文书和一个玩具。"], correct: 1 },
  { sentence: "What colour is it?", options: ["它在哪里？", "它有多重？", "它是什么颜色的？", "它是什么？"], correct: 2 },
  { sentence: "My schoolbag is heavy.", options: ["我的书包很漂亮。", "我的书包很大。", "我的书包很新。", "我的书包很重。"], correct: 3 },
  { sentence: "Here you are.", options: ["给你。", "它在这儿。", "你在哪里？", "谢谢你。"], correct: 0 }
]
