// PEP五年级下册 Unit 4 Part C《Story time / Let's check》题库
// 主题：Unit 4 综合复习 (序数词规则、询问日期与节日活动)
// 7种题型，每种5题，共35题

export const quizBankG5D4c = [
  { question: "___ is the English test?", chinese: "英语测试在什么时候？", options: ["When", "What", "Who", "Why"], correct: 0, explanation: "对日期提问用 When。", tag: "疑问词" },
  { question: "It's ___ Nov. 2nd.", chinese: "在11月2日。", options: ["on", "in", "at", "to"], correct: 0, explanation: "在具体的某一天（几月几日）用 on。", tag: "介词" },
  { question: "He is the ___ one to school.", chinese: "他是第一个到学校的。", options: ["first", "one", "second", "third"], correct: 0, explanation: "第一个 first，one是基数词。", tag: "序数词" },
  { question: "There ___ a math test tomorrow.", chinese: "明天有一个数学测试。", options: ["is", "are", "am", "be"], correct: 0, explanation: "there is a math test单数。", tag: "系动词" },
  { question: "I will ___ noodles.", chinese: "我将要煮面条。", options: ["cook", "cooks", "cooking", "to cook"], correct: 0, explanation: "will 后面加动词原形。", tag: "情态动词" }
]

export const fillblankBankG5D4c = [
  { sentence: "___ (什么时候) is the sports meet?", answer: "When", chinese: "运动会是什么时候？", explanation: "When", tag: "疑问词" },
  { sentence: "It's ___ (在...) Sept. 1st.", answer: "on", chinese: "在九月一日。", explanation: "几月几日用介词 on。", tag: "介词" },
  { sentence: "He is the ___ (第五) student.", answer: "fifth", chinese: "他是第五名学生。", explanation: "fifth 第五", tag: "序数词" },
  { sentence: "Children's Day is on June ___ (第一).", answer: "1st", chinese: "儿童节在六月一号。", explanation: "1st 或者 first。通常填 1st 更快。", tag: "序数词" },
  { sentence: "I will ___ (做) a card for her.", answer: "make", chinese: "我将会为她制作卡片。", explanation: "make", tag: "动词" }
]

export const listenWordBankG5D4c = [
  { word: "first", options: ["first", "fast", "fourth", "fifth"], correct: 0, zh: "第一" },
  { word: "second", options: ["second", "seven", "six", "send"], correct: 0, zh: "第二" },
  { word: "third", options: ["third", "thirty", "three", "tree"], correct: 0, zh: "第三" },
  { word: "fourth", options: ["four", "forty", "fourth", "fifth"], correct: 2, zh: "第四" },
  { word: "twelfth", options: ["twelve", "twelfth", "twenty", "two"], correct: 1, zh: "第十二" }
]

export const listenSentenceBankG5D4c = [
  { sentence: "When is the math test?", zh: "数学考试在什么时候？", options: ["When is the math test?", "When is the English test?", "Where is the math test?", "What is the math test?"], correct: 0 },
  { sentence: "It's on Nov. 2nd.", zh: "在11月2日。", options: ["It's on Nov. 1st.", "It's in Nov.", "It's on Nov. 2nd.", "It's on Nov. 3rd."], correct: 2 },
  { sentence: "Is your birthday in May?", zh: "你的生日在五月吗？", options: ["Is your birthday in June?", "Is your birthday in May?", "Is her birthday in May?", "Whose birthday is in May?"], correct: 1 },
  { sentence: "He is the first.", zh: "他是第一名。", options: ["He is the first.", "She is the first.", "He is the second.", "I am the first."], correct: 0 },
  { sentence: "I will cook noodles.", zh: "我将煮面条。", options: ["I will make a card.", "I will wash clothes.", "I will cook noodles.", "She will cook noodles."], correct: 2 }
]

export const listenOrderBankG5D4c = [
  { sentence: "When is the math test?", zh: "数学测试是什么时候？", words: ["When", "is", "the", "math", "test?"], answer: ["When", "is", "the", "math", "test?"] },
  { sentence: "It is on Nov. 2nd.", zh: "在11月2日。", words: ["It", "is", "on", "Nov.", "2nd."], answer: ["It", "is", "on", "Nov.", "2nd."] },
  { sentence: "Is your birthday in May?", zh: "你的生日在五月吗？", words: ["Is", "your", "birthday", "in", "May?"], answer: ["Is", "your", "birthday", "in", "May?"] },
  { sentence: "He is the first.", zh: "他是第一个。", words: ["He", "is", "the", "first."], answer: ["He", "is", "the", "first."] },
  { sentence: "I will make a card.", zh: "我将会做张贺卡。", words: ["I", "will", "make", "a", "card."], answer: ["I", "will", "make", "a", "card."] }
]

export const listenResponseBankG5D4c = [
  { question: "When is the math test?", zh: "数学考试在什么时候？", options: ["It's on Dec. 4th.", "It is math.", "He is young.", "Yes, I do."], correct: 0 },
  { question: "Is your birthday in July?", zh: "你的生日在七月吗？", options: ["Yes, it is.", "No, they aren't.", "Thank you.", "A birthday card."], correct: 0 },
  { question: "What will you do on Mother's Day?", zh: "在母亲节你将干什么？", options: ["I will make a card.", "It's on Sunday.", "Yes, she is.", "I love her."], correct: 0 },
  { question: "When is Teachers' Day?", zh: "教师节在什么时候？", options: ["It's on Sept. 10th.", "I'm ten.", "Yes, it is.", "A teacher."], correct: 0 },
  { question: "Who is the first?", zh: "谁是第一个？", options: ["Tom is.", "It is red.", "Because I am fast.", "Yes, he is."], correct: 0 }
]

export const listenTranslateBankG5D4c = [
  { sentence: "When is the math test?", options: ["英语考试在什么时候？", "阅读节在时候？", "数学测试在什么时候？", "你会做数学题吗？"], correct: 2 },
  { sentence: "It's on Nov. 2nd.", options: ["在十一月一日。", "在十一月二日。", "在十月二日。", "在十二月二日。"], correct: 1 },
  { sentence: "Is your birthday in May?", options: ["你的生日在三月吗？", "她的生日在五月吗？", "你的生日在五月吗？", "是谁的生日在五月？"], correct: 2 },
  { sentence: "He is the first.", options: ["他是第五名。", "他是第二。", "我是第一个。", "他是第一名。"], correct: 3 },
  { sentence: "I will cook noodles.", options: ["我要洗碗。", "我要买面条。", "我将会煮面条。", "我们在吃面条。"], correct: 2 }
]
