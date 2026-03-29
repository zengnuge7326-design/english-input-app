// PEP三年级下册 Unit 6 Part B《Let's learn / Let's talk》题库
// 主题：数字 (sixteen, seventeen, eighteen, nineteen, twenty) + How many cars do you have? We have...
// 7种题型，每种5题，共35题

export const quizBankG3D6b = [
  { question: "How many cars ___ you have?", chinese: "你有多少辆小汽车？", options: ["do", "are", "is", "does"], correct: 0, explanation: "询问对方“你们有...”用 do you have?", tag: "助动词" },
  { question: "We ___ twenty cars.", chinese: "我们有二十辆小汽车。", options: ["have", "has", "do", "see"], correct: 0, explanation: "We (我们)，接复数形式有 have。", tag: "动词" },
  { question: "Open ___ see!", chinese: "打开看看！", options: ["and", "or", "but", "to"], correct: 0, explanation: "Open and see! 意思是“打开来看看！”", tag: "连词" },
  { question: "___! So many cars!", chinese: "哇！这么多小汽车！", options: ["Wow", "Ouch", "No", "Sorry"], correct: 0, explanation: "Wow 表示惊叹。", tag: "感叹" },
  { question: "I have ___ apples.", chinese: "我有十七个苹果。", options: ["seventeen", "seven", "seventy", "sixteen"], correct: 0, explanation: "seventeen 十七。", tag: "数词" }
]

export const fillblankBankG3D6b = [
  { sentence: "How many cars ___ (助动词) you have?", answer: "do", chinese: "你有几辆小汽车？", explanation: "do you have", tag: "助动词" },
  { sentence: "We ___ (有) twenty.", answer: "have", chinese: "我们有二十个。", explanation: "have 有", tag: "动词" },
  { sentence: "Open ___ (和/并) see!", answer: "and", chinese: "打开看看！", explanation: "and 连接两个动作。", tag: "连词" },
  { sentence: "I have ___ (十六) crayons.", answer: "sixteen", chinese: "我有十六支蜡笔。", explanation: "sixteen", tag: "数词" },
  { sentence: "Let's count. Eighteen, nineteen, ___ (二十).", answer: "twenty", chinese: "十八，十九，二十。", explanation: "twenty", tag: "数词" }
]

export const listenWordBankG3D6b = [
  { word: "sixteen", options: ["six", "sixty", "sixteen", "sixes"], correct: 2, zh: "十六" },
  { word: "seventeen", options: ["seventy", "seventeen", "seven", "eleven"], correct: 1, zh: "十七" },
  { word: "eighteen", options: ["eight", "eighty", "eighteen", "thirteen"], correct: 2, zh: "十八" },
  { word: "nineteen", options: ["nine", "ninety", "nineteen", "ten"], correct: 2, zh: "十九" },
  { word: "twenty", options: ["twelve", "twenty", "two", "ten"], correct: 1, zh: "二十" }
]

export const listenSentenceBankG3D6b = [
  { sentence: "How many cars do you have?", zh: "你有多少辆汽车？", options: ["How many cats do you have?", "How many cars do you have?", "How many caps do you have?", "How many cars do you see?"], correct: 1 },
  { sentence: "We have twenty.", zh: "我们有二十个。", options: ["We have twelve.", "We have twenty.", "I have twenty.", "We have two."], correct: 1 },
  { sentence: "Open and see!", zh: "打开看看！", options: ["Open the door!", "Open and see!", "Look and see!", "Open your box!"], correct: 1 },
  { sentence: "I have eighteen pencils.", zh: "我有十八支铅笔。", options: ["I have eight pens.", "I have eighteen pencils.", "I have eighteen pens.", "We have eighteen pencils."], correct: 1 },
  { sentence: "Look at my new crayons.", zh: "看我的新蜡笔。", options: ["Look at my big crayons.", "Look at my new crayons.", "Look at my old crayons.", "Look at my red crayons."], correct: 1 }
]

export const listenOrderBankG3D6b = [
  { sentence: "How many do you have?", zh: "你有多少个？", words: ["How", "many", "do", "you", "have?"], answer: ["How", "many", "do", "you", "have?"] },
  { sentence: "We have twenty.", zh: "我们有二十个。", words: ["We", "have", "twenty."], answer: ["We", "have", "twenty."] },
  { sentence: "Open and see!", zh: "打开看看！", words: ["Open", "and", "see!"], answer: ["Open", "and", "see!"] },
  { sentence: "Look at my new crayons.", zh: "看我的新蜡笔。", words: ["Look", "at", "my", "new", "crayons."], answer: ["Look", "at", "my", "new", "crayons."] },
  { sentence: "I have sixteen.", zh: "我有十六个。", words: ["I", "have", "sixteen."], answer: ["I", "have", "sixteen."] }
]

export const listenResponseBankG3D6b = [
  { question: "How many cars do you have?", zh: "你们有几辆小汽车？", options: ["We have twenty.", "I see twelve.", "It's big.", "Goodbye."], correct: 0 },
  { question: "Look at my new crayons.", zh: "看我的新蜡笔。", options: ["Wow! How many do you have?", "I'm ten.", "Yes, it is.", "Thank you."], correct: 0 },
  { question: "Open and see!", zh: "打开看看！", options: ["OK.", "Hello.", "It's a monkey.", "I have two."], correct: 0 },
  { question: "How many apples do you have?", zh: "你吃几个苹果了？(你有几个苹果？)", options: ["I have eighteen.", "Me too.", "It's red.", "Welcome."], correct: 0 },
  { question: "Let's count.", zh: "我们来数数吧。", options: ["One, two, three...", "How are you?", "It's green.", "Goodbye."], correct: 0 }
]

export const listenTranslateBankG3D6b = [
  { sentence: "How many cars do you have?", options: ["你们看见多少辆车？", "你们有多少辆汽车？", "你们有几个猫？", "我有多少车？"], correct: 1 },
  { sentence: "We have twenty.", options: ["我们看到二十个。", "我们有十二个。", "我们有二十个。", "我有二十个。"], correct: 2 },
  { sentence: "Open and see!", options: ["睁开眼睛看！", "打开并观看！", "打开看看！", "请进。"], correct: 2 },
  { sentence: "I have eighteen pencils.", options: ["我有十八支笔。", "我有八支铅笔。", "我有十八支钢笔。", "我有十八支铅笔。"], correct: 3 },
  { sentence: "Look at my new crayons.", options: ["看这支新蜡笔。", "看我的旧蜡笔。", "看我的红蜡笔。", "看我的新蜡笔。"], correct: 3 }
]
