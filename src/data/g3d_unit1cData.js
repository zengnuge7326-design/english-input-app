// PEP三年级下册 Unit 1 Part C《Story time / Let's check》题库
// 主题：Unit 1 综合复习 (国家、学生老师身份、介绍)
// 7种题型，每种5题，共35题

export const quizBankG3D1c = [
  { question: "Let's play ___ game.", chinese: "我们一起来玩个游戏吧。", options: ["a", "an", "the", "some"], correct: 0, explanation: "play a game 玩游戏，固定搭配。", tag: "冠词" },
  { question: "I ___ a boy. She ___ a girl.", chinese: "我是个男孩。她是个女孩。", options: ["is / am", "am / is", "are / is", "am / are"], correct: 1, explanation: "I am (我是)；She is (她是)。", tag: "语法" },
  { question: "We ___ new friends.", chinese: "我们有新朋友。", options: ["has", "have", "are", "is"], correct: 1, explanation: "We 是复数，表示“有”用 have。", tag: "动词" },
  { question: "Where is she ___? She's from the UK.", chinese: "她来自哪里？她来自英国。", options: ["to", "for", "from", "at"], correct: 2, explanation: "Where is sb from? (某人来自哪里？)", tag: "介词" },
  { question: "___, I'm Miss White.", chinese: "你好，我是怀特老师。", options: ["Hi", "Goodbye", "Welcome", "OK"], correct: 0, explanation: "打招呼介绍自己用 Hi/Hello。", tag: "交际" }
]

export const fillblankBankG3D1c = [
  { sentence: "Where ___ (是) you from?", answer: "are", chinese: "你来自哪里？", explanation: "you 配合 are。", tag: "动词" },
  { sentence: "I ___ (是) a student.", answer: "am", chinese: "我是一名学生。", explanation: "I 配合 am。", tag: "动词" },
  { sentence: "Let's ___ (玩) a game.", answer: "play", chinese: "我们玩游戏吧。", explanation: "play 玩。", tag: "动词" },
  { sentence: "She is a ___ (女孩).", answer: "girl", chinese: "她是个女孩。", explanation: "girl 女孩。", tag: "词汇" },
  { sentence: "I'm from ___ (加拿大).", answer: "Canada", chinese: "我来自加拿大。", explanation: "Canada 加拿大，注意首字母大写。", tag: "词汇" }
]

export const listenWordBankG3D1c = [
  { word: "game", options: ["name", "came", "game", "gate"], correct: 2, zh: "游戏" },
  { word: "student", options: ["study", "student", "stand", "story"], correct: 1, zh: "学生" },
  { word: "where", options: ["who", "what", "where", "there"], correct: 2, zh: "哪里" },
  { word: "new", options: ["now", "new", "no", "not"], correct: 1, zh: "新的" },
  { word: "Australia", options: ["America", "Africa", "Australia", "Austria"], correct: 2, zh: "澳大利亚" }
]

export const listenSentenceBankG3D1c = [
  { sentence: "Where are you from?", zh: "你来自哪里？", options: ["Who are you?", "Where are you from?", "How are you?", "What's your name?"], correct: 1 },
  { sentence: "I'm a boy. And you?", zh: "我是个男孩子。你呢？", options: ["I'm a girl.", "I'm a pupil.", "I'm a boy. And you?", "I'm a student."], correct: 2 },
  { sentence: "We have a new friend today.", zh: "今天我们有一位新朋友。", options: ["We have two new friends.", "I have a new teacher.", "We have a new friend today.", "This is my friend."], correct: 2 },
  { sentence: "Let's play a game.", zh: "我们来玩游戏吧。", options: ["Let's make a puppet.", "Let's read a book.", "Let's go to school.", "Let's play a game."], correct: 3 },
  { sentence: "Wait a minute!", zh: "等一下！", options: ["Look at me!", "Wait a minute!", "Show me your pen!", "Come here!"], correct: 1 }
]

export const listenOrderBankG3D1c = [
  { sentence: "Where are you from?", zh: "你们来自哪里？", words: ["Where", "are", "you", "from?"], answer: ["Where", "are", "you", "from?"] },
  { sentence: "I am a new pupil.", zh: "我是一名新来的小学生。", words: ["I", "am", "a", "new", "pupil."], answer: ["I", "am", "a", "new", "pupil."] },
  { sentence: "Let's play a game.", zh: "让我们玩个游戏。", words: ["Let's", "play", "a", "game."], answer: ["Let's", "play", "a", "game."] },
  { sentence: "We have two new friends.", zh: "我们有两位新朋友。", words: ["We", "have", "two", "new", "friends."], answer: ["We", "have", "two", "new", "friends."] },
  { sentence: "Wait a minute!", zh: "稍等一下！", words: ["Wait", "a", "minute!"], answer: ["Wait", "a", "minute!"] }
]

export const listenResponseBankG3D1c = [
  { question: "Where are you from?", zh: "你来自哪儿？", options: ["I'm from Australia.", "I am a girl.", "Yes.", "Welcome."], correct: 0 },
  { question: "Let's play a game.", zh: "我们玩生字游戏吧。", options: ["OK.", "Hello.", "I see black.", "I am ten."], correct: 0 },
  { question: "Welcome back to school!", zh: "欢迎回到学校！", options: ["Thank you.", "Nice to see you again.", "I am a boy.", "Yes, it is."], correct: 1 },
  { question: "Is she a teacher?", zh: "她是一名老师吗？", options: ["Yes, she is.", "He is a student.", "I'm from China.", "Welcome."], correct: 0 },
  { question: "I'm a new pupil.", zh: "我是一名新来的小学生。", options: ["Welcome!", "Goodbye.", "What's your name?", "Thank you."], correct: 0 }
]

export const listenTranslateBankG3D1c = [
  { sentence: "We have a new friend today.", options: ["今天是朋友的生日。", "我们有一个新老师。", "今天我们有一位新朋友。", "我们喜欢新朋友。"], correct: 2 },
  { sentence: "I am a pupil.", options: ["我是一名老师。", "我是一名学生。", "我是一名小学生。", "我是个女孩。"], correct: 2 },
  { sentence: "Let's play a game.", options: ["我们回家吧。", "我们做游戏吧。", "让我们玩吧。", "我们去上学。"], correct: 1 },
  { sentence: "Where are you from?", options: ["你要去哪儿？", "你在哪里上学？", "你叫什么？", "你来自哪里？"], correct: 3 },
  { sentence: "Wait a minute!", options: ["十分钟！", "等一下！", "快点！", "再见！"], correct: 1 }
]
