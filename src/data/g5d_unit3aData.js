// PEP五年级下册 Unit 3 Part A《My school calendar》题库
// 主题：月份前六个月 (January, February, March, April, May, June) + When is the party? It's in April.
// 7种题型，每种5题，共35题

export const quizBankG5D3a = [
  { question: "___ is the school trip?", chinese: "学校郊游在什么时候？", options: ["When", "What", "Where", "Who"], correct: 0, explanation: "对时间提问用 When。", tag: "疑问词" },
  { question: "It's ___ April.", chinese: "在四月。", options: ["in", "on", "at", "to"], correct: 0, explanation: "在具体的月份前面用 in。", tag: "介词" },
  { question: "Tree Planting Day is in ___.", chinese: "植树节在三月。", options: ["March", "May", "January", "June"], correct: 0, explanation: "植树节是3月 (March)。", tag: "常识词汇" },
  { question: "___ is the first month of the year.", chinese: "一月是一年中的第一个月。", options: ["January", "February", "March", "April"], correct: 0, explanation: "January 是第一月。", tag: "常识词汇" },
  { question: "Children's Day is in ___.", chinese: "儿童节在六月。", options: ["June", "January", "July", "May"], correct: 0, explanation: "儿童节在6月 (June)。", tag: "常识词汇" }
]

export const fillblankBankG5D3a = [
  { sentence: "___ (什么时候) is the sports meet?", answer: "When", chinese: "运动会在什么时候？", explanation: "When", tag: "疑问词" },
  { sentence: "It's ___ (在...里) May.", answer: "in", chinese: "它在五月。", explanation: "在某个月份用in。", tag: "介词" },
  { sentence: "New Year's Day is in ___ (一月).", answer: "January", chinese: "元旦在第一月。", explanation: "January", tag: "名词" },
  { sentence: "Tree Planting Day is in ___ (三月).", answer: "March", chinese: "植树节在三月。", explanation: "March", tag: "名词" },
  { sentence: "Children's Day is in ___ (六月).", answer: "June", chinese: "儿童节在六月。", explanation: "June", tag: "名词" }
]

export const listenWordBankG5D3a = [
  { word: "January", options: ["June", "January", "July", "February"], correct: 1, zh: "一月" },
  { word: "February", options: ["Friday", "February", "family", "funny"], correct: 1, zh: "二月" },
  { word: "March", options: ["May", "March", "match", "math"], correct: 1, zh: "三月" },
  { word: "April", options: ["apple", "April", "August", "autumn"], correct: 1, zh: "四月" },
  { word: "June", options: ["July", "June", "juice", "jump"], correct: 1, zh: "六月" }
]

export const listenSentenceBankG5D3a = [
  { sentence: "When is the party?", zh: "晚会在什么时候？", options: ["When is the sports meet?", "When is the party?", "When is your birthday?", "When is the singing contest?"], correct: 1 },
  { sentence: "It's in April.", zh: "在四月。", options: ["It's in May.", "It's in August.", "It's in April.", "It's in March."], correct: 2 },
  { sentence: "Tree Planting Day is in March.", zh: "植树节在三月。", options: ["Children's Day is in June.", "Tree Planting Day is in March.", "Teachers' Day is in September.", "National Day is in October."], correct: 1 },
  { sentence: "When is the school trip?", zh: "学校郊游在什么时候？", options: ["When is the school trip?", "Where is the school trip?", "When is the sports meet?", "When is the singing contest?"], correct: 0 },
  { sentence: "May I have a look?", zh: "我可以看一看吗？", options: ["May I go now?", "May I have a look?", "May I have some water?", "Can I have a look?"], correct: 1 }
]

export const listenOrderBankG5D3a = [
  { sentence: "When is the party?", zh: "派对什么时候举行？", words: ["When", "is", "the", "party?"], answer: ["When", "is", "the", "party?"] },
  { sentence: "It is in April.", zh: "在四月份。", words: ["It", "is", "in", "April."], answer: ["It", "is", "in", "April."] },
  { sentence: "Tree Planting Day is in March.", zh: "植树节在三月。", words: ["Tree", "Planting", "Day", "is", "in", "March."], answer: ["Tree", "Planting", "Day", "is", "in", "March."] },
  { sentence: "When is the sports meet?", zh: "运动会在什么时候？", words: ["When", "is", "the", "sports", "meet?"], answer: ["When", "is", "the", "sports", "meet?"] },
  { sentence: "Children's Day is in June.", zh: "儿童节在六月。", words: ["Children's", "Day", "is", "in", "June."], answer: ["Children's", "Day", "is", "in", "June."] }
]

export const listenResponseBankG5D3a = [
  { question: "When is the party?", zh: "派对是什么时候？", options: ["It's in April.", "On Monday.", "Yes, I do.", "Because it's hot."], correct: 0 },
  { question: "Is the sports meet in May?", zh: "运动会在五月份吗？", options: ["Yes, it is.", "No, they aren't.", "At 8:00.", "In the room."], correct: 0 },
  { question: "When is Tree Planting Day?", zh: "植树节是什么时候？", options: ["It's in March.", "I like trees.", "It's green.", "Me too."], correct: 0 },
  { question: "Are you in a dancing class?", zh: "你在上舞蹈课吗？", options: ["No, I am not.", "I am twelve.", "She is dancing.", "Thanks."], correct: 0 },
  { question: "When is Children's Day?", zh: "儿童节是几月？", options: ["It's in June.", "It's on Friday.", "We have apples.", "Yes, it is."], correct: 0 }
]

export const listenTranslateBankG5D3a = [
  { sentence: "When is the party?", options: ["谁来参加派对？", "晚会在什么时候？", "派对在哪里？", "我们什么时候放假？"], correct: 1 },
  { sentence: "It's in April.", options: ["在四月。", "在八月。", "在五月。", "在三月。"], correct: 0 },
  { sentence: "When is the school trip?", options: ["你去郊游吗？", "学校放假是几号？", "学校郊游在什么时候？", "你什么时候回家？"], correct: 2 },
  { sentence: "Tree Planting Day is in March.", options: ["劳动节在五月。", "植树节在三月。", "国庆节在十月。", "青年节在五月。"], correct: 1 },
  { sentence: "Children's Day is in June.", options: ["教师节在九月。", "儿童节在六月。", "圣诞节在十二月。", "元旦在一月。"], correct: 1 }
]
