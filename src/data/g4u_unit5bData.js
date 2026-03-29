// PEP四年级上册 Unit 5 Part B《Let's learn / Let's talk》题库
// 主题：餐具 (chopsticks, bowl, fork, knife, spoon) + Help yourself. Would you like...? + -e 发音规则
// 7种题型，每种5题，共35题

export const quizBankG4U5b = [
  { question: "___ yourself.", chinese: "请随便吃。", options: ["Help", "Helps", "Helping", "To help"], correct: 0, explanation: "Help yourself (自便/随便吃) 祈使句用动词原形。", tag: "用法" },
  { question: "Would you like a knife ___ fork?", chinese: "你想要刀叉吗？", options: ["to", "and", "or", "in"], correct: 1, explanation: "a knife and fork (一副刀叉) 作为搭配使用。", tag: "连词" },
  { question: "Pass me the ___.", chinese: "请把碗递给我。", options: ["chopsticks", "bowl", "noodles", "vegetable"], correct: 1, explanation: "the 接单数碗 bowl。chopsticks通常复数（双）。（注：此题侧重单词认读，过碗的动作最符合单数物品）", tag: "词汇" },
  { question: "I can use ___.", chinese: "我会用筷子。", options: ["chopsticks", "spoon", "bowl", "fork"], correct: 0, explanation: "筷子总是复数 chopsticks。", tag: "单复数" },
  { question: "Which word has the 'e' sound like in 'me'?", chinese: "哪个词里面的 e 发音和 me 里的相同？", options: ["bed", "red", "he", "desk"], correct: 2, explanation: "me 中 e 发长元音 /iː/，同样的有 he, she, we。", tag: "拼读" }
]

export const fillblankBankG4U5b = [
  { sentence: "___ (请随便吃) yourself.", answer: "Help", chinese: "请随便吃。", explanation: "Help yourself是固定说法。", tag: "短语" },
  { sentence: "Would you like a ___ (刀)?", answer: "knife", chinese: "你想要一把餐刀吗？", explanation: "knife 刀。", tag: "词汇" },
  { sentence: "Pass me the ___ (叉子).", answer: "fork", chinese: "把叉子递给我。", explanation: "fork 叉子。", tag: "词汇" },
  { sentence: "Use the ___ (勺子).", answer: "spoon", chinese: "使用勺子。", explanation: "spoon 勺子。", tag: "词汇" },
  { sentence: "I have a clean ___ (碗).", answer: "bowl", chinese: "我有一个干净的碗。", explanation: "bowl 碗。", tag: "词汇" }
]

export const listenWordBankG4U5b = [
  { word: "chopsticks", options: ["chips", "chocolate", "chopsticks", "chicken"], correct: 2, zh: "筷子" },
  { word: "bowl", options: ["blow", "bowl", "ball", "boat"], correct: 1, zh: "碗" },
  { word: "fork", options: ["fork", "form", "fort", "pork"], correct: 0, zh: "叉子" },
  { word: "knife", options: ["life", "knife", "night", "nice"], correct: 1, zh: "刀" },
  { word: "spoon", options: ["soon", "moon", "spoon", "sport"], correct: 2, zh: "勺子" }
]

export const listenSentenceBankG4U5b = [
  { sentence: "Help yourself.", zh: "请自便/随便吃。", options: ["Help me.", "Help yourself.", "Help him.", "Help her."], correct: 1 },
  { sentence: "Would you like a knife and fork?", zh: "你想要一副刀叉吗？", options: ["Would you like a knife and fork?", "Would you like a spoon?", "Would you like some beef?", "Would you like a bowl?"], correct: 0 },
  { sentence: "No, thanks.", zh: "不用了，谢谢。", options: ["Yes, please.", "No, thanks.", "Here you are.", "You're welcome."], correct: 1 },
  { sentence: "I can use chopsticks.", zh: "我会用筷子。", options: ["I can use a fork.", "I can use a spoon.", "I can use a knife.", "I can use chopsticks."], correct: 3 },
  { sentence: "Pass me the bowl.", zh: "把碗递给我。", options: ["Pass me the fork.", "Pass me the knife.", "Pass me the bowl.", "Pass me the spoon."], correct: 2 }
]

export const listenOrderBankG4U5b = [
  { sentence: "Help yourself.", zh: "请随便吃。", words: ["Help", "yourself."], answer: ["Help", "yourself."] },
  { sentence: "Would you like a knife?", zh: "你想要一把餐刀吗？", words: ["Would", "you", "like", "a", "knife?"], answer: ["Would", "you", "like", "a", "knife?"] },
  { sentence: "Pass me the fork, please.", zh: "请把叉子递给我。", words: ["Pass", "me", "the", "fork,", "please."], answer: ["Pass", "me", "the", "fork,", "please."] },
  { sentence: "I can use chopsticks.", zh: "我能使用筷子。", words: ["I", "can", "use", "chopsticks."], answer: ["I", "can", "use", "chopsticks."] },
  { sentence: "No, thanks.", zh: "不用了，谢谢。", words: ["No,", "thanks."], answer: ["No,", "thanks."] }
]

export const listenResponseBankG4U5b = [
  { question: "Would you like some beef?", zh: "你想要些牛肉吗？", options: ["Yes, please.", "Here it is.", "It is heavy.", "They are on the table."], correct: 0 },
  { question: "Would you like a knife and fork?", zh: "你需要刀叉吗？", options: ["No, thanks. I can use chopsticks.", "I like beef.", "They are near the phone.", "Yes, it is."], correct: 0 },
  { question: "Help yourself.", zh: "请随便吃。", options: ["Thank you.", "Yes, I am.", "It's a spoon.", "Where is it?"], correct: 0 },
  { question: "Can I have some soup?", zh: "我能喝点汤吗？", options: ["It's on the sofa.", "Yes. Pass me the bowl, please.", "No, it isn't.", "They are my glasses."], correct: 1 },
  { question: "I can use chopsticks.", zh: "我会用筷子。", options: ["Good job!", "It is blue.", "Where are they?", "I am short."], correct: 0 }
]

export const listenTranslateBankG4U5b = [
  { sentence: "Help yourself.", options: ["帮帮我。", "随便吃。", "自己做。", "快点儿。"], correct: 1 },
  { sentence: "Would you like a knife and fork?", options: ["你想要牛肉和米饭吗？", "你想要一双筷子吗？", "你会用刀叉吗？", "你想要一副刀叉吗？"], correct: 3 },
  { sentence: "Pass me the bowl.", options: ["把勺子递给我。", "把筷子递给我。", "把叉子递给我。", "把碗递给我。"], correct: 3 },
  { sentence: "I can use chopsticks.", options: ["我能吃面条。", "我会用筷子。", "我会用刀叉。", "我有筷子。"], correct: 1 },
  { sentence: "No, thanks.", options: ["好的，谢谢。", "不用了，谢谢。", "不，它不在。", "不，我不在。"], correct: 1 }
]
