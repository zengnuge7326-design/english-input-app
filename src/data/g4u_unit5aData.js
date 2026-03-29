// PEP四年级上册 Unit 5 Part A《Dinner's ready》题库
// 主题：食物词汇 (beef, chicken, noodles, soup, vegetable) + What would you like for dinner? I'd like some...
// 7种题型，每种5题，共35题

export const quizBankG4U5a = [
  { question: "What would you like ___ dinner?", chinese: "晚饭你想吃什么？", options: ["for", "to", "in", "on"], correct: 0, explanation: "for dinner 表示作为晚餐(吃什么)。", tag: "介词" },
  { question: "I'd like ___ beef, please.", chinese: "请给我一些牛肉。", options: ["some", "a", "an", "any"], correct: 0, explanation: "beef 是不可数名词，用 some。", tag: "语法" },
  { question: "Dinner's ___!", chinese: "晚餐准备好了！", options: ["read", "reading", "ready", "red"], correct: 2, explanation: "be ready 准备好了。Dinner is ready = Dinner's ready.", tag: "词汇" },
  { question: "Here you ___.", chinese: "给你。", options: ["are", "is", "am", "do"], correct: 0, explanation: "Here you are (给你) 固定搭配。", tag: "交际" },
  { question: "I like ___. They are yummy.", chinese: "我喜欢面条。它们很好吃。", options: ["noodle", "noodles", "beef", "soup"], correct: 1, explanation: "They are 说明这里的食物是复数概念，noodles(面条)常以复数形式出现。", tag: "单复数" }
]

export const fillblankBankG4U5a = [
  { sentence: "What would you like for ___ (晚餐)?", answer: "dinner", chinese: "晚饭你想吃什么？", explanation: "dinner 晚餐。", tag: "词汇" },
  { sentence: "I'd like some ___ (牛肉).", answer: "beef", chinese: "我想要一些牛肉。", explanation: "beef 牛肉", tag: "词汇" },
  { sentence: "Some ___ (大米) and fish.", answer: "rice", chinese: "一些米饭和鱼。", explanation: "rice 大米/米饭。通常搭配一起构成本单元食谱。", tag: "词汇" },
  { sentence: "Have some ___ (汤).", answer: "soup", chinese: "喝点汤吧。", explanation: "soup 汤", tag: "词汇" },
  { sentence: "I like ___ (面条).", answer: "noodles", chinese: "我喜欢面条。", explanation: "面条的复数 noodles", tag: "词汇" }
]

export const listenWordBankG4U5a = [
  { word: "beef", options: ["beep", "beef", "leaf", "deaf"], correct: 1, zh: "牛肉" },
  { word: "chicken", options: ["kitchen", "children", "chicken", "check"], correct: 2, zh: "鸡肉/鸡" },
  { word: "noodles", options: ["noodles", "poodles", "needles", "doodles"], correct: 0, zh: "面条" },
  { word: "soup", options: ["soap", "soup", "sour", "soon"], correct: 1, zh: "汤" },
  { word: "vegetable", options: ["table", "vegetable", "comfortable", "valuable"], correct: 1, zh: "蔬菜" }
]

export const listenSentenceBankG4U5a = [
  { sentence: "What would you like for dinner?", zh: "晚饭你想吃什么？", options: ["What do you like for dinner?", "What would you like for lunch?", "What would you like for breakfast?", "What would you like for dinner?"], correct: 3 },
  { sentence: "I'd like some beef, please.", zh: "请给我来点牛肉。", options: ["I'd like some pork, please.", "I'd like some fish, please.", "I'd like some chicken, please.", "I'd like some beef, please."], correct: 3 },
  { sentence: "Dinner's ready!", zh: "晚餐好了！", options: ["Lunch is ready!", "Breakfast's ready!", "Dinner's ready!", "Food is ready!"], correct: 2 },
  { sentence: "Here you are.", zh: "给你。", options: ["Here it is.", "Here you are.", "Thank you.", "Excuse me."], correct: 1 },
  { sentence: "Have some noodles.", zh: "吃点面条吧。", options: ["Have some vegetables.", "Have some soup.", "Have some beef.", "Have some noodles."], correct: 3 }
]

export const listenOrderBankG4U5a = [
  { sentence: "What would you like for dinner?", zh: "晚饭你想吃什么？", words: ["What", "would", "you", "like", "for", "dinner?"], answer: ["What", "would", "you", "like", "for", "dinner?"] },
  { sentence: "I'd like some beef, please.", zh: "请给我一些牛肉。", words: ["I'd", "like", "some", "beef,", "please."], answer: ["I'd", "like", "some", "beef,", "please."] },
  { sentence: "Dinner is ready.", zh: "晚餐准备好了。", words: ["Dinner", "is", "ready."], answer: ["Dinner", "is", "ready."] },
  { sentence: "Have some soup and bread.", zh: "喝点汤吃点面包吧。", words: ["Have", "some", "soup", "and", "bread."], answer: ["Have", "some", "soup", "and", "bread."] },
  { sentence: "I like vegetables.", zh: "我喜欢蔬菜。", words: ["I", "like", "vegetables."], answer: ["I", "like", "vegetables."] }
]

export const listenResponseBankG4U5a = [
  { question: "What would you like for dinner?", zh: "晚饭你想吃什么？", options: ["I'd like some beef.", "It's on the table.", "Yes, please.", "I have a book."], correct: 0 },
  { question: "I'd like some soup, please.", zh: "我想要些汤。", options: ["What colour is it?", "Here you are.", "Where are they?", "Lunch is ready."], correct: 1 },
  { question: "Dinner's ready!", zh: "晚餐准备好了！", options: ["Thank you.", "Yes, I am.", "It's a kitchen.", "Blue."], correct: 0 },
  { question: "Have some beef.", zh: "吃点牛肉吧。", options: ["I like vegetables.", "No, it isn't.", "Thank you.", "It's near the phone."], correct: 2 },
  { question: "What's for dinner?", zh: "晚饭吃什么？", options: ["Soup and bread.", "It's heavy.", "In the kitchen.", "I have a new bag."], correct: 0 }
]

export const listenTranslateBankG4U5a = [
  { sentence: "What would you like for dinner?", options: ["午饭你想吃什么？", "晚饭你想吃什么？", "你想喝点什么？", "晚餐在哪里吃？"], correct: 1 },
  { sentence: "I'd like some beef, please.", options: ["请给我一些鸡肉。", "请给我一些面条。", "请给我一些鱼。", "请给我一些牛肉。"], correct: 3 },
  { sentence: "Dinner is ready.", options: ["午餐准备好了。", "早餐准备好了。", "晚餐准备好了。", "吃晚餐了。"], correct: 2 },
  { sentence: "Have some vegetables.", options: ["吃点蔬菜吧。", "吃点水果吧。", "吃点鸡肉吧。", "喝点汤吧。"], correct: 0 },
  { sentence: "Here you are.", options: ["这是你的。", "它在这儿。", "它在那儿。", "给你。"], correct: 3 }
]
