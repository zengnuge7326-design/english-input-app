// PEP四年级上册 Unit 6 Part B《Let's learn / Let's talk》题库
// 主题：职业 (doctor, cook, driver, farmer, nurse) + What's your father's job? He is a doctor.
// 7种题型，每种5题，共35题

export const quizBankG4U6b = [
  { question: "What's your father's ___?", chinese: "你爸爸是做什么工作的？", options: ["name", "job", "colour", "family"], correct: 1, explanation: "询问职业用 What's someone's job?", tag: "词汇" },
  { question: "He ___ a doctor.", chinese: "他是一名医生。", options: ["am", "is", "are", "be"], correct: 1, explanation: "He 是单数第三人称，用 is。", tag: "语法" },
  { question: "My mother is a ___. She works in a hospital.", chinese: "我妈妈是个护士。她在医院工作。", options: ["nurse", "farmer", "driver", "cook"], correct: 0, explanation: "在医院工作的有医生和护士(nurse)。", tag: "词汇" },
  { question: "Is your uncle a driver? Yes, he ___.", chinese: "你叔叔是一名司机吗？是的，他是。", options: ["is", "isn't", "does", "do"], correct: 0, explanation: "用 Is 提问，用 is 回答。", tag: "语法" },
  { question: "They are ___. They like their jobs.", chinese: "他们是厨师。他们喜欢这份工作。", options: ["cook", "cooker", "cooks", "cooking"], correct: 2, explanation: "厨师是 cook，主语 They 是复数，因此填 cooks。", tag: "单复数" }
]

export const fillblankBankG4U6b = [
  { sentence: "What's your father's ___ (工作)?", answer: "job", chinese: "你爸爸的工作是什么？", explanation: "job 职业、工作。", tag: "词汇" },
  { sentence: "He is a ___ (医生).", answer: "doctor", chinese: "他是一名医生。", explanation: "doctor 医生。", tag: "词汇" },
  { sentence: "She is a ___ (护士).", answer: "nurse", chinese: "她是一名护士。", explanation: "nurse 护士。", tag: "词汇" },
  { sentence: "My uncle is a ___ (司机).", answer: "driver", chinese: "我的叔叔是一名司机。", explanation: "driver 司机。", tag: "词汇" },
  { sentence: "He is a ___ (农民).", answer: "farmer", chinese: "他是一个农民。", explanation: "farmer 农民。", tag: "词汇" }
]

export const listenWordBankG4U6b = [
  { word: "doctor", options: ["daughter", "doctor", "door", "dog"], correct: 1, zh: "医生" },
  { word: "cook", options: ["book", "look", "cook", "good"], correct: 2, zh: "厨师" },
  { word: "driver", options: ["diver", "drink", "driver", "drive"], correct: 2, zh: "司机" },
  { word: "farmer", options: ["father", "farm", "farmer", "far"], correct: 2, zh: "农民" },
  { word: "nurse", options: ["purse", "nose", "nurse", "none"], correct: 2, zh: "护士" }
]

export const listenSentenceBankG4U6b = [
  { sentence: "What's your father's job?", zh: "你爸爸是做什么工作的？", options: ["What's your mother's job?", "What's your father's name?", "What's your father's job?", "Where is your father?"], correct: 2 },
  { sentence: "He is a doctor.", zh: "他是一名医生。", options: ["He is a driver.", "She is a doctor.", "He is a farmer.", "He is a doctor."], correct: 3 },
  { sentence: "Is she a nurse?", zh: "她是一名护士吗？", options: ["Is he a nurse?", "Is she a cook?", "Is she a nurse?", "Are they nurses?"], correct: 2 },
  { sentence: "My mother is a cook.", zh: "我妈妈是一名厨师。", options: ["My father is a cook.", "My mother is a cook.", "My mother is a teacher.", "She is a cook."], correct: 1 },
  { sentence: "They are farmers.", zh: "他们是农民。", options: ["We are farmers.", "They are farmers.", "They are drivers.", "They are doctors."], correct: 1 }
]

export const listenOrderBankG4U6b = [
  { sentence: "What is your father's job?", zh: "你爸爸的工作是什么？", words: ["What", "is", "your", "father's", "job?"], answer: ["What", "is", "your", "father's", "job?"] },
  { sentence: "He is a great doctor.", zh: "他是个好医生。", words: ["He", "is", "a", "great", "doctor."], answer: ["He", "is", "a", "great", "doctor."] },
  { sentence: "Is she a nurse?", zh: "她是一名护士吗？", words: ["Is", "she", "a", "nurse?"], answer: ["Is", "she", "a", "nurse?"] },
  { sentence: "My uncle is a driver.", zh: "我的叔叔是名司机。", words: ["My", "uncle", "is", "a", "driver."], answer: ["My", "uncle", "is", "a", "driver."] },
  { sentence: "They are farmers.", zh: "他们是农民。", words: ["They", "are", "farmers."], answer: ["They", "are", "farmers."] }
]

export const listenResponseBankG4U6b = [
  { question: "What's your mother's job?", zh: "你妈妈是做什么的？", options: ["She is tall.", "She is a nurse.", "His name is John.", "Yes, she is."], correct: 1 },
  { question: "Is your uncle a driver?", zh: "你叔叔是司机吗？", options: ["Yes, he is.", "No, it isn't.", "He is tall.", "Yes, she is."], correct: 0 },
  { question: "Are they farmers?", zh: "他们是农民吗？", options: ["Yes, they are.", "It is a farm.", "He is a doctor.", "We are farmers."], correct: 0 },
  { question: "Is he a doctor?", zh: "他是个医生吗？", options: ["She is a nurse.", "No, he is a cook.", "Yes, it is.", "He is strong."], correct: 1 },
  { question: "What's his job?", zh: "他的工作是什么？", options: ["He is my uncle.", "He's a cook.", "His name is Mike.", "They are farmers."], correct: 1 }
]

export const listenTranslateBankG4U6b = [
  { sentence: "What's your father's job?", options: ["你爸爸的名字叫什么？", "你爸爸是做什么工作的？", "你叔叔是做什么的？", "谁是你爸爸？"], correct: 1 },
  { sentence: "He is a doctor.", options: ["他是个司机。", "他是个农民。", "他是个医生。", "她是个护士。"], correct: 2 },
  { sentence: "Is your mother a nurse?", options: ["你妈妈是厨师吗？", "你阿姨是护士吗？", "你妈妈是医生吗？", "你妈妈是护士吗？"], correct: 3 },
  { sentence: "My uncle is a driver.", options: ["我叔叔是个农民。", "我叔叔是个司机。", "我父亲是个司机。", "那是我的医生。"], correct: 1 },
  { sentence: "They are farmers.", options: ["他们是工人。", "他们是农民。", "我们是农民。", "他们是厨师。"], correct: 1 }
]
