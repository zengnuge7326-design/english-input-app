// PEP三年级下册 Unit 6 Part A《How many?》题库
// 主题：数字 (eleven, twelve, thirteen, fourteen, fifteen) + How many kites do you see? I see...
// 7种题型，每种5题，共35题

export const quizBankG3D6a = [
  { question: "How many kites do you ___?", chinese: "你看见了多少只风筝？", options: ["see", "look", "watch", "have"], correct: 0, explanation: "see 表示看见、看到。", tag: "动词" },
  { question: "I see 11 ___.", chinese: "我看见了11只风筝。", options: ["kites", "kite", "a kite", "the kite"], correct: 0, explanation: "大于1的数量跟可数名词复数。", tag: "名词复数" },
  { question: "___ many birds do you see?", chinese: "你看见多少只鸟？", options: ["How", "What", "Who", "Where"], correct: 0, explanation: "询问数量用 How viele (How many)。", tag: "疑问词" },
  { question: "One, two, three... ___, twelve!", chinese: "一，二，三... 十一，十二！", options: ["eleven", "fourteen", "thirteen", "fifteen"], correct: 0, explanation: "十之后是十一 (eleven)，十二 (twelve)。", tag: "数词" },
  { question: "I see ___.", chinese: "我看见了十五个。", options: ["fifteen", "five", "thirteen", "fourteen"], correct: 0, explanation: "fifteen (十五)。", tag: "数词" }
]

export const fillblankBankG3D6a = [
  { sentence: "How ___ (多少) kites do you see?", answer: "many", chinese: "你看见了多少只风筝？", explanation: "How many 多少。", tag: "疑问词" },
  { sentence: "I ___ (看见) 12.", answer: "see", chinese: "我看见十二个。", explanation: "see 看见。", tag: "动词" },
  { sentence: "I see ___ (十一) apples.", answer: "eleven", chinese: "我看到十一个苹果。", explanation: "eleven 十一。", tag: "数字" },
  { sentence: "I have ___ (十三) books.", answer: "thirteen", chinese: "我有十三本书。", explanation: "thirteen 十三。", tag: "数字" },
  { sentence: "I see ___ (十五) kites.", answer: "fifteen", chinese: "我看见十五只风筝。", explanation: "fifteen 十五。", tag: "数字" }
]

export const listenWordBankG3D6a = [
  { word: "eleven", options: ["seven", "eleven", "even", "heaven"], correct: 1, zh: "十一" },
  { word: "twelve", options: ["twenty", "twelve", "twin", "twice"], correct: 1, zh: "十二" },
  { word: "thirteen", options: ["thirty", "thirteen", "three", "fourteen"], correct: 1, zh: "十三" },
  { word: "fourteen", options: ["four", "forty", "fourteen", "fifteen"], correct: 2, zh: "十四" },
  { word: "fifteen", options: ["fifty", "five", "fifteen", "thirteen"], correct: 2, zh: "十五" }
]

export const listenSentenceBankG3D6a = [
  { sentence: "How many kites do you see?", zh: "你看见了多少只风筝？", options: ["How many birds do you see?", "How many kites do you see?", "How many cars do you see?", "How many cats do you see?"], correct: 1 },
  { sentence: "I see eleven.", zh: "我看见连十一个。", options: ["I see twelve.", "I see eleven.", "I see seven.", "I see thirteen."], correct: 1 },
  { sentence: "The black one is a bird.", zh: "那个黑色的是一只鸟。", options: ["The big one is a bird.", "The black one is a bird.", "The small one is a bird.", "The red one is a bird."], correct: 1 },
  { sentence: "I have fifteen apples.", zh: "我有十五个苹果。", options: ["I have fourteen apples.", "I have fifteen apples.", "I have fifty apples.", "I have eighteen apples."], correct: 1 },
  { sentence: "One, two. I see twelve.", zh: "一，二。我看到十二个。", options: ["One, two. I see ten.", "One, two. I see twelve.", "One, two. I see eleven.", "One, two. I see twenty."], correct: 1 }
]

export const listenOrderBankG3D6a = [
  { sentence: "How many do you see?", zh: "你看见了多少个？", words: ["How", "many", "do", "you", "see?"], answer: ["How", "many", "do", "you", "see?"] },
  { sentence: "I see twelve.", zh: "我看见十二个。", words: ["I", "see", "twelve."], answer: ["I", "see", "twelve."] },
  { sentence: "The black one is a bird.", zh: "那个黑色的是一只鸟。", words: ["The", "black", "one", "is", "a", "bird."], answer: ["The", "black", "one", "is", "a", "bird."] },
  { sentence: "I see fifteen kites.", zh: "我看见十五只风筝。", words: ["I", "see", "fifteen", "kites."], answer: ["I", "see", "fifteen", "kites."] },
  { sentence: "Beautiful!", zh: "真漂亮！", words: ["Beautiful!"], answer: ["Beautiful!"] }
]

export const listenResponseBankG3D6a = [
  { question: "How many kites do you see?", zh: "你看见多少只风筝？", options: ["I see twelve.", "Yes, I do.", "He is my dad.", "I have ten."], correct: 0 },
  { question: "Look at the kites.", zh: "看这些风筝。", options: ["Beautiful!", "I see ten.", "It's big.", "Welcome."], correct: 0 },
  { question: "Is the black one a bird?", zh: "那个黑色的是鸟吗？", options: ["Yes, it is.", "I see twelve.", "Thank you.", "It's a cat."], correct: 0 },
  { question: "How old are you?", zh: "你几岁了？", options: ["I'm nine.", "I am nine years.", "I see red.", "I see ten."], correct: 0 },
  { question: "I see eleven birds.", zh: "我看到十一只鸟。", options: ["Wow!", "Thank you.", "He's tall.", "Me too."], correct: 0 }
]

export const listenTranslateBankG3D6a = [
  { sentence: "How many kites do you see?", options: ["你想要几只风筝？", "你有几只风筝？", "你看见多少只鸟？", "你看见几只风筝？"], correct: 3 },
  { sentence: "I see twelve.", options: ["我看见十个。", "我看见十二个。", "我看见二十个。", "我看见两个。"], correct: 1 },
  { sentence: "The black one is a bird.", options: ["黑色的是一只鸟。", "这只是黑色的鸟。", "小鸟是黑色的。", "它是一只鸟。"], correct: 0 },
  { sentence: "I have thirteen.", options: ["我有三十个。", "我有十三个。", "我看见三个。", "我只有三个。"], correct: 1 },
  { sentence: "Look at the kites.", options: ["看这只风筝。", "看那些红色的。", "看那些鸟。", "看那些风筝。"], correct: 3 }
]
