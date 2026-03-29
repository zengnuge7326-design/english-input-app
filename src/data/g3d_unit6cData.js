// PEP三年级下册 Unit 6 Part C《Story time / Let's check》题库
// 主题：Unit 6 综合复习 (数字 11-20、询问数量 has/have/see的区别)
// 7种题型，每种5题，共35题

export const quizBankG3D6c = [
  { question: "How ___ apples do you have?", chinese: "你有多少个苹果？", options: ["many", "much", "old", "are"], correct: 0, explanation: "询问可数名词数量用 How many。", tag: "疑问词" },
  { question: "I ___ 15 cars. And you?", chinese: "我有15辆小汽车。你呢？", options: ["have", "has", "see", "am"], correct: 0, explanation: "表达拥有用 have。", tag: "动词" },
  { question: "I ___ 16 birds in the tree.", chinese: "我看见树上有16只鸟。", options: ["see", "have", "look", "run"], correct: 0, explanation: "看见 birds 用 see。", tag: "动词" },
  { question: "Fifteen, sixteen, ___, eighteen.", chinese: "十五、十六、十七、十八。", options: ["seventeen", "seventy", "seven", "eleven"], correct: 0, explanation: "数字顺序。", tag: "数词" },
  { question: "10 + 2 = ___ (十加二等于)", chinese: "十加二等于十二。", options: ["twelve", "eleven", "thirteen", "ten"], correct: 0, explanation: "数字计算。", tag: "计算" }
]

export const fillblankBankG3D6c = [
  { sentence: "How ___ (多少) do you have?", answer: "many", chinese: "你有多少个？", explanation: "How many", tag: "疑问句" },
  { sentence: "We ___ (有) seventeen.", answer: "have", chinese: "我们有十七个。", explanation: "have 有", tag: "动词" },
  { sentence: "I ___ (看见) thirteen.", answer: "see", chinese: "我看见十三个。", explanation: "see 看见", tag: "动词" },
  { sentence: "It's ___ (美丽的)!", answer: "beautiful", chinese: "它很漂亮！", explanation: "beautiful", tag: "形容词" },
  { sentence: "One, two, three... ___ (连词) twenty!", answer: "and", chinese: "一，二，三……以及二十！", explanation: "and 或者", tag: "连词" }
]

export const listenWordBankG3D6c = [
  { word: "thirteen", options: ["thirty", "three", "thirteen", "fourteen"], correct: 2, zh: "十三" },
  { word: "fifteen", options: ["fifty", "fifteen", "five", "sixteen"], correct: 1, zh: "十五" },
  { word: "seventeen", options: ["seven", "seventeen", "eleven", "seventy"], correct: 1, zh: "十七" },
  { word: "twenty", options: ["twelve", "two", "twenty", "ten"], correct: 2, zh: "二十" },
  { word: "beautiful", options: ["beautiful", "useful", "colourful", "careful"], correct: 0, zh: "美丽的" }
]

export const listenSentenceBankG3D6c = [
  { sentence: "How many apples do you have?", zh: "你有多少个苹果？", options: ["How many apples do you see?", "How many apples do you have?", "How many pears do you have?", "How many cars do you have?"], correct: 1 },
  { sentence: "I see eighteen.", zh: "我看见十八个。", options: ["I see eighteen.", "I have eighteen.", "I see sixteen.", "I see eighty."], correct: 0 },
  { sentence: "We have twenty cars.", zh: "我们有二十辆小汽车。", options: ["We have twelve cars.", "We have twenty cars.", "I have twenty cars.", "We see twenty cars."], correct: 1 },
  { sentence: "It's beautiful!", zh: "真漂亮！", options: ["It's big!", "It's beautiful!", "It's small!", "It's yellow!"], correct: 1 },
  { sentence: "Open and see!", zh: "打开看看！", options: ["Open the window!", "Look and see!", "Open and see!", "Wait a minute!"], correct: 2 }
]

export const listenOrderBankG3D6c = [
  { sentence: "How many do you have?", zh: "你有多少个？", words: ["How", "many", "do", "you", "have?"], answer: ["How", "many", "do", "you", "have?"] },
  { sentence: "I see thirteen.", zh: "我看到十三个。", words: ["I", "see", "thirteen."], answer: ["I", "see", "thirteen."] },
  { sentence: "We have twenty.", zh: "我们有二十个。", words: ["We", "have", "twenty."], answer: ["We", "have", "twenty."] },
  { sentence: "Open and see!", zh: "打开看看！", words: ["Open", "and", "see!"], answer: ["Open", "and", "see!"] },
  { sentence: "It's beautiful!", zh: "很漂亮！", words: ["It's", "beautiful!"], answer: ["It's", "beautiful!"] }
]

export const listenResponseBankG3D6c = [
  { question: "How many cars do you have?", zh: "你们有几辆小汽车？", options: ["We have twenty.", "I see twelve.", "It's beautiful.", "Thanks."], correct: 0 },
  { question: "How many do you see?", zh: "你看见多少个？", options: ["I see thirteen.", "I have ten.", "Yes, I do.", "Let's go."], correct: 0 },
  { question: "Look at my kites.", zh: "看我的风筝。", options: ["They are beautiful.", "Me too.", "It is under the desk.", "Welcome."], correct: 0 },
  { question: "Open and see!", zh: "打开看看！", options: ["Wow! So many apples!", "Hello.", "It's tall.", "Bye."], correct: 0 },
  { question: "Let's count apples.", zh: "我们数苹果吧。", options: ["OK. One, two...", "Thank you.", "I like pears.", "See you."], correct: 0 }
]

export const listenTranslateBankG3D6c = [
  { sentence: "How many do you have?", options: ["你看见多少个？", "你们有多少个？", "你多大了？", "你想吃什么？"], correct: 1 },
  { sentence: "I see eighteen.", options: ["我看见八个。", "我看见十八个。", "我有十八个。", "我看见十二个。"], correct: 1 },
  { sentence: "We have twenty.", options: ["我们看见二十个。", "我们有十二个。", "我们有二十个。", "我有二十个。"], correct: 2 },
  { sentence: "It's beautiful!", options: ["真高大啊！", "真漂亮！", "太胖了！", "很大！"], correct: 1 },
  { sentence: "Open and see!", options: ["睁开眼看！", "打开看看！", "过来看看！", "等一下看！"], correct: 1 }
]
