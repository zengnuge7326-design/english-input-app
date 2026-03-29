// PEP五年级上册 Unit 6 Part A《In a nature park》题库
// 主题：自然公园景物1 (forest, river, lake, mountain, hill) + Is there a river in the park?
// 7种题型，每种5题，共35题

export const quizBankG5U6a = [
  { question: "___ there a river in the park?", chinese: "公园里有河吗？", options: ["Is", "Are", "Am", "Do"], correct: 0, explanation: "单数名词 a river，用 Is 提问。", tag: "系动词" },
  { question: "Let's go to the ___ park.", chinese: "我们去自然公园吧。", options: ["nature", "natural", "city", "farm"], correct: 0, explanation: "自然公园 nature park。", tag: "专有名词" },
  { question: "Is there a lake? Yes, there ___.", chinese: "有个湖吗？是的，有。", options: ["is", "isn't", "are", "do"], correct: 0, explanation: "Is there 的肯定回答是 Yes, there is.", tag: "语法" },
  { question: "The mountain is very ___.", chinese: "这座山非常高。", options: ["high", "long", "old", "young"], correct: 0, explanation: "山通常用高 high（或tall，但high更常见）。", tag: "形容词" },
  { question: "Let's go ___.", chinese: "我们去划船吧。", options: ["boating", "boat", "boats", "to boat"], correct: 0, explanation: "去划船 go boating，是固定搭配。", tag: "词组搭配" }
]

export const fillblankBankG5U6a = [
  { sentence: "___ (是) there a river?", answer: "Is", chinese: "这里有一条河吗？", explanation: "Is（首字母大写）", tag: "系动词" },
  { sentence: "Let's go to the ___ (自然) park.", answer: "nature", chinese: "我们去自然公园吧。", explanation: "nature 自然", tag: "名词短语" },
  { sentence: "There is a big ___ (山脉).", answer: "mountain", chinese: "有一座大山。", explanation: "mountain山", tag: "名词" },
  { sentence: "There is a small ___ (山丘).", answer: "hill", chinese: "有一座小山丘。", explanation: "hill 小山", tag: "名词" },
  { sentence: "I can see a ___ (湖).", answer: "lake", chinese: "我能看到一个湖。", explanation: "lake 湖", tag: "名词" }
]

export const listenWordBankG5U6a = [
  { word: "forest", options: ["for", "forest", "fire", "first"], correct: 1, zh: "森林" },
  { word: "river", options: ["river", "driver", "ride", "liver"], correct: 0, zh: "河流" },
  { word: "mountain", options: ["mouse", "monkey", "mountain", "mouth"], correct: 2, zh: "高山" },
  { word: "hill", options: ["hill", "hall", "hello", "hold"], correct: 0, zh: "小山丘" },
  { word: "lake", options: ["lake", "like", "make", "cake"], correct: 0, zh: "湖泊" }
]

export const listenSentenceBankG5U6a = [
  { sentence: "Is there a river in the park?", zh: "公园里有一条河吗？", options: ["Is there a lake in the park?", "Is there a river in the forest?", "Is there a river in the park?", "Are there any rivers in the park?"], correct: 2 },
  { sentence: "Yes, there is.", zh: "是的，有。", options: ["Yes, there is.", "No, there isn't.", "Yes, it is.", "No, it isn't."], correct: 0 },
  { sentence: "Let's go to the nature park.", zh: "我们去自然公园吧。", options: ["Let's go to the zoo.", "Let's go to the farm.", "Let's go to the nature park.", "Let's go boating."], correct: 2 },
  { sentence: "There is a big mountain.", zh: "有一座大山。", options: ["There is a small hill.", "There is a big mountain.", "There is a long river.", "There is a deep lake."], correct: 1 },
  { sentence: "Let's go boating.", zh: "我们去划船吧。", options: ["Let's go swimming.", "Let's go fishing.", "Let's go boating.", "Let's go hiking."], correct: 2 }
]

export const listenOrderBankG5U6a = [
  { sentence: "Is there a river?", zh: "有一条河吗？", words: ["Is", "there", "a", "river?"], answer: ["Is", "there", "a", "river?"] },
  { sentence: "Yes, there is.", zh: "是的，有。", words: ["Yes,", "there", "is."], answer: ["Yes,", "there", "is."] },
  { sentence: "Let's go to the nature park.", zh: "去自然公园吧。", words: ["Let's", "go", "to", "the", "nature", "park."], answer: ["Let's", "go", "to", "the", "nature", "park."] },
  { sentence: "There is a mountain.", zh: "有座大山。", words: ["There", "is", "a", "mountain."], answer: ["There", "is", "a", "mountain."] },
  { sentence: "Let's go boating.", zh: "去划小船吧。", words: ["Let's", "go", "boating."], answer: ["Let's", "go", "boating."] }
]

export const listenResponseBankG5U6a = [
  { question: "Is there a river in the park?", zh: "公园里有河吗？", options: ["Yes, there is.", "Yes, it is.", "There are trees.", "No, it aren't."], correct: 0 },
  { question: "Is there a forest?", zh: "有森林吗？", options: ["No, there isn't.", "I am twelve.", "Thank you.", "I like apples."], correct: 0 },
  { question: "Let's go to the nature park.", zh: "我们去自然公园吧。", options: ["Great!", "No, I am not.", "It is green.", "Bye."], correct: 0 },
  { question: "Let's go boating.", zh: "咱们去划船吧。", options: ["OK.", "Hello.", "I see a bird.", "It's tall."], correct: 0 },
  { question: "What is in the park?", zh: "公园里有什么？", options: ["There is a lake.", "Yes, there is.", "I am singing.", "Welcome."], correct: 0 }
]

export const listenTranslateBankG5U6a = [
  { sentence: "Is there a river in the park?", options: ["公园里有狗吗？", "公园里有河吗？", "公园里有湖吗？", "公园在哪儿？"], correct: 1 },
  { sentence: "Yes, there is.", options: ["是的，有一条。", "不，没有。", "是的，他是。", "是的，我喜欢。"], correct: 0 },
  { sentence: "Let's go to the nature park.", options: ["我们回家吧。", "我们去自然公园吧。", "我们去动物园吧。", "这是自然公园吗？"], correct: 1 },
  { sentence: "There is a big mountain.", options: ["我有一座山。", "有许多小山丘。", "那里有很高的树。", "那里有一座大山。"], correct: 3 },
  { sentence: "Let's go boating.", options: ["我们去洗澡吧。", "我们去划船吧。", "我们去爬山吧。", "我们休息吧。"], correct: 1 }
]
