// PEP五年级下册 Unit 6 Part B《Work quietly!》题库
// 主题：规则与指令 (keep to the right, keep your desk clean, talk quietly, take turns) + What's the little monkey doing? It's playing. Shh. Talk quietly.
// 7种题型，每种5题，共35题

export const quizBankG5D6b = [
  { question: "Talk ___.", chinese: "小声讲话。", options: ["quietly", "quiet", "quite", "loudly"], correct: 0, explanation: "修饰动词 talk 用副词 quietly。", tag: "副词" },
  { question: "Keep to the ___.", chinese: "靠右行。", options: ["right", "left", "straight", "wrong"], correct: 0, explanation: "keep to the right 靠右走，常考规则。", tag: "名词" },
  { question: "Keep your desk ___.", chinese: "保持你的课桌整洁。", options: ["clean", "cleaning", "cleans", "to clean"], correct: 0, explanation: "keep + 宾语 + 形容词：保持某物...状态。", tag: "形容词" },
  { question: "Take ___.", chinese: "按顺序来。", options: ["turns", "turn", "turning", "turned"], correct: 0, explanation: "take turns 轮流/按顺序来。", tag: "固定搭配" },
  { question: "___, the baby is sleeping.", chinese: "嘘，婴儿正在睡觉。", options: ["Shh", "Wow", "Aha", "Oh"], correct: 0, explanation: "Shh 表示让人安静。", tag: "感叹词" }
]

export const fillblankBankG5D6b = [
  { sentence: "Talk ___ (安静地).", answer: "quietly", chinese: "小声讲话。", explanation: "quietly 安静地（副词）", tag: "副词" },
  { sentence: "Keep to the ___ (右边).", answer: "right", chinese: "靠右走。", explanation: "right 右边", tag: "名词" },
  { sentence: "Take ___ (按顺序来/轮流).", answer: "turns", chinese: "要有序轮流。", explanation: "take turns", tag: "名词复数" },
  { sentence: "Keep your desk ___ (干净的).", answer: "clean", chinese: "保持书桌干净。", explanation: "clean 干净的", tag: "形容词" },
  { sentence: "Shh. ___ (小声说话) quietly.", answer: "Talk", chinese: "嘘，小声说话。", explanation: "祈使句首字母大写 Talk。", tag: "动词" }
]

export const listenWordBankG5D6b = [
  { word: "quietly", options: ["quickly", "quietly", "quite", "quit"], correct: 1, zh: "安静地" },
  { word: "right", options: ["light", "night", "right", "write"], correct: 2, zh: "右边/正确的" },
  { word: "keep", options: ["deep", "keep", "sleep", "sweep"], correct: 1, zh: "保持" },
  { word: "clean", options: ["clear", "clean", "class", "clever"], correct: 1, zh: "干净的/打扫" },
  { word: "turns", options: ["burns", "turns", "towns", "terms"], correct: 1, zh: "轮流(名词复数)" }
]

export const listenSentenceBankG5D6b = [
  { sentence: "Talk quietly, please.", zh: "请小声讲话。", options: ["Walk quietly, please.", "Talk quietly, please.", "Read quietly, please.", "Talk loudly, please."], correct: 1 },
  { sentence: "Keep to the right.", zh: "靠右行。", options: ["Keep to the right.", "Keep to the left.", "Keep your desk clean.", "Go straight ahead."], correct: 0 },
  { sentence: "Keep your desk clean.", zh: "保持你的书桌干净。", options: ["Keep your room clean.", "Keep your desk clean.", "Keep your hands clean.", "Keep to the right."], correct: 1 },
  { sentence: "Take turns, please.", zh: "请按顺序来。", options: ["Take care, please.", "Take turns, please.", "Sit down, please.", "Stand up, please."], correct: 1 },
  { sentence: "What's the little monkey doing?", zh: "那只小猴子在干什么？", options: ["What's the tiger doing?", "What's the baby monkey doing?", "What's the little monkey doing?", "Where is the monkey?"], correct: 2 }
]

export const listenOrderBankG5D6b = [
  { sentence: "Talk quietly, please.", zh: "请小声说话。", words: ["Talk", "quietly,", "please."], answer: ["Talk", "quietly,", "please."] },
  { sentence: "Keep to the right.", zh: "靠右行。", words: ["Keep", "to", "the", "right."], answer: ["Keep", "to", "the", "right."] },
  { sentence: "Keep your desk clean.", zh: "保持你的桌子整洁。", words: ["Keep", "your", "desk", "clean."], answer: ["Keep", "your", "desk", "clean."] },
  { sentence: "Take turns.", zh: "按顺序来。", words: ["Take", "turns."], answer: ["Take", "turns."] },
  { sentence: "What is the monkey doing?", zh: "猴子正在干什么？", words: ["What", "is", "the", "monkey", "doing?"], answer: ["What", "is", "the", "monkey", "doing?"] }
]

export const listenResponseBankG5D6b = [
  { question: "What is the dog doing?", zh: "狗正在做什么？", options: ["It is sleeping.", "Talk quietly.", "Yes, it is.", "Thank you."], correct: 0 },
  { question: "Are they playing?", zh: "他们正在玩耍吗？", options: ["Yes, they are.", "No, she isn't.", "Take turns.", "Here you are."], correct: 0 },
  { question: "Look at the sign. What does it say?", zh: "看这个标志。上面写了什么？", options: ["It says 'Keep to the right'.", "It is a sign.", "Because it's red.", "Bye!"], correct: 0 },
  { question: "Shh. My baby is sleeping.", zh: "嘘。我的宝宝在睡觉。", options: ["Oh, sorry. I'll talk quietly.", "Yes, they are.", "He is young.", "Thank you."], correct: 0 },
  { question: "There are so many people.", zh: "这里有好多人。", options: ["Yes, let's take turns.", "Keep your desk clean.", "No, it isn't.", "They are happy."], correct: 0 }
]

export const listenTranslateBankG5D6b = [
  { sentence: "Talk quietly, please.", options: ["请保持安静。", "请小声讲话。", "请不要说话。", "请大声朗读。"], correct: 1 },
  { sentence: "Keep to the right.", options: ["保持你的书桌干净。", "向左转。", "靠右行。", "按顺序来。"], correct: 2 },
  { sentence: "Keep your desk clean.", options: ["保持你的手干净。", "保持书籍整洁。", "打扫你的房间。", "保持你的课桌整洁。"], correct: 3 },
  { sentence: "Take turns.", options: ["我们要多运动。", "按顺序来/轮流。", "小心拐弯。", "那是你的回合。"], correct: 1 },
  { sentence: "What's the little monkey doing?", options: ["大象在做什么？", "小熊在做什么？", "那只小猴子正在干什么？", "小猴子去了哪里？"], correct: 2 }
]
