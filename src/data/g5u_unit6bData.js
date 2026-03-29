// PEP五年级上册 Unit 6 Part B《In a nature park》题库
// 主题：自然公园景物2 (tree, bridge, building, village, house) + Are there any lakes on the mountain?
// 7种题型，每种5题，共35题

export const quizBankG5U6b = [
  { question: "___ there any lakes?", chinese: "有没有湖泊？", options: ["Are", "Is", "Am", "Do"], correct: 0, explanation: "lakes 是复数，所以用 Are there 提问。", tag: "系动词" },
  { question: "Yes, there ___.", chinese: "是的，有。", options: ["are", "is", "am", "do"], correct: 0, explanation: "对于 Are there 的肯定回答是 Yes, there are.", tag: "语法" },
  { question: "Are there ___ tall trees?", chinese: "有高大的树吗？", options: ["any", "some", "a", "an"], correct: 0, explanation: "在疑问句中，表示“一些”通常用 any。", tag: "限定词" },
  { question: "There are many small ___.", chinese: "有很多小房子。", options: ["houses", "house", "house's", "the house"], correct: 0, explanation: "many 后面接可数名词复数。", tag: "名词复数" },
  { question: "The ___ is over the river.", chinese: "那座桥建在河上。", options: ["bridge", "bird", "fridge", "building"], correct: 0, explanation: "桥 (bridge) 在河上方。", tag: "名词" }
]

export const fillblankBankG5U6b = [
  { sentence: "___ (有复数) there any lakes?", answer: "Are", chinese: "有一些湖吗？", explanation: "Are（句首大写）", tag: "系动词" },
  { sentence: "Yes, there ___ (有复数).", answer: "are", chinese: "是的，有。", explanation: "are", tag: "语法" },
  { sentence: "Are there ___ (任何的/一些) animals?", answer: "any", chinese: "有动物吗？", explanation: "疑问句中表示一些用any。", tag: "限定词" },
  { sentence: "I can see a ___ (桥).", answer: "bridge", chinese: "我能看到一座桥。", explanation: "bridge 桥", tag: "名词" },
  { sentence: "There is a small ___ (村庄).", answer: "village", chinese: "有一个小村子。", explanation: "village 村庄", tag: "名词" }
]

export const listenWordBankG5U6b = [
  { word: "bridge", options: ["fridge", "bridge", "bird", "bread"], correct: 1, zh: "桥" },
  { word: "building", options: ["build", "building", "body", "bell"], correct: 1, zh: "建筑物" },
  { word: "village", options: ["village", "valley", "very", "violin"], correct: 0, zh: "村庄" },
  { word: "house", options: ["horse", "house", "mouse", "hour"], correct: 1, zh: "房屋" },
  { word: "tree", options: ["three", "tree", "free", "train"], correct: 1, zh: "树" }
]

export const listenSentenceBankG5U6b = [
  { sentence: "Are there any lakes on the mountain?", zh: "山上有什么湖泊吗？", options: ["Are there any rivers on the mountain?", "Are there any trees on the mountain?", "Are there any lakes on the mountain?", "Is there a lake on the mountain?"], correct: 2 },
  { sentence: "Yes, there are.", zh: "是的，有。", options: ["No, there aren't.", "Yes, there are.", "Yes, there is.", "No, it isn't."], correct: 1 },
  { sentence: "There are many houses.", zh: "有很多房子。", options: ["There is a house.", "There are many houses.", "There are some horses.", "There is a big house."], correct: 1 },
  { sentence: "The bridge is very old.", zh: "这座桥很老了。", options: ["The bridge is very long.", "The building is very tall.", "The bridge is very old.", "The tree is very big."], correct: 2 },
  { sentence: "Are there any tall buildings?", zh: "有什么高楼吗？", options: ["Are there any tall buildings?", "Are there any small villages?", "Is there a tall building?", "Are there any old bridges?"], correct: 0 }
]

export const listenOrderBankG5U6b = [
  { sentence: "Are there any lakes?", zh: "有没有湖泊？", words: ["Are", "there", "any", "lakes?"], answer: ["Are", "there", "any", "lakes?"] },
  { sentence: "Yes, there are.", zh: "是的，有。", words: ["Yes,", "there", "are."], answer: ["Yes,", "there", "are."] },
  { sentence: "There are many houses.", zh: "有很多房屋。", words: ["There", "are", "many", "houses."], answer: ["There", "are", "many", "houses."] },
  { sentence: "Are there any tall buildings?", zh: "有高楼大厦吗？", words: ["Are", "there", "any", "tall", "buildings?"], answer: ["Are", "there", "any", "tall", "buildings?"] },
  { sentence: "No, there are not.", zh: "不，没有。", words: ["No,", "there", "are", "not."], answer: ["No,", "there", "are", "not."] }
]

export const listenResponseBankG5U6b = [
  { question: "Are there any lakes on the mountain?", zh: "山上有湖吗？", options: ["Yes, there are.", "Yes, it is.", "No, there isn't.", "Ten."], correct: 0 },
  { question: "Are there any tall buildings in the village?", zh: "村庄里有高楼吗？", options: ["No, there aren't.", "Yes, he is.", "I like apples.", "Thank you."], correct: 0 },
  { question: "Where is the bridge?", zh: "桥在哪？", options: ["It's over the river.", "It is red.", "I have two.", "Me too."], correct: 0 },
  { question: "What is in the village?", zh: "村里有什么？", options: ["There are many houses.", "Yes, it is.", "No, they aren't.", "Sing a song."], correct: 0 },
  { question: "How many trees do you see?", zh: "你看到多少棵树？", options: ["I see twelve.", "There is a river.", "Yes, I do.", "Thank you."], correct: 0 }
]

export const listenTranslateBankG5U6b = [
  { sentence: "Are there any lakes on the mountain?", options: ["山上有树吗？", "公园里有河吗？", "山上有湖泊吗？", "村庄里有大楼吗？"], correct: 2 },
  { sentence: "Yes, there are.", options: ["是的，有一座。", "是的，有很多。", "是的，有。", "不，什么也没有。"], correct: 2 },
  { sentence: "No, there aren't.", options: ["是的，很多。", "不，没有。", "不，他不在。", "不是，那是猫。"], correct: 1 },
  { sentence: "Are there any tall buildings?", options: ["有高楼大厦吗？", "那里有大楼吗？", "那里有房子吗？", "有高大的树吗？"], correct: 0 },
  { sentence: "There are many small houses.", options: ["有一座小房子。", "有很多大房子。", "那里有老房子。", "有很多小房子。"], correct: 3 }
]
