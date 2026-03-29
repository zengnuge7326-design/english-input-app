// PEP四年级上册 Unit 6 Part A《Meet my family!》题库
// 主题：家庭成员 (parents, cousin, uncle, aunt, baby brother) + How many people are there in your family?
// 7种题型，每种5题，共35题

export const quizBankG4U6a = [
  { question: "___ many people are there in your family?", chinese: "你家里有几口人？", options: ["How", "What", "Who", "Where"], correct: 0, explanation: "询问数量用 How many。", tag: "疑问词" },
  { question: "My family ___ six people.", chinese: "我家里有六口人。", options: ["has", "have", "is", "are"], correct: 0, explanation: "my family 作为一个整体词（家庭）时，谓语动词常用单数 has。", tag: "语法" },
  { question: "This is my ___. She is my mother's sister.", chinese: "这是我的阿姨。她是我妈妈的姐/妹。", options: ["aunt", "uncle", "cousin", "parents"], correct: 0, explanation: "妈妈的姐妹是 aunt (阿姨)。", tag: "词汇" },
  { question: "Meet my ___. They are my father and mother.", chinese: "见见我的父母。他们是我爸爸和妈妈。", options: ["parents", "cousins", "uncles", "family"], correct: 0, explanation: "parents 表示双亲(父母)。", tag: "词汇" },
  { question: "Are they ___? Yes.", chinese: "他们是农民吗？是的。", options: ["farmer", "farmers", "a farmer", "the farmer"], correct: 1, explanation: "they 是复数，对应的职业应加s，farmers。", tag: "语法" }
]

export const fillblankBankG4U6a = [
  { sentence: "How ___ (多少) people are there in your family?", answer: "many", chinese: "你家有几口人？", explanation: "How many 多少。", tag: "疑问词" },
  { sentence: "Meet my ___ (父母).", answer: "parents", chinese: "见见我的父母。", explanation: "parents 父母双亲。", tag: "词汇" },
  { sentence: "This is my ___ (堂表兄妹).", answer: "cousin", chinese: "这是我的堂/表亲。", explanation: "cousin 堂(表)兄弟姊妹。", tag: "词汇" },
  { sentence: "He is my ___ (叔叔).", answer: "uncle", chinese: "他是我的叔叔。", explanation: "uncle 叔叔/舅舅等。", tag: "词汇" },
  { sentence: "She is my ___ (阿姨).", answer: "aunt", chinese: "她是我的阿姨。", explanation: "aunt 阿姨/姑妈等。", tag: "词汇" }
]

export const listenWordBankG4U6a = [
  { word: "parents", options: ["parks", "parents", "pants", "parts"], correct: 1, zh: "父母" },
  { word: "cousin", options: ["count", "course", "cousin", "cotton"], correct: 2, zh: "表兄妹" },
  { word: "uncle", options: ["uncle", "aunt", "an", "under"], correct: 0, zh: "叔叔/舅舅" },
  { word: "aunt", options: ["ant", "aunt", "art", "out"], correct: 1, zh: "阿姨/姑妈" },
  { word: "baby brother", options: ["big brother", "baby brother", "baby sister", "brother"], correct: 1, zh: "小弟弟" }
]

export const listenSentenceBankG4U6a = [
  { sentence: "How many people are there in your family?", zh: "你家有几口人？", options: ["How many people are there in your family?", "How many apples do you have?", "Who is in your family?", "What's in your family?"], correct: 0 },
  { sentence: "My family has six people.", zh: "我家有六口人。", options: ["My family has five people.", "I have six boys.", "My family has six people.", "There are four people."], correct: 2 },
  { sentence: "Meet my family.", zh: "见见我的家人。", options: ["Meet my friend.", "Look at my family.", "This is my family.", "Meet my family."], correct: 3 },
  { sentence: "This is my uncle.", zh: "这是我的叔叔。", options: ["This is my aunt.", "This is my cousin.", "This is my uncle.", "This is my father."], correct: 2 },
  { sentence: "She is my aunt.", zh: "她是我的阿姨。", options: ["He is my uncle.", "She is my aunt.", "She is my sister.", "She is my mother."], correct: 1 }
]

export const listenOrderBankG4U6a = [
  { sentence: "How many people are there in your family?", zh: "你的家庭有几口人？", words: ["How", "many", "people", "are", "there", "in", "your", "family?"], answer: ["How", "many", "people", "are", "there", "in", "your", "family?"] },
  { sentence: "My family has six people.", zh: "我家有六口人。", words: ["My", "family", "has", "six", "people."], answer: ["My", "family", "has", "six", "people."] },
  { sentence: "Meet my family.", zh: "见见我的家人。", words: ["Meet", "my", "family."], answer: ["Meet", "my", "family."] },
  { sentence: "Is this your uncle?", zh: "这是你叔叔吗？", words: ["Is", "this", "your", "uncle?"], answer: ["Is", "this", "your", "uncle?"] },
  { sentence: "He is my cousin.", zh: "他是我的表弟。", words: ["He", "is", "my", "cousin."], answer: ["He", "is", "my", "cousin."] }
]

export const listenResponseBankG4U6a = [
  { question: "How many people are there in your family?", zh: "你家有几口人？", options: ["My family has four people.", "Yes, it is.", "He is my uncle.", "She is tall."], correct: 0 },
  { question: "Is this your aunt?", zh: "这是你阿姨吗？", options: ["They are farmers.", "Yes, she is.", "No, he is my uncle.", "Here you are."], correct: 1 },
  { question: "Who's that man?", zh: "那个男的是谁？", options: ["She is my aunt.", "It's near the window.", "He is my uncle.", "Yes, he is."], correct: 2 },
  { question: "Meet my family.", zh: "认识一下我的家人。", options: ["Nice to meet you.", "Five people.", "My parents and me.", "Yes, they are."], correct: 0 },
  { question: "Are they your parents?", zh: "他们是你父母吗？", options: ["Yes, he is.", "Yes, they are.", "No, she isn't.", "They are teachers."], correct: 1 }
]

export const listenTranslateBankG4U6a = [
  { sentence: "How many people are there in your family?", options: ["你家有几只猫？", "你家在哪里？", "你家里有谁？", "你家有几口人？"], correct: 3 },
  { sentence: "My family has three people.", options: ["我家有四口人。", "我家有三口人。", "我的父母都在家。", "我家有五口人。"], correct: 1 },
  { sentence: "Meet my parents.", options: ["见见我的姑姑。", "这是我的表弟。", "见见我的父母。", "认识一下我的朋友。"], correct: 2 },
  { sentence: "This is my uncle.", options: ["这是我的爷爷。", "这是我的阿姨。", "这是我的叔叔。", "那个男的是谁？"], correct: 2 },
  { sentence: "He has a baby brother.", options: ["他有一个小妹妹。", "姐姐很高。", "他有一个弟弟。", "她有一个小弟弟。"], correct: 2 }
]
