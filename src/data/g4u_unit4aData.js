// PEP四年级上册 Unit 4 Part A《My home》题库
// 主题：房间名称 (bedroom, living room, study, kitchen, bathroom) + Is she in the living room?
// 7种题型，每种5题，共35题

export const quizBankG4U4a = [
  { question: "Is she in the ___?", chinese: "她在客厅里吗？", options: ["living room", "bedroom", "study", "kitchen"], correct: 0, explanation: "living room 是客厅。", tag: "词汇" },
  { question: "Yes, she ___.", chinese: "是的，她在。", options: ["do", "does", "is", "are"], correct: 2, explanation: "Is she...? 的肯定回答是 Yes, she is.", tag: "语法" },
  { question: "Welcome ___ my home.", chinese: "欢迎来到我的家。", options: ["to", "in", "on", "at"], correct: 0, explanation: "welcome to + 地点，表示欢迎来到某地。", tag: "介词" },
  { question: "Is it in the ___?", chinese: "它在厨房里吗？", options: ["kitchen", "bathroom", "bedroom", "study"], correct: 0, explanation: "kitchen 是厨房。", tag: "词汇" },
  { question: "Where is my cat? ___ in the study.", chinese: "我的猫在哪里？它在书房里。", options: ["He", "She", "It", "It's"], correct: 3, explanation: "指代猫用 It，完整的句子需要 is，缩写为 It's。", tag: "代词" }
]

export const fillblankBankG4U4a = [
  { sentence: "Is she in the ___ (客厅)?", answer: "living room", chinese: "她在客厅里吗？", explanation: "客厅 living room", tag: "词汇" },
  { sentence: "Go to the ___ (卧室).", answer: "bedroom", chinese: "去卧室。", explanation: "bedroom 卧室", tag: "词汇" },
  { sentence: "Read a book in the ___ (书房).", answer: "study", chinese: "在书房看书。", explanation: "study 书房", tag: "词汇" },
  { sentence: "Have a snack in the ___ (厨房).", answer: "kitchen", chinese: "在厨房吃点零食。", explanation: "kitchen 厨房", tag: "词汇" },
  { sentence: "Take a shower in the ___ (浴室).", answer: "bathroom", chinese: "在浴室里洗澡。", explanation: "bathroom 浴室", tag: "词汇" }
]

export const listenWordBankG4U4a = [
  { word: "bedroom", options: ["bathroom", "bedroom", "living room", "classroom"], correct: 1, zh: "卧室" },
  { word: "living room", options: ["living room", "dining room", "reading room", "study"], correct: 0, zh: "客厅" },
  { word: "study", options: ["student", "study", "stand", "star"], correct: 1, zh: "书房" },
  { word: "kitchen", options: ["chicken", "kitchen", "child", "catch"], correct: 1, zh: "厨房" },
  { word: "bathroom", options: ["bedroom", "bathroom", "broom", "ballroom"], correct: 1, zh: "浴室/洗手间" }
]

export const listenSentenceBankG4U4a = [
  { sentence: "Is she in the living room?", zh: "她在客厅里吗？", options: ["Is she in the living room?", "Is he in the living room?", "Is she in the bedroom?", "Is it in the living room?"], correct: 0 },
  { sentence: "Where is my cat?", zh: "我的猫在哪里？", options: ["Where is my car?", "Where is my cat?", "Where is my cap?", "Where is the cat?"], correct: 1 },
  { sentence: "It's in the kitchen.", zh: "它在厨房里。", options: ["It's in the bedroom.", "It's in the study.", "It's in the kitchen.", "It's in the bathroom."], correct: 2 },
  { sentence: "Welcome to my home.", zh: "欢迎来到我的家。", options: ["Welcome to my school.", "Welcome to my farm.", "Welcome to my home.", "Welcome to my class."], correct: 2 },
  { sentence: "No, she isn't.", zh: "不，她不在。", options: ["Yes, she is.", "No, she isn't.", "No, it isn't.", "No, he isn't."], correct: 1 }
]

export const listenOrderBankG4U4a = [
  { sentence: "Is she in the living room?", zh: "她在客厅吗？", words: ["Is", "she", "in", "the", "living", "room?"], answer: ["Is", "she", "in", "the", "living", "room?"] },
  { sentence: "No, she isn't.", zh: "不，她不在。", words: ["No,", "she", "isn't."], answer: ["No,", "she", "isn't."] },
  { sentence: "Where is my cat?", zh: "我的猫在哪里？", words: ["Where", "is", "my", "cat?"], answer: ["Where", "is", "my", "cat?"] },
  { sentence: "It is in the kitchen.", zh: "它在厨房里。", words: ["It", "is", "in", "the", "kitchen."], answer: ["It", "is", "in", "the", "kitchen."] },
  { sentence: "Welcome to my home.", zh: "欢迎来到我家。", words: ["Welcome", "to", "my", "home."], answer: ["Welcome", "to", "my", "home."] }
]

export const listenResponseBankG4U4a = [
  { question: "Where is Amy?", zh: "艾米在哪里？", options: ["She is in the study.", "He is in the study.", "It's near the window.", "Yes, she is."], correct: 0 },
  { question: "Is she in the living room?", zh: "她在客厅吗？", options: ["Yes, she is.", "Yes, he is.", "She is tall.", "It's a living room."], correct: 0 },
  { question: "Where is the cat?", zh: "猫在哪里？", options: ["No, it isn't.", "It's in the kitchen.", "I have a cat.", "Blue."], correct: 1 },
  { question: "Is it in the bathroom?", zh: "它在浴室里吗？", options: ["It is a bathroom.", "Yes, please.", "No, it isn't.", "She is in the bathroom."], correct: 2 },
  { question: "Welcome to my home.", zh: "欢迎来到我的家。", options: ["Welcome.", "Thank you.", "Go to the study.", "Yes, it is."], correct: 1 }
]

export const listenTranslateBankG4U4a = [
  { sentence: "Is she in the living room?", options: ["他在客厅吗？", "它在客厅吗？", "她在书房吗？", "她在客厅吗？"], correct: 3 },
  { sentence: "It's in the kitchen.", options: ["它在厨房里。", "它在卧室里。", "它在浴室里。", "它在客厅里。"], correct: 0 },
  { sentence: "Where is my bag?", options: ["我的猫在哪里？", "我的书在哪里？", "我的书包在哪里？", "你在哪里？"], correct: 2 },
  { sentence: "No, she isn't.", options: ["是的，她在。", "不，她不在。", "是的，它在。", "不，它不在。"], correct: 1 },
  { sentence: "Welcome to my home.", options: ["欢迎来到我的农场。", "欢迎来到学校。", "我的家很大。", "欢迎来到我的家。"], correct: 3 }
]
