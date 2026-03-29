// PEP四年级下册 Unit 5 Part B《Let's learn / Let's talk》题库
// 主题：部分衣物 (coat, shirt, jacket, sweater, shorts) + Whose coat is this? + le发音
// 7种题型，每种5题，共35题

export const quizBank5b = [
  { question: "___ coat is this?", chinese: "这是谁的外套？", options: ["Who", "Whose", "What", "Where"], correct: 1, explanation: "询问'谁的(东西)'用 Whose。", tag: "句型" },
  { question: "It's ___. (这是我的。)", chinese: "这是我的。", options: ["me", "my", "mine", "I"], correct: 2, explanation: "mine = my coat，名词性物主代词，指'我的东西'。", tag: "语法" },
  { question: "Whose pants are ___?", chinese: "这些是谁的裤子？", options: ["this", "those", "that", "it"], correct: 1, explanation: "pants 是复数，所以代词必须用复数的 those 或 these，排除 this/that/it。", tag: "语法" },
  { question: "They're ___.", chinese: "它们是你爸爸的。", options: ["your father", "your fathers", "your father's", "you father"], correct: 2, explanation: "某人的东西用名词所有格加 's。也就是 your father's (pants)。", tag: "语法" },
  { question: "Which word has the 'le' sound like in 'apple'?", chinese: "哪个词里面的 le 发音和 apple 里的 le 一样？", options: ["people", "please", "play", "clean"], correct: 0, explanation: "apple 和 people 中的 le 发 /l/ 辅音组合成音节 /pl/。", tag: "拼读" }
]

export const fillblankBank5b = [
  { sentence: "___ (谁的) jacket is this?", answer: "Whose", chinese: "这是谁的夹克衫？", explanation: "Whose 谁的。", tag: "词汇" },
  { sentence: "It's ___ (我的).", answer: "mine", chinese: "这是我的。", explanation: "mine 我的东西。", tag: "语法" },
  { sentence: "They are your ___ (妈妈的).", answer: "mother's", chinese: "它们是你妈妈的。", explanation: "名词所有格 mother's。", tag: "语法" },
  { sentence: "Put on your ___ (外套).", answer: "coat", chinese: "穿上你的外套。", explanation: "coat 外套/大衣。", tag: "词汇" },
  { sentence: "Whose ___ (短裤) are those?", answer: "shorts", chinese: "那些是谁的短裤？", explanation: "短裤 shorts。", tag: "词汇" }
]

export const listenWordBank5b = [
  { word: "whose", options: ["whose", "who", "house", "hose"], correct: 0, zh: "谁的" },
  { word: "mine", options: ["mind", "mine", "nine", "line"], correct: 1, zh: "我的" },
  { word: "jacket", options: ["packet", "racket", "jacket", "socket"], correct: 2, zh: "夹克衫" },
  { word: "sweater", options: ["sweat", "sweet", "sweater", "weather"], correct: 2, zh: "毛衣" },
  { word: "shorts", options: ["shoes", "shirts", "shorts", "sorts"], correct: 2, zh: "短裤" }
]

export const listenSentenceBank5b = [
  { sentence: "Whose coat is this?", zh: "这是谁的外套？", options: ["Whose coat is this?", "Whose cat is this?", "Where is the coat?", "Who is this?"], correct: 0 },
  { sentence: "It's mine.", zh: "是我的。", options: ["It's my.", "It's me.", "It's mine.", "It's fine."], correct: 2 },
  { sentence: "Whose pants are those?", zh: "那些是谁的裤子？", options: ["Whose pens are those?", "Whose pants are those?", "Are those your pants?", "Whose pants are these?"], correct: 1 },
  { sentence: "They're your father's.", zh: "它们是你爸爸的。", options: ["They're your mother's.", "They're my father's.", "They're your father's.", "It is your father's."], correct: 2 },
  { sentence: "Put on your sweater.", zh: "穿上你的毛衣。", options: ["Take off your sweater.", "Put on your jacket.", "Put on your sweater.", "Put on your shirt."], correct: 2 }
]

export const listenOrderBank5b = [
  { sentence: "Whose coat is this?", zh: "这是谁的外套？", words: ["Whose", "coat", "is", "this?"], answer: ["Whose", "coat", "is", "this?"] },
  { sentence: "It is mine.", zh: "这是我的。", words: ["It", "is", "mine."], answer: ["It", "is", "mine."] },
  { sentence: "Whose shorts are those?", zh: "那些是谁的短裤？", words: ["Whose", "shorts", "are", "those?"], answer: ["Whose", "shorts", "are", "those?"] },
  { sentence: "They are my brother's.", zh: "他们是我哥哥的。", words: ["They", "are", "my", "brother's."], answer: ["They", "are", "my", "brother's."] },
  { sentence: "Take off your jacket.", zh: "脱掉你的夹克。", words: ["Take", "off", "your", "jacket."], answer: ["Take", "off", "your", "jacket."] }
]

export const listenResponseBank5b = [
  { question: "Whose jacket is this?", zh: "这是谁的夹克？", options: ["It's Amy's.", "Yes, it is.", "They're mine.", "It's a jacket."], correct: 0 },
  { question: "Are these your shorts?", zh: "这些是你的短裤吗？", options: ["It's my shorts.", "Yes, they are.", "No, it isn't.", "They are shorts."], correct: 1 },
  { question: "Whose shoes are those?", zh: "那些是谁的鞋子？", options: ["They are Sarah's.", "It is Sarah's.", "Yes, they are.", "They are Sarah."], correct: 0 },
  { question: "Is this your sweater?", zh: "这是你的毛衣吗？", options: ["Yes, they are.", "No, it is my coat.", "Yes, it's mine.", "This is a sweater."], correct: 2 },
  { question: "Can I wear my shirt?", zh: "我能穿我的衬衫吗？", options: ["Yes, you are.", "Yes, you can.", "No, I can't.", "It's your shirt."], correct: 1 }
]

export const listenTranslateBank5b = [
  { sentence: "Whose coat is this?", options: ["这是谁的衬衫？", "这是你的外套吗？", "那谁的外套？", "这是谁的外套？"], correct: 3 },
  { sentence: "It's mine.", options: ["这是你的。", "这是他的。", "这是我的。", "这是她的。"], correct: 2 },
  { sentence: "Whose pants are those?", options: ["那些是谁的裤子？", "这些是谁的裤子？", "那是谁的短裤？", "那些是谁的鞋子？"], correct: 0 },
  { sentence: "They are your father's.", options: ["它们是他爸爸的。", "它们是你妈妈的。", "它们是你爸爸的。", "它是你爸爸的。"], correct: 2 },
  { sentence: "Put on your sweater.", options: ["穿上你的夹克。", "穿上你的外套。", "穿上你的毛衣。", "脱掉你的毛衣。"], correct: 2 }
]
