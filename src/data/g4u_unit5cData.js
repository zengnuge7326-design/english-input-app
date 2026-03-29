// PEP四年级上册 Unit 5 Part C《Story time / Let's check》题库
// 主题：Unit 5 综合复习 (食物与餐具)
// 7种题型，每种5题，共35题

export const quizBankG4U5c = [
  { question: "Can I have ___ soup?", chinese: "我能喝点汤吗？", options: ["any", "a", "an", "some"], correct: 3, explanation: "在表示请求或建议的疑问句中，希望得到肯定回答时用 some 而不用 any。", tag: "语法" },
  { question: "Pass ___ the fork, please.", chinese: "请把叉子递给我。", options: ["I", "my", "mine", "me"], correct: 3, explanation: "动词 pass 后面跟宾格代词 me。", tag: "代词" },
  { question: "I can ___ chopsticks.", chinese: "我会用筷子。", options: ["use", "uses", "make", "clean"], correct: 0, explanation: "can 后面接动词原形，使用筷子用 use。", tag: "语法" },
  { question: "___ you like some beef?", chinese: "你想点些牛肉吗？", options: ["Do", "Are", "Can", "Would"], correct: 3, explanation: "Would you like...? 是委婉地询问“你想要...吗？”", tag: "语法" },
  { question: "Wait ___ me.", chinese: "等等我。", options: ["for", "to", "on", "in"], correct: 0, explanation: "wait for 就是“等待”。", tag: "短语" }
]

export const fillblankBankG4U5c = [
  { sentence: "___ (你想要...) you like some chicken?", answer: "Would", chinese: "你想要些鸡肉吗？", explanation: "Would you like...?", tag: "语法" },
  { sentence: "Pass ___ (我) the plate.", answer: "me", chinese: "把盘子递给我。", explanation: "宾格 me。", tag: "代词" },
  { sentence: "Can I have some ___ (蔬菜)?", answer: "vegetables", chinese: "我能吃点蔬菜吗？", explanation: "vegetable的复数形式 vegetables", tag: "拼写" },
  { sentence: "___ (帮助) yourself.", answer: "Help", chinese: "请自便。", explanation: "Help", tag: "词汇" },
  { sentence: "I'd like some ___ (面条).", answer: "noodles", chinese: "我想要些面条。", explanation: "复数面条 noodles。", tag: "拼写" }
]

export const listenWordBankG4U5c = [
  { word: "dinner", options: ["dinner", "winner", "supper", "lunch"], correct: 0, zh: "晚餐" },
  { word: "ready", options: ["read", "ready", "red", "lady"], correct: 1, zh: "准备好的" },
  { word: "pass", options: ["past", "pass", "glass", "class"], correct: 1, zh: "传递" },
  { word: "spoon", options: ["moon", "spoon", "soup", "soon"], correct: 1, zh: "勺子" },
  { word: "use", options: ["yes", "us", "use", "youth"], correct: 2, zh: "使用" }
]

export const listenSentenceBankG4U5c = [
  { sentence: "What's for dinner?", zh: "晚饭吃什么？", options: ["What's in the bag?", "What's for lunch?", "What's for dinner?", "What time is it?"], correct: 2 },
  { sentence: "I'd like some noodles, please.", zh: "请给我来些面条。", options: ["I'd like some beef, please.", "I'd like some rice, please.", "I'd like some soup, please.", "I'd like some noodles, please."], correct: 3 },
  { sentence: "Can I have some soup?", zh: "我能喝点汤吗？", options: ["Can I have some milk?", "Can I have some soup?", "Can I have some water?", "Can I have some beef?"], correct: 1 },
  { sentence: "Pass me the knife.", zh: "把刀递给我。", options: ["Pass me the fork.", "Pass me the spoon.", "Pass me the bowl.", "Pass me the knife."], correct: 3 },
  { sentence: "Everything is ready.", zh: "所有的东西都准备好了。", options: ["Dinner is ready.", "Food is ready.", "Everything is ready.", "Everyone is here."], correct: 2 }
]

export const listenOrderBankG4U5c = [
  { sentence: "What is for dinner?", zh: "晚饭吃什么？", words: ["What", "is", "for", "dinner?"], answer: ["What", "is", "for", "dinner?"] },
  { sentence: "I would like some beef.", zh: "我想要些牛肉。", words: ["I", "would", "like", "some", "beef."], answer: ["I", "would", "like", "some", "beef."] },
  { sentence: "Can I have some soup?", zh: "我能喝点汤吗？", words: ["Can", "I", "have", "some", "soup?"], answer: ["Can", "I", "have", "some", "soup?"] },
  { sentence: "Pass me the spoon, please.", zh: "请把勺子递给我。", words: ["Pass", "me", "the", "spoon,", "please."], answer: ["Pass", "me", "the", "spoon,", "please."] },
  { sentence: "Dinner is ready.", zh: "晚餐好了。", words: ["Dinner", "is", "ready."], answer: ["Dinner", "is", "ready."] }
]

export const listenResponseBankG4U5c = [
  { question: "Would you like some soup?", zh: "你想要些汤吗？", options: ["Yes, please.", "Yes, it is.", "It is heavy.", "I have a bowl."], correct: 0 },
  { question: "Can I have some beef?", zh: "我能吃点牛肉吗？", options: ["No, it isn't.", "Yes, he does.", "Sure. Here you are.", "They are near the phone."], correct: 2 },
  { question: "What would you like?", zh: "你想要些什么？", options: ["He is my friend.", "I'd like some chicken.", "Yes, please.", "I am tall."], correct: 1 },
  { question: "Dinner's ready!", zh: "晚餐好了！", options: ["Help yourself.", "Thank you.", "Yes, it is.", "Let me clean the desk."], correct: 1 },
  { question: "Can you use chopsticks?", zh: "你会用筷子吗？", options: ["Yes, I can.", "Yes, please.", "No, it isn't.", "It's on the table."], correct: 0 }
]

export const listenTranslateBankG4U5c = [
  { sentence: "What would you like for dinner?", options: ["你想喝点什么？", "这是你的晚餐吗？", "晚饭你有什么？", "晚饭你想吃什么？"], correct: 3 },
  { sentence: "I'd like some vegetables.", options: ["我想要一些面条。", "我想要一些牛肉。", "我想要一些蔬菜。", "我想要一些米饭。"], correct: 2 },
  { sentence: "Can I have some soup?", options: ["我可以要一些牛肉吗？", "我可以吃一些面条吗？", "我可以要一把刀吗？", "我可以喝点汤吗？"], correct: 3 },
  { sentence: "Pass me the spoon.", options: ["把碗递给我。", "把筷子递给我。", "把叉子递给我。", "把勺子递给我。"], correct: 3 },
  { sentence: "Use the chopsticks.", options: ["整理床铺。", "吃面条。", "使用筷子。", "那是你的筷子。"], correct: 2 }
]
