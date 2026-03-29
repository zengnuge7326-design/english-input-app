// PEP三年级下册 Unit 2 Part B《Let's learn / Let's talk》题库
// 主题：家庭成员2 (brother, sister, grandfather, grandmother) + Is she your mother? Yes, she is.
// 7种题型，每种5题，共35题

export const quizBankG3D2b = [
  { question: "Is ___ your mother?", chinese: "她是你妈妈吗？", options: ["he", "she", "it", "they"], correct: 1, explanation: "mother(母亲)对应女性代词 she。", tag: "代词" },
  { question: "Is he your brother? Yes, he ___.", chinese: "他是你哥哥吗？是的，他是。", options: ["is", "isn't", "are", "do"], correct: 0, explanation: "Is he...? 的肯定回答是 Yes, he is.", tag: "语法" },
  { question: "___ that boy? He's my brother.", chinese: "那个男孩是谁？他是我弟弟。", options: ["What's", "Where's", "Who's", "How's"], correct: 2, explanation: "询问身份用 Who's。", tag: "疑问词" },
  { question: "Is she your sister? No, she ___.", chinese: "她是你妹妹吗？不，她不是。", options: ["is", "isn't", "aren't", "doesn't"], correct: 1, explanation: "Is she...? 的否定回答是 No, she isn't.", tag: "语法" },
  { question: "This is my ___. She is my mother's mother.", chinese: "这是我的外祖母。她是我妈妈的妈妈。", options: ["grandmother", "grandfather", "sister", "brother"], correct: 0, explanation: "grandma/grandmother 外祖母、奶奶。", tag: "词汇" }
]

export const fillblankBankG3D2b = [
  { sentence: "Is ___ (她) your mother?", answer: "she", chinese: "她是你妈妈吗？", explanation: "she 她", tag: "代词" },
  { sentence: "Yes, she ___ (是).", answer: "is", chinese: "是的，她是的。", explanation: "Yes, she is.", tag: "动词" },
  { sentence: "Is he your ___ (兄弟)?", answer: "brother", chinese: "他是你兄弟吗？", explanation: "brother 兄弟", tag: "词汇" },
  { sentence: "Is she your ___ (姐妹)?", answer: "sister", chinese: "她是你姐妹吗？", explanation: "sister 姐妹", tag: "词汇" },
  { sentence: "This is my ___ (祖母/奶奶).", answer: "grandmother", chinese: "这是我奶奶。", explanation: "grandmother 祖母/外祖母。", tag: "词汇" }
]

export const listenWordBankG3D2b = [
  { word: "brother", options: ["bother", "brother", "mother", "brave"], correct: 1, zh: "兄弟" },
  { word: "sister", options: ["sit", "star", "sister", "six"], correct: 2, zh: "姐妹" },
  { word: "grandfather", options: ["father", "grandfather", "grandmother", "grab"], correct: 1, zh: "祖父/外祖父" },
  { word: "grandmother", options: ["mother", "grandmother", "grandfather", "grass"], correct: 1, zh: "祖母/外祖母" },
  { word: "family", options: ["farmer", "family", "factory", "father"], correct: 1, zh: "家庭" }
]

export const listenSentenceBankG3D2b = [
  { sentence: "Is she your mother?", zh: "她是你妈妈吗？", options: ["Is she your sister?", "Is he your father?", "Is she your mother?", "Who's your mother?"], correct: 2 },
  { sentence: "Yes, she is.", zh: "是的，她是的。", options: ["Yes, he is.", "No, she isn't.", "Yes, she is.", "No, he isn't."], correct: 2 },
  { sentence: "Is he your brother?", zh: "他是你兄弟吗？", options: ["Is she your sister?", "Is he your brother?", "Is he your father?", "Who's that boy?"], correct: 1 },
  { sentence: "No, he isn't.", zh: "不，他不是。", options: ["Yes, he is.", "No, she isn't.", "No, he isn't.", "No, it isn't."], correct: 2 },
  { sentence: "This is my grandfather.", zh: "这是我爷爷。", options: ["This is my father.", "This is my grandfather.", "This is my grandmother.", "He is my grandpa."], correct: 1 }
]

export const listenOrderBankG3D2b = [
  { sentence: "Is she your mother?", zh: "她是你的妈妈吗？", words: ["Is", "she", "your", "mother?"], answer: ["Is", "she", "your", "mother?"] },
  { sentence: "Yes, she is.", zh: "是的，她是的。", words: ["Yes,", "she", "is."], answer: ["Yes,", "she", "is."] },
  { sentence: "Is he your brother?", zh: "他是你的兄弟吗？", words: ["Is", "he", "your", "brother?"], answer: ["Is", "he", "your", "brother?"] },
  { sentence: "No, he isn't.", zh: "不，他不是。", words: ["No,", "he", "isn't."], answer: ["No,", "he", "isn't."] },
  { sentence: "He's my grandfather.", zh: "他是我爷爷。", words: ["He's", "my", "grandfather."], answer: ["He's", "my", "grandfather."] }
]

export const listenResponseBankG3D2b = [
  { question: "Is she your mother?", zh: "她是你妈妈吗？", options: ["Yes, she is.", "Yes, he is.", "She is tall.", "No, he isn't."], correct: 0 },
  { question: "Is he your brother?", zh: "他是你兄弟吗？", options: ["Yes, I am.", "No, he isn't.", "She is my sister.", "He is ten."], correct: 1 },
  { question: "Who's that boy?", zh: "那个男孩是谁？", options: ["He's my brother.", "She is my sister.", "It's a dog.", "He is tall."], correct: 0 },
  { question: "Who's that girl?", zh: "那个女孩是谁？", options: ["He is my brother.", "She is my sister.", "She is nine.", "Yes, she is."], correct: 1 },
  { question: "Is this your grandfather?", zh: "这是你爷爷吗？", options: ["Yes, he is.", "She's my grandmother.", "He is old.", "Thank you."], correct: 0 }
]

export const listenTranslateBankG3D2b = [
  { sentence: "Is she your mother?", options: ["她是你姐姐吗？", "他叫什么名字？", "你妈妈在哪？", "她是你妈妈吗？"], correct: 3 },
  { sentence: "Yes, she is.", options: ["不，她不是。", "是的，她是的。", "他是的。", "我不知道。"], correct: 1 },
  { sentence: "Is he your brother?", options: ["他是你爸爸吗？", "他是你男朋友吗？", "他是你兄弟吗？", "这是你的狗吗？"], correct: 2 },
  { sentence: "No, he isn't.", options: ["是的，他是。", "是的，她是的。", "不，他不是。", "不，她不是。"], correct: 2 },
  { sentence: "This is my grandmother.", options: ["这是我的爷爷。", "这是我的外祖母/奶奶。", "这是我的兄弟。", "那是我的阿姨。"], correct: 1 }
]
