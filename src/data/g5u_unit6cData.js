// PEP五年级上册 Unit 6 Part C《Story time / Let's check》题库
// 主题：Unit 6 综合复习 (nature park, Is there / Are there)
// 7种题型，每种5题，共35题

export const quizBankG5U6c = [
  { question: "___ there a forest in the park?", chinese: "公园里有森林吗？", options: ["Is", "Are", "Do", "Does"], correct: 0, explanation: "单数名词前用Is。", tag: "系动词" },
  { question: "___ there any tall buildings?", chinese: "有没有高楼？", options: ["Are", "Is", "Am", "Do"], correct: 0, explanation: "复数 buildings用Are。", tag: "系动词" },
  { question: "Are there ___ ducks?", chinese: "有一些鸭子吗？", options: ["any", "some", "a", "an"], correct: 0, explanation: "疑问句表示一些用any。", tag: "限定词" },
  { question: "I want to ___ a picture.", chinese: "我想拍个照/画幅画。", options: ["take", "taking", "takes", "to take"], correct: 0, explanation: "want to + 动词原形。这里take a picture表示拍照。", tag: "短语" },
  { question: "It's so ___.", chinese: "真是太安静了。", options: ["quiet", "quite", "quick", "quit"], correct: 0, explanation: "quiet 安静的。", tag: "形容词" }
]

export const fillblankBankG5U6c = [
  { sentence: "___ (是) there a river?", answer: "Is", chinese: "这里有一条河吗？", explanation: "Is（开头大写）。", tag: "系动词" },
  { sentence: "___ (是复数) there any lakes?", answer: "Are", chinese: "这里有一些湖吗？", explanation: "Are（开头大写）。", tag: "系动词" },
  { sentence: "Yes, there ___ (有短的).", answer: "is", chinese: "是的，有。", explanation: "Yes, there is. 回答Is there问题", tag: "语法" },
  { sentence: "No, there ___ (没有复数).", answer: "aren't", chinese: "不，没有。", explanation: "No, there aren't. 回答 Are there", tag: "语法" },
  { sentence: "The nature park is very ___ (安静的).", answer: "quiet", chinese: "自然公园非常安静。", explanation: "quiet 安静的", tag: "形容词" }
]

export const listenWordBankG5U6c = [
  { word: "quiet", options: ["quite", "quiet", "quick", "quit"], correct: 1, zh: "安静的" },
  { word: "picture", options: ["picture", "photo", "park", "part"], correct: 0, zh: "图片/照片" },
  { word: "nature", options: ["natural", "nation", "nature", "nurse"], correct: 2, zh: "自然" },
  { word: "bridge", options: ["build", "bridge", "bread", "bring"], correct: 1, zh: "桥" },
  { word: "forest", options: ["first", "rest", "forest", "fire"], correct: 2, zh: "森林" }
]

export const listenSentenceBankG5U6c = [
  { sentence: "Is there a river?", zh: "这里有河吗？", options: ["Is there a river?", "Is there a lake?", "Is there a forest?", "Are there any rivers?"], correct: 0 },
  { sentence: "Are there any bears?", zh: "有什么熊吗？", options: ["Are there any birds?", "Are there any bears?", "Are there any ducks?", "Are there any pandas?"], correct: 1 },
  { sentence: "No, there aren't.", zh: "不，没有。", options: ["No, there isn't.", "No, she isn't.", "No, there aren't.", "Yes, there are."], correct: 2 },
  { sentence: "Let's take a picture.", zh: "我们拍张照片吧。", options: ["Let's take a walk.", "Let's draw a picture.", "Let's take a picture.", "Let's go boating."], correct: 2 },
  { sentence: "It's so quiet.", zh: "太安静了。", options: ["It's so quick.", "It's so beautiful.", "It's so quiet.", "It's a quiet bird."], correct: 2 }
]

export const listenOrderBankG5U6c = [
  { sentence: "Is there a river?", zh: "这里有河吗？", words: ["Is", "there", "a", "river?"], answer: ["Is", "there", "a", "river?"] },
  { sentence: "Are there any tall trees?", zh: "有高大的树木吗？", words: ["Are", "there", "any", "tall", "trees?"], answer: ["Are", "there", "any", "tall", "trees?"] },
  { sentence: "No, there are not.", zh: "不，没有。", words: ["No,", "there", "are", "not."], answer: ["No,", "there", "are", "not."] },
  { sentence: "Let's take a picture.", zh: "我们来拍张照。", words: ["Let's", "take", "a", "picture."], answer: ["Let's", "take", "a", "picture."] },
  { sentence: "It is so quiet.", zh: "这里真安静。", words: ["It", "is", "so", "quiet."], answer: ["It", "is", "so", "quiet."] }
]

export const listenResponseBankG5U6c = [
  { question: "Is there a forest in the park?", zh: "公园里有森林吗？", options: ["Yes, there is.", "Yes, they are.", "It is big.", "Thank you."], correct: 0 },
  { question: "Are there any lakes?", zh: "有一些湖泊吗？", options: ["No, there aren't.", "Yes, it is.", "They are ducks.", "Bye."], correct: 0 },
  { question: "Look at the nature park.", zh: "看看这个自然公园。", options: ["It's so beautiful.", "I like apples.", "She is young.", "Yes, I can."], correct: 0 },
  { question: "Let's go boating.", zh: "咱们去划船吧。", options: ["OK.", "Hello.", "I see a bird.", "It's tall."], correct: 0 },
  { question: "What a beautiful picture!", zh: "多么美丽的画/照片啊！", options: ["Thank you.", "Yes, I am.", "I am singing.", "Me too."], correct: 0 }
]

export const listenTranslateBankG5U6c = [
  { sentence: "Is there a river in the park?", options: ["公园里有河吗？", "公园里有树吗？", "河在哪里？", "这是公园里的河吗？"], correct: 0 },
  { sentence: "Are there any tall trees?", options: ["有任何花吗？", "有一些小树吗？", "有高大的树吗？", "有些老树吗？"], correct: 2 },
  { sentence: "Let's take a picture.", options: ["让我看看画。", "让我们画幅画。", "我们拍张照片吧。", "那是一张照片。"], correct: 2 },
  { sentence: "It's so quiet.", options: ["这里真的很美。", "太干净了。", "天气很好。", "真是太安静了。"], correct: 3 },
  { sentence: "No, there aren't.", options: ["是的，有很多。", "不，不是那个。", "是的，他们是。", "不，没有。"], correct: 3 }
]
