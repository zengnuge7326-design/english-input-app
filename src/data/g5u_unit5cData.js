// PEP五年级上册 Unit 5 Part C《Story time / Let's check》题库
// 主题：Unit 5 综合复习 (There is/are句型、方位介词)
// 7种题型，每种5题，共35题

export const quizBankG5U5c = [
  { question: "___ there a clock in your room?", chinese: "你的房间里有闹钟吗？", options: ["Is", "Are", "Am", "Do"], correct: 0, explanation: "a clock单数，There is的疑问句用Is提前。", tag: "系动词" },
  { question: "There ___ some plants.", chinese: "有一些植物。", options: ["are", "is", "am", "be"], correct: 0, explanation: "plants复数，所以用There are。", tag: "系动词" },
  { question: "The cat is ___ the door.", chinese: "猫在门后面。", options: ["behind", "above", "in", "to"], correct: 0, explanation: "behind 在...后面。", tag: "介词" },
  { question: "My computer is ___ the desk.", chinese: "我的电脑在书桌上。", options: ["on", "beside", "above", "under"], correct: 0, explanation: "on 接触表面；beside旁边；above正上方。", tag: "介词" },
  { question: "___! Beautiful pictures!", chinese: "哇！美丽的画！", options: ["Wow", "Ouch", "No", "Sorry"], correct: 0, explanation: "Wow 表示惊叹。", tag: "感叹" }
]

export const fillblankBankG5U5c = [
  { sentence: "___ (有) is a plant.", answer: "There", chinese: "有一株植物。", explanation: "There is", tag: "副词" },
  { sentence: "There ___ (有复数) two birds.", answer: "are", chinese: "有两只小鸟。", explanation: "are", tag: "系动词" },
  { sentence: "It's ___ (在...上面) the bed.", answer: "on", chinese: "它在床上。", explanation: "on", tag: "介词" },
  { sentence: "It's ___ (在...旁边) the chair.", answer: "beside", chinese: "它在椅子旁边。", explanation: "beside", tag: "介词" },
  { sentence: "She is ___ (在...前面) of the house.", answer: "in front", chinese: "她在房子前面。", explanation: "in front", tag: "短语" }
]

export const listenWordBankG5U5c = [
  { word: "between", options: ["behind", "beside", "between", "bottom"], correct: 2, zh: "在...之间" },
  { word: "bottle", options: ["bottle", "bottom", "boat", "boot"], correct: 0, zh: "水瓶" },
  { word: "front", options: ["fruit", "front", "frog", "from"], correct: 1, zh: "前面" },
  { word: "plant", options: ["planet", "plant", "plane", "plate"], correct: 1, zh: "植物" },
  { word: "there", options: ["where", "here", "their", "there"], correct: 3, zh: "在那里" }
]

export const listenSentenceBankG5U5c = [
  { sentence: "Is there a clock in your room?", zh: "你的房间里有闹钟吗？", options: ["Is there a clock on the desk?", "Is there a clock in your room?", "Are there plants in your room?", "Where is the clock?"], correct: 1 },
  { sentence: "There are some plants.", zh: "有一些植物。", options: ["There is a plant.", "There are some pictures.", "There are some plants.", "There are some photos."], correct: 2 },
  { sentence: "The book is beside the computer.", zh: "书在电脑旁边。", options: ["The book is behind the computer.", "The book is beside the computer.", "The book is on the computer.", "The pen is beside the computer."], correct: 1 },
  { sentence: "Wow! So many pictures!", zh: "哇！这么多照片/画！", options: ["Wow! So many books!", "Wow! So many photos!", "Wow! So many plants!", "Wow! So many pictures!"], correct: 3 },
  { sentence: "My bed is near the window.", zh: "我的床在窗户附近。", options: ["My desk is near the window.", "My bed is near the window.", "My chair is near the window.", "My bed is under the window."], correct: 1 }
]

export const listenOrderBankG5U5c = [
  { sentence: "There are some plants.", zh: "有一些植物。", words: ["There", "are", "some", "plants."], answer: ["There", "are", "some", "plants."] },
  { sentence: "Is there a clock?", zh: "有一个闹钟吗？", words: ["Is", "there", "a", "clock?"], answer: ["Is", "there", "a", "clock?"] },
  { sentence: "The book is beside it.", zh: "书在它旁边。", words: ["The", "book", "is", "beside", "it."], answer: ["The", "book", "is", "beside", "it."] },
  { sentence: "Wow! So many pictures!", zh: "哇！这么多相片！", words: ["Wow!", "So", "many", "pictures!"], answer: ["Wow!", "So", "many", "pictures!"] },
  { sentence: "My bed is near the window.", zh: "我的床靠近窗户。", words: ["My", "bed", "is", "near", "the", "window."], answer: ["My", "bed", "is", "near", "the", "window."] }
]

export const listenResponseBankG5U5c = [
  { question: "Is there a clock in your room?", zh: "你的房间里有一个闹钟吗？", options: ["Yes, there is.", "Yes, it is.", "He is tall.", "I have ten."], correct: 0 },
  { question: "Are there any plants?", zh: "有植物吗？", options: ["Yes, there are.", "No, there isn't.", "They are clever.", "Welcome."], correct: 0 },
  { question: "Where is the cat?", zh: "小猫在哪里？", options: ["It's between the doors.", "She is young.", "I can jump.", "Me too."], correct: 0 },
  { question: "Look at my new room.", zh: "看我的新房间。", options: ["It is really nice.", "Yes, I do.", "Thank you.", "Bye."], correct: 0 },
  { question: "What is on the desk?", zh: "书桌上有什么？", options: ["There is a computer.", "Yes, it is.", "No, I don't.", "I like it."], correct: 0 }
]

export const listenTranslateBankG5U5c = [
  { sentence: "Is there a clock in your room?", options: ["你的房间里有书吗？", "你的客厅里有闹钟吗？", "你的房间里有闹钟吗？", "他在你的房间里吗？"], correct: 2 },
  { sentence: "There are some plants.", options: ["这是一株植物。", "这些是花。", "有一些照片。", "有一些植物。"], correct: 3 },
  { sentence: "The cat is behind the door.", options: ["小猫在门旁边。", "小狗在门后。", "小猫在门后。", "猫跑了。"], correct: 2 },
  { sentence: "My bed is near the window.", options: ["我的床在窗帘下。", "我的床靠近门。", "我的桌子靠近窗户。", "我的床靠近窗户。"], correct: 3 },
  { sentence: "Wow! So many pictures!", options: ["看这副画！", "哇！好多照片/画！", "好多的书本啊！", "太多花儿了！"], correct: 1 }
]
