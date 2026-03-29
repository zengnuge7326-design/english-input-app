// PEP四年级上册 Unit 6 Part C《Story time / Let's check》题库
// 主题：Unit 6 综合复习 (家庭成员与职业)
// 7种题型，每种5题，共35题

export const quizBankG4U6c = [
  { question: "___ people are there in your family?", chinese: "你家里有几口人？", options: ["How many", "How much", "What", "Who"], correct: 0, explanation: "询问可数名词的数量用 How many。", tag: "疑问词" },
  { question: "This is my aunt. ___ is a nurse.", chinese: "这是我的阿姨。她是一名护士。", options: ["He", "She", "It", "Her"], correct: 1, explanation: "aunt(阿姨)为女性，主语用 She。", tag: "代词" },
  { question: "Are ___ farmers? Yes, they are.", chinese: "他们是农民吗？是的，他们是。", options: ["we", "they", "you", "he"], correct: 1, explanation: "根据答语 they are，问句的主语应该是 they。", tag: "代词" },
  { question: "Look at the man. Is ___ your uncle?", chinese: "看那个男人。他是你的叔叔吗？", options: ["she", "he", "it", "his"], correct: 1, explanation: "the man 男人对应的代词是 he。", tag: "代词" },
  { question: "My parents like ___ jobs.", chinese: "我的父母喜欢他们的工作。", options: ["their", "our", "my", "your"], correct: 0, explanation: "父母(parents)是复数他们，对应的物主代词是 their(他们的)。", tag: "语法" }
]

export const fillblankBankG4U6c = [
  { sentence: "How ___ (多少) people are there?", answer: "many", chinese: "一共有几口人？", explanation: "How many 多少", tag: "词汇" },
  { sentence: "My ___ (家庭) has five people.", answer: "family", chinese: "我的家庭有五口人。", explanation: "family 家庭", tag: "词汇" },
  { sentence: "What's his ___ (工作)?", answer: "job", chinese: "他是做什么工作的？", explanation: "job 工作", tag: "词汇" },
  { sentence: "He is a ___ (医生).", answer: "doctor", chinese: "他是名医生。", explanation: "doctor 医生", tag: "词汇" },
  { sentence: "She is a ___ (护士).", answer: "nurse", chinese: "她是名护士。", explanation: "nurse 护士", tag: "词汇" }
]

export const listenWordBankG4U6c = [
  { word: "doctor", options: ["door", "doctor", "dog", "down"], correct: 1, zh: "医生" },
  { word: "family", options: ["factory", "family", "funny", "farmer"], correct: 1, zh: "家庭" },
  { word: "parents", options: ["presents", "parents", "pants", "party"], correct: 1, zh: "父母" },
  { word: "driver", options: ["diver", "drink", "river", "driver"], correct: 3, zh: "司机" },
  { word: "farmer", options: ["father", "former", "farmer", "farm"], correct: 2, zh: "农民" }
]

export const listenSentenceBankG4U6c = [
  { sentence: "How many people are there in your family?", zh: "你家有几口人？", options: ["How many books are there?", "What's your father's job?", "How many people are there in your family?", "Who is in your family?"], correct: 2 },
  { sentence: "Is this your uncle?", zh: "这是你叔叔吗？", options: ["Is this your father?", "Is this your aunt?", "Is this your uncle?", "This is my uncle."], correct: 2 },
  { sentence: "She is a nurse.", zh: "她是一名护士。", options: ["He is a doctor.", "She is a nurse.", "She is a cook.", "He is a nurse."], correct: 1 },
  { sentence: "My family has four people.", zh: "我家有四口人。", options: ["My family has five people.", "My family has four people.", "There are three people.", "We are four people."], correct: 1 },
  { sentence: "What's his job?", zh: "他的工作是什么？", options: ["What's her job?", "What's his job?", "What's your job?", "Where is his home?"], correct: 1 }
]

export const listenOrderBankG4U6c = [
  { sentence: "My family has five people.", zh: "我家有五个人。", words: ["My", "family", "has", "five", "people."], answer: ["My", "family", "has", "five", "people."] },
  { sentence: "What is his job?", zh: "他的工作是什么？", words: ["What", "is", "his", "job?"], answer: ["What", "is", "his", "job?"] },
  { sentence: "He is a tall doctor.", zh: "他是一名很高的医生。", words: ["He", "is", "a", "tall", "doctor."], answer: ["He", "is", "a", "tall", "doctor."] },
  { sentence: "This is my aunt.", zh: "这是我的阿姨。", words: ["This", "is", "my", "aunt."], answer: ["This", "is", "my", "aunt."] },
  { sentence: "She is a cook.", zh: "她是名厨师。", words: ["She", "is", "a", "cook."], answer: ["She", "is", "a", "cook."] }
]

export const listenResponseBankG4U6c = [
  { question: "How many people are there in your family?", zh: "你家里有几口人？", options: ["My parents and me.", "They are farmers.", "Three.", "I have three books."], correct: 2 },
  { question: "Is he your uncle?", zh: "他是你叔叔吗？", options: ["Yes, he is.", "Yes, she is.", "He is a driver.", "No, it isn't."], correct: 0 },
  { question: "What's her job?", zh: "她是做什么工作的？", options: ["She is a nurse.", "Her name is Amy.", "She is my aunt.", "He is a doctor."], correct: 0 },
  { question: "Are they farmers?", zh: "他们是农民吗？", options: ["Yes, he is.", "They are fast.", "No, they aren't.", "I like farms."], correct: 2 },
  { question: "Meet my family.", zh: "见见我的家人。", options: ["Five people.", "My uncle is a cook.", "Welcome to my home.", "Nice to meet you."], correct: 3 }
]

export const listenTranslateBankG4U6c = [
  { sentence: "How many people are there in your family?", options: ["你家在哪里？", "你父母是做什么工作的？", "你家里有几口人？", "谁在你的家里？"], correct: 2 },
  { sentence: "My family has three people.", options: ["我家有五口人。", "我家有四口人。", "我家有三口人。", "我有一个弟弟。"], correct: 2 },
  { sentence: "What's his job?", options: ["她的工作是什么？", "他的兴趣是什么？", "他的工作是什么？", "他去哪里工作？"], correct: 2 },
  { sentence: "He is a driver.", options: ["他是一名医生。", "他是一名农民。", "她是一名护士。", "他是一名司机。"], correct: 3 },
  { sentence: "This is my aunt.", options: ["这是我的阿姨。", "这是我的表叔。", "这是我的朋友。", "她是我妈妈。"], correct: 0 }
]
