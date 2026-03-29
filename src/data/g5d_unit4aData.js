// PEP五年级下册 Unit 4 Part A《When is the art show?》题库
// 主题：序数词(1st - 5th) (first, second, third, fourth, fifth) + When is the art show? It's on May 1st.
// 7种题型，每种5题，共35题

export const quizBankG5D4a = [
  { question: "___ is the art show?", chinese: "艺术展在什么时候？", options: ["When", "What", "Where", "Who"], correct: 0, explanation: "对时间提问用 When。", tag: "疑问词" },
  { question: "It's ___ May 1st.", chinese: "在五月一日。", options: ["on", "in", "at", "to"], correct: 0, explanation: "在具体的某一天前面用介词 on。", tag: "介词" },
  { question: "There are some ___ days in May.", chinese: "五月份有一些特殊的日子。", options: ["special", "specially", "second", "third"], correct: 0, explanation: "special days 特殊的日子。", tag: "形容词" },
  { question: "Mother's Day is on the ___ Sunday in May.", chinese: "母亲节在五月的第二个星期日。", options: ["second", "two", "third", "one"], correct: 0, explanation: "在第几个星期日，需要用序数词 second。", tag: "序数词" },
  { question: "What is the ___ month of the year?", chinese: "一年中的第五个月是什么？", options: ["fifth", "five", "four", "fourth"], correct: 0, explanation: "第五个 fifth。", tag: "序数词" }
]

export const fillblankBankG5D4a = [
  { sentence: "My birthday is on April ___ (第一).", answer: "first", chinese: "我的生日在四月一号。", explanation: "first 第一 (1st)", tag: "序数词" },
  { sentence: "Our classroom is on the ___ (第二) floor.", answer: "second", chinese: "我们的教室在二楼。", explanation: "second 第二 (2nd)", tag: "序数词" },
  { sentence: "He is the ___ (第三) student.", answer: "third", chinese: "他是第三个学生。", explanation: "third 第三 (3rd)", tag: "序数词" },
  { sentence: "Today is May the ___ (第四).", answer: "fourth", chinese: "今天是五月四日。", explanation: "fourth 第四 (4th)", tag: "序数词" },
  { sentence: "May is the ___ (第五) month.", answer: "fifth", chinese: "五月是第五个月。", explanation: "fifth 第五 (5th)", tag: "序数词" }
]

export const listenWordBankG5D4a = [
  { word: "first", options: ["fast", "first", "forest", "fire"], correct: 1, zh: "第一" },
  { word: "second", options: ["season", "seven", "second", "send"], correct: 2, zh: "第二" },
  { word: "third", options: ["three", "third", "thirsty", "thirty"], correct: 1, zh: "第三" },
  { word: "fourth", options: ["four", "five", "fourth", "forty"], correct: 2, zh: "第四" },
  { word: "fifth", options: ["five", "fifth", "fifteen", "fifty"], correct: 1, zh: "第五" }
]

export const listenSentenceBankG5D4a = [
  { sentence: "When is the art show?", zh: "艺术展是什么时候？", options: ["When is the sports meet?", "When is the art show?", "When is the singing contest?", "Where is the art show?"], correct: 1 },
  { sentence: "It's on May 1st.", zh: "在五月一日。", options: ["It's on May 1st.", "It's on May 2nd.", "It's in May.", "It's on May 3rd."], correct: 0 },
  { sentence: "When is the reading festival?", zh: "阅读节是什么时候？", options: ["When is the sports meet?", "When is the art show?", "When is the reading festival?", "When is the science festival?"], correct: 2 },
  { sentence: "There are some special days in April.", zh: "四月份有一些特殊的日子。", options: ["There are some special days in May.", "There are some special days in April.", "There are some festivals in April.", "It's a special day."], correct: 1 },
  { sentence: "Mother's Day is on the second Sunday in May.", zh: "母亲节在五月的第二个星期日。", options: ["Father's Day is on the third Sunday.", "Mother's Day is on the second Sunday in May.", "Mother's Day is in May.", "My birthday is on the second Sunday."], correct: 1 }
]

export const listenOrderBankG5D4a = [
  { sentence: "When is the art show?", zh: "艺术展在什么时候？", words: ["When", "is", "the", "art", "show?"], answer: ["When", "is", "the", "art", "show?"] },
  { sentence: "It is on May 1st.", zh: "在五月一日。", words: ["It", "is", "on", "May", "1st."], answer: ["It", "is", "on", "May", "1st."] },
  { sentence: "There are some special days.", zh: "有一些特殊的日子。", words: ["There", "are", "some", "special", "days."], answer: ["There", "are", "some", "special", "days."] },
  { sentence: "It is on the fifth floor.", zh: "它在五楼。", words: ["It", "is", "on", "the", "fifth", "floor."], answer: ["It", "is", "on", "the", "fifth", "floor."] },
  { sentence: "When is the reading festival?", zh: "读书节在什么时候？", words: ["When", "is", "the", "reading", "festival?"], answer: ["When", "is", "the", "reading", "festival?"] }
]

export const listenResponseBankG5D4a = [
  { question: "When is the art show?", zh: "艺术展在什么时候？", options: ["It's on May 1st.", "It's red.", "In the room.", "I like art."], correct: 0 },
  { question: "Is the reading festival on May 5th?", zh: "阅读节在五月五号吗？", options: ["Yes, it is.", "No, they aren't.", "They are reading.", "Thanks."], correct: 0 },
  { question: "Which floor is your classroom on?", zh: "你们的教室在几楼？", options: ["It's on the third floor.", "Yes, it is.", "I'm ten.", "Singing."], correct: 0 },
  { question: "Is your birthday in April?", zh: "你的生日在四月吗？", options: ["Yes, it is.", "Because it's spring.", "Me too.", "It's an apple."], correct: 0 },
  { question: "There are some special days.", zh: "有一些特殊的日子。", options: ["Yes, for example Mother's Day.", "No, I'm not.", "Winter is cold.", "I have a book."], correct: 0 }
]

export const listenTranslateBankG5D4a = [
  { sentence: "When is the art show?", options: ["艺术展在什么时候？", "阅读节在什么时候？", "学校郊游在什么时候？", "运动会在什么时候？"], correct: 0 },
  { sentence: "It's on May 1st.", options: ["在三月一日。", "在四月一日。", "在六月一日。", "在五月一日。"], correct: 3 },
  { sentence: "There are some special days in May.", options: ["五月份有十天。", "五月有一些特殊的日子。", "我喜欢五月。", "五月份是热的。"], correct: 1 },
  { sentence: "Mother's Day is on the second Sunday in May.", options: ["父亲节在第三个星期日。", "母亲节在五月的第二个星期日。", "妇女节在三月。", "这是给妈妈的礼物。"], correct: 1 },
  { sentence: "My classroom is on the third floor.", options: ["我家在二楼。", "图书馆在一楼。", "我的教室在第三层/三楼。", "操场非常大。"], correct: 2 }
]
