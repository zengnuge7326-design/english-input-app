// PEP三年级下册 Unit 1 Part B《Let's learn / Let's talk》题库
// 主题：身份与性别 (student, pupil, teacher, boy, girl) + Where are you from? I'm from...
// 7种题型，每种5题，共35题

export const quizBankG3D1b = [
  { question: "___ are you from?", chinese: "你来自哪里？", options: ["Where", "What", "Who", "How"], correct: 0, explanation: "询问地点或来自哪里用 Where。", tag: "疑问词" },
  { question: "I am a new ___. I learn in school.", chinese: "我是一名新学生。我在学校学习。", options: ["teacher", "student", "book", "school"], correct: 1, explanation: "在学校学习的是学生 (student)。", tag: "词汇" },
  { question: "She ___ a pupil.", chinese: "她是一名小学生。", options: ["is", "am", "are", "be"], correct: 0, explanation: "She 为单数第三人称，用 is。", tag: "语法" },
  { question: "___ is a teacher.", chinese: "他是一名老师。", options: ["He", "She", "I", "They"], correct: 0, explanation: "选项里面结合句子的单数意义和日常最常用选项（若无指代女性标志，He优先填入。此处测试主格He/She）。", tag: "代词" },
  { question: "He is a ___. She is a girl.", chinese: "他是个男孩。她是个女孩。", options: ["boy", "man", "woman", "teacher"], correct: 0, explanation: "boy 和 girl 对应。", tag: "词汇" }
]

export const fillblankBankG3D1b = [
  { sentence: "___ (哪里) are you from?", answer: "Where", chinese: "你来自哪里？", explanation: "Where 疑问词。注意首字母大写。", tag: "疑问词" },
  { sentence: "I am a ___ (学生).", answer: "student", chinese: "我是一名学生。", explanation: "student 学生。", tag: "词汇" },
  { sentence: "She is a ___ (小学生).", answer: "pupil", chinese: "她是一名小学生。", explanation: "pupil 小学生。", tag: "词汇" },
  { sentence: "Mr Jones is a ___ (老师).", answer: "teacher", chinese: "琼斯先生是一名老师。", explanation: "teacher 老师。", tag: "词汇" },
  { sentence: "He is a ___ (男孩).", answer: "boy", chinese: "他是个男孩。", explanation: "boy 男孩。", tag: "词汇" }
]

export const listenWordBankG3D1b = [
  { word: "student", options: ["study", "student", "stand", "story"], correct: 1, zh: "学生" },
  { word: "pupil", options: ["people", "purple", "pupil", "puppet"], correct: 2, zh: "小学生" },
  { word: "teacher", options: ["teach", "touch", "teacher", "tiger"], correct: 2, zh: "老师" },
  { word: "boy", options: ["toy", "box", "boy", "body"], correct: 2, zh: "男孩" },
  { word: "girl", options: ["girl", "bird", "good", "green"], correct: 0, zh: "女孩" }
]

export const listenSentenceBankG3D1b = [
  { sentence: "Where are you from?", zh: "你来自哪里？", options: ["How are you?", "Where are you from?", "Who are you?", "What's your name?"], correct: 1 },
  { sentence: "I'm a pupil.", zh: "我是一名小学生。", options: ["I'm a student.", "I'm a boy.", "I'm a pupil.", "I'm a teacher."], correct: 2 },
  { sentence: "She is a student.", zh: "她是一名学生。", options: ["She is a teacher.", "She is a student.", "She is a pupil.", "He is a student."], correct: 1 },
  { sentence: "I'm from China.", zh: "我来自中国。", options: ["I'm from Canada.", "He is from China.", "I'm from China.", "I'm from the UK."], correct: 2 },
  { sentence: "He is a teacher.", zh: "他是一名老师。", options: ["She is a teacher.", "He is a teacher.", "He is a doctor.", "He is a student."], correct: 1 }
]

export const listenOrderBankG3D1b = [
  { sentence: "Where are you from?", zh: "你来自哪里？", words: ["Where", "are", "you", "from?"], answer: ["Where", "are", "you", "from?"] },
  { sentence: "I'm a pupil.", zh: "我是名小学生。", words: ["I'm", "a", "pupil."], answer: ["I'm", "a", "pupil."] },
  { sentence: "She is a new student.", zh: "她是一名新学生。", words: ["She", "is", "a", "new", "student."], answer: ["She", "is", "a", "new", "student."] },
  { sentence: "He is a teacher.", zh: "他是一名老师。", words: ["He", "is", "a", "teacher."], answer: ["He", "is", "a", "teacher."] },
  { sentence: "I'm from the USA.", zh: "我来自美国。", words: ["I'm", "from", "the", "USA."], answer: ["I'm", "from", "the", "USA."] }
]

export const listenResponseBankG3D1b = [
  { question: "Where are you from?", zh: "你来自哪里？", options: ["I am a pupil.", "I'm from China.", "Welcome.", "Goodbye."], correct: 1 },
  { question: "Is she a student?", zh: "她是个学生吗？", options: ["Yes, she is.", "Me too.", "I see green.", "He is a teacher."], correct: 0 },
  { question: "Are you a teacher?", zh: "你是一位老师吗？", options: ["Yes, I am.", "She is a pupil.", "No, it isn't.", "Hello."], correct: 0 },
  { question: "Look at the boy.", zh: "看那个男孩。", options: ["He is my friend.", "It's a cat.", "Welcome.", "Yes."], correct: 0 },
  { question: "I'm a student.", zh: "我是一名学生。", options: ["Me too.", "It's brown.", "See you.", "Where are you?"], correct: 0 }
]

export const listenTranslateBankG3D1b = [
  { sentence: "Where are you from?", options: ["你要去哪里？", "你是谁？", "你来自哪里？", "你叫什么名字？"], correct: 2 },
  { sentence: "She is a student.", options: ["她是一名学生。", "她是一名老师。", "她是一名护士。", "他是一名学生。"], correct: 0 },
  { sentence: "He is a teacher.", options: ["他是一名学生。", "他是一名总统。", "她是老师。", "他是一名老师。"], correct: 3 },
  { sentence: "I am a girl.", options: ["我是一只鸟。", "我是一个女孩。", "我是一个男孩。", "我是一名学生。"], correct: 1 },
  { sentence: "I'm from Australia.", options: ["我来自加拿大。", "我来自中国。", "我来自澳大利亚。", "我来自英国。"], correct: 2 }
]
