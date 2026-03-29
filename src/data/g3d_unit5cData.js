// PEP三年级下册 Unit 5 Part C《Story time / Let's check》题库
// 主题：Unit 5 综合复习 (水果综合、喜欢与不喜欢)
// 7种题型，每种5题，共35题

export const quizBankG3D5c = [
  { question: "___ you like oranges?", chinese: "你喜欢橙子吗？", options: ["Do", "Are", "Is", "Does"], correct: 0, explanation: "助动词 Do 提问。", tag: "语法" },
  { question: "No, I ___.", chinese: "不，我不喜欢。", options: ["don't", "do", "isn't", "am"], correct: 0, explanation: "否定回答 No, I don't.", tag: "语法" },
  { question: "Let's ___ some fruit.", chinese: "我们吃些水果吧。", options: ["have", "has", "do", "are"], correct: 0, explanation: "Let's 后接动词原形，have 为“吃”。", tag: "动词" },
  { question: "I like ___. They are sweet.", chinese: "我喜欢葡萄。它们很甜。", options: ["grapes", "grape", "a grape", "watermelons"], correct: 0, explanation: "复数形式 grapes，而且后面说了“They are sweet”。", tag: "名词复数" },
  { question: "Have some apples. ___ you.", chinese: "吃点苹果吧。谢谢你。", options: ["Thank", "Thanks", "Welcome", "Do"], correct: 0, explanation: "Thank you = Thanks.", tag: "交际" }
]

export const fillblankBankG3D5c = [
  { sentence: "___ (助动词) you like bananas?", answer: "Do", chinese: "你喜欢香蕉吗？", explanation: "Do，句首大写", tag: "助动词" },
  { sentence: "Yes, I ___ (助动词).", answer: "do", chinese: "是的，我喜欢。", explanation: "yes, I do", tag: "语法" },
  { sentence: "I ___ (不喜欢) like pears.", answer: "don't", chinese: "我不喜欢梨。", explanation: "don't", tag: "否定词" },
  { sentence: "Have some ___ (水果).", answer: "fruit", chinese: "吃点水果。", explanation: "fruit 水果", tag: "词汇" },
  { sentence: "___ (感谢) you.", answer: "Thank", chinese: "谢谢你。", explanation: "Thank you", tag: "交际" }
]

export const listenWordBankG3D5c = [
  { word: "fruit", options: ["foot", "food", "fruit", "friend"], correct: 2, zh: "水果" },
  { word: "apples", options: ["maples", "apples", "animals", "oranges"], correct: 1, zh: "苹果(复)" },
  { word: "pears", options: ["bears", "pears", "pairs", "tears"], correct: 1, zh: "梨(复)" },
  { word: "grapes", options: ["greats", "grapes", "grades", "greens"], correct: 1, zh: "葡萄(复)" },
  { word: "sweet", options: ["sweet", "sweat", "seat", "meat"], correct: 0, zh: "甜的" }
]

export const listenSentenceBankG3D5c = [
  { sentence: "Do you like apples?", zh: "你喜欢苹果吗？", options: ["Do you like pears?", "Do you like oranges?", "Do you like apples?", "Do you like grapes?"], correct: 2 },
  { sentence: "Yes, I do. They are sweet.", zh: "是的，我喜欢。它们很甜。", options: ["No, I don't.", "Yes, I do. They are sweet.", "Yes, it is sweet.", "No, it isn't."], correct: 1 },
  { sentence: "I don't like bananas.", zh: "我不喜欢香蕉。", options: ["I like bananas.", "I don't like bananas.", "I don't like apples.", "I don't like watermelons."], correct: 1 },
  { sentence: "Have some fruit.", zh: "吃点水果。", options: ["Have some apples.", "Have some grapes.", "Have some fruit.", "Eat some oranges."], correct: 2 },
  { sentence: "Thank you.", zh: "谢谢你。", options: ["Thank you.", "Here you are.", "You're welcome.", "Me too."], correct: 0 }
]

export const listenOrderBankG3D5c = [
  { sentence: "Do you like apples?", zh: "你喜欢苹果吗？", words: ["Do", "you", "like", "apples?"], answer: ["Do", "you", "like", "apples?"] },
  { sentence: "No, I don't.", zh: "不，我不喜欢。", words: ["No,", "I", "don't."], answer: ["No,", "I", "don't."] },
  { sentence: "I like pears.", zh: "我喜欢梨。", words: ["I", "like", "pears."], answer: ["I", "like", "pears."] },
  { sentence: "Let's have some fruit.", zh: "我们吃点水果吧。", words: ["Let's", "have", "some", "fruit."], answer: ["Let's", "have", "some", "fruit."] },
  { sentence: "Thank you.", zh: "谢谢。", words: ["Thank", "you."], answer: ["Thank", "you."] }
]

export const listenResponseBankG3D5c = [
  { question: "Do you like oranges?", zh: "你喜欢橙子吗？", options: ["No, I don't.", "Yes, it is.", "It is under the desk.", "He is tall."], correct: 0 },
  { question: "Have some fruit.", zh: "吃点水果吧。", options: ["Thank you.", "It's big.", "See you.", "Yes, she is."], correct: 0 },
  { question: "I like strawberries.", zh: "我喜欢草莓。", options: ["Me too.", "It is an apple.", "It has a long tail.", "Hello."], correct: 0 },
  { question: "Can I have some grapes?", zh: "我能吃些葡萄吗？", options: ["Here you are.", "It's a monkey.", "I'm ten.", "Goodbye."], correct: 0 },
  { question: "Thank you.", zh: "谢谢你。", options: ["You're welcome.", "No.", "Yes, I do.", "Here you are."], correct: 0 }
]

export const listenTranslateBankG3D5c = [
  { sentence: "Do you like apples?", options: ["你喜欢苹果吗？", "你要葡萄吗？", "你吃梨吗？", "它们是苹果吗？"], correct: 0 },
  { sentence: "No, I don't.", options: ["是的，我喜欢。", "是的，它是。", "不，我不喜欢。", "不，它不甜。"], correct: 2 },
  { sentence: "I like pears.", options: ["我不喜欢梨。", "我想要梨。", "我吃梨。", "我喜欢梨。"], correct: 3 },
  { sentence: "Let's have some fruit.", options: ["吃些苹果吧。", "吃些葡萄。", "我们吃些水果吧。", "去玩吧。"], correct: 2 },
  { sentence: "Thank you.", options: ["不用谢。", "没关系。", "给你。", "谢谢你。"], correct: 3 }
]
