// PEP五年级下册 Unit 5 Part B《Whose dog is it?》题库
// 主题：现在进行时动词ing形式 (climbing, eating, playing, jumping, drinking, sleeping) + Is he drinking water? He's eating.
// 7种题型，每种5题，共35题

export const quizBankG5D5b = [
  { question: "The dog is ___ now.", chinese: "这只狗正在睡觉。", options: ["sleeping", "sleep", "sleeps", "slept"], correct: 0, explanation: "is + 动词ing，构成现在进行时表正在进行的动作。", tag: "现在进行时" },
  { question: "___ he drinking water?", chinese: "他正在喝水吗？", options: ["Is", "Are", "Am", "Do"], correct: 0, explanation: "主语是he，进行时一般疑问句助动词是 Is。", tag: "系动词" },
  { question: "No, he ___.", chinese: "不，他没有。", options: ["isn't", "is", "aren't", "don't"], correct: 0, explanation: "Is he... 的否定回答是 No, he isn't.", tag: "语法" },
  { question: "The monkeys are ___.", chinese: "猴子们正在攀爬。", options: ["climbing", "climb", "climbs", "climbed"], correct: 0, explanation: "are + ing现在进行时。", tag: "现在进行时" },
  { question: "are they ___?", chinese: "他们正在吃东西吗？", options: ["eating", "eat", "eats", "ate"], correct: 0, explanation: "are + 主语 + doing 构成现在进行时的疑问句。", tag: "现在进行时" }
]

export const fillblankBankG5D5b = [
  { sentence: "The dog is ___ (睡觉).", answer: "sleeping", chinese: "狗正在睡觉。", explanation: "sleep 的 ing 形式 sleeping。", tag: "分词" },
  { sentence: "Is he ___ (喝) water?", answer: "drinking", chinese: "他正在喝水吗？", explanation: "drink 的 ing 形式 drinking。", tag: "分词" },
  { sentence: "The monkeys are ___ (跳跃).", answer: "jumping", chinese: "猴子们正在跳。", explanation: "jump 的 ing 形式 jumping。", tag: "分词" },
  { sentence: "They are ___ (玩耍) with each other.", answer: "playing", chinese: "他们正在互相玩耍。", explanation: "play 的 ing 形式 playing。", tag: "分词" },
  { sentence: "Look! Fido is ___ (吃).", answer: "eating", chinese: "看！Fido 正在吃东西。", explanation: "eat 的 ing 形式 eating。", tag: "分词" }
]

export const listenWordBankG5D5b = [
  { word: "sleeping", options: ["sleep", "sleeping", "sweeping", "sheep"], correct: 1, zh: "睡觉(ing)" },
  { word: "climbing", options: ["climb", "cleaning", "climbing", "coming"], correct: 2, zh: "攀爬(ing)" },
  { word: "eating", options: ["eat", "eating", "meeting", "reading"], correct: 1, zh: "吃(ing)" },
  { word: "drinking", options: ["drink", "drawing", "driving", "drinking"], correct: 3, zh: "喝(ing)" },
  { word: "jumping", options: ["jump", "jumping", "running", "jogging"], correct: 1, zh: "跳跃(ing)" }
]

export const listenSentenceBankG5D5b = [
  { sentence: "Is he drinking water?", zh: "他正在喝水吗？", options: ["Is he eating food?", "Is he drinking water?", "Are they drinking water?", "Is she drinking water?"], correct: 1 },
  { sentence: "No, he isn't.", zh: "不，他没有。", options: ["No, he isn't.", "No, she isn't.", "No, they aren't.", "Yes, he is."], correct: 0 },
  { sentence: "He is eating.", zh: "他正在吃东西。", options: ["He is eating.", "He is sleeping.", "He is climbing.", "He is playing."], correct: 0 },
  { sentence: "The monkeys are climbing.", zh: "猴子们正在爬树。", options: ["The monkeys are eating.", "The monkeys are jumping.", "The monkeys are sleeping.", "The monkeys are climbing."], correct: 3 },
  { sentence: "The dog is sleeping.", zh: "小狗正在睡觉。", options: ["The dog is jumping.", "The bag is sleeping.", "The dog is sleeping.", "The dog is eating."], correct: 2 }
]

export const listenOrderBankG5D5b = [
  { sentence: "Is he drinking water?", zh: "他正在喝水吗？", words: ["Is", "he", "drinking", "water?"], answer: ["Is", "he", "drinking", "water?"] },
  { sentence: "He is eating.", zh: "他正在吃。", words: ["He", "is", "eating."], answer: ["He", "is", "eating."] },
  { sentence: "They are playing.", zh: "他们正在玩耍。", words: ["They", "are", "playing."], answer: ["They", "are", "playing."] },
  { sentence: "The monkeys are climbing.", zh: "猴子们在爬。", words: ["The", "monkeys", "are", "climbing."], answer: ["The", "monkeys", "are", "climbing."] },
  { sentence: "The dog is sleeping.", zh: "狗正在睡觉。", words: ["The", "dog", "is", "sleeping."], answer: ["The", "dog", "is", "sleeping."] }
]

export const listenResponseBankG5D5b = [
  { question: "Is he drinking water?", zh: "他在喝水吗？", options: ["No, he's eating.", "He is ten.", "I like water.", "It's Monday."], correct: 0 },
  { question: "What are the monkeys doing?", zh: "猴子们正在干什么？", options: ["They are climbing.", "It's a monkey.", "Because they like bananas.", "Yes, they are."], correct: 0 },
  { question: "Are they sleeping?", zh: "他们正在睡觉吗？", options: ["No, they aren't. They are playing.", "I am twelve.", "Thank you.", "My book."], correct: 0 },
  { question: "Look at the dog.", zh: "看那只狗。", options: ["It's sleeping.", "It's his.", "I have a dog.", "Me too."], correct: 0 },
  { question: "Is she jumping?", zh: "她正在跳吗？", options: ["Yes, she is.", "No, he isn't.", "She is tall.", "Goodbye."], correct: 0 }
]

export const listenTranslateBankG5D5b = [
  { sentence: "Is he drinking water?", options: ["他喜欢喝水吗？", "他在吃东西吗？", "他正在喝水吗？", "谁在喝水？"], correct: 2 },
  { sentence: "No, he's eating.", options: ["是的，他在吃东西。", "不，他在吃东西。", "不，他在睡觉。", "不，他在玩。"], correct: 1 },
  { sentence: "The monkeys are climbing.", options: ["猴子们在跳。", "猴子们在吃香蕉。", "猴子们正在攀爬。", "有很多猴子。"], correct: 2 },
  { sentence: "They are playing.", options: ["他们赢了。", "他们在跳。", "他们在工作。", "他们正在玩耍。"], correct: 3 },
  { sentence: "The dog is sleeping.", options: ["我的狗睡了。", "那只猫在睡觉。", "小狗在吃东西。", "那只狗正在睡觉。"], correct: 3 }
]
