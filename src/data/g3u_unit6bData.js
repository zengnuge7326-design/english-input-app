// PEP三年级上册 Unit 6 Part B《Let's learn / Let's talk》题库
// 主题：数字 (six, seven, eight, nine, ten) + How old are you? I'm... Happy birthday!
// 7种题型，每种5题，共35题

export const quizBankG3U6b = [
  { question: "How ___ are you?", chinese: "你几岁了？", options: ["old", "many", "much", "do"], correct: 0, explanation: "How old are you? 是询问年龄的固定说法的句型。", tag: "疑问词" },
  { question: "I'm six ___ old.", chinese: "我六岁了。", options: ["year", "years", "time", "day"], correct: 1, explanation: "超过一岁用 years old。", tag: "词汇" },
  { question: "Happy ___!", chinese: "生日快乐！", options: ["birthday", "morning", "afternoon", "day"], correct: 0, explanation: "Happy birthday是祝人生日快乐的用语。", tag: "交际" },
  { question: "Show me ___.", chinese: "给我比划出八。", options: ["six", "ten", "eight", "seven"], correct: 2, explanation: "eight (八)。", tag: "词汇" },
  { question: "I'm ___ years old.", chinese: "我九岁了。", options: ["nine", "line", "fine", "mine"], correct: 0, explanation: "数字 nine 表示九。", tag: "拼写" }
]

export const fillblankBankG3U6b = [
  { sentence: "How ___ (老的) are you?", answer: "old", chinese: "你多大了？", explanation: "old 老的，岁数。", tag: "疑问句" },
  { sentence: "I'm ___ (七) years old.", answer: "seven", chinese: "我七岁了。", explanation: "seven 七", tag: "数词" },
  { sentence: "Happy ___ (生日)!", answer: "birthday", chinese: "生日快乐！", explanation: "birthday 生日。", tag: "词汇" },
  { sentence: "I'm ___ (六) years old.", answer: "six", chinese: "我六岁了。", explanation: "six 六", tag: "数词" },
  { sentence: "Show me ___ (十).", answer: "ten", chinese: "给我展示十。", explanation: "ten 十", tag: "数词" }
]

export const listenWordBankG3U6b = [
  { word: "six", options: ["sex", "six", "fix", "mix"], correct: 1, zh: "六" },
  { word: "seven", options: ["seven", "eleven", "heaven", "seventh"], correct: 0, zh: "七" },
  { word: "eight", options: ["eat", "eight", "late", "ate"], correct: 1, zh: "八" },
  { word: "nine", options: ["mine", "line", "fine", "nine"], correct: 3, zh: "九" },
  { word: "ten", options: ["tin", "ten", "pen", "men"], correct: 1, zh: "十" }
]

export const listenSentenceBankG3U6b = [
  { sentence: "How old are you?", zh: "你多大了？", options: ["How are you?", "How old are you?", "Who are you?", "Where are you?"], correct: 1 },
  { sentence: "I'm six years old.", zh: "我六岁了。", options: ["I'm seven years old.", "I'm eight years old.", "I'm six years old.", "I'm ten years old."], correct: 2 },
  { sentence: "Happy birthday!", zh: "生日快乐！", options: ["Happy New Year!", "Happy everyday!", "Happy birthday!", "Goodbye!"], correct: 2 },
  { sentence: "Show me nine.", zh: "给我看看九。", options: ["Show me ten.", "Show me eight.", "Show me seven.", "Show me nine."], correct: 3 },
  { sentence: "Brother.", zh: "哥哥/弟弟。", options: ["Mother.", "Father.", "Sister.", "Brother."], correct: 3 }
]

export const listenOrderBankG3U6b = [
  { sentence: "How old are you?", zh: "你几岁了？", words: ["How", "old", "are", "you?"], answer: ["How", "old", "are", "you?"] },
  { sentence: "I am seven years old.", zh: "我七岁了。", words: ["I", "am", "seven", "years", "old."], answer: ["I", "am", "seven", "years", "old."] },
  { sentence: "Happy birthday!", zh: "生日快乐！", words: ["Happy", "birthday!"], answer: ["Happy", "birthday!"] },
  { sentence: "Show me ten.", zh: "比划一下十。", words: ["Show", "me", "ten."], answer: ["Show", "me", "ten."] },
  { sentence: "This is for you.", zh: "这是给你的。", words: ["This", "is", "for", "you."], answer: ["This", "is", "for", "you."] }
]

export const listenResponseBankG3U6b = [
  { question: "How old are you?", zh: "你多大了？", options: ["I'm six years old.", "I'm fine.", "Me too.", "It's red."], correct: 0 },
  { question: "Happy birthday!", zh: "生日快乐！", options: ["Happy birthday!", "Thank you.", "Hello.", "See you."], correct: 1 },
  { question: "This is for you.", zh: "这是给你的。", options: ["Thank you.", "How old are you?", "OK.", "Bye."], correct: 0 },
  { question: "Show me eight.", zh: "给我比划八。", options: ["OK.", "Hello.", "It's a monkey.", "Ten."], correct: 0 },
  { question: "Eat some cake.", zh: "吃点蛋糕。", options: ["Thank you.", "I am Mike.", "It's a duck.", "Seven."], correct: 0 }
]

export const listenTranslateBankG3U6b = [
  { sentence: "How old are you?", options: ["你好吗？", "你多高？", "你长大了吗？", "你多大了？"], correct: 3 },
  { sentence: "I'm six years old.", options: ["我五岁了。", "我七岁了。", "我六岁了。", "我八岁了。"], correct: 2 },
  { sentence: "Happy birthday!", options: ["新年快乐！", "早上好！", "天天开心！", "生日快乐！"], correct: 3 },
  { sentence: "Show me ten.", options: ["给我看九。", "给我看十。", "给我看看。", "多少个？"], correct: 1 },
  { sentence: "This is for you.", options: ["这是为你准备的。", "这是你。", "这是谁的？", "那是他给我的。"], correct: 0 }
]
