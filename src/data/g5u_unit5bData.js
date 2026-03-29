// PEP五年级上册 Unit 5 Part B《There is a big bed》题库
// 主题：空间方位 (in front of, beside, between, behind, above) + There are so many pictures.
// 7种题型，每种5题，共35题

export const quizBankG5U5b = [
  { question: "___ are so many pictures here.", chinese: "这里有那么多画。", options: ["There", "They", "Here", "Where"], correct: 0, explanation: "There are 表示“有(复数)”。", tag: "句型" },
  { question: "The ball is ___ front of the dog.", chinese: "球在狗的前面。", options: ["in", "on", "at", "to"], correct: 0, explanation: "in front of 在...前面。", tag: "介词短语" },
  { question: "There is a tree ___ the house.", chinese: "房子旁边有一棵树。", options: ["beside", "at", "to", "between"], correct: 0, explanation: "beside 在...旁边。", tag: "介词" },
  { question: "The cat is ___ the two dogs.", chinese: "猫在两只狗之间。", options: ["between", "in", "above", "behind"], correct: 0, explanation: "between 在两物之间。", tag: "介词" },
  { question: "There is a clock ___ the bed.", chinese: "床上方有一个时钟。", options: ["above", "in", "under", "front"], correct: 0, explanation: "above 在...上方。", tag: "介词" }
]

export const fillblankBankG5U5b = [
  { sentence: "There ___ (是复数) so many pictures.", answer: "are", chinese: "有那么多照片。", explanation: "There are 后面跟复数名词。", tag: "系动词" },
  { sentence: "It's in ___ (前面) of the dog.", answer: "front", chinese: "它在狗的前面。", explanation: "in front of", tag: "方位" },
  { sentence: "The book is ___ (在...旁边) the computer.", answer: "beside", chinese: "书在电脑旁边。", explanation: "beside", tag: "介词" },
  { sentence: "She is standing ___ (在...之间) the trees.", answer: "between", chinese: "她正站在树的中间。", explanation: "between", tag: "介词" },
  { sentence: "The picture is ___ (在...后面) the door.", answer: "behind", chinese: "画在门后。", explanation: "behind", tag: "介词" }
]

export const listenWordBankG5U5b = [
  { word: "beside", options: ["behind", "beside", "besides", "between"], correct: 1, zh: "在...旁边" },
  { word: "between", options: ["behind", "beside", "between", "bottom"], correct: 2, zh: "在...之间" },
  { word: "behind", options: ["beside", "behind", "below", "beyond"], correct: 1, zh: "在...后面" },
  { word: "above", options: ["about", "above", "apple", "able"], correct: 1, zh: "在...上方" },
  { word: "front", options: ["fruit", "front", "from", "for"], correct: 1, zh: "前面" }
]

export const listenSentenceBankG5U5b = [
  { sentence: "There are so many pictures here.", zh: "这里有那么多画。", options: ["There is a picture here.", "There are so many pictures here.", "There are so many plants here.", "There are some books here."], correct: 1 },
  { sentence: "The ball is in front of the dog.", zh: "球在狗的前面。", options: ["The ball is behind the dog.", "The bone is behind the dog.", "The ball is in front of the dog.", "The ball is beside the dog."], correct: 2 },
  { sentence: "There is a clock above the bed.", zh: "床上方有一个钟。", options: ["There is a picture above the bed.", "There is a plant beside the bed.", "There is a clock above the bed.", "There is a photo above the desk."], correct: 2 },
  { sentence: "The mouse is behind the computer.", zh: "鼠标在电脑后面。", options: ["The mouse is beside the computer.", "The mouse is behind the computer.", "The cat is behind the computer.", "The book is behind the computer."], correct: 1 },
  { sentence: "The cat is between the two boxes.", zh: "这只猫在两个盒子中间。", options: ["The cat is beside the two boxes.", "The dog is between the two boxes.", "The cat is between the two boxes.", "The toy is between the boxes."], correct: 2 }
]

export const listenOrderBankG5U5b = [
  { sentence: "There are so many pictures here.", zh: "这里有好多照片。", words: ["There", "are", "so", "many", "pictures", "here."], answer: ["There", "are", "so", "many", "pictures", "here."] },
  { sentence: "It is in front of the dog.", zh: "它在小狗的前方。", words: ["It", "is", "in", "front", "of", "the", "dog."], answer: ["It", "is", "in", "front", "of", "the", "dog."] },
  { sentence: "The ball is beside the dog.", zh: "球在狗的旁边。", words: ["The", "ball", "is", "beside", "the", "dog."], answer: ["The", "ball", "is", "beside", "the", "dog."] },
  { sentence: "The cat is between the boxes.", zh: "猫在盒子中间。", words: ["The", "cat", "is", "between", "the", "boxes."], answer: ["The", "cat", "is", "between", "the", "boxes."] },
  { sentence: "There is a clock above it.", zh: "上面有一个钟。", words: ["There", "is", "a", "clock", "above", "it."], answer: ["There", "is", "a", "clock", "above", "it."] }
]

export const listenResponseBankG5U5b = [
  { question: "Where is the ball?", zh: "球在哪儿？", options: ["It's behind the dog.", "Yes, there is.", "There are twenty.", "I like red."], correct: 0 },
  { question: "Where is the clock?", zh: "时钟在哪？", options: ["It is above the bed.", "It is very big.", "I am twelve.", "Thank you."], correct: 0 },
  { question: "Are there many pictures?", zh: "有很多画吗？", options: ["Yes, there are.", "No, it isn't.", "They are funny.", "On Monday."], correct: 0 },
  { question: "Look at my pictures.", zh: "看我的画。", options: ["Wow, so many pictures!", "Me too.", "It is under the desk.", "Thanks."], correct: 0 },
  { question: "Is the cat between the boxes?", zh: "猫在盒子中间吗？", options: ["Yes, it is.", "No, they aren't.", "I do kung fu.", "She is young."], correct: 0 }
]

export const listenTranslateBankG5U5b = [
  { sentence: "There are so many pictures here.", options: ["这里有很多书。", "那里有一张画。", "这里有很多照片。", "这副画真好看。"], correct: 2 },
  { sentence: "The ball is in front of the dog.", options: ["球在猫的后面。", "球在猫的前面。", "小狗在球下面。", "球在小狗的前面。"], correct: 3 },
  { sentence: "The plant is beside the window.", options: ["叶子在窗外。", "植物在窗户旁边。", "水井在房子旁。", "花在门边。"], correct: 1 },
  { sentence: "The mouse is between the boxes.", options: ["大鼠在大箱子里。", "鼠标在盒子下面。", "老鼠在盒子中间。", "盒子中间是空的。"], correct: 2 },
  { sentence: "There is a clock above the bed.", options: ["床上方有一幅画。", "桌子上方有一个时钟。", "床上方有一个闹钟。", "闹钟在床头柜上。"], correct: 2 }
]
