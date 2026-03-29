// PEP五年级下册 Unit 3 Part B《My school calendar》题库
// 主题：月份后六个月 (July, August, September, October, November, December) + We have a few fun things...
// 7种题型，每种5题，共35题

export const quizBankG5D3b = [
  { question: "We have a ___ fun things in spring.", chinese: "我们在春天有一些有趣的事情。", options: ["few", "little", "any", "much"], correct: 0, explanation: "a few 表示一些，后面接可数名词的复数，如 fun things。", tag: "限定词" },
  { question: "National Day is in ___.", chinese: "国庆节在十月。", options: ["October", "November", "December", "August"], correct: 0, explanation: "国庆节(National Day)在10月(October)。", tag: "常识词汇" },
  { question: "Teachers' Day is in ___.", chinese: "教师节在九月。", options: ["September", "Teacher", "November", "December"], correct: 0, explanation: "教师节在9月 (September)。", tag: "常识词汇" },
  { question: "It's ___ my birthday.", chinese: "是在我的生日。", options: ["on", "in", "at", "to"], correct: 0, explanation: "在具体的某一天前面使用介词 on。", tag: "介词" },
  { question: "Christmas is in ___.", chinese: "圣诞节在十二月。", options: ["December", "November", "October", "September"], correct: 0, explanation: "Christmas 在12月(December)。", tag: "常识词汇" }
]

export const fillblankBankG5D3b = [
  { sentence: "We have a ___ (一些) fun things.", answer: "few", chinese: "我们有一些有趣的事情。", explanation: "a few 少数几个，一些。", tag: "限定词" },
  { sentence: "Teachers' Day is in ___ (九月).", answer: "September", chinese: "教师节在九月。", explanation: "September 九月", tag: "名词" },
  { sentence: "National Day is in ___ (十月).", answer: "October", chinese: "国庆节在十月。", explanation: "October", tag: "名词" },
  { sentence: "Thanksgiving Day is in ___ (十一月).", answer: "November", chinese: "感恩节在十一月。", explanation: "November", tag: "名词" },
  { sentence: "Christmas is in ___ (十二月).", answer: "December", chinese: "圣诞节在十二月。", explanation: "December", tag: "名词" }
]

export const listenWordBankG5D3b = [
  { word: "July", options: ["June", "July", "August", "January"], correct: 1, zh: "七月" },
  { word: "August", options: ["August", "Autumn", "April", "About"], correct: 0, zh: "八月" },
  { word: "September", options: ["September", "October", "November", "December"], correct: 0, zh: "九月" },
  { word: "October", options: ["October", "November", "October", "over"], correct: 0, zh: "十月" },
  { word: "December", options: ["November", "December", "September", "dance"], correct: 1, zh: "十二月" }
]

export const listenSentenceBankG5D3b = [
  { sentence: "We have a few fun things in spring.", zh: "我们在春天有一些有趣的事情。", options: ["We have a lot of fun things.", "We have a few fun things in spring.", "I have some new books.", "We have a good trip."], correct: 1 },
  { sentence: "Teachers' Day is in September.", zh: "教师节在九月。", options: ["Children's Day is in June.", "Teachers' Day is in September.", "National Day is in October.", "Christmas is in December."], correct: 1 },
  { sentence: "We have an English party.", zh: "我们有一个英语派对。", options: ["We have a sports meet.", "We have a maths party.", "We have an English party.", "We have an art class."], correct: 2 },
  { sentence: "Christmas is in December.", zh: "圣诞节在十二月。", options: ["Teachers' Day is in September.", "National Day is in October.", "Thanksgiving Day is in November.", "Christmas is in December."], correct: 3 },
  { sentence: "National Day is in October.", zh: "国庆节在十月份。", options: ["National Day is in October.", "National Day is in September.", "Tree Planting Day is in March.", "New Year's Day is in January."], correct: 0 }
]

export const listenOrderBankG5D3b = [
  { sentence: "We have a few fun things.", zh: "我们有一些有趣的事情。", words: ["We", "have", "a", "few", "fun", "things."], answer: ["We", "have", "a", "few", "fun", "things."] },
  { sentence: "Teachers' Day is in September.", zh: "教师节在九月份。", words: ["Teachers'", "Day", "is", "in", "September."], answer: ["Teachers'", "Day", "is", "in", "September."] },
  { sentence: "National Day is in October.", zh: "国庆在十月份。", words: ["National", "Day", "is", "in", "October."], answer: ["National", "Day", "is", "in", "October."] },
  { sentence: "Christmas is in December.", zh: "圣诞节是在十二月。", words: ["Christmas", "is", "in", "December."], answer: ["Christmas", "is", "in", "December."] },
  { sentence: "I like August.", zh: "我喜欢八月。", words: ["I", "like", "August."], answer: ["I", "like", "August."] }
]

export const listenResponseBankG5D3b = [
  { question: "When is Teachers' Day?", zh: "教师节是什么时候？", options: ["It's in September.", "It's on Monday.", "Because I love teachers.", "In my school."], correct: 0 },
  { question: "When is National Day?", zh: "国庆节是什么时候？", options: ["It's in October.", "I have a flag.", "It's red.", "In the park."], correct: 0 },
  { question: "When is Christmas?", zh: "圣诞节是什么时候？", options: ["It's in December.", "It's a tree.", "Yes, it is.", "Thank you."], correct: 0 },
  { question: "When is your birthday?", zh: "你的生日是什么时候？", options: ["It's in July.", "I like cakes.", "He is young.", "I'm ten."], correct: 0 },
  { question: "Are we in November?", zh: "我们现在在十一月吗？", options: ["Yes, it is.", "Yes, we are.", "Winter is cold.", "Bye."], correct: 1 }
]

export const listenTranslateBankG5D3b = [
  { sentence: "We have a few fun things in spring.", options: ["我们在秋天去野餐。", "我们在春天去春游。", "我们在春天有一些有趣的事情。", "我们玩得很开心。"], correct: 2 },
  { sentence: "Teachers' Day is in September.", options: ["劳动节在五月。", "建军节在八月。", "教师节在八月。", "教师节在九月。"], correct: 3 },
  { sentence: "National Day is in October.", options: ["国庆节在九月。", "国庆节在十月。", "感恩节在十一月。", "圣诞节在十二月。"], correct: 1 },
  { sentence: "My birthday is in August.", options: ["他生日在九月。", "我妈妈生日在五月。", "我生日在八月。", "他们生日在七月。"], correct: 2 },
  { sentence: "Christmas is in December.", options: ["圣诞节很快乐。", "圣诞树很美。", "圣诞节在十一月。", "圣诞节在十二月。"], correct: 3 }
]
