// PEP三年级下册 Unit 2 Part A《My family》题库
// 主题：家庭成员1 (father, dad, mother, mom, man, woman) + Who's that man/woman?
// 7种题型，每种5题，共35题

export const quizBankG3D2a = [
  { question: "Who's that ___?", chinese: "那个男人是谁？", options: ["man", "woman", "boy", "girl"], correct: 0, explanation: "man 表示成年的男人。", tag: "词汇" },
  { question: "who's that woman? ___ is my mother.", chinese: "那个女人是谁？她是我的妈妈。", options: ["He", "She", "It", "They"], correct: 1, explanation: "woman(女人) 对应的代词是 She。", tag: "代词" },
  { question: "He is ___ father.", chinese: "他是我的爸爸。", options: ["I", "me", "my", "mine"], correct: 2, explanation: "我的爸爸用 my father。", tag: "代词" },
  { question: "___ that man? He's my dad.", chinese: "那个男人是谁？他是我爸爸。", options: ["What's", "Who's", "Where's", "How's"], correct: 1, explanation: "询问身份用 Who's (Who is)。", tag: "疑问词" },
  { question: "My mother is a ___. She is very nice.", chinese: "我妈妈是个女人。她很好。", options: ["man", "woman", "boy", "girl"], correct: 1, explanation: "妈妈是成年女性，即 woman。", tag: "概念" }
]

export const fillblankBankG3D2a = [
  { sentence: "___ (谁是) that man?", answer: "Who's", chinese: "那个男人是谁？", explanation: "Who's 是谁。句首首字母大写。", tag: "疑问词" },
  { sentence: "He is my ___ (父亲).", answer: "father", chinese: "他是我的爸爸。", explanation: "father 父亲/爸爸", tag: "词汇" },
  { sentence: "She is my ___ (母亲).", answer: "mother", chinese: "她是我的妈妈。", explanation: "mother 母亲/妈妈", tag: "词汇" },
  { sentence: "Who is that ___ (女人)?", answer: "woman", chinese: "那个女人是谁？", explanation: "woman 女人", tag: "词汇" },
  { sentence: "___ (她) is my mom.", answer: "She", chinese: "她是我的妈妈 (口语)。", explanation: "She 她。", tag: "代词" }
]

export const listenWordBankG3D2a = [
  { word: "man", options: ["map", "mat", "man", "make"], correct: 2, zh: "男人" },
  { word: "woman", options: ["welcome", "woman", "window", "watermelon"], correct: 1, zh: "女人" },
  { word: "father", options: ["farmer", "father", "feather", "far"], correct: 1, zh: "父亲/爸爸" },
  { word: "mother", options: ["brother", "monster", "mother", "mouth"], correct: 2, zh: "母亲/妈妈" },
  { word: "who", options: ["what", "how", "where", "who"], correct: 3, zh: "谁" }
]

export const listenSentenceBankG3D2a = [
  { sentence: "Who's that man?", zh: "那个男的是谁？", options: ["Who's that woman?", "Who's that boy?", "Who's that man?", "Who's this man?"], correct: 2 },
  { sentence: "He's my father.", zh: "他是我的父亲。", options: ["She's my mother.", "He's my father.", "He's my brother.", "He's my friend."], correct: 1 },
  { sentence: "Who's that woman?", zh: "那个女的是谁？", options: ["Who's that man?", "Who's that girl?", "Who's that woman?", "Who's this woman?"], correct: 2 },
  { sentence: "She's my mother.", zh: "她是我的妈妈。", options: ["She's my mother.", "He's my father.", "She's my sister.", "She's my teacher."], correct: 0 },
  { sentence: "He's my dad.", zh: "他是我老爸。", options: ["She's my mom.", "He's my dad.", "He's my grandpa.", "It's my dog."], correct: 1 }
]

export const listenOrderBankG3D2a = [
  { sentence: "Who's that man?", zh: "那个男人是谁？", words: ["Who's", "that", "man?"], answer: ["Who's", "that", "man?"] },
  { sentence: "He is my father.", zh: "他是我的父亲。", words: ["He", "is", "my", "father."], answer: ["He", "is", "my", "father."] },
  { sentence: "Who's that woman?", zh: "那个女人是谁？", words: ["Who's", "that", "woman?"], answer: ["Who's", "that", "woman?"] },
  { sentence: "She is my mother.", zh: "她是我的母亲。", words: ["She", "is", "my", "mother."], answer: ["She", "is", "my", "mother."] },
  { sentence: "He is my dad.", zh: "他是我老爸。", words: ["He", "is", "my", "dad."], answer: ["He", "is", "my", "dad."] }
]

export const listenResponseBankG3D2a = [
  { question: "Who's that man?", zh: "那个男的是谁？", options: ["He's my father.", "She's my mother.", "Yes, he is.", "I am ten."], correct: 0 },
  { question: "Who's that woman?", zh: "那个女的是谁？", options: ["She's my mother.", "He's a teacher.", "She is tall.", "Yes, she is."], correct: 0 },
  { question: "Is he your father?", zh: "他是你爸爸吗？", options: ["Yes, he is.", "No, she isn't.", "He is big.", "Thank you."], correct: 0 },
  { question: "Look at the man.", zh: "看那个男人。", options: ["He's my dad.", "It's a cat.", "Goodbye.", "She is a student."], correct: 0 },
  { question: "Nice to meet you.", zh: "见到你很高兴。", options: ["Good afternoon.", "Nice to meet you, too.", "Thank you.", "I see green."], correct: 1 }
]

export const listenTranslateBankG3D2a = [
  { sentence: "Who's that man?", options: ["这男孩是谁？", "那男人是谁？", "他叫什么名字？", "你爸爸在哪？"], correct: 1 },
  { sentence: "He's my father.", options: ["他是我的兄弟。", "她是我的母亲。", "她是我的老师。", "他是我的父亲。"], correct: 3 },
  { sentence: "Who's that woman?", options: ["那女孩是谁？", "那女人是谁？", "这老师是谁？", "她去哪里了？"], correct: 1 },
  { sentence: "She's my mom.", options: ["他是我爸爸。", "她是我的奶奶。", "她是我的妈妈（口语）。", "她是我妹妹。"], correct: 2 },
  { sentence: "Is he your dad?", options: ["她是你妈妈吗？", "他去哪了？", "他是你爸爸吗？", "那人是谁？"], correct: 2 }
]
