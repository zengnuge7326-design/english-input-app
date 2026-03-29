// PEP五年级上册 Unit 2 Part A《My week》题库
// 主题：星期1 (Monday, Tuesday, Wednesday, Thursday, Friday) + What do you have on Thursdays?
// 7种题型，每种5题，共35题

export const quizBankG5U2a = [
  { question: "What do you have ___ Thursdays?", chinese: "你星期四有什么课？", options: ["on", "in", "at", "to"], correct: 0, explanation: "在具体的星期几前面用介词 on。", tag: "介词" },
  { question: "___ do you have on Mondays?", chinese: "你星期一有什么课？", options: ["What", "Who", "Where", "How"], correct: 0, explanation: "询问有什么课用 What。", tag: "疑问词" },
  { question: "I ___ math, English and music.", chinese: "我有数学、英语和音乐课。", options: ["have", "has", "do", "like"], correct: 0, explanation: "表示有课程用动词 have。", tag: "动词" },
  { question: "We have PE on ___ and Wednesday.", chinese: "我们在星期一和星期三有体育课。", options: ["Monday", "Weekend", "day", "week"], correct: 0, explanation: "Monday 是星期一。", tag: "名词" },
  { question: "I like ___.", chinese: "我喜欢星期五。", options: ["Fridays", "Friday", "Friday's", "fridays"], correct: 0, explanation: "表示喜欢某个特定的星期，可以用复数Fridays，或者单数Friday。选项中Fridays最符合语境。", tag: "专有名词" }
]

export const fillblankBankG5U2a = [
  { sentence: "What do you have ___ (在...上) Thursdays?", answer: "on", chinese: "你星期四有什么课？", explanation: "on 接星期几。", tag: "介词" },
  { sentence: "I have English on ___ (星期一).", answer: "Monday", chinese: "我在星期一有英语课。", explanation: "Monday", tag: "星期" },
  { sentence: "We have art on ___ (星期二).", answer: "Tuesday", chinese: "我们在星期二有美术课。", explanation: "Tuesday", tag: "星期" },
  { sentence: "I like ___ (周三, 填复数表泛指类).", answer: "Wednesdays", chinese: "我喜欢周三。", explanation: "Wednesdays", tag: "星期" },
  { sentence: "We have PE on ___ (星期五).", answer: "Friday", chinese: "我们在周五有体育课。", explanation: "Friday", tag: "星期" }
]

export const listenWordBankG5U2a = [
  { word: "Monday", options: ["Sunday", "Monday", "money", "model"], correct: 1, zh: "星期一" },
  { word: "Tuesday", options: ["Thursday", "Tuesday", "Today", "Toady"], correct: 1, zh: "星期二" },
  { word: "Wednesday", options: ["weekend", "Wednesday", "weather", "when"], correct: 1, zh: "星期三" },
  { word: "Thursday", options: ["Tuesday", "Thursday", "thirty", "thirsty"], correct: 1, zh: "星期四" },
  { word: "Friday", options: ["fly", "fried", "Friday", "free"], correct: 2, zh: "星期五" }
]

export const listenSentenceBankG5U2a = [
  { sentence: "What do you have on Thursdays?", zh: "你星期四有什么课？", options: ["What do you have on Tuesdays?", "What do you have on Thursdays?", "What do you have on Mondays?", "What do you have on Fridays?"], correct: 1 },
  { sentence: "I have math, English and music.", zh: "我有数学，英语和音乐。", options: ["I have art and PE.", "I have math, English and music.", "I have Chinese and math.", "I have science and art."], correct: 1 },
  { sentence: "We have PE on Monday.", zh: "我们在星期一有体育课。", options: ["We have art on Monday.", "We have English on Friday.", "We have PE on Monday.", "We have math on Tuesday."], correct: 2 },
  { sentence: "Is it Wednesday?", zh: "今天是星期三吗？", options: ["Is it Monday?", "Is it Tuesday?", "Is it Wednesday?", "Is it Thursday?"], correct: 2 },
  { sentence: "No, it's Thursday.", zh: "不，今天是星期四。", options: ["No, it's Tuesday.", "No, it's Thursday.", "No, it's Wednesday.", "Yes, it is."], correct: 1 }
]

export const listenOrderBankG5U2a = [
  { sentence: "What do you have on Thursdays?", zh: "你星期四有什么课？", words: ["What", "do", "you", "have", "on", "Thursdays?"], answer: ["What", "do", "you", "have", "on", "Thursdays?"] },
  { sentence: "I have English and math.", zh: "我有很多和数学。", words: ["I", "have", "English", "and", "math."], answer: ["I", "have", "English", "and", "math."] },
  { sentence: "We have PE on Mondays.", zh: "我们在星期一有体育课。", words: ["We", "have", "PE", "on", "Mondays."], answer: ["We", "have", "PE", "on", "Mondays."] },
  { sentence: "Is it Tuesday?", zh: "今天是星期二吗？", words: ["Is", "it", "Tuesday?"], answer: ["Is", "it", "Tuesday?"] },
  { sentence: "I like Fridays.", zh: "我喜欢星期五。", words: ["I", "like", "Fridays."], answer: ["I", "like", "Fridays."] }
]

export const listenResponseBankG5U2a = [
  { question: "What do you have on Mondays?", zh: "你星期一有什么课？", options: ["I have English and math.", "Yes, I do.", "On Tuesday.", "I like apples."], correct: 0 },
  { question: "Is it Wednesday today?", zh: "今天是周三吗？", options: ["Yes, it is.", "I have PE.", "It is a book.", "Me too."], correct: 0 },
  { question: "Do you like Fridays?", zh: "你喜欢周五吗？", options: ["Yes, I do.", "I have art.", "It's Friday.", "Thanks."], correct: 0 },
  { question: "What do you have on Tuesdays?", zh: "周二你有什么课？", options: ["We have science.", "He is strict.", "She is kind.", "Yes, we do."], correct: 0 },
  { question: "I like music.", zh: "我喜欢音乐。", options: ["Me too.", "It is on Monday.", "Yes, he is.", "Bye."], correct: 0 }
]

export const listenTranslateBankG5U2a = [
  { sentence: "What do you have on Thursdays?", options: ["你星期三有什么课？", "你星期四有什么课？", "你星期二有什么课？", "你今天有什么课？"], correct: 1 },
  { sentence: "I have math, English and music.", options: ["我有数学、英语和音乐。", "我有美术、音乐和体育。", "我有语文和数学。", "我有科学和英语。"], correct: 0 },
  { sentence: "We have PE on Mondays.", options: ["我们星期一有体育课。", "我们星期二有体育课。", "我们星期五有美术课。", "我们星期一有音乐课。"], correct: 0 },
  { sentence: "Is it Wednesday?", options: ["今天是周一吗？", "今天是周二吗？", "今天是周三吗？", "今天是周四吗？"], correct: 2 },
  { sentence: "I like Fridays.", options: ["我喜欢周末。", "我喜欢星期四。", "我喜欢星期六。", "我喜欢星期五。"], correct: 3 }
]
