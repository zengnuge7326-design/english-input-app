// PEP三年级下册 Unit 1 Part A《Welcome back to school!》题库
// 主题：国家 (UK, Canada, USA, China) + I'm from... / We have two new friends.
// 7种题型，每种5题，共35题

export const quizBankG3D1a = [
  { question: "I'm ___ the UK.", chinese: "我来自英国。", options: ["from", "to", "in", "on"], correct: 0, explanation: "be from... 来自...", tag: "介词" },
  { question: "We have two new ___ today.", chinese: "今天我们有两位新朋友。", options: ["friend", "friends", "boy", "girl"], correct: 1, explanation: "two 后面接可数名词复数 friends。", tag: "单复数" },
  { question: "___ back to school!", chinese: "欢迎回到学校！", options: ["Welcome", "Hello", "Good", "Nice"], correct: 0, explanation: "Welcome back (欢迎回来) 是日常交际用语。", tag: "交际" },
  { question: "I am a boy. I am from ___.", chinese: "我是一个男孩。我来自中国。", options: ["china", "Chinese", "China", "UK"], correct: 2, explanation: "国家名称首字母要大写，China。", tag: "大小写" },
  { question: "Hi, I'm Amy. I'm from the ___.", chinese: "嗨，我是艾米。我来自英国。", options: ["UK", "Canada", "China", "us"], correct: 0, explanation: "由图文常识，the 后接 UK 或 USA。", tag: "国家词汇" }
]

export const fillblankBankG3D1a = [
  { sentence: "I'm ___ (来自) the USA.", answer: "from", chinese: "我来自美国。", explanation: "from 来自", tag: "介词" },
  { sentence: "___ (欢迎) back to school!", answer: "Welcome", chinese: "欢迎回到学校！", explanation: "Welcome 欢迎。句首首字母大写。", tag: "交际" },
  { sentence: "I'm from ___ (中国).", answer: "China", chinese: "我来自中国。", explanation: "China 中国", tag: "词汇" },
  { sentence: "I am from ___ (加拿大).", answer: "Canada", chinese: "我来自加拿大。", explanation: "Canada 加拿大", tag: "词汇" },
  { sentence: "We have two new ___ (朋友们).", answer: "friends", chinese: "我们有两个新朋友。", explanation: "friends 朋友", tag: "名" }
]

export const listenWordBankG3D1a = [
  { word: "China", options: ["China", "Canada", "child", "chair"], correct: 0, zh: "中国" },
  { word: "Canada", options: ["camera", "Canada", "panda", "candy"], correct: 1, zh: "加拿大" },
  { word: "welcome", options: ["window", "welcome", "woman", "well"], correct: 1, zh: "欢迎" },
  { word: "friends", options: ["french", "fresh", "friends", "front"], correct: 2, zh: "朋友们" },
  { word: "from", options: ["form", "from", "farm", "front"], correct: 1, zh: "来自" }
]

export const listenSentenceBankG3D1a = [
  { sentence: "Welcome back to school!", zh: "欢迎回到学校！", options: ["Welcome back to school!", "Welcome to our school!", "Welcome to my home!", "Nice to meet you!"], correct: 0 },
  { sentence: "I'm from the UK.", zh: "我来自英国。", options: ["I'm from the USA.", "I'm from the UK.", "I'm from China.", "I'm from Canada."], correct: 1 },
  { sentence: "We have two new friends.", zh: "我们有两个新朋友。", options: ["We have three new friends.", "I have a new friend.", "We have two new friends.", "They are my friends."], correct: 2 },
  { sentence: "Hi, I'm Amy.", zh: "你好，我是艾米。", options: ["Hello, I'm Sarah.", "Hi, I'm Amy.", "Hi, I'm Chen Jie.", "I am Mike."], correct: 1 },
  { sentence: "I am from Canada.", zh: "我来自加拿大。", options: ["He is from Canada.", "I am from China.", "I am from the USA.", "I am from Canada."], correct: 3 }
]

export const listenOrderBankG3D1a = [
  { sentence: "Welcome back to school!", zh: "欢迎回校！", words: ["Welcome", "back", "to", "school!"], answer: ["Welcome", "back", "to", "school!"] },
  { sentence: "I'm from the UK.", zh: "我来自英国。", words: ["I'm", "from", "the", "UK."], answer: ["I'm", "from", "the", "UK."] },
  { sentence: "We have two new friends.", zh: "我们有两个新朋友。", words: ["We", "have", "two", "new", "friends."], answer: ["We", "have", "two", "new", "friends."] },
  { sentence: "I am from China.", zh: "我来自中国。", words: ["I", "am", "from", "China."], answer: ["I", "am", "from", "China."] },
  { sentence: "Nice to meet you.", zh: "很高兴认识你。", words: ["Nice", "to", "meet", "you."], answer: ["Nice", "to", "meet", "you."] }
]

export const listenResponseBankG3D1a = [
  { question: "Welcome back to school!", zh: "欢迎回校！", options: ["Nice to see you again.", "I am from China.", "Goodbye.", "It's a schoolbag."], correct: 0 },
  { question: "Where are you from?", zh: "你来自哪里？", options: ["I'm from Canada.", "I am Mike.", "Welcome.", "Me too."], correct: 0 },
  { question: "I'm from the USA.", zh: "我来自美国。", options: ["Me too.", "Welcome.", "I'm from China.", "Nice to meet you."], correct: 3 },
  { question: "Hi, I'm Mike.", zh: "你好，我是迈克。", options: ["You're welcome.", "Hi, I'm Sarah.", "See you.", "Goodbye."], correct: 1 },
  { question: "We have two new friends today.", zh: "我们今天有两个新朋友。", options: ["Welcome!", "Bye.", "Me too.", "It is a duck."], correct: 0 }
]

export const listenTranslateBankG3D1a = [
  { sentence: "I'm from China.", options: ["我来自英国。", "我来自中国。", "我来自加拿大。", "我来自美国。"], correct: 1 },
  { sentence: "Welcome back to school!", options: ["我们去上学吧！", "这是你的学校。", "欢迎来到我家！", "欢迎回到学校！"], correct: 3 },
  { sentence: "We have a new friend.", options: ["我们有一个新书包。", "我们有一个新朋友。", "我们有两个新朋友。", "这是你的新朋友。"], correct: 1 },
  { sentence: "I'm from the UK.", options: ["我来自美国。", "我来自英国。", "我来自加拿大。", "我来自中国。"], correct: 1 },
  { sentence: "Hi, I am Amy.", options: ["你好，我是艾米。", "再见，艾米。", "你是艾米吗？", "这是艾米。"], correct: 0 }
]
