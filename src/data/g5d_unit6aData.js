// PEP五年级下册 Unit 6 Part A《Work quietly!》题库
// 主题：进行时短语 (doing morning exercises, having... class, eating lunch, reading a book, listening to music) + What are they doing? They're eating lunch.
// 7种题型，每种5题，共35题

export const quizBankG5D6a = [
  { question: "___ are they doing?", chinese: "他们正在干什么？", options: ["What", "Where", "Who", "When"], correct: 0, explanation: "对动作提问用 What。", tag: "疑问词" },
  { question: "They ___ eating lunch.", chinese: "他们正在吃午饭。", options: ["are", "is", "am", "do"], correct: 0, explanation: "主语汇 They，系动词用 are。", tag: "系动词" },
  { question: "I am ___ a book.", chinese: "我正在看一本大。", options: ["reading", "looking", "watching", "seeing"], correct: 0, explanation: "读书用 read a book。此处需要ing形式。", tag: "词语辨析" },
  { question: "We are listening ___ music.", chinese: "我们正在听音乐。", options: ["to", "for", "with", "at"], correct: 0, explanation: "听音乐 listen to music。", tag: "介词搭配" },
  { question: "They are ___ morning exercises.", chinese: "他们正在做早操。", options: ["doing", "making", "having", "taking"], correct: 0, explanation: "做早操 do morning exercises。进行时加 ing。", tag: "动词搭配" }
]

export const fillblankBankG5D6a = [
  { sentence: "___ (什么) are they doing?", answer: "What", chinese: "他们正在干什么？", explanation: "What", tag: "疑问词" },
  { sentence: "They are ___ (吃) lunch.", answer: "eating", chinese: "他们正在吃午饭。", explanation: "eating", tag: "动词" },
  { sentence: "She is listening to ___ (音乐).", answer: "music", chinese: "她正在听音乐。", explanation: "music", tag: "名词" },
  { sentence: "I am ___ (看) a book.", answer: "reading", chinese: "我正在看一本书。", explanation: "read 的 ing 形式 reading。", tag: "动词" },
  { sentence: "They are ___ (做) morning exercises.", answer: "doing", chinese: "他们正在做早操。", explanation: "do 的 ing 形式 doing。", tag: "动词" }
]

export const listenWordBankG5D6a = [
  { word: "doing", options: ["doing", "going", "drawing", "driving"], correct: 0, zh: "做(ing)" },
  { word: "having", options: ["making", "having", "helping", "hearing"], correct: 1, zh: "有/吃(ing)" },
  { word: "eating", options: ["meeting", "reading", "eating", "beating"], correct: 2, zh: "吃(ing)" },
  { word: "reading", options: ["riding", "reading", "running", "writing"], correct: 1, zh: "读/看书(ing)" },
  { word: "listening", options: ["lesson", "listening", "light", "little"], correct: 1, zh: "听(ing)" }
]

export const listenSentenceBankG5D6a = [
  { sentence: "What are they doing?", zh: "他们正在干嘛？", options: ["What is he doing?", "Where are they doing?", "What are they doing?", "What are you doing?"], correct: 2 },
  { sentence: "They are eating lunch.", zh: "他们正在吃午饭。", options: ["They are eating dinner.", "They are eating lunch.", "We are eating lunch.", "She is eating lunch."], correct: 1 },
  { sentence: "I am reading a book.", zh: "我正在看一本书。", options: ["I am reading a book.", "I am writing a book.", "She is reading a book.", "I am drawing a picture."], correct: 0 },
  { sentence: "He is listening to music.", zh: "他正在听音乐。", options: ["He is listening to music.", "She is listening to music.", "I am listening to music.", "He is singing a song."], correct: 0 },
  { sentence: "They are doing morning exercises.", zh: "他们正在做早操。", options: ["They are playing sports.", "We are doing morning exercises.", "They are doing morning exercises.", "They are doing homework."], correct: 2 }
]

export const listenOrderBankG5D6a = [
  { sentence: "What are they doing?", zh: "他们正在干什么？", words: ["What", "are", "they", "doing?"], answer: ["What", "are", "they", "doing?"] },
  { sentence: "They are eating lunch.", zh: "他们正在吃午饭。", words: ["They", "are", "eating", "lunch."], answer: ["They", "are", "eating", "lunch."] },
  { sentence: "I am reading a book.", zh: "我正在看书。", words: ["I", "am", "reading", "a", "book."], answer: ["I", "am", "reading", "a", "book."] },
  { sentence: "She is listening to music.", zh: "她正在听音乐。", words: ["She", "is", "listening", "to", "music."], answer: ["She", "is", "listening", "to", "music."] },
  { sentence: "He is having class.", zh: "他正在上课。", words: ["He", "is", "having", "class."], answer: ["He", "is", "having", "class."] }
]

export const listenResponseBankG5D6a = [
  { question: "What are they doing?", zh: "他们正在干什么？", options: ["They are eating lunch.", "It's my dog.", "Because I am hungry.", "Yes, they are."], correct: 0 },
  { question: "Are they reading books?", zh: "他们正在看书吗？", options: ["Yes, they are.", "No, she isn't.", "In the room.", "Thank you."], correct: 0 },
  { question: "Is he listening to music?", zh: "他正在听音乐吗？", options: ["Yes, he is.", "They are playing.", "At 8:00.", "I like music."], correct: 0 },
  { question: "Who is doing morning exercises?", zh: "谁正在做早操？", options: ["Chen Jie is.", "They are running.", "Yes, I am.", "In the playground."], correct: 0 },
  { question: "Are you having an English class?", zh: "你们正在上英语课吗？", options: ["No, we aren't.", "They are.", "I am twelve.", "Nice to meet you."], correct: 0 }
]

export const listenTranslateBankG5D6a = [
  { sentence: "What are they doing?", options: ["他在干什么？", "他们去了哪里？", "他们正在干什么？", "这是什么？"], correct: 2 },
  { sentence: "They are eating lunch.", options: ["他正在吃晚饭。", "他们正在吃早饭。", "他们正在吃午饭。", "我们在吃午饭。"], correct: 2 },
  { sentence: "I am reading a book.", options: ["我正在画画。", "我正在读书。", "他们在看书。", "她正在读报。"], correct: 1 },
  { sentence: "She is listening to music.", options: ["他正在听老师讲课。", "他们正在听音乐。", "她正在放音乐。", "她正在听音乐。"], correct: 3 },
  { sentence: "He is doing morning exercises.", options: ["他们正在做作业。", "她正在做运动。", "他正在做早操。", "他经常做早操。"], correct: 2 }
]
