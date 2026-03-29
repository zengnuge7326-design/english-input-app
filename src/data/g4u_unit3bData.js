// PEP四年级上册 Unit 3 Part B《Let's learn / Let's talk》题库
// 主题：询问与介绍朋友 (boy, girl, friend) + What's his/her name? + o-e发音规则
// 7种题型，每种5题，共35题

export const quizBankG4U3b = [
  { question: "What's ___ name? His name is Zhang Peng.", chinese: "他叫什么名字？他叫张鹏。", options: ["his", "her", "your", "my"], correct: 0, explanation: "回答是 His name is，说明问的是男孩的名字，用 What's his name?", tag: "语法" },
  { question: "What's her name? ___ name is Amy.", chinese: "她叫什么名字？她叫Amy。", options: ["His", "She", "Her", "My"], correct: 2, explanation: "女性的'她的'用 Her。", tag: "代词" },
  { question: "He is a ___. She is a girl.", chinese: "他是一个男孩。她是一个女孩。", options: ["girl", "boy", "friend", "teacher"], correct: 1, explanation: "He 是男他，对应的性别身份是男孩 boy。", tag: "词汇" },
  { question: "Which word has the 'o-e' sound like in 'nose'?", chinese: "哪个词里面的 o-e 发音和 nose 里的发音相同？", options: ["dog", "note", "box", "hot"], correct: 1, explanation: "o-e结构中 o 发字母本身的双元音 /əʊ/ (美音 /oʊ/)。note 符合。", tag: "拼读" },
  { question: "I have a good ___. His name is Mike.", chinese: "我有一个好朋友。他的名字叫迈克。", options: ["friend", "friends", "boy", "girl"], correct: 0, explanation: "a 好朋友，单数，所以用 friend。", tag: "单复数" }
]

export const fillblankBankG4U3b = [
  { sentence: "What's ___ (他的) name?", answer: "his", chinese: "他叫什么名字？", explanation: "his 他的。", tag: "代词" },
  { sentence: "___ (她的) name is Sarah.", answer: "Her", chinese: "她的名字叫萨拉。", explanation: "her 她的。注意句首大写。", tag: "代词" },
  { sentence: "Is he a ___ (男孩)?", answer: "boy", chinese: "他是个男孩吗？", explanation: "boy 男孩。", tag: "词汇" },
  { sentence: "She is a good ___ (朋友).", answer: "friend", chinese: "她是个好朋友。", explanation: "friend 朋友。", tag: "词汇" },
  { sentence: "___ (谁) is he?", answer: "Who", chinese: "他是谁？", explanation: "问是谁用 Who。", tag: "疑问词" }
]

export const listenWordBankG4U3b = [
  { word: "his", options: ["he", "him", "her", "his"], correct: 3, zh: "他的" },
  { word: "her", options: ["hair", "her", "his", "she"], correct: 1, zh: "她的" },
  { word: "boy", options: ["boy", "toy", "joy", "box"], correct: 0, zh: "男孩" },
  { word: "girl", options: ["bird", "girl", "curl", "good"], correct: 1, zh: "女孩" },
  { word: "friend", options: ["find", "friend", "friendly", "finish"], correct: 1, zh: "朋友" }
]

export const listenSentenceBankG4U3b = [
  { sentence: "What's his name?", zh: "他叫什么名字？", options: ["What's your name?", "What's her name?", "What's his name?", "Who is his friend?"], correct: 2 },
  { sentence: "Her name is Amy.", zh: "她叫艾米。", options: ["His name is Mike.", "Her name is Amy.", "She is Amy.", "My name is Amy."], correct: 1 },
  { sentence: "He is a tall boy.", zh: "他是一个很高的男孩。", options: ["She is a tall girl.", "He is a strong boy.", "He is a tall boy.", "He is a quiet boy."], correct: 2 },
  { sentence: "I have a good friend.", zh: "我有一个好朋友。", options: ["She is my good friend.", "I have a good friend.", "He has a good friend.", "You are my friend."], correct: 1 },
  { sentence: "Who is she?", zh: "她是谁？", options: ["Who is he?", "Where is she?", "What is she?", "Who is she?"], correct: 3 }
]

export const listenOrderBankG4U3b = [
  { sentence: "What is his name?", zh: "他的名字是什么？", words: ["What", "is", "his", "name?"], answer: ["What", "is", "his", "name?"] },
  { sentence: "Her name is Amy.", zh: "她的名字是艾米。", words: ["Her", "name", "is", "Amy."], answer: ["Her", "name", "is", "Amy."] },
  { sentence: "He is a good boy.", zh: "他是个好男孩。", words: ["He", "is", "a", "good", "boy."], answer: ["He", "is", "a", "good", "boy."] },
  { sentence: "Who is she?", zh: "她是谁？", words: ["Who", "is", "she?"], answer: ["Who", "is", "she?"] },
  { sentence: "I have a new friend.", zh: "我有一个新朋友。", words: ["I", "have", "a", "new", "friend."], answer: ["I", "have", "a", "new", "friend."] }
]

export const listenResponseBankG4U3b = [
  { question: "What's his name?", zh: "他的名字是什么？", options: ["His name is John.", "Her name is Amy.", "He is tall.", "I am John."], correct: 0 },
  { question: "Who is she?", zh: "她是谁？", options: ["He is Mike.", "She is my friend.", "Her name is Sarah.", "She is tall."], correct: 1 },
  { question: "What's her name?", zh: "她叫什么名字？", options: ["She is quiet.", "Her name is Chen Jie.", "His name is Wu Binbin.", "I am Chen Jie."], correct: 1 },
  { question: "Is he a boy?", zh: "他是个男孩吗？", options: ["Yes, he is.", "Yes, she is.", "No, he is my friend.", "It is a boy."], correct: 0 },
  { question: "I have a new friend.", zh: "我有一个新朋友。", options: ["A boy or a girl?", "Thank you.", "He has short hair.", "Yes, I have."], correct: 0 }
]

export const listenTranslateBankG4U3b = [
  { sentence: "What's his name?", options: ["你的名字是什么？", "她的名字是什么？", "他是谁？", "他的名字是什么？"], correct: 3 },
  { sentence: "Her name is Sarah.", options: ["他叫萨拉。", "她叫萨拉。", "萨拉是我的朋友。", "她是个女孩。"], correct: 1 },
  { sentence: "Who is he?", options: ["他是谁？", "她是谁？", "他叫什么名字？", "他在哪里？"], correct: 0 },
  { sentence: "He is a boy.", options: ["他是个朋友。", "他是个男孩。", "她是个女孩。", "他很高。"], correct: 1 },
  { sentence: "I have a good friend.", options: ["她是一个好朋友。", "他有许多好朋友。", "我有一个好朋友。", "你是一个好朋友。"], correct: 2 }
]
