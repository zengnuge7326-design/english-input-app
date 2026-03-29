// PEP四年级上册 Unit 4 Part C《Story time / Let's check》题库
// 主题：Unit 4 综合复习 (居室 + 家具 + 地点介词短语)
// 7种题型，每种5题，共35题

export const quizBankG4U4c = [
  { question: "Where ___ the cat?", chinese: "猫在哪里？", options: ["is", "are", "am", "do"], correct: 0, explanation: "单数事物做主语，用 is。", tag: "语法" },
  { question: "Where ___ the glasses?", chinese: "眼镜在哪里？", options: ["is", "are", "do", "has"], correct: 1, explanation: "眼镜(glasses)作主语，是复数概念，用 are。", tag: "语法" },
  { question: "Look! It's ___ the bed.", chinese: "看！它在床下面。", options: ["under", "in", "to", "at"], correct: 0, explanation: "在床下面用 under the bed。", tag: "介词" },
  { question: "Are they in the study? Yes, they ___.", chinese: "它们在书房里吗？是的，它们在。", options: ["are", "aren't", "is", "isn't"], correct: 0, explanation: "Are they 问，用 they are 回答。", tag: "语法" },
  { question: "Is she in the bedroom? No, she ___.", chinese: "她在卧室里吗？不，她不在。", options: ["isn't", "is", "aren't", "are"], correct: 0, explanation: "Is she...?的否定回答：No, she isn't.", tag: "语法" }
]

export const fillblankBankG4U4c = [
  { sentence: "Where ___ (是) the keys?", answer: "are", chinese: "钥匙在哪里？", explanation: "复数主语用 are。", tag: "语法" },
  { sentence: "Is she in the ___ (书房)?", answer: "study", chinese: "她在书房里吗？", explanation: "study 书房", tag: "词汇" },
  { sentence: "Yes, she ___.", answer: "is", chinese: "是的。", explanation: "简略肯定回答。", tag: "语法" },
  { sentence: "It's near the ___ (床).", answer: "bed", chinese: "它在床附近。", explanation: "bed 床", tag: "词汇" },
  { sentence: "Welcome to my ___ (家).", answer: "home", chinese: "欢迎来到我的家。", explanation: "home 家", tag: "词汇" }
]

export const listenWordBankG4U4c = [
  { word: "living room", options: ["bedroom", "living room", "bathroom", "kitchen"], correct: 1, zh: "客厅" },
  { word: "phone", options: ["phone", "home", "bone", "sofa"], correct: 0, zh: "电话" },
  { word: "fridge", options: ["bridge", "fridge", "free", "friend"], correct: 1, zh: "冰箱" },
  { word: "table", options: ["table", "cable", "desk", "apple"], correct: 0, zh: "桌子" },
  { word: "keys", options: ["kites", "kids", "keys", "keeps"], correct: 2, zh: "钥匙 (复数)" }
]

export const listenSentenceBankG4U4c = [
  { sentence: "Is he in the study?", zh: "他在书房里吗？", options: ["Is he in the study?", "Is she in the study?", "Is it in the study?", "Is he in the bedroom?"], correct: 0 },
  { sentence: "Where are my glasses?", zh: "我的眼镜在哪里？", options: ["Where are my keys?", "Where are my glasses?", "Where is my book?", "Where is my bag?"], correct: 1 },
  { sentence: "They are on the fridge.", zh: "它们在冰箱上。", options: ["They are in the fridge.", "They are on the fridge.", "It is on the fridge.", "They are on the table."], correct: 1 },
  { sentence: "Welcome to my home.", zh: "欢迎来到我的家。", options: ["Welcome to our school.", "Welcome to my farm.", "Welcome to my home.", "Welcome to the classroom."], correct: 2 },
  { sentence: "She is in the bathroom.", zh: "她在浴室里。", options: ["She is in the bedroom.", "She is in the living room.", "She is in the kitchen.", "She is in the bathroom."], correct: 3 }
]

export const listenOrderBankG4U4c = [
  { sentence: "Where are the keys?", zh: "钥匙在哪里？", words: ["Where", "are", "the", "keys?"], answer: ["Where", "are", "the", "keys?"] },
  { sentence: "Are they on the table?", zh: "它们在桌子上吗？", words: ["Are", "they", "on", "the", "table?"], answer: ["Are", "they", "on", "the", "table?"] },
  { sentence: "Is she in the bedroom?", zh: "她在卧室里吗？", words: ["Is", "she", "in", "the", "bedroom?"], answer: ["Is", "she", "in", "the", "bedroom?"] },
  { sentence: "No, she isn't.", zh: "不，她不在。", words: ["No,", "she", "isn't."], answer: ["No,", "she", "isn't."] },
  { sentence: "It's near the phone.", zh: "它在电话附近。", words: ["It's", "near", "the", "phone."], answer: ["It's", "near", "the", "phone."] }
]

export const listenResponseBankG4U4c = [
  { question: "Are they under the sofa?", zh: "它们在沙发底下吗？", options: ["No, they aren't.", "Yes, it is.", "No, it isn't.", "They are on the sofa."], correct: 0 },
  { question: "Where is my book?", zh: "我的书在哪里？", options: ["It's on the bed.", "They are on the bed.", "Yes, it is.", "I like books."], correct: 0 },
  { question: "Is he in the study?", zh: "他在书房吗？", options: ["Yes, she is.", "Yes, he is.", "He has short hair.", "I am in the study."], correct: 1 },
  { question: "Where are the toys?", zh: "玩具们在哪里？", options: ["It's in the box.", "They're in the living room.", "I have three toys.", "Yes, they are."], correct: 1 },
  { question: "Welcome to my home.", zh: "欢迎来到我家。", options: ["Where is the home?", "Thank you.", "Yes, I am.", "It's near the window."], correct: 1 }
]

export const listenTranslateBankG4U4c = [
  { sentence: "Where are the keys?", options: ["风筝在哪里？", "书包在哪里？", "钥匙在哪里？", "你的猫在哪里？"], correct: 2 },
  { sentence: "Are they on the table?", options: ["它们在桌子上吗？", "它们在椅子上吗？", "它们在沙发上吗？", "它们在冰箱里吗？"], correct: 0 },
  { sentence: "Is she in the living room?", options: ["他在客厅吗？", "她在卧室吗？", "她在书房吗？", "她在客厅吗？"], correct: 3 },
  { sentence: "She is in the bathroom.", options: ["她在客厅里。", "她在厨房里。", "她在浴室里。", "她在卧室里。"], correct: 2 },
  { sentence: "Where is the cat?", options: ["书包在哪里？", "猫在哪里？", "帽子在哪里？", "桌子在哪里？"], correct: 1 }
]
