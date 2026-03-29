// PEP三年级上册 Unit 6 Part C《Story time / Let's check》题库
// 主题：Unit 6 综合复习 (所有数字与生日表达)
// 7种题型，每种5题，共35题

export const quizBankG3U6c = [
  { question: "How ___ plates?", chinese: "多少个盘子？", options: ["many", "much", "old", "are"], correct: 0, explanation: "询问可数名词数量用 How many。", tag: "疑问词" },
  { question: "___ old are you?", chinese: "你多大了？", options: ["How", "What", "Who", "Where"], correct: 0, explanation: "How old are you 是固定句型。", tag: "疑问词" },
  { question: "I'm ___ years old.", chinese: "我八岁了。", options: ["eight", "age", "eat", "ate"], correct: 0, explanation: "eight 八。", tag: "数字" },
  { question: "___ is for you.", chinese: "这是给你的。", options: ["This", "These", "He", "They"], correct: 0, explanation: "This is for you. 是送礼物时的常用语。", tag: "代词" },
  { question: "___ birthday!", chinese: "生日快乐！", options: ["Happy", "Good", "Nice", "Hello"], correct: 0, explanation: "Happy birthday，生日快乐。", tag: "交际" }
]

export const fillblankBankG3U6c = [
  { sentence: "How ___ (多少) gifts?", answer: "many", chinese: "有多少个礼物？", explanation: "How many 多少个。", tag: "疑问句" },
  { sentence: "How ___ (几岁的) are you?", answer: "old", chinese: "你几岁了？", explanation: "old 岁的", tag: "疑问句" },
  { sentence: "___ (这) is for you.", answer: "This", chinese: "这是给你的。", explanation: "This 这个。", tag: "代词" },
  { sentence: "I'm ___ (九) years old.", answer: "nine", chinese: "我九岁了。", explanation: "nine 九。", tag: "数词" },
  { sentence: "Happy ___ (生日)!", answer: "birthday", chinese: "生日快乐！", explanation: "birthday", tag: "祝贺" }
]

export const listenWordBankG3U6c = [
  { word: "plate", options: ["play", "plate", "place", "plant"], correct: 1, zh: "盘子" },
  { word: "birthday", options: ["bird", "birthday", "thursday", "boy"], correct: 1, zh: "生日" },
  { word: "years", options: ["ears", "yes", "years", "yellow"], correct: 2, zh: "年份/岁数" },
  { word: "happy", options: ["hello", "hi", "happy", "heavy"], correct: 2, zh: "快乐的" },
  { word: "ten", options: ["pen", "ten", "men", "hen"], correct: 1, zh: "十" }
]

export const listenSentenceBankG3U6c = [
  { sentence: "How old are you?", zh: "你多大了？", options: ["How old are you?", "How are you?", "Where are you?", "Who are you?"], correct: 0 },
  { sentence: "I am ten years old.", zh: "我十岁了。", options: ["I am ten years old.", "I am nine years old.", "I am six years old.", "I am seven years old."], correct: 0 },
  { sentence: "How many plates?", zh: "几个盘子？", options: ["How many bags?", "How many books?", "How many plates?", "How many apples?"], correct: 2 },
  { sentence: "Happy birthday!", zh: "生日快乐！", options: ["Happy birthday!", "Goodbye!", "Hello!", "Good morning!"], correct: 0 },
  { sentence: "This is for you.", zh: "这是给你的。", options: ["That is for me.", "This is for you.", "It is for him.", "Here you are."], correct: 1 }
]

export const listenOrderBankG3U6c = [
  { sentence: "How many plates?", zh: "多少个盘子？", words: ["How", "many", "plates?"], answer: ["How", "many", "plates?"] },
  { sentence: "How old are you?", zh: "你几岁了？", words: ["How", "old", "are", "you?"], answer: ["How", "old", "are", "you?"] },
  { sentence: "I am ten.", zh: "我十岁了。", words: ["I", "am", "ten."], answer: ["I", "am", "ten."] },
  { sentence: "Happy birthday to you.", zh: "祝你生日快乐。", words: ["Happy", "birthday", "to", "you."], answer: ["Happy", "birthday", "to", "you."] },
  { sentence: "This is for you.", zh: "这是给你的。", words: ["This", "is", "for", "you."], answer: ["This", "is", "for", "you."] }
]

export const listenResponseBankG3U6c = [
  { question: "How old are you?", zh: "你多大了？", options: ["I am seven.", "I am fine.", "Thank you.", "It is a duck."], correct: 0 },
  { question: "How many plates?", zh: "几个盘子？", options: ["Eight.", "I see red.", "This is my dog.", "Yes, it is."], correct: 0 },
  { question: "Happy birthday!", zh: "生日快乐！", options: ["Thank you.", "Happy birthday!", "Good morning.", "OK."], correct: 0 },
  { question: "This is for you.", zh: "这是给你的。", options: ["Thank you.", "Yes.", "No.", "Me too."], correct: 0 },
  { question: "Let's eat the cake.", zh: "我们吃蛋糕吧。", options: ["Great!", "Ten.", "Bye.", "Hello."], correct: 0 }
]

export const listenTranslateBankG3U6c = [
  { sentence: "How old are you?", options: ["你好吗？", "你多大了？", "你在哪？", "你要几个？"], correct: 1 },
  { sentence: "I'm ten years old.", options: ["我八岁了。", "我九岁了。", "我十岁了。", "我有十个。"], correct: 2 },
  { sentence: "How many plates?", options: ["要几本书？", "多少个盘子？", "有多少苹果？", "有几支笔？"], correct: 1 },
  { sentence: "This is for you.", options: ["这是给你的。", "那是给我的。", "那是谁的？", "在这儿。"], correct: 0 },
  { sentence: "Happy birthday!", options: ["圣诞快乐！", "你好！", "生日快乐！", "万圣节快乐！"], correct: 2 }
]
