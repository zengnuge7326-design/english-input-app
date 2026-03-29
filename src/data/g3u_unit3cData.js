// PEP三年级上册 Unit 3 Part C《Story time / Let's check》题库
// 主题：Unit 3 综合复习 (所有身体部位与动作)
// 7种题型，每种5题，共35题

export const quizBankG3U3c = [
  { question: "Shake your ___.", chinese: "摇摇你的腿。", options: ["legs", "arms", "hands", "face"], correct: 0, explanation: "shake legs 抖腿/摇摇腿，与手、脸搭配不常见(shake hands是握手)。", tag: "搭配" },
  { question: "This is ___ head.", chinese: "这是我的头。", options: ["I", "my", "me", "mine"], correct: 1, explanation: "我的头用形容词性物主代词 my。", tag: "代词" },
  { question: "How ___ you?", chinese: "你好吗？", options: ["is", "am", "are", "do"], correct: 2, explanation: "How are you? 固定问候。", tag: "语法" },
  { question: "Let's ___ together.", chinese: "让我们一起去学校。", options: ["go", "goes", "to go", "going"], correct: 0, explanation: "Let's 后接动词原形。", tag: "语法" },
  { question: "Look ___ me.", chinese: "看着我。", options: ["to", "in", "on", "at"], correct: 3, explanation: "look at 是“看着...”的固定搭配。", tag: "介词" }
]

export const fillblankBankG3U3c = [
  { sentence: "This is my ___ (头).", answer: "head", chinese: "这是我的头。", explanation: "head 头。", tag: "词汇" },
  { sentence: "Look ___ (看) me.", answer: "at", chinese: "看着我。", explanation: "look at", tag: "介词" },
  { sentence: "Touch your ___ (眼睛，复数).", answer: "eyes", chinese: "摸摸你的眼睛。", explanation: "eyes 眼睛", tag: "词汇" },
  { sentence: "How ___ (是) you?", answer: "are", chinese: "你最近好吗？", explanation: "How are you?", tag: "动词" },
  { sentence: "Let's ___ (制作) a puppet.", answer: "make", chinese: "让我们做个木偶吧。", explanation: "make 制作。", tag: "动词" }
]

export const listenWordBankG3U3c = [
  { word: "head", options: ["hand", "head", "hat", "hard"], correct: 1, zh: "头" },
  { word: "puppet", options: ["puppy", "puppet", "apple", "purple"], correct: 1, zh: "木偶" },
  { word: "touch", options: ["touch", "teach", "catch", "match"], correct: 0, zh: "触摸" },
  { word: "wave", options: ["wave", "cave", "save", "have"], correct: 0, zh: "挥手" },
  { word: "shake", options: ["snake", "make", "take", "shake"], correct: 3, zh: "摇晃" }
]

export const listenSentenceBankG3U3c = [
  { sentence: "Let's make a puppet.", zh: "让我们做个木偶吧。", options: ["Let's make a kite.", "Let's make a puppet.", "Let's make a cake.", "Let's make a bed."], correct: 1 },
  { sentence: "This is the arm.", zh: "这是手臂。", options: ["This is the leg.", "This is the hand.", "This is the arm.", "This is the head."], correct: 2 },
  { sentence: "Shake your body.", zh: "摇你的身体。", options: ["Shake your head.", "Shake your legs.", "Shake your body.", "Shake your hand."], correct: 2 },
  { sentence: "Touch your nose.", zh: "摸摸你的鼻子。", options: ["Touch your mouth.", "Touch your nose.", "Touch your face.", "Touch your ear."], correct: 1 },
  { sentence: "I'm fine, thank you.", zh: "我很好，谢谢你。", options: ["I'm fine, thank you.", "Very well, thanks.", "How are you?", "Nice to meet you."], correct: 0 }
]

export const listenOrderBankG3U3c = [
  { sentence: "Let's make a puppet.", zh: "我们来做个木偶吧。", words: ["Let's", "make", "a", "puppet."], answer: ["Let's", "make", "a", "puppet."] },
  { sentence: "This is the head.", zh: "这是头。", words: ["This", "is", "the", "head."], answer: ["This", "is", "the", "head."] },
  { sentence: "Look at me.", zh: "看着我。", words: ["Look", "at", "me."], answer: ["Look", "at", "me."] },
  { sentence: "Shake your legs.", zh: "抖抖你的腿。", words: ["Shake", "your", "legs."], answer: ["Shake", "your", "legs."] },
  { sentence: "How are you?", zh: "你好吗？", words: ["How", "are", "you?"], answer: ["How", "are", "you?"] }
]

export const listenResponseBankG3U3c = [
  { question: "How are you?", zh: "你最近好吗？", options: ["Very well, thanks.", "Nice to meet you.", "Hello.", "See you."], correct: 0 },
  { question: "Let's make a puppet.", zh: "让我们做个玩偶。", options: ["Great!", "Thank you.", "Hello.", "Goodbye."], correct: 0 },
  { question: "This is my face.", zh: "这是我的脸。", options: ["Nice to meet you.", "Oh.", "Thank you.", "Bye."], correct: 1 },
  { question: "Touch your ear.", zh: "摸摸你的耳朵。", options: ["OK.", "Hello.", "It's an ear.", "Are you Mike?"], correct: 0 },
  { question: "Shake your body.", zh: "扭扭你的身体。", options: ["OK.", "Hello.", "Goodbye.", "Nice to meet you."], correct: 0 }
]

export const listenTranslateBankG3U3c = [
  { sentence: "Let's make a puppet.", options: ["让我们去玩吧。", "让我们做个风筝。", "让我们做个木偶吧。", "让我们画个画。"], correct: 2 },
  { sentence: "This is the arm.", options: ["这是手臂。", "这是腿。", "这是手。", "这是脚。"], correct: 0 },
  { sentence: "Shake your body.", options: ["拍拍你的手。", "跺跺你的脚。", "挥挥你的手臂。", "摇动你的身体。"], correct: 3 },
  { sentence: "Touch your mouth.", options: ["摸摸你的鼻子。", "摸摸你的嘴巴。", "摸摸你的脸。", "闭上嘴。"], correct: 1 },
  { sentence: "I'm fine, thank you.", options: ["你好吗？", "很高兴见到你。", "我很好，谢谢你。", "我也很好。"], correct: 2 }
]
