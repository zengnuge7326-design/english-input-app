// PEP三年级下册 Unit 3 Part A《At the zoo》题库
// 主题：动物特征1 (thin, fat, tall, short) + Look at that monkey. It's so fat!
// 7种题型，每种5题，共35题

export const quizBankG3D3a = [
  { question: "___ at that monkey.", chinese: "看看那只猴子。", options: ["Look", "See", "Watch", "Read"], correct: 0, explanation: "Look at 是固定搭配，“看……”。", tag: "词组" },
  { question: "It's ___ tall!", chinese: "它真高啊！", options: ["so", "no", "to", "go"], correct: 0, explanation: "so tall 意为“这么高”或者“真高”。", tag: "副词" },
  { question: "The bear is ___ and the monkey is thin.", chinese: "熊很胖，猴子很瘦。", options: ["fat", "tall", "short", "long"], correct: 0, explanation: "与 thin (瘦) 对应的是 fat (胖)。", tag: "反义词" },
  { question: "The giraffe is ___. The bear is short.", chinese: "长颈鹿很高。熊很矮。", options: ["tall", "fat", "long", "big"], correct: 0, explanation: "与 short (矮) 对应且修饰长颈鹿的是 tall (高)。", tag: "反义词" },
  { question: "I see a ___ pig. It eats a lot.", chinese: "我看到一头胖猪。它吃得很多。", options: ["fat", "thin", "tall", "short"], correct: 0, explanation: "吃得多通常对应的体型是 fat (胖)。", tag: "常识" }
]

export const fillblankBankG3D3a = [
  { sentence: "___ (看) at that monkey.", answer: "Look", chinese: "看那只猴子。", explanation: "Look，注意句首大写。", tag: "动词" },
  { sentence: "It's so ___ (胖的)!", answer: "fat", chinese: "它好胖啊！", explanation: "fat 胖的", tag: "形容词" },
  { sentence: "The man is ___ (高的).", answer: "tall", chinese: "那个男人很高。", explanation: "tall 高的", tag: "形容词" },
  { sentence: "The bear is ___ (矮的).", answer: "short", chinese: "这只熊很矮。", explanation: "short 矮的", tag: "形容词" },
  { sentence: "The monkey is ___ (瘦的).", answer: "thin", chinese: "这只猴子很瘦。", explanation: "thin 瘦的", tag: "形容词" }
]

export const listenWordBankG3D3a = [
  { word: "fat", options: ["cat", "fat", "hat", "bat"], correct: 1, zh: "胖的" },
  { word: "thin", options: ["thin", "thick", "ten", "pen"], correct: 0, zh: "瘦的" },
  { word: "tall", options: ["tall", "fall", "wall", "call"], correct: 0, zh: "高的" },
  { word: "short", options: ["shirt", "short", "shoes", "shot"], correct: 1, zh: "矮的/短的" },
  { word: "look", options: ["book", "cook", "look", "good"], correct: 2, zh: "看" }
]

export const listenSentenceBankG3D3a = [
  { sentence: "Look at that monkey.", zh: "看那只猴子。", options: ["Look at that bear.", "Look at that monkey.", "Look at this pig.", "Look at that panda."], correct: 1 },
  { sentence: "It's so fat!", zh: "它好胖啊！", options: ["It's so tall!", "It's so short!", "It's so fat!", "It's so big!"], correct: 2 },
  { sentence: "The giraffe is tall.", zh: "长颈鹿很高。", options: ["The monkey is thin.", "The bear is short.", "The giraffe is tall.", "The elephant is big."], correct: 2 },
  { sentence: "It's so short.", zh: "它真矮。", options: ["It's so tall.", "It's so short.", "It's so thin.", "It's so fat."], correct: 1 },
  { sentence: "Look at the bear.", zh: "看那只熊。", options: ["Look at the panda.", "Look at the monkey.", "Look at the bear.", "Look at the man."], correct: 2 }
]

export const listenOrderBankG3D3a = [
  { sentence: "Look at that bear.", zh: "看那只熊。", words: ["Look", "at", "that", "bear."], answer: ["Look", "at", "that", "bear."] },
  { sentence: "It is so fat!", zh: "它好胖啊！", words: ["It", "is", "so", "fat!"], answer: ["It", "is", "so", "fat!"] },
  { sentence: "The monkey is thin.", zh: "猴子很瘦。", words: ["The", "monkey", "is", "thin."], answer: ["The", "monkey", "is", "thin."] },
  { sentence: "He is very tall.", zh: "他非常高。", words: ["He", "is", "very", "tall."], answer: ["He", "is", "very", "tall."] },
  { sentence: "She is short.", zh: "她很矮。", words: ["She", "is", "short."], answer: ["She", "is", "short."] }
]

export const listenResponseBankG3D3a = [
  { question: "Look at the giraffe.", zh: "看那只长颈鹿。", options: ["Wow! It's so tall!", "It's a cat.", "Thank you.", "Where are you from?"], correct: 0 },
  { question: "Look at the monkey.", zh: "看那只猴子。", options: ["Oh, it's so thin.", "He is ten.", "You're welcome.", "Goodbye."], correct: 0 },
  { question: "What's that?", zh: "那是什么？", options: ["It's a bear.", "I'm ten.", "Yes.", "Welcome."], correct: 0 },
  { question: "Look at that bear.", zh: "看那只熊。", options: ["Ha! It's so fat!", "No, it isn't.", "Hello.", "See you."], correct: 0 },
  { question: "Who's that man?", zh: "那个男人是谁？", options: ["He's so tall. He is my dad.", "She is my sister.", "It is yellow.", "I am nine."], correct: 0 }
]

export const listenTranslateBankG3D3a = [
  { sentence: "Look at that monkey.", options: ["这是一只猴子。", "看那只熊猫。", "看这只熊。", "看那只猴子。"], correct: 3 },
  { sentence: "It's so fat!", options: ["它好瘦啊！", "它好矮啊！", "它好高啊！", "它好胖啊！"], correct: 3 },
  { sentence: "The giraffe is tall.", options: ["猴子很瘦。", "大象很大。", "长颈鹿很高。", "熊很矮。"], correct: 2 },
  { sentence: "It's so thin.", options: ["它那么胖。", "它那么高。", "它真瘦。", "它是短的。"], correct: 2 },
  { sentence: "Look at the bear.", options: ["看那只熊。", "看那只长颈鹿。", "看那只猪。", "你看。"], correct: 0 }
]
