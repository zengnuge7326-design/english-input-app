// PEP四年级上册 Unit 1 Part C《Story time / Let's check》题库
// 主题：Unit 1 综合复习 (教室物品及打扫动作)
// 7种题型，每种5题，共35题

export const quizBankG4U1c = [
  { question: "___ clean the teacher's desk.", chinese: "让我来擦讲台。", options: ["Let's", "Let me", "I'm", "My"], correct: 1, explanation: "Let me = 让我来做某事。Let's = 让我们一起做某事。", tag: "短语" },
  { question: "The ___ is on the teacher's desk.", chinese: "电脑在讲台上。", options: ["door", "window", "computer", "floor"], correct: 2, explanation: "电脑 (computer) 通常放在桌子上。", tag: "词汇" },
  { question: "___ in your desk? A book.", chinese: "你的课桌里有什么？一本书。", options: ["What's", "Where's", "Who's", "How's"], correct: 0, explanation: "问有什么东西，用 What's。", tag: "疑问词" },
  { question: "There is a bee ___ the blackboard.", chinese: "黑板上有一只蜜蜂。", options: ["in", "on", "at", "to"], correct: 1, explanation: "在表面上，用 on。", tag: "介词" },
  { question: "Let's ___ and see.", chinese: "让我们去看看。", options: ["going", "goes", "go", "went"], correct: 2, explanation: "Let's 后接动词原形。", tag: "语法" }
]

export const fillblankBankG4U1c = [
  { sentence: "What's in the ___ (教室)?", answer: "classroom", chinese: "教室里有什么？", explanation: "classroom 教室。", tag: "词汇" },
  { sentence: "Let's clean the ___ (黑板).", answer: "blackboard", chinese: "让我们擦黑板。", explanation: "blackboard 黑板。", tag: "词汇" },
  { sentence: "It's near the ___ (窗户).", answer: "window", chinese: "它在窗户旁边。", explanation: "window 窗户。", tag: "词汇" },
  { sentence: "Let ___ (让我) clean the floor.", answer: "me", chinese: "让我扫地。", explanation: "Let me 让我...", tag: "短语" },
  { sentence: "The ___ (墙) is blue.", answer: "wall", chinese: "这面墙是蓝色的。", explanation: "wall 墙。", tag: "词汇" }
]

export const listenWordBankG4U1c = [
  { word: "board", options: ["boat", "board", "bird", "bore"], correct: 1, zh: "黑板/木板" },
  { word: "desk", options: ["disk", "deck", "desk", "duck"], correct: 2, zh: "书桌" },
  { word: "chair", options: ["hair", "chair", "cheer", "share"], correct: 1, zh: "椅子" },
  { word: "near", options: ["ear", "year", "dear", "near"], correct: 3, zh: "在...附近" },
  { word: "under", options: ["uncle", "under", "up", "umbrella"], correct: 1, zh: "在...下面" }
]

export const listenSentenceBankG4U1c = [
  { sentence: "What's in the classroom?", zh: "教室里有什么？", options: ["Where is the classroom?", "What's in the classroom?", "What's in the bag?", "This is a classroom."], correct: 1 },
  { sentence: "Let me clean the windows.", zh: "让我擦窗户。", options: ["Let me clean the board.", "Let me clean the desk.", "Let me clean the windows.", "Let me clean the floor."], correct: 2 },
  { sentence: "It's near the door.", zh: "它在门附近。", options: ["It's near the door.", "It's near the window.", "It's under the desk.", "It's on the chair."], correct: 0 },
  { sentence: "Look at the blackboard.", zh: "看着黑板。", options: ["Look at the dog.", "Look at the blackboard.", "Look at the book.", "Look at the boy."], correct: 1 },
  { sentence: "Let's go and see.", zh: "让我们去看看吧。", options: ["Let's go to sleep.", "Let's go and play.", "Let's go to school.", "Let's go and see."], correct: 3 }
]

export const listenOrderBankG4U1c = [
  { sentence: "What is in the classroom?", zh: "教室里有什么？", words: ["What", "is", "in", "the", "classroom?"], answer: ["What", "is", "in", "the", "classroom?"] },
  { sentence: "Let me clean the board.", zh: "让我擦黑板。", words: ["Let", "me", "clean", "the", "board."], answer: ["Let", "me", "clean", "the", "board."] },
  { sentence: "It is near the desk.", zh: "它在书桌旁边。", words: ["It", "is", "near", "the", "desk."], answer: ["It", "is", "near", "the", "desk."] },
  { sentence: "The fan is green.", zh: "风扇是绿色的。", words: ["The", "fan", "is", "green."], answer: ["The", "fan", "is", "green."] },
  { sentence: "Look at the new computer.", zh: "看这台新电脑。", words: ["Look", "at", "the", "new", "computer."], answer: ["Look", "at", "the", "new", "computer."] }
]

export const listenResponseBankG4U1c = [
  { question: "Where is my pencil?", zh: "我的铅笔在哪里？", options: ["It's a pencil.", "It's under your book.", "I have a pencil.", "Blue."], correct: 1 },
  { question: "Let's clean the classroom.", zh: "让我们打扫教室吧。", options: ["OK.", "Yes, it is.", "The classroom is big.", "Thank you."], correct: 0 },
  { question: "What's in your desk?", zh: "你书桌里有什么？", options: ["It's on the desk.", "A ruler and a pen.", "It is under the chair.", "I like desks."], correct: 1 },
  { question: "Is it near the window?", zh: "它在窗户旁边吗？", options: ["Yes, they are.", "No, it is near the door.", "Yes, I am.", "It's a window."], correct: 1 },
  { question: "Let me help you.", zh: "让我帮你。", options: ["Help me.", "Thank you.", "I am fine.", "No, I am not."], correct: 1 }
]

export const listenTranslateBankG4U1c = [
  { sentence: "Let me clean the teacher's desk.", options: ["让我擦黑板。", "让我扫地。", "让我擦讲台。", "让我关窗户。"], correct: 2 },
  { sentence: "What's in the classroom?", options: ["书包里有什么？", "教室里有什么？", "那是谁的教室？", "哪里有教室？"], correct: 1 },
  { sentence: "It's near the door.", options: ["它在门旁边。", "它在窗户旁边。", "它在桌子底下。", "它在墙上。"], correct: 0 },
  { sentence: "Look at the picture.", options: ["看那本书。", "看那台电脑。", "看那个风扇。", "看那幅画。"], correct: 3 },
  { sentence: "Let's go and see.", options: ["让我们去玩吧。", "让我们去看看吧。", "让我看看。", "我想去看看。"], correct: 1 }
]
