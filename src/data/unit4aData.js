// PEP四年级下册 Unit 4 Part A《At the farm》题库
// 主题：蔬菜名词复数 (tomatoes, potatoes, carrots, green beans) + What are these? Are these...?
// 7种题型，每种5题，共35题

export const quizBank4a = [
  { question: "___ are these? They're carrots.", chinese: "这些是什么？它们是胡萝卜。", options: ["Who", "What", "Where", "When"], correct: 1, explanation: "What are these? 是询问近处复数物品'这些是什么？'的常用句型。", tag: "句型" },
  { question: "Are these ___? Yes, they are.", chinese: "这些是西红柿吗？是的。", options: ["tomato", "tomatos", "tomatoes", "a tomato"], correct: 2, explanation: "tomato 的复数形式是加 -es：tomatoes。", tag: "语法" },
  { question: "Look at the ___. They are so long.", chinese: "看看这些长豆角。它们好长。", options: ["green bean", "green beans", "carrots", "potatoes"], correct: 1, explanation: "长豆角是 green beans。", tag: "词汇" },
  { question: "They're ___. I like them very much.", chinese: "它们是土豆。我非常喜欢它们。", options: ["potato", "potatos", "potatoes", "a potato"], correct: 2, explanation: "potato 的复数形式和 tomato 一样，加 -es：potatoes。", tag: "语法" },
  { question: "___ these apples? No, they aren't.", chinese: "这些是苹果吗？不，不是。", options: ["Do", "Is", "Are", "Does"], correct: 2, explanation: "主语 these 是复数，be动词要用 Are。", tag: "语法" }
]

export const fillblankBank4a = [
  { sentence: "What are ___ (这些)?", answer: "these", chinese: "这些是什么？", explanation: "these 指示代词，这些（指代近处的复数事物）。", tag: "语法" },
  { sentence: "Are these ___ (胡萝卜)?", answer: "carrots", chinese: "这些是胡萝卜吗？", explanation: "carrot 反数加 -s: carrots。", tag: "拼写" },
  { sentence: "Yes, they ___.", answer: "are", chinese: "是的，它们是。", explanation: "Are these...? 的肯定回答：Yes, they are.", tag: "句型" },
  { sentence: "They're so ___ (大的).", answer: "big", chinese: "它们好大啊。", explanation: "big 大的。", tag: "词汇" },
  { sentence: "They are green ___ (豆角).", answer: "beans", chinese: "它们是青豆角。", explanation: "green beans 青豆/豆角。", tag: "词汇" }
]

export const listenWordBank4a = [
  { word: "tomatoes", options: ["tomatoes", "potatoes", "toes", "today"], correct: 0, zh: "西红柿 (复数)" },
  { word: "potatoes", options: ["tomatoes", "potatoes", "pianos", "photos"], correct: 1, zh: "土豆 (复数)" },
  { word: "carrots", options: ["cabbages", "cows", "carrots", "cars"], correct: 2, zh: "胡萝卜 (复数)" },
  { word: "these", options: ["this", "those", "that", "these"], correct: 3, zh: "这些" },
  { word: "beans", options: ["bears", "beans", "beads", "beats"], correct: 1, zh: "豆子 (复数)" }
]

export const listenSentenceBank4a = [
  { sentence: "What are these?", zh: "这些是什么？", options: ["What are these?", "What are those?", "What are they?", "Who are they?"], correct: 0 },
  { sentence: "They're tomatoes.", zh: "它们是西红柿。", options: ["They're potatoes.", "They're carrots.", "They're tomatoes.", "They're apples."], correct: 2 },
  { sentence: "Are these carrots?", zh: "这些是胡萝卜吗？", options: ["Are these apples?", "Are these potatoes?", "Are those carrots?", "Are these carrots?"], correct: 3 },
  { sentence: "Yes, they are.", zh: "是的，它们是。", options: ["No, they aren't.", "Yes, they do.", "Yes, they are.", "Yes, it is."], correct: 2 },
  { sentence: "They're good.", zh: "它们很好吃。", options: ["They're good.", "It's good.", "They're big.", "They're small."], correct: 0 }
]

export const listenOrderBank4a = [
  { sentence: "What are these?", zh: "这些是什么？", words: ["What", "are", "these?"], answer: ["What", "are", "these?"] },
  { sentence: "They're tomatoes.", zh: "它们是西红柿。", words: ["They're", "tomatoes."], answer: ["They're", "tomatoes."] },
  { sentence: "Are these carrots?", zh: "这些是胡萝卜吗？", words: ["Are", "these", "carrots?"], answer: ["Are", "these", "carrots?"] },
  { sentence: "Let's make some soup.", zh: "我们来做些汤吧。", words: ["Let's", "make", "some", "soup."], answer: ["Let's", "make", "some", "soup."] },
  { sentence: "They're so big.", zh: "它们好大啊。", words: ["They're", "so", "big."], answer: ["They're", "so", "big."] }
]

export const listenResponseBank4a = [
  { question: "What are these?", zh: "这些是什么？", options: ["They're on the desk.", "They're tomatoes.", "Yes, they are.", "No, they aren't."], correct: 1 },
  { question: "Are these potatoes?", zh: "这些是土豆吗？", options: ["Yes, they are.", "It is a potato.", "These are apples.", "I like potatoes."], correct: 0 },
  { question: "Do you like carrots?", zh: "你喜欢胡萝卜吗？", options: ["Yes, I can.", "Yes, I am.", "Yes, I do.", "Yes, it is."], correct: 2 },
  { question: "Are they green beans?", zh: "它们是长豆角吗？", options: ["Yes, it is.", "No, it isn't.", "No, they aren't.", "They are green."], correct: 2 },
  { question: "Look at these vegetables.", zh: "看看这些蔬菜。", options: ["They're so big!", "I am cooking.", "It's a tomato.", "Where are they?"], correct: 0 }
]

export const listenTranslateBank4a = [
  { sentence: "What are these?", options: ["那些是什么？", "这是什么？", "这些是什么？", "他们在哪里？"], correct: 2 },
  { sentence: "They're tomatoes.", options: ["它们是土豆。", "它们是西红柿。", "它们是胡萝卜。", "它们是豆角。"], correct: 1 },
  { sentence: "Are these carrots?", options: ["这些是西红柿吗？", "那些是胡萝卜吗？", "这些是胡萝卜吗？", "那些是豆角吗？"], correct: 2 },
  { sentence: "Yes, they are.", options: ["是的，它是。", "是的，它们是。", "不，不是。", "不，它们不是。"], correct: 1 },
  { sentence: "I like green beans.", options: ["我喜欢洋葱。", "我喜欢吃土豆。", "我喜欢胡萝卜。", "我喜欢长豆角。"], correct: 3 }
]
