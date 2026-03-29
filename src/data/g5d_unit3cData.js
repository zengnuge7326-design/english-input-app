// PEP五年级下册 Unit 3 Part C《Story time / Let's check》题库
// 主题：Unit 3 综合复习 (一年12个月份与中西节日)
// 7种题型，每种5题，共35题

export const quizBankG5D3c = [
  { question: "___ is your birthday?", chinese: "你的生日是什么时候？", options: ["When", "What", "Who", "Where"], correct: 0, explanation: "对日期/时间提问用 When。", tag: "疑问词" },
  { question: "My birthday is ___ July.", chinese: "我的生日在七月。", options: ["in", "on", "at", "for"], correct: 0, explanation: "在某个月份中，前置介词用 in。", tag: "介词" },
  { question: "What will you do ___ your mum?", chinese: "你要为你妈妈做什么？", options: ["for", "to", "at", "in"], correct: 0, explanation: "do something for someone 为某人做某事。", tag: "介词" },
  { question: "I will ___ her a card.", chinese: "我将要给她做一张卡片。", options: ["make", "making", "makes", "to make"], correct: 0, explanation: "will 后面跟动词原形。", tag: "情态助动词短语" },
  { question: "There are 12 ___ in a year.", chinese: "一年有12个月。", options: ["months", "month", "seasons", "days"], correct: 0, explanation: "12个月：12 months。", tag: "名词复数" }
]

export const fillblankBankG5D3c = [
  { sentence: "___ (什么时候) is the party?", answer: "When", chinese: "晚会在什么时候？", explanation: "When", tag: "疑问词" },
  { sentence: "It's ___ (在...) June.", answer: "in", chinese: "它在六月。", explanation: "在月份里面用 in。", tag: "介词" },
  { sentence: "I will ___ (煮) noodles for her.", answer: "cook", chinese: "我将为她煮面条。", explanation: "will + 动词原形 cook。", tag: "动词" },
  { sentence: "Mother's Day is in ___ (五月).", answer: "May", chinese: "母亲节在五月。", explanation: "May", tag: "名词" },
  { sentence: "I'll ___ (做) a card.", answer: "make", chinese: "我将会做一张贺卡。", explanation: "make", tag: "动词" }
]

export const listenWordBankG5D3c = [
  { word: "month", options: ["mouse", "mouth", "month", "math"], correct: 2, zh: "月份" },
  { word: "will", options: ["will", "well", "wall", "way"], correct: 0, zh: "将要" },
  { word: "cook", options: ["look", "cook", "book", "good"], correct: 1, zh: "做饭" },
  { word: "make", options: ["make", "take", "lake", "wake"], correct: 0, zh: "制作" },
  { word: "card", options: ["car", "cat", "card", "cart"], correct: 2, zh: "卡片" }
]

export const listenSentenceBankG5D3c = [
  { sentence: "When is your birthday?", zh: "你的生日在什么时候？", options: ["When is your birthday?", "When is her birthday?", "Where is your birthday?", "When is the party?"], correct: 0 },
  { sentence: "My birthday is in June.", zh: "我的生日在六月。", options: ["His birthday is in May.", "Her birthday is in June.", "My birthday is in July.", "My birthday is in June."], correct: 3 },
  { sentence: "What will you do for your mum?", zh: "你会为你妈妈做什么？", options: ["What will you do for your dad?", "What will you do for your mum?", "What can you do for your mum?", "What will she do for her mum?"], correct: 1 },
  { sentence: "I'll make a card.", zh: "我会做一张卡片。", options: ["I'll buy a card.", "I'll draw a picture.", "I'll make a card.", "I'll send a card."], correct: 2 },
  { sentence: "Mother's Day is in May.", zh: "母亲节在五月。", options: ["Father's Day is in June.", "Mother's Day is in May.", "Children's Day is in June.", "Teachers' Day is in September."], correct: 1 }
]

export const listenOrderBankG5D3c = [
  { sentence: "When is your birthday?", zh: "你的生日是什么时候？", words: ["When", "is", "your", "birthday?"], answer: ["When", "is", "your", "birthday?"] },
  { sentence: "It is in May.", zh: "在五月份。", words: ["It", "is", "in", "May."], answer: ["It", "is", "in", "May."] },
  { sentence: "What will you do?", zh: "你打算做什么？", words: ["What", "will", "you", "do?"], answer: ["What", "will", "you", "do?"] },
  { sentence: "I will make a card.", zh: "我将会做一张贺卡。", words: ["I", "will", "make", "a", "card."], answer: ["I", "will", "make", "a", "card."] },
  { sentence: "I will cook noodles.", zh: "我将煮面条。", words: ["I", "will", "cook", "noodles."], answer: ["I", "will", "cook", "noodles."] }
]

export const listenResponseBankG5D3c = [
  { question: "When is Mother's Day?", zh: "母亲节在什么时候？", options: ["It's in May.", "It's on Sunday.", "Yes, I love her.", "I make a card."], correct: 0 },
  { question: "What will you do for her?", zh: "你将为她做什么？", options: ["I'll cook noodles.", "She is kind.", "In June.", "Yes, I will."], correct: 0 },
  { question: "Is your birthday in July?", zh: "你的生日在七月吗？", options: ["Yes, it is.", "No, I'm not.", "It's a cake.", "Thank you."], correct: 0 },
  { question: "When is Father's Day?", zh: "父亲节是什么时候？", options: ["It's in June.", "I am twelve.", "For my dad.", "Goodbye."], correct: 0 },
  { question: "Will you make a card?", zh: "你将要制作一张卡片吗？", options: ["Yes, I will.", "No, she won't.", "Here you are.", "Me too."], correct: 0 }
]

export const listenTranslateBankG5D3c = [
  { sentence: "When is your birthday?", options: ["谁过生日？", "他生日是哪天？", "你的生日是几号？", "你的生日是什么时候？"], correct: 3 },
  { sentence: "My birthday is in June.", options: ["她生日在七月。", "我生日在六月。", "我生日在五月。", "这是我的生日蛋糕。"], correct: 1 },
  { sentence: "What will you do for your mum?", options: ["你的妈妈喜欢什么？", "你为妈妈做了什么？", "你打算为你妈妈做点什么？", "这是给妈妈的礼物吗？"], correct: 2 },
  { sentence: "I'll make a beautiful card.", options: ["我买了一张卡。 ", "她会做卡片。", "我要画幅画。", "我会制作一张漂亮的卡片。"], correct: 3 },
  { sentence: "Mother's Day is in May.", options: ["儿童节在六月。", "中秋节在九月。", "妇女节在三月。", "母亲节在五月。"], correct: 3 }
]
