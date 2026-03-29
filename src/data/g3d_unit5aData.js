// PEP三年级下册 Unit 5 Part A《Do you like pears?》题库
// 主题：水果1 (pear, apple, orange, banana) + Do you like pears? Yes, I do. / No, I don't.
// 7种题型，每种5题，共35题

export const quizBankG3D5a = [
  { question: "___ you like pears?", chinese: "你喜欢梨吗？", options: ["Do", "Are", "Is", "Does"], correct: 0, explanation: "主语是 you，助动词用 Do 提问。", tag: "助动词" },
  { question: "Yes, I ___.", chinese: "是的，我喜欢。", options: ["do", "don't", "am", "are"], correct: 0, explanation: "Do you like...? 的肯定回答是 Yes, I do.", tag: "交际回答" },
  { question: "No, I ___.", chinese: "不，我不喜欢。", options: ["don't", "do", "isn't", "am not"], correct: 0, explanation: "Do you...的否定回答是 No, I don't.", tag: "交际回答" },
  { question: "I like ___.", chinese: "我喜欢苹果。", options: ["apples", "apple", "a apples", "an apples"], correct: 0, explanation: "表示喜欢某一类事物，可数名词通常用复数形式 apples。", tag: "单复数" },
  { question: "Let's have some ___.", chinese: "我们吃些香蕉吧。", options: ["bananas", "banana", "a banana", "an banana"], correct: 0, explanation: "some 后接可数名词复数。", tag: "单复数" }
]

export const fillblankBankG3D5a = [
  { sentence: "___ (助动词) you like pears?", answer: "Do", chinese: "你喜欢梨吗？", explanation: "Do，注意首字母大写。", tag: "助动词" },
  { sentence: "Yes, I ___ (助动词).", answer: "do", chinese: "是的，我喜欢。", explanation: "Yes, I do.", tag: "交际回答" },
  { sentence: "No, I ___ (不喜欢).", answer: "don't", chinese: "不，我不喜欢。", explanation: "don't = do not", tag: "交际回答" },
  { sentence: "I like ___ (苹果, 填复数).", answer: "apples", chinese: "我喜欢苹果。", explanation: "apples 苹果复数", tag: "复数" },
  { sentence: "Let's have some ___ (香蕉, 填复数).", answer: "bananas", chinese: "让我们吃些香蕉吧。", explanation: "bananas 香蕉复数", tag: "复数" }
]

export const listenWordBankG3D5a = [
  { word: "pear", options: ["bear", "pear", "pair", "tear"], correct: 1, zh: "梨" },
  { word: "apple", options: ["maple", "apple", "animal", "ankle"], correct: 1, zh: "苹果" },
  { word: "orange", options: ["orange", "arrange", "origan", "oven"], correct: 0, zh: "橙子" },
  { word: "banana", options: ["panda", "banana", "band", "banner"], correct: 1, zh: "香蕉" },
  { word: "like", options: ["lake", "look", "like", "bike"], correct: 2, zh: "喜欢" }
]

export const listenSentenceBankG3D5a = [
  { sentence: "Do you like pears?", zh: "你喜欢梨吗？", options: ["Do you like apples?", "Do you like pears?", "Do you like bananas?", "Do you like oranges?"], correct: 1 },
  { sentence: "Yes, I do.", zh: "是的，我喜欢。", options: ["No, I don't.", "Yes, I am.", "Yes, I do.", "Yes, he does."], correct: 2 },
  { sentence: "No, I don't.", zh: "不，我不喜欢。", options: ["No, I'm not.", "No, she isn't.", "Yes, I do.", "No, I don't."], correct: 3 },
  { sentence: "I like apples.", zh: "我喜欢苹果。", options: ["I like oranges.", "I like apples.", "I like pears.", "I like bananas."], correct: 1 },
  { sentence: "Let's have some bananas.", zh: "我们吃些香蕉吧。", options: ["Have some apples.", "Let's have some oranges.", "Let's have some bananas.", "Eat some pears."], correct: 2 }
]

export const listenOrderBankG3D5a = [
  { sentence: "Do you like pears?", zh: "你喜欢梨吗？", words: ["Do", "you", "like", "pears?"], answer: ["Do", "you", "like", "pears?"] },
  { sentence: "Yes, I do.", zh: "是的，我喜欢。", words: ["Yes,", "I", "do."], answer: ["Yes,", "I", "do."] },
  { sentence: "No, I don't.", zh: "不，我不喜欢。", words: ["No,", "I", "don't."], answer: ["No,", "I", "don't."] },
  { sentence: "I like apples.", zh: "我喜欢苹果。", words: ["I", "like", "apples."], answer: ["I", "like", "apples."] },
  { sentence: "Let's have some bananas.", zh: "咱们吃些水果吧。", words: ["Let's", "have", "some", "bananas."], answer: ["Let's", "have", "some", "bananas."] }
]

export const listenResponseBankG3D5a = [
  { question: "Do you like pears?", zh: "你喜欢梨吗？", options: ["Yes, I do.", "He is my father.", "I am ten.", "It's on the desk."], correct: 0 },
  { question: "Do you like apples?", zh: "你喜欢苹果吗？", options: ["No, I don't.", "Yes, she is.", "It's big.", "Thank you."], correct: 0 },
  { question: "Have some oranges.", zh: "吃些橙子吧。", options: ["Thank you.", "No, I don't.", "Hello.", "Bye."], correct: 0 },
  { question: "Let's buy some fruit.", zh: "我们买点水果吧。", options: ["OK.", "Yes, I do.", "I'm fine.", "It's a cat.", "OK."], correct: 0 },
  { question: "I like bananas.", zh: "我喜欢香蕉。", options: ["Me too.", "It's under the chair.", "You're welcome.", "No, I don't."], correct: 0 }
]

export const listenTranslateBankG3D5a = [
  { sentence: "Do you like pears?", options: ["你喜欢苹果吗？", "你想要梨吗？", "你喜欢梨吗？", "你吃梨吗？"], correct: 2 },
  { sentence: "Yes, I do.", options: ["是的，它在。", "是的，我喜欢。", "不，我不喜欢。", "是的，我是。"], correct: 1 },
  { sentence: "No, I don't.", options: ["不，她不是。", "是的，我是。", "不，它不在这里。", "不，我不喜欢。"], correct: 3 },
  { sentence: "I like apples.", options: ["我想要一个苹果。", "我吃苹果。", "这是苹果。", "我喜欢苹果。"], correct: 3 },
  { sentence: "Let's have some bananas.", options: ["吃些橙子吧。", "你要香蕉吗？", "我们吃些香蕉吧。", "这里有香蕉。"], correct: 2 }
]
