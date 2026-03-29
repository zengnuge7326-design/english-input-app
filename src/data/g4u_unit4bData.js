// PEP四年级上册 Unit 4 Part B《Let's learn / Let's talk》题库
// 主题：房间里的家具 (bed, sofa, fridge, table, phone) + Where are the keys? Are they...? + u-e 发音规则
// 7种题型，每种5题，共35题

export const quizBankG4U4b = [
  { question: "___ are the keys?", chinese: "钥匙在哪里？", options: ["Where", "What", "Who", "How"], correct: 0, explanation: "询问在哪里用 Where。", tag: "疑问词" },
  { question: "Are they on the table? No, they ___.", chinese: "它们在桌子上吗？不，它们不在。", options: ["are", "aren't", "is", "isn't"], correct: 1, explanation: "Are they...? 的否定回答是 No, they aren't.", tag: "语法" },
  { question: "Open the ___. (打开冰箱)", chinese: "打开冰箱。", options: ["fridge", "table", "bed", "sofa"], correct: 0, explanation: "fridge 是冰箱。", tag: "词汇" },
  { question: "Sit on the ___.", chinese: "坐在沙发上。", options: ["sofa", "phone", "fridge", "table"], correct: 0, explanation: "sofa 是沙发。", tag: "短语" },
  { question: "Which word has the 'u-e' sound like in 'use'?", chinese: "哪个词里面的 u-e 发音和 use 里的/juː/相同？", options: ["duck", "cut", "cute", "cup"], correct: 2, explanation: "u-e发双元音/juː/或长音/uː/，cute 符合。", tag: "拼读" }
]

export const fillblankBankG4U4b = [
  { sentence: "Where ___ (是) the keys?", answer: "are", chinese: "钥匙在哪里？", explanation: "keys 是复数，所以用 are。", tag: "语法" },
  { sentence: "Are they ___ (在…上面) the table?", answer: "on", chinese: "它们在桌子上吗？", explanation: "在桌子上用 on。", tag: "介词" },
  { sentence: "Yes, they ___.", answer: "are", chinese: "是的，它们在。", explanation: "肯定回答 Yes, they are.", tag: "语法" },
  { sentence: "Open the ___ (冰箱).", answer: "fridge", chinese: "打开冰箱。", explanation: "fridge 冰箱。", tag: "词汇" },
  { sentence: "Answer the ___ (电话).", answer: "phone", chinese: "接电话。", explanation: "phone 电话。Answer the phone 接电话。", tag: "短语" }
]

export const listenWordBankG4U4b = [
  { word: "sofa", options: ["soft", "sofa", "safe", "soda"], correct: 1, zh: "沙发" },
  { word: "fridge", options: ["bridge", "fridge", "ridge", "friend"], correct: 1, zh: "冰箱" },
  { word: "table", options: ["table", "cable", "label", "tablet"], correct: 0, zh: "桌子" },
  { word: "phone", options: ["photo", "bone", "phone", "post"], correct: 2, zh: "电话" },
  { word: "bed", options: ["bad", "bed", "red", "dad"], correct: 1, zh: "床" }
]

export const listenSentenceBankG4U4b = [
  { sentence: "Where are the keys?", zh: "钥匙在哪里？", options: ["Where is the key?", "Where are the keys?", "What are the keys?", "Are they the keys?"], correct: 1 },
  { sentence: "Are they on the table?", zh: "它们在桌子上吗？", options: ["Are they on the desk?", "Are they under the table?", "Are they on the table?", "Are they on the bed?"], correct: 2 },
  { sentence: "No, they aren't.", zh: "不，它们不是。", options: ["Yes, they are.", "No, they aren't.", "No, it isn't.", "Yes, it is."], correct: 1 },
  { sentence: "They are in the door.", zh: "它们在门上(插着)。", options: ["They are near the door.", "They are on the door.", "They are in the door.", "They are under the door."], correct: 2 },
  { sentence: "Answer the phone.", zh: "接电话。", options: ["Answer the phone.", "Look at the phone.", "Where is the phone?", "This is a phone."], correct: 0 }
]

export const listenOrderBankG4U4b = [
  { sentence: "Where are the keys?", zh: "钥匙在哪里？", words: ["Where", "are", "the", "keys?"], answer: ["Where", "are", "the", "keys?"] },
  { sentence: "Are they on the table?", zh: "它们在桌子上吗？", words: ["Are", "they", "on", "the", "table?"], answer: ["Are", "they", "on", "the", "table?"] },
  { sentence: "Yes, they are.", zh: "是的，它们是。", words: ["Yes,", "they", "are."], answer: ["Yes,", "they", "are."] },
  { sentence: "Open the fridge.", zh: "打开冰箱。", words: ["Open", "the", "fridge."], answer: ["Open", "the", "fridge."] },
  { sentence: "Make the bed.", zh: "整理床铺。", words: ["Make", "the", "bed."], answer: ["Make", "the", "bed."] }
]

export const listenResponseBankG4U4b = [
  { question: "Where are the keys?", zh: "钥匙在哪里？", options: ["They're on the table.", "It's on the table.", "Yes, they are.", "I like keys."], correct: 0 },
  { question: "Are they in the door?", zh: "它们在门上（查着）吗？", options: ["Yes, they are.", "Yes, it is.", "No, it isn't.", "They are small."], correct: 0 },
  { question: "Where is the phone?", zh: "电话在哪里？", options: ["It's heavy.", "I have a phone.", "It's on the sofa.", "Yes, it is."], correct: 2 },
  { question: "Can you make the bed?", zh: "你能整理床铺吗？", options: ["Yes, I can.", "Yes, I am.", "It's a bed.", "I see the bed."], correct: 0 },
  { question: "Are these your storybooks?", zh: "这些是你的故事书吗？", options: ["Yes, they are.", "It's a storybook.", "They are near the phone.", "No, it isn't."], correct: 0 }
]

export const listenTranslateBankG4U4b = [
  { sentence: "Where are the keys?", options: ["钥匙在哪里？", "风筝在哪里？", "书包在哪里？", "我的猫在哪里？"], correct: 0 },
  { sentence: "Are they on the table?", options: ["它们在书桌上吗？", "它们在沙发上吗？", "它们在桌子上吗？", "它们在床下吗？"], correct: 2 },
  { sentence: "No, they aren't.", options: ["是的，它们是。", "不，它们不在。", "是的，它在。", "不，它不在。"], correct: 1 },
  { sentence: "They're near the phone.", options: ["它们在电话旁边。", "它在电话下面。", "它们在冰箱旁边。", "它在桌子旁边。"], correct: 0 },
  { sentence: "Sit on the sofa.", options: ["打开冰箱。", "坐在沙发上。", "整理床铺。", "擦桌子。"], correct: 1 }
]
