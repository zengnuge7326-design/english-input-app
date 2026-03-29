// PEP四年级下册 Unit 4 Part B《Let's learn / Let's talk》题库
// 主题：农场动物名词复数 (horses, cows, hens, sheep) + What are those? + or 发音规则
// 7种题型，每种5题，共35题

export const quizBank4b = [
  { question: "What are ___? They're horses.", chinese: "那些是什么？它们是马。", options: ["these", "those", "this", "that"], correct: 1, explanation: "指代远处的复数事物用 those，近处用 these。结合语境答 those 最佳。", tag: "词汇" },
  { question: "Wow! You have a lot of ___.", chinese: "哇！你有很多羊。", options: ["sheep", "sheeps", "a sheep", "sheep's"], correct: 0, explanation: "sheep 单复数同形，复数不需要加 s。", tag: "语法" },
  { question: "Are those ___?", chinese: "那些是母鸡吗？", options: ["hen", "hens", "hen's", "a hen"], correct: 1, explanation: "those 是复数，所以后面的名词要用复数 hens。", tag: "语法" },
  { question: "How many ___ do you have? Seventeen.", chinese: "你有多少头奶牛？十七头。", options: ["cow", "cowes", "cows", "a cow"], correct: 2, explanation: "How many 后接可数名词复数。cow 的复数是 cows。", tag: "语法" },
  { question: "Which word's 'or' sounds different?", chinese: "哪个词里的 or 发音不同？", options: ["horse", "fork", "homework", "born"], correct: 2, explanation: "horse/fork/born 中 or 发 /ɔː/，而 homework(以及 work/world) 中 or 发 /ɜː/。", tag: "拼读" }
]

export const fillblankBank4b = [
  { sentence: "What are ___ (那些)?", answer: "those", chinese: "那些是什么？", explanation: "those 那些（指远处复数事物）。", tag: "词汇" },
  { sentence: "They are ___ (马).", answer: "horses", chinese: "它们是马。", explanation: "horse 的复数是 horses。", tag: "拼写" },
  { sentence: "Are those ___ (奶牛)?", answer: "cows", chinese: "那些是奶牛吗？", explanation: "cow 牛，复数形式 cows。", tag: "拼写" },
  { sentence: "No, they ___. They are horses.", answer: "aren't", chinese: "不，它们不是。它们是马。", explanation: "Are those...? 的否定回答：No, they aren't.", tag: "语法" },
  { sentence: "How ___ cows do you have?", answer: "many", chinese: "你有多少头奶牛？", explanation: "How many 问数量多少。", tag: "句型" }
]

export const listenWordBank4b = [
  { word: "those", options: ["these", "this", "that", "those"], correct: 3, zh: "那些" },
  { word: "cows", options: ["cats", "cows", "cars", "calls"], correct: 1, zh: "奶牛 (复数)" },
  { word: "horses", options: ["houses", "hoses", "horses", "holes"], correct: 2, zh: "马 (复数)" },
  { word: "hens", options: ["hands", "hens", "pens", "tens"], correct: 1, zh: "母鸡 (复数)" },
  { word: "sheep", options: ["ship", "shape", "sheep", "shop"], correct: 2, zh: "绵羊 (单复同形)" }
]

export const listenSentenceBank4b = [
  { sentence: "What are those?", zh: "那些是什么？", options: ["What are these?", "What are those?", "Where are those?", "Who are those?"], correct: 1 },
  { sentence: "They're horses.", zh: "它们是马。", options: ["They're houses.", "They're cows.", "They're horses.", "They're sheep."], correct: 2 },
  { sentence: "Are those hens?", zh: "那些是母鸡吗？", options: ["Are these hens?", "Are those ducks?", "Are those hens?", "Are those pens?"], correct: 2 },
  { sentence: "How many cows do you have?", zh: "你有多少头奶牛？", options: ["How many cars do you have?", "How many cats do you have?", "How many cows do you have?", "How many sheep do you have?"], correct: 2 },
  { sentence: "I have seventeen.", zh: "我有十七头。", options: ["I have seven.", "I have seventeen.", "I have seventy.", "I have sixteen."], correct: 1 }
]

export const listenOrderBank4b = [
  { sentence: "What are those?", zh: "那些是什么？", words: ["What", "are", "those?"], answer: ["What", "are", "those?"] },
  { sentence: "They are horses.", zh: "它们是马。", words: ["They", "are", "horses."], answer: ["They", "are", "horses."] },
  { sentence: "Are those hens?", zh: "那些是母鸡吗？", words: ["Are", "those", "hens?"], answer: ["Are", "those", "hens?"] },
  { sentence: "How many cows do you have?", zh: "你有多少头奶牛？", words: ["How", "many", "cows", "do", "you", "have?"], answer: ["How", "many", "cows", "do", "you", "have?"] },
  { sentence: "Wow! You have a lot of animals.", zh: "哇！你有很多动物。", words: ["Wow!", "You", "have", "a", "lot", "of", "animals."], answer: ["Wow!", "You", "have", "a", "lot", "of", "animals."] }
]

export const listenResponseBank4b = [
  { question: "What are those?", zh: "那些是什么？", options: ["They are carrots.", "It is a horse.", "They are horses.", "Those are far."], correct: 2 },
  { question: "How many sheep do you have?", zh: "你有多少只绵羊？", options: ["Yes, I do.", "I have twenty.", "They're sheep.", "It is a sheep."], correct: 1 },
  { question: "Are those cows?", zh: "那些是奶牛吗？", options: ["Yes, they are.", "No, it isn't.", "These are cows.", "Yes, I am."], correct: 0 },
  { question: "Is this a farm?", zh: "这是一个农场吗？", options: ["Yes, they are.", "Yes, it is.", "No, they aren't.", "It's big."], correct: 1 },
  { question: "What are these?", zh: "这些是什么？", options: ["They are horses.", "They are near.", "It is a duck.", "I like those."], correct: 0 }
]

export const listenTranslateBank4b = [
  { sentence: "What are those?", options: ["那些是什么？", "这些是什么？", "他们是谁？", "你在哪里？"], correct: 0 },
  { sentence: "They're sheep.", options: ["它们是山羊。", "它们是绵羊。", "它们是奶牛。", "它们是马。"], correct: 1 },
  { sentence: "Are those hens?", options: ["那些是母鸡吗？", "这些是母鸡吗？", "那些是鸭子吗？", "这些是鸭子吗？"], correct: 0 },
  { sentence: "How many cows do you have?", options: ["你有很多奶牛吗？", "你有多少只绵羊？", "你有多少头奶牛？", "你有多少匹马？"], correct: 2 },
  { sentence: "They are horses.", options: ["它们是房子。", "它们是奶牛。", "它们是马。", "它们是鸭子。"], correct: 2 }
]
