// PEP四年级上册 Unit 1 Part B《Let's learn / Let's talk》题库
// 主题：教室清洁与物品 (teacher's desk, computer, fan, wall, floor) + Let's clean the classroom. + a-e发音规则
// 7种题型，每种5题，共35题

export const quizBankG4U1b = [
  { question: "Let's ___ the classroom.", chinese: "让我们打扫教室吧。", options: ["clean", "cleans", "cleaning", "cleaned"], correct: 0, explanation: "Let's 后面接动词原形 clean。", tag: "语法" },
  { question: "Look! This is the ___ desk.", chinese: "看！这是讲台。", options: ["teacher", "teachers", "teacher's", "teachers'"], correct: 2, explanation: "teacher's desk 表示老师的桌子，即讲台。", tag: "词汇" },
  { question: "Let me clean the ___.", chinese: "让我来擦黑板。", options: ["floor", "blackboard", "wall", "door"], correct: 1, explanation: "通常是擦黑板 (clean the blackboard)；擦地板常说 sweep the floor (但小学阶段也可用clean)。选最符合语境搭配的。", tag: "搭配" },
  { question: "Which word has the 'a-e' sound like in 'cake'?", chinese: "哪个词里面的 a-e 发音和 cake 里的发音相同？", options: ["cat", "name", "bag", "apple"], correct: 1, explanation: "a-e结构通常发双元音 /eɪ/，此时e不发音。如 cake, name。", tag: "拼读" },
  { question: "The ___ is green. The floor is green too.", chinese: "墙是绿色的。地板也是绿色的。", options: ["wall", "computer", "fan", "light"], correct: 0, explanation: "wall 是墙壁，与地板(floor)呼应形成空间描述。", tag: "词汇" }
]

export const fillblankBankG4U1b = [
  { sentence: "Let ___ (让我) clean the window.", answer: "me", chinese: "让我来擦窗户。", explanation: "Let me 让我...", tag: "短语" },
  { sentence: "This is a ___ (电脑).", answer: "computer", chinese: "这是一台电脑。", explanation: "computer 计算机。", tag: "词汇" },
  { sentence: "Look at the ___ (风扇).", answer: "fan", chinese: "看那个风扇。", explanation: "fan 风扇。", tag: "词汇" },
  { sentence: "The ___ (墙) is white.", answer: "wall", chinese: "墙是白色的。", explanation: "wall 墙。", tag: "词汇" },
  { sentence: "Clean the ___ (地板).", answer: "floor", chinese: "打扫地板。", explanation: "floor 地板。", tag: "词汇" }
]

export const listenWordBankG4U1b = [
  { word: "computer", options: ["commuter", "computer", "competitor", "commander"], correct: 1, zh: "电脑" },
  { word: "fan", options: ["fun", "van", "fan", "fat"], correct: 2, zh: "风扇" },
  { word: "wall", options: ["ball", "wall", "tall", "fall"], correct: 1, zh: "墙" },
  { word: "floor", options: ["door", "four", "floor", "flow"], correct: 2, zh: "地板" },
  { word: "clean", options: ["clear", "clean", "cream", "clock"], correct: 1, zh: "打扫/清洁" }
]

export const listenSentenceBankG4U1b = [
  { sentence: "Let's clean the classroom.", zh: "让我们打扫教室吧。", options: ["Let's go to the classroom.", "Let me clean the classroom.", "Let's clean the classroom.", "Let's clean the desk."], correct: 2 },
  { sentence: "Let me clean the windows.", zh: "让我擦窗户。", options: ["Let me clean the board.", "Let me clean the floor.", "Let me clean the windows.", "Let me clean the desks."], correct: 2 },
  { sentence: "Look! This is the teacher's desk.", zh: "看！这是讲台。", options: ["Look! This is the student's desk.", "Look! This is a computer.", "Look! This is the teacher's desk.", "Look at the teacher."], correct: 2 },
  { sentence: "The wall is white.", zh: "墙是白色的。", options: ["The floor is white.", "The wall is white.", "The door is white.", "The window is white."], correct: 1 },
  { sentence: "The floor is green.", zh: "地板是绿色的。", options: ["The door is green.", "The wall is green.", "The floor is green.", "The board is green."], correct: 2 }
]

export const listenOrderBankG4U1b = [
  { sentence: "Let's clean the classroom.", zh: "让我们打扫教室吧。", words: ["Let's", "clean", "the", "classroom."], answer: ["Let's", "clean", "the", "classroom."] },
  { sentence: "Let me clean the floor.", zh: "让我来扫地。", words: ["Let", "me", "clean", "the", "floor."], answer: ["Let", "me", "clean", "the", "floor."] },
  { sentence: "This is a computer.", zh: "这是一台电脑。", words: ["This", "is", "a", "computer."], answer: ["This", "is", "a", "computer."] },
  { sentence: "Look at the wall.", zh: "看这面墙。", words: ["Look", "at", "the", "wall."], answer: ["Look", "at", "the", "wall."] },
  { sentence: "The fan is blue.", zh: "风扇是蓝色的。", words: ["The", "fan", "is", "blue."], answer: ["The", "fan", "is", "blue."] }
]

export const listenResponseBankG4U1b = [
  { question: "Let's clean the classroom.", zh: "让我们打扫教室。", options: ["OK.", "It's near the window.", "It's a computer.", "I like the classroom."], correct: 0 },
  { question: "What's in the classroom?", zh: "教室里有什么？", options: ["Let's go.", "Look at the window.", "A blackboard and many desks.", "OK."], correct: 2 },
  { question: "Let me clean the teacher's desk.", zh: "让我擦讲台。", options: ["Where is it?", "Thank you.", "It is big.", "Let me."], correct: 1 },
  { question: "Where is the fan?", zh: "风扇在哪里？", options: ["It's near the window.", "It is a fan.", "It's blue.", "I can see a fan."], correct: 0 },
  { question: "Is this a computer?", zh: "这是一台电脑吗？", options: ["I have a computer.", "Yes, it is.", "It is white.", "No, they aren't."], correct: 1 }
]

export const listenTranslateBankG4U1b = [
  { sentence: "Let's clean the classroom.", options: ["我们要去教室。", "教室很干净。", "让我们打扫教室吧。", "让我擦黑板。"], correct: 2 },
  { sentence: "Let me clean the windows.", options: ["让我擦窗户。", "让我扫地。", "让我擦桌子。", "我们擦窗户。"], correct: 0 },
  { sentence: "This is the teacher's desk.", options: ["这是老师的椅子。", "这是讲台。", "这是学生的桌子。", "老师在课桌旁。"], correct: 1 },
  { sentence: "Look at the computer.", options: ["这是我的电脑。", "我喜欢这台电脑。", "看这台电脑。", "电脑在哪里？"], correct: 2 },
  { sentence: "The floor is green.", options: ["门是绿色的。", "墙是绿色的。", "窗户是白色的。", "地板是绿色的。"], correct: 3 }
]
