// PEP三年级下册 Unit 3 Part C《Story time / Let's check》题库
// 主题：Unit 3 综合复习 (动物特征及部位)
// 7种题型，每种5题，共35题

export const quizBankG3D3c = [
  { question: "Look ___ the giraffe.", chinese: "看那只长颈鹿。", options: ["at", "in", "on", "to"], correct: 0, explanation: "Look at 后接看到的事物。", tag: "介词" },
  { question: "It ___ a big body.", chinese: "它有一个大身体。", options: ["has", "have", "are", "am"], correct: 0, explanation: "第三人称单数 It 对应 has。", tag: "动词" },
  { question: "The monkey ___ a long tail.", chinese: "猴子有一条长尾巴。", options: ["have", "has", "is", "are"], correct: 1, explanation: "The monkey 单数，用 has。", tag: "动词" },
  { question: "The bear is ___, but the monkey is thin.", chinese: "熊很胖，但是猴子很瘦。", options: ["fat", "tall", "small", "short"], correct: 0, explanation: "与 thin (瘦) 对应的是 fat。", tag: "反义词" },
  { question: "___! It's so big!", chinese: "哇！它真大啊！", options: ["Wow", "Ouch", "No", "Yes"], correct: 0, explanation: "Wow 表示赞叹或惊讶。", tag: "感叹词" }
]

export const fillblankBankG3D3c = [
  { sentence: "___ (看) at the elephant.", answer: "Look", chinese: "看那头大象。", explanation: "Look at", tag: "动词" },
  { sentence: "It ___ (有) a big head.", answer: "has", chinese: "它有一个大脑袋。", explanation: "has 有", tag: "动词" },
  { sentence: "It's ___ (这样/如此) tall!", answer: "so", chinese: "它好高啊！", explanation: "so", tag: "副词" },
  { sentence: "The ostrich is ___ (高的).", answer: "tall", chinese: "鸵鸟很高。", explanation: "tall 高的", tag: "形容词" },
  { sentence: "The dog has a ___ (短的) tail.", answer: "short", chinese: "狗有短尾巴。", explanation: "short", tag: "形容词" }
]

export const listenWordBankG3D3c = [
  { word: "giraffe", options: ["giraffe", "elephant", "tiger", "bear"], correct: 0, zh: "长颈鹿" },
  { word: "long", options: ["song", "long", "pig", "big"], correct: 1, zh: "长的" },
  { word: "tail", options: ["tall", "tell", "tail", "taste"], correct: 2, zh: "尾巴" },
  { word: "children", options: ["child", "children", "chicken", "kitchen"], correct: 1, zh: "孩子们" },
  { word: "body", options: ["boy", "body", "boat", "box"], correct: 1, zh: "身体" }
]

export const listenSentenceBankG3D3c = [
  { sentence: "Look at the elephant.", zh: "看那头大象。", options: ["Look at the giraffe.", "Look at the elephant.", "Look at the monkey.", "Look at the bear."], correct: 1 },
  { sentence: "It has a long nose and a short tail.", zh: "它有一个长鼻子和一条短尾巴。", options: ["It has a big tail.", "It has a big head.", "It has a long nose and a short tail.", "It has a small mouth."], correct: 2 },
  { sentence: "The monkey has a long tail.", zh: "猴子有一条长尾巴。", options: ["The tiger has a big head.", "The monkey has a long tail.", "The bear has a short tail.", "The elephant has big ears."], correct: 1 },
  { sentence: "Wow! It's so big!", zh: "哇！它好大啊！", options: ["It's so tall!", "Wow! It's so big!", "It's so small!", "It's so long!"], correct: 1 },
  { sentence: "Come here, children.", zh: "到这儿来，孩子们。", options: ["Wait a minute.", "Look at me.", "Come here, children.", "Let's play a game."], correct: 2 }
]

export const listenOrderBankG3D3c = [
  { sentence: "Look at the elephant.", zh: "看这大象。", words: ["Look", "at", "the", "elephant."], answer: ["Look", "at", "the", "elephant."] },
  { sentence: "It has a long nose.", zh: "它有一个长鼻子。", words: ["It", "has", "a", "long", "nose."], answer: ["It", "has", "a", "long", "nose."] },
  { sentence: "It has a short tail.", zh: "它有一条短尾。", words: ["It", "has", "a", "short", "tail."], answer: ["It", "has", "a", "short", "tail."] },
  { sentence: "The monkey is thin.", zh: "这猴子很瘦。", words: ["The", "monkey", "is", "thin."], answer: ["The", "monkey", "is", "thin."] },
  { sentence: "Wow, it is so tall!", zh: "哇，它好高啊！", words: ["Wow,", "it", "is", "so", "tall!"], answer: ["Wow,", "it", "is", "so", "tall!"] }
]

export const listenResponseBankG3D3c = [
  { question: "Look at the giraffe.", zh: "看这只长颈鹿。", options: ["Wow! It's so tall!", "It is a duck.", "I'm ten.", "Goodbye."], correct: 0 },
  { question: "Does it have a long nose?", zh: "它有一个长鼻子吗？", options: ["Yes, it's an elephant.", "He's my father.", "Welcome.", "No, it's a pig."], correct: 0 },
  { question: "Look at the bear.", zh: "看看那只熊。", options: ["It's so fat.", "It has a long tail.", "See you.", "Yes."], correct: 0 },
  { question: "Come here, children.", zh: "孩子们，过来。", options: ["OK.", "Hello.", "It's big.", "Thank you."], correct: 0 },
  { question: "What's that?", zh: "那是什么？", options: ["It's an ostrich.", "I am a pupil.", "My name is John.", "It's so long."], correct: 0 }
]

export const listenTranslateBankG3D3c = [
  { sentence: "Look at the elephant.", options: ["看那只熊猫。", "看那只猴子。", "看这头大象。", "看那只长颈鹿。"], correct: 2 },
  { sentence: "It has a long nose.", options: ["它有一只大耳朵。", "它有一条短尾巴。", "它有一条长尾巴。", "它有一个长鼻子。"], correct: 3 },
  { sentence: "The monkey has a long tail.", options: ["猴子很瘦。", "猴子有一个大脑袋。", "猴子有一条长尾巴。", "猴子有个长鼻子。"], correct: 2 },
  { sentence: "Wow! It's so big!", options: ["哇！它这么高！", "哇！它真胖！", "哇！它真大啊！", "哇！它真瘦啊！"], correct: 2 },
  { sentence: "Come here.", options: ["过来。", "回去。", "再见。", "等一下。"], correct: 0 }
]
