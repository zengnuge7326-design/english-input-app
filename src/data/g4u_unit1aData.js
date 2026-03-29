// PEP四年级上册 Unit 1 Part A《My classroom》题库
// 主题：教室里的物品 (classroom, window, blackboard, light, picture, door) + Where is it?
// 7种题型，每种5题，共35题

export const quizBankG4U1a = [
  { question: "What's in the ___?", chinese: "教室里有什么？", options: ["classroom", "home", "desk", "bed"], correct: 0, explanation: "本单元主题是教室，问教室里有什么用 classroom。", tag: "词汇" },
  { question: "___ is it? It's near the window.", chinese: "它在哪里？它在窗户旁边。", options: ["What", "Where", "Who", "How"], correct: 1, explanation: "回答是在窗户旁，所以问句是用 Where 问地点。", tag: "疑问词" },
  { question: "Let's go and ___!", chinese: "让我们去看看吧！", options: ["sees", "see", "seeing", "saw"], correct: 1, explanation: "Let's 后接动词原形 see。", tag: "语法" },
  { question: "It is ___ the blackboard.", chinese: "它在黑板上。", options: ["in", "on", "at", "to"], correct: 1, explanation: "在表面上用介词 on。", tag: "介词" },
  { question: "Turn on the ___.", chinese: "打开灯。", options: ["light", "window", "door", "blackboard"], correct: 0, explanation: "灯 (light) 可以 turned on (打开)。", tag: "短语" }
]

export const fillblankBankG4U1a = [
  { sentence: "What's ___ (在…里面) the classroom?", answer: "in", chinese: "教室里有什么？", explanation: "in 在里面。", tag: "介词" },
  { sentence: "Clean the ___ (窗户).", answer: "window", chinese: "擦窗户。", explanation: "window 窗户。", tag: "词汇" },
  { sentence: "Put up the ___ (图画，照片).", answer: "picture", chinese: "贴图画。", explanation: "picture 图画/照片。", tag: "词汇" },
  { sentence: "It's near the ___ (门).", answer: "door", chinese: "它在门附近。", explanation: "door 门。", tag: "词汇" },
  { sentence: "___ (哪里) is the kite?", answer: "Where", chinese: "风筝在哪里？", explanation: "where 哪里。", tag: "疑问词" }
]

export const listenWordBankG4U1a = [
  { word: "classroom", options: ["classroom", "bedroom", "bathroom", "mushroom"], correct: 0, zh: "教室" },
  { word: "window", options: ["yellow", "window", "pillow", "shadow"], correct: 1, zh: "窗户" },
  { word: "blackboard", options: ["keyboard", "cardboard", "blackboard", "skateboard"], correct: 2, zh: "黑板" },
  { word: "light", options: ["night", "right", "light", "kite"], correct: 2, zh: "灯" },
  { word: "picture", options: ["nature", "future", "picture", "capture"], correct: 2, zh: "图画" }
]

export const listenSentenceBankG4U1a = [
  { sentence: "What's in the classroom?", zh: "教室里面有什么？", options: ["What's in the bag?", "What's in the classroom?", "Where is the classroom?", "This is the classroom."], correct: 1 },
  { sentence: "Let's go and see.", zh: "我们去看看吧。", options: ["Let's go and play.", "Let's go and see.", "Let me see.", "Let's go to school."], correct: 1 },
  { sentence: "Where is it?", zh: "它在哪里？", options: ["What is it?", "Who is it?", "Where is it?", "How is it?"], correct: 2 },
  { sentence: "It's near the window.", zh: "它在窗户旁边。", options: ["It's near the door.", "It's on the window.", "It's near the window.", "It's under the desk."], correct: 2 },
  { sentence: "Open the door.", zh: "开门。", options: ["Close the door.", "Open the window.", "Open the door.", "Clean the door."], correct: 2 }
]

export const listenOrderBankG4U1a = [
  { sentence: "What's in the classroom?", zh: "教室里有什么？", words: ["What's", "in", "the", "classroom?"], answer: ["What's", "in", "the", "classroom?"] },
  { sentence: "Let's go and see.", zh: "我们去看看吧。", words: ["Let's", "go", "and", "see."], answer: ["Let's", "go", "and", "see."] },
  { sentence: "Where is it?", zh: "它在哪里？", words: ["Where", "is", "it?"], answer: ["Where", "is", "it?"] },
  { sentence: "It's near the window.", zh: "它在窗户旁边。", words: ["It's", "near", "the", "window."], answer: ["It's", "near", "the", "window."] },
  { sentence: "Look at the picture.", zh: "看那幅画。", words: ["Look", "at", "the", "picture."], answer: ["Look", "at", "the", "picture."] }
]

export const listenResponseBankG4U1a = [
  { question: "Where is the picture?", zh: "图画在哪里？", options: ["It's big.", "It is near the door.", "Yes, it is.", "I see a picture."], correct: 1 },
  { question: "What's in the classroom?", zh: "教室里面有什么？", options: ["One blackboard and many desks.", "It is a classroom.", "Yes, I'm in the classroom.", "It's near the desk."], correct: 0 },
  { question: "Let's go and see.", zh: "我们去看看吧。", options: ["It's my desk.", "OK.", "Yes, it is.", "I see a bird."], correct: 1 },
  { question: "Is it near the window?", zh: "它在窗户的旁边吗？", options: ["Yes, it is.", "It is a window.", "I can see the window.", "No, it is a door."], correct: 0 },
  { question: "Turn on the light.", zh: "打开灯。", options: ["It is a light.", "OK.", "I see the light.", "It is bright."], correct: 1 }
]

export const listenTranslateBankG4U1a = [
  { sentence: "What's in the classroom?", options: ["教室在哪里？", "书包里有什么？", "教室里有什么？", "这是谁的教室？"], correct: 2 },
  { sentence: "Where is it?", options: ["它是什么？", "它是谁？", "它在哪里？", "风筝在哪里？"], correct: 2 },
  { sentence: "It's near the window.", options: ["它在窗户旁边。", "它在门的旁边。", "它在课桌下面。", "它在风筝旁边。"], correct: 0 },
  { sentence: "Turn on the light.", options: ["关上灯。", "打开灯。", "擦黑板。", "贴图画。"], correct: 1 },
  { sentence: "Let's go and see.", options: ["让我们去玩吧。", "让我们去上学吧。", "让我看看。", "让我们去看看吧。"], correct: 3 }
]
