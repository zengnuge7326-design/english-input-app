// PEP四年级下册 Unit 4 Part C《Story time / Let's check》题库
// 主题：Unit 4 综合复习 (农场动物 + 蔬菜)
// 7种题型，每种5题，共35题

export const quizBank4c = [
  { question: "___ are these? They're green beans.", chinese: "这些是什么？它们是长豆角。", options: ["How", "Who", "What", "When"], correct: 2, explanation: "询问'什么'用 What。What are these? 这些是什么？", tag: "句型" },
  { question: "Are those ___? Yes, they are.", chinese: "那些是绵羊吗？是的。", options: ["sheep", "sheeps", "a sheep", "sheep's"], correct: 0, explanation: "sheep 单复数同形，那些绵羊(复数)依然用 sheep。", tag: "语法" },
  { question: "___ many horses do you have?", chinese: "你有多少匹马？", options: ["How", "What", "Who", "Where"], correct: 0, explanation: "How many 问多少(数量)。", tag: "词汇" },
  { question: "Look at the farm. It is very ___.", chinese: "看看这个农场。它非常大。", options: ["big", "small", "long", "short"], correct: 0, explanation: "农场一般用 big(大) 描述比较常见。根据课文情境，农场很大。", tag: "词汇" },
  { question: "They are ___. We love them.", chinese: "它们是土豆。我们爱它们。", options: ["potato", "potatos", "potatoes", "a potato"], correct: 2, explanation: "potato的复数是potatoes。", tag: "语法" }
]

export const fillblankBank4c = [
  { sentence: "What ___ (是) these?", answer: "are", chinese: "这些是什么？", explanation: "主语是 these(复数)，be动词用 are。", tag: "语法" },
  { sentence: "They are ___ (西红柿).", answer: "tomatoes", chinese: "它们是西红柿。", explanation: "tomato复数为tomatoes。", tag: "拼写" },
  { sentence: "Are ___ (那些) cows?", answer: "those", chinese: "那些是奶牛吗？", explanation: "那些是 those。", tag: "词汇" },
  { sentence: "No, they ___. They're horses.", answer: "aren't", chinese: "不，它们不是。它们是马。", explanation: "Are those...? 的否定回答：No, they aren't.", tag: "语法" },
  { sentence: "We have a lot of ___ (动物).", answer: "animals", chinese: "我们有很多动物。", explanation: "a lot of 后接可数名词复数 animals。", tag: "词汇" }
]

export const listenWordBank4c = [
  { word: "farm", options: ["farm", "firm", "form", "fort"], correct: 0, zh: "农场" },
  { word: "vegetables", options: ["vegetables", "tables", "apples", "animals"], correct: 0, zh: "蔬菜" },
  { word: "animals", options: ["animals", "apples", "ants", "angels"], correct: 0, zh: "动物" },
  { word: "those", options: ["this", "that", "these", "those"], correct: 3, zh: "那些" },
  { word: "how many", options: ["how much", "how many", "how old", "how are"], correct: 1, zh: "多少" }
]

export const listenSentenceBank4c = [
  { sentence: "Welcome to my farm.", zh: "欢迎来到我的农场。", options: ["Welcome to my school.", "Welcome to my farm.", "Welcome to my home.", "Welcome to my room."], correct: 1 },
  { sentence: "Are these carrots?", zh: "这些是胡萝卜吗？", options: ["Are these apples?", "Are these potatoes?", "Are these carrots?", "Are those carrots?"], correct: 2 },
  { sentence: "Yes, they are.", zh: "是的，它们是。", options: ["No, they aren't.", "Yes, they are.", "Yes, it is.", "No, it isn't."], correct: 1 },
  { sentence: "What are those?", zh: "那些是什么？", options: ["What are these?", "What are those?", "Where are those?", "Who are those?"], correct: 1 },
  { sentence: "They're sheep.", zh: "它们是绵羊。", options: ["They're cows.", "They're horses.", "They're ducks.", "They're sheep."], correct: 3 }
]

export const listenOrderBank4c = [
  { sentence: "Welcome to my farm.", zh: "欢迎来到我的农场。", words: ["Welcome", "to", "my", "farm."], answer: ["Welcome", "to", "my", "farm."] },
  { sentence: "Are these potatoes?", zh: "这些是土豆吗？", words: ["Are", "these", "potatoes?"], answer: ["Are", "these", "potatoes?"] },
  { sentence: "Yes, they are.", zh: "是的，它们是。", words: ["Yes,", "they", "are."], answer: ["Yes,", "they", "are."] },
  { sentence: "How many horses do you have?", zh: "你有多少匹马？", words: ["How", "many", "horses", "do", "you", "have?"], answer: ["How", "many", "horses", "do", "you", "have?"] },
  { sentence: "They are very big.", zh: "它们好大啊。", words: ["They", "are", "very", "big."], answer: ["They", "are", "very", "big."] }
]

export const listenResponseBank4c = [
  { question: "What are these?", zh: "这些是什么？", options: ["They're potatoes.", "It is a potato.", "Yes, they are.", "No, they aren't."], correct: 0 },
  { question: "Are those sheep?", zh: "那些是绵羊吗？", options: ["They're cows.", "Yes, it is.", "Yes, they are.", "Sure, I like sheep."], correct: 2 },
  { question: "How many ducks do you have?", zh: "你有多少只鸭子？", options: ["I have fifteen.", "Ducks are cute.", "Yes, I have.", "No, I don't."], correct: 0 },
  { question: "Are these tomatoes?", zh: "这些是西红柿吗？", options: ["No, it isn't.", "Yes, they are.", "They are apples.", "I am eating a tomato."], correct: 1 },
  { question: "Is this a carrot?", zh: "这是一根胡萝卜吗？", options: ["Yes, it is.", "Yes, they are.", "No, they aren't.", "It is a horse."], correct: 0 }
]

export const listenTranslateBank4c = [
  { sentence: "Are these green beans?", options: ["这些是长豆角吗？", "这些是胡萝卜吗？", "那是长豆角吗？", "那些是土豆吗？"], correct: 0 },
  { sentence: "What are those?", options: ["这是什么？", "这些是什么？", "那是什么？", "那些是什么？"], correct: 3 },
  { sentence: "They're cows.", options: ["它们是马。", "它们是绵羊。", "它们是奶牛。", "它们是鸭子。"], correct: 2 },
  { sentence: "How many sheep do you have?", options: ["你有多少头奶牛？", "你有多少只绵羊？", "你有多少匹马？", "你有多少头猪？"], correct: 1 },
  { sentence: "Welcome to our farm.", options: ["欢迎回家。", "欢迎来到学校。", "欢迎来到我们的农场。", "这是你的农场。"], correct: 2 }
]
