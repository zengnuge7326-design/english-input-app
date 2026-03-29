// PEP三年级下册 Unit 2 Part C《Story time / Let's check》题库
// 主题：Unit 2 综合复习 (家庭树、Who's & Is 句型)
// 7种题型，每种5题，共35题

export const quizBankG3D2c = [
  { question: "How ___ your family?", chinese: "你的家人好吗？", options: ["is", "am", "are", "do"], correct: 0, explanation: "family在这里作为整体指代家庭，谓语常用 is。或询问情况 How is your family？", tag: "语法" },
  { question: "___ that man? He's my grandfather.", chinese: "那个男的是谁？他是我爷爷。", options: ["What's", "Who's", "Where's", "How"], correct: 1, explanation: "询问身份用 Who's。", tag: "疑问词" },
  { question: "Look at me. ___ beautiful!", chinese: "看看我。多漂亮啊！", options: ["How", "What", "Who", "Where"], correct: 0, explanation: "How beautiful! 表示“多漂亮啊！”", tag: "感叹句" },
  { question: "Is she your teacher? Yes, ___.", chinese: "她是你们的老师吗？是的。她是。", options: ["she is", "he is", "it is", "I am"], correct: 0, explanation: "问句用 she，答句也用 she。", tag: "语法" },
  { question: "Is he your brother? ___, he isn't.", chinese: "他是你哥哥吗？不，他不是。", options: ["Yes", "No", "Not", "OK"], correct: 1, explanation: "后半句是 he isn't，所以开头用 No。", tag: "语法" }
]

export const fillblankBankG3D2c = [
  { sentence: "___ (谁是) that woman?", answer: "Who's", chinese: "那个女的是谁？", explanation: "Who's (Who is)", tag: "疑问词" },
  { sentence: "___ (不), she isn't.", answer: "No", chinese: "不，她不是。", explanation: "No 表示否定", tag: "语法" },
  { sentence: "Is he your ___ (爷爷)?", answer: "grandfather", chinese: "他是你爷爷吗？", explanation: "grandfather 祖父/外祖父", tag: "词汇" },
  { sentence: "___ (多么) beautiful!", answer: "How", chinese: "多漂亮啊！", explanation: "How beautiful! (感叹句)", tag: "感叹词" },
  { sentence: "He is my ___ (兄弟).", answer: "brother", chinese: "他是我弟弟。", explanation: "brother", tag: "词汇" }
]

export const listenWordBankG3D2c = [
  { word: "family", options: ["family", "factory", "father", "famous"], correct: 0, zh: "家庭" },
  { word: "man", options: ["map", "man", "mad", "mat"], correct: 1, zh: "男人" },
  { word: "beautiful", options: ["beautiful", "useful", "careful", "colourful"], correct: 0, zh: "美丽的" },
  { word: "woman", options: ["water", "woman", "window", "welcome"], correct: 1, zh: "女人" },
  { word: "sister", options: ["sit", "star", "six", "sister"], correct: 3, zh: "姐妹" }
]

export const listenSentenceBankG3D2c = [
  { sentence: "Who's that man?", zh: "那个男人是谁？", options: ["Who's that woman?", "Who's that boy?", "Who's that man?", "Where is that man?"], correct: 2 },
  { sentence: "He's my father.", zh: "他是我父亲。", options: ["She's my mother.", "He's my brother.", "He's my father.", "He's my grandfather."], correct: 2 },
  { sentence: "Is she your sister?", zh: "她是你妹妹吗？", options: ["Is he your brother?", "Is she your sister?", "Is she your mother?", "She is my sister."], correct: 1 },
  { sentence: "No, she isn't.", zh: "不，她不是。", options: ["Yes, she is.", "No, he isn't.", "No, she isn't.", "She isn't here."], correct: 2 },
  { sentence: "How beautiful!", zh: "多漂亮啊！", options: ["How nice!", "How beautiful!", "How big!", "What a pity!"], correct: 1 }
]

export const listenOrderBankG3D2c = [
  { sentence: "Who's that man?", zh: "那个男的是谁？", words: ["Who's", "that", "man?"], answer: ["Who's", "that", "man?"] },
  { sentence: "He is my brother.", zh: "我是的兄弟。", words: ["He", "is", "my", "brother."], answer: ["He", "is", "my", "brother."] },
  { sentence: "Is she your mother?", zh: "她是你妈妈吗？", words: ["Is", "she", "your", "mother?"], answer: ["Is", "she", "your", "mother?"] },
  { sentence: "Yes, she is.", zh: "是的，她是的。", words: ["Yes,", "she", "is."], answer: ["Yes,", "she", "is."] },
  { sentence: "How beautiful!", zh: "多美啊！", words: ["How", "beautiful!"], answer: ["How", "beautiful!"] }
]

export const listenResponseBankG3D2c = [
  { question: "Who's that man?", zh: "那个男的是谁？", options: ["He's my grandfather.", "She's my grandmother.", "No, he isn't.", "It's a bear."], correct: 0 },
  { question: "Is he your father?", zh: "他是你父亲吗？", options: ["Yes, she is.", "Yes, he is.", "She is my mother.", "He is tall."], correct: 1 },
  { question: "Is she your sister?", zh: "她是你姐姐吗？", options: ["No, he isn't.", "No, she isn't. She is my mom.", "Yes, I am.", "She is at school."], correct: 1 },
  { question: "Who's that woman?", zh: "那个女人是谁？", options: ["She is my aunt.", "He is my uncle.", "Yes, she is.", "Where is she?"], correct: 0 },
  { question: "Look at my dress.", zh: "看我的裙子。", options: ["How beautiful!", "Who's that man?", "He is my brother.", "Yes, it is."], correct: 0 }
]

export const listenTranslateBankG3D2c = [
  { sentence: "Who's that man?", options: ["这男孩是谁？", "那男人是谁？", "他叫什么名字？", "她是谁？"], correct: 1 },
  { sentence: "Is she your grandmother?", options: ["那是你的爷爷吗？", "她是你的小姨吗？", "她是你的外婆/奶奶吗？", "你奶奶在干嘛？"], correct: 2 },
  { sentence: "Yes, she is.", options: ["是的，她是的。", "不，她不是。", "是的，他是的。", "是的，它是的。"], correct: 0 },
  { sentence: "He is my brother.", options: ["他是我的兄弟。", "她是我的妹妹。", "他是我的朋友。", "他是一名学生。"], correct: 0 },
  { sentence: "How beautiful!", options: ["多可爱啊！", "真大啊！", "多漂亮啊！", "谢谢！"], correct: 2 }
]
