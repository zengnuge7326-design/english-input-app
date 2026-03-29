// PEP三年级下册 Unit 5 Part B《Let's learn / Let's talk》题库
// 主题：水果2 (watermelon, strawberry, grape) + Have some grapes.
// 7种题型，每种5题，共35题

export const quizBankG3D5b = [
  { question: "___ some grapes.", chinese: "吃些葡萄吧。", options: ["Have", "Has", "Does", "Do"], correct: 0, explanation: "表建议、祈使的“吃些…”，用原形动词 Have。", tag: "动词" },
  { question: "I don't like ___.", chinese: "我不喜欢西瓜。", options: ["watermelons", "watermelon", "a watermelon", "an watermelon"], correct: 0, explanation: "表示一类事物用可数名词复数形式 watermelons。", tag: "单复数" },
  { question: "Can I have some bananas? Here you ___.", chinese: "我能吃些香蕉吗？给你。", options: ["are", "is", "am", "do"], correct: 0, explanation: "Here you are. 给你。", tag: "交际" },
  { question: "Me, ___.", chinese: "我也一样。", options: ["too", "to", "two", "do"], correct: 0, explanation: "Me too 表示我也一样。", tag: "口语" },
  { question: "I like ___.", chinese: "我喜欢草莓。", options: ["strawberries", "strawberry", "a strawberry", "strawberrys"], correct: 0, explanation: "草莓的复数是 strawberries (辅音加y结尾变i加es)。", tag: "拼写" }
]

export const fillblankBankG3D5b = [
  { sentence: "___ (吃) some grapes.", answer: "Have", chinese: "吃些葡萄吧。", explanation: "Have，注意句首大写。", tag: "动词" },
  { sentence: "Here you ___ (是).", answer: "are", chinese: "给你。", explanation: "Here you are.", tag: "交际" },
  { sentence: "I don't like ___ (西瓜).", answer: "watermelons", chinese: "我不喜欢西瓜。", explanation: "watermelons 填复数", tag: "词汇" },
  { sentence: "I like ___ (草莓).", answer: "strawberries", chinese: "我喜欢草莓。", explanation: "strawberries 草莓复数", tag: "词汇" },
  { sentence: "Me, ___ (也).", answer: "too", chinese: "我也一样。", explanation: "too 也", tag: "副词" }
]

export const listenWordBankG3D5b = [
  { word: "watermelon", options: ["water", "watermelon", "welcome", "woman"], correct: 1, zh: "西瓜" },
  { word: "strawberry", options: ["story", "strawberry", "student", "strong"], correct: 1, zh: "草莓" },
  { word: "grape", options: ["great", "grade", "grape", "green"], correct: 2, zh: "葡萄" },
  { word: "have", options: ["has", "have", "had", "hat"], correct: 1, zh: "吃/有" },
  { word: "fruit", options: ["foot", "food", "fruit", "friend"], correct: 2, zh: "水果" }
]

export const listenSentenceBankG3D5b = [
  { sentence: "Have some grapes.", zh: "吃些葡萄吧。", options: ["Have some apples.", "Have some grapes.", "Have some watermelons.", "Have some strawberries."], correct: 1 },
  { sentence: "I don't like watermelons.", zh: "我不喜欢西瓜。", options: ["I like watermelons.", "I don't like apples.", "I don't like grapes.", "I don't like watermelons."], correct: 3 },
  { sentence: "Me, too.", zh: "我也一样。", options: ["Me, too.", "Thank you.", "Yes, I do.", "Here you are."], correct: 0 },
  { sentence: "Can I have some strawberries?", zh: "我能吃些草莓吗？", options: ["Can I have some grapes?", "Can I have some bananas?", "Can I have some strawberries?", "Do you like strawberries?"], correct: 2 },
  { sentence: "Here you are.", zh: "给你。", options: ["Here I am.", "Here it is.", "Here you are.", "Thank you."], correct: 2 }
]

export const listenOrderBankG3D5b = [
  { sentence: "Have some grapes.", zh: "吃点葡萄。", words: ["Have", "some", "grapes."], answer: ["Have", "some", "grapes."] },
  { sentence: "I like strawberries.", zh: "我喜欢草莓。", words: ["I", "like", "strawberries."], answer: ["I", "like", "strawberries."] },
  { sentence: "I don't like watermelons.", zh: "我不喜欢西瓜。", words: ["I", "don't", "like", "watermelons."], answer: ["I", "don't", "like", "watermelons."] },
  { sentence: "Can I have some bananas?", zh: "我能吃些香蕉吗？", words: ["Can", "I", "have", "some", "bananas?"], answer: ["Can", "I", "have", "some", "bananas?"] },
  { sentence: "Here you are.", zh: "给你。", words: ["Here", "you", "are."], answer: ["Here", "you", "are."] }
]

export const listenResponseBankG3D5b = [
  { question: "Have some grapes.", zh: "吃点葡萄吧。", options: ["Thank you.", "It's red.", "He is ten.", "Goodbye."], correct: 0 },
  { question: "Can I have some strawberries?", zh: "我能吃点草莓吗？", options: ["Here you are.", "Me too.", "No, she isn't.", "I am fine."], correct: 0 },
  { question: "I don't like watermelons.", zh: "我不喜欢西瓜。", options: ["Me, neither.", "It's on the desk.", "Welcome.", "See you."], correct: 0 },
  { question: "Do you like grapes?", zh: "你喜欢葡萄吗？", options: ["Yes, I do.", "Here you are.", "Thank you.", "I am five."], correct: 0 },
  { question: "I like apples.", zh: "我喜欢苹果。", options: ["Me, too.", "I'm a boy.", "It's a cat.", "Bye."], correct: 0 }
]

export const listenTranslateBankG3D5b = [
  { sentence: "Have some grapes.", options: ["吃些草莓。反弹", "吃些苹果吧。", "吃些西瓜吧。", "吃些葡萄吧。"], correct: 3 },
  { sentence: "Can I have some strawberries?", options: ["你喜欢草莓吗？", "给你些草莓。", "我能吃些草莓吗？", "这些是草莓吗？"], correct: 2 },
  { sentence: "I don't like watermelons.", options: ["我不喜欢吃水果。", "我不喜欢葡萄。", "我不喜欢草莓。", "我不喜欢西瓜。"], correct: 3 },
  { sentence: "Here you are.", options: ["不客气。", "给你。", "你在那里。", "谢谢。"], correct: 1 },
  { sentence: "Me, too.", options: ["我也是。", "谢谢你。", "再见。", "吃吧。"], correct: 0 }
]
