// PEP五年级上册 Unit 5 Part A《There is a big bed》题库
// 主题：房间物品 (clock, plant, bottle, bike, photo) + There is a big bed.
// 7种题型，每种5题，共35题

export const quizBankG5U5a = [
  { question: "___ is a big bed.", chinese: "有一张大床。", options: ["There", "Here", "Where", "They"], correct: 0, explanation: "There is... 某处有某物。", tag: "句型" },
  { question: "There ___ a clock on the desk.", chinese: "书桌上有一个闹钟。", options: ["is", "are", "am", "be"], correct: 0, explanation: "单数名词前用 is。", tag: "系动词" },
  { question: "Look ___ my room.", chinese: "看我的房间。", options: ["at", "in", "on", "to"], correct: 0, explanation: "look at 看...", tag: "介词" },
  { question: "There are two ___ in the room.", chinese: "房间里有两株植物。", options: ["plants", "plant", "photo", "bike"], correct: 0, explanation: "plants (植物的复数形式)。", tag: "名词的复数" },
  { question: "I like my ___.", chinese: "我喜欢我的房间。", options: ["room", "room's", "rooms", "a room"], correct: 0, explanation: "room 房间。", tag: "名词" }
]

export const fillblankBankG5U5a = [
  { sentence: "___ (有) is a big bed in my room.", answer: "There", chinese: "我的房间里有一张大床。", explanation: "There is... 句型，首字母大写。", tag: "副词" },
  { sentence: "There is a ___ (闹钟).", answer: "clock", chinese: "那里有个闹钟。", explanation: "clock 闹钟", tag: "名词" },
  { sentence: "I have a ___ (水瓶).", answer: "bottle", chinese: "我有一个水杯。", explanation: "bottle 瓶子/水杯", tag: "名词" },
  { sentence: "Look at my ___ (照片).", answer: "photo", chinese: "看我的照片。", explanation: "photo", tag: "名词" },
  { sentence: "My ___ (自行车) is nice.", answer: "bike", chinese: "我的自行车很棒。", explanation: "bike 自行车", tag: "名词" }
]

export const listenWordBankG5U5a = [
  { word: "clock", options: ["cloud", "clock", "close", "clean"], correct: 1, zh: "闹钟" },
  { word: "plant", options: ["planet", "plant", "plane", "plate"], correct: 1, zh: "植物" },
  { word: "bottle", options: ["bottom", "bottle", "boat", "boot"], correct: 1, zh: "瓶子" },
  { word: "photo", options: ["phone", "photo", "piano", "panda"], correct: 1, zh: "图片/照片" },
  { word: "bike", options: ["bike", "like", "kite", "lake"], correct: 0, zh: "自行车" }
]

export const listenSentenceBankG5U5a = [
  { sentence: "There is a big bed.", zh: "有一张大床。", options: ["There is a big dog.", "There is a big bed.", "There is a big bird.", "There is a small bed."], correct: 1 },
  { sentence: "There is a clock on the wall.", zh: "墙上有一个时钟。", options: ["There is a clock on the desk.", "There is a picture on the wall.", "There is a clock on the wall.", "There is a photo on the desk."], correct: 2 },
  { sentence: "Look at my room.", zh: "看我的房间。", options: ["Look at my big bed.", "Look at my room.", "Look at my photo.", "Look at my books."], correct: 1 },
  { sentence: "Your room is really nice.", zh: "你的房间真的很漂亮。", options: ["Your room is very big.", "Your room is really nice.", "Your room is very good.", "Your car is really nice."], correct: 1 },
  { sentence: "I have a new bike.", zh: "我有一辆新自行车。", options: ["I have a new kite.", "I have a new bike.", "I have a nice bike.", "I like my new bike."], correct: 1 }
]

export const listenOrderBankG5U5a = [
  { sentence: "There is a big bed.", zh: "有一张大床。", words: ["There", "is", "a", "big", "bed."], answer: ["There", "is", "a", "big", "bed."] },
  { sentence: "Look at my room.", zh: "看我的房间。", words: ["Look", "at", "my", "room."], answer: ["Look", "at", "my", "room."] },
  { sentence: "Your room is really nice.", zh: "你的房间很漂亮。", words: ["Your", "room", "is", "really", "nice."], answer: ["Your", "room", "is", "really", "nice."] },
  { sentence: "There is a computer.", zh: "有一台电脑。", words: ["There", "is", "a", "computer."], answer: ["There", "is", "a", "computer."] },
  { sentence: "Thanks.", zh: "谢谢。", words: ["Thanks."], answer: ["Thanks."] }
]

export const listenResponseBankG5U5a = [
  { question: "Your room is really nice.", zh: "你的房间非常漂亮。", options: ["Thanks.", "Me too.", "It is red.", "Yes, I do."], correct: 0 },
  { question: "What is in your room?", zh: "你房间里有什么？", options: ["There is a big bed.", "I'm ten.", "Yes, there is.", "Welcome."], correct: 0 },
  { question: "Look at my photo.", zh: "看我的照片。", options: ["Wow! Nice.", "I see twelve.", "I wash clothes.", "Bye."], correct: 0 },
  { question: "Where is the clock?", zh: "闹钟在哪里？", options: ["It's on the desk.", "There is a clock.", "Yes, it is.", "Thank you."], correct: 0 },
  { question: "Do you like your room?", zh: "你喜欢你的房间吗？", options: ["Yes, I do.", "There is a bed.", "It is small.", "You're welcome."], correct: 0 }
]

export const listenTranslateBankG5U5a = [
  { sentence: "There is a big bed.", options: ["这是一张大床。", "有一张大床。", "他有一张大床。", "这里只有床。"], correct: 1 },
  { sentence: "Look at my room.", options: ["这是我的房间。", "看我的相片。", "看我的房间。", "我喜欢我的房间。"], correct: 2 },
  { sentence: "Your room is really nice.", options: ["你的图片很美丽。", "你的房间非常漂亮。", "你的书包很漂亮。", "你非常美丽。"], correct: 1 },
  { sentence: "There is a clock in my room.", options: ["我的房间里有一个闹钟。", "我的房间有一个水瓶。", "书桌上有一个闹钟。", "我有一个闹钟。"], correct: 0 },
  { sentence: "Thanks.", options: ["没关系。", "不用谢。", "好的。", "谢谢。"], correct: 3 }
]
