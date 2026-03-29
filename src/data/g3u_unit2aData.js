// PEP三年级上册 Unit 2 Part A《Colours》题库
// 主题：颜色 (red, yellow, green, blue) + I see... / Show me...
// 7种题型，每种5题，共35题

export const quizBankG3U2a = [
  { question: "I see ___.", chinese: "我看见了绿色。", options: ["green", "book", "pencil", "bag"], correct: 0, explanation: "根据题意，填表示颜色的词 green。", tag: "词汇" },
  { question: "___! This is Mr Jones.", chinese: "早上好！这是琼斯先生。", options: ["Hello", "Good morning", "Goodbye", "Look"], correct: 1, explanation: "清晨打招呼用 Good morning.", tag: "交际" },
  { question: "Show me ___.", chinese: "给我看看红色。", options: ["red", "apple", "book", "dog"], correct: 0, explanation: "本课练习展示颜色，Show me red (给我指出红色)。", tag: "词汇" },
  { question: "Nice to meet ___.", chinese: "很高兴见到你。", options: ["your", "me", "you", "I"], correct: 2, explanation: "Nice to meet you (很高兴见到你)是固定打招呼用语。", tag: "交际" },
  { question: "___ see blue.", chinese: "我看见了蓝色。", options: ["You", "I", "He", "She"], correct: 1, explanation: "第一人称用 I (我)。", tag: "语法" }
]

export const fillblankBankG3U2a = [
  { sentence: "I see ___ (红色).", answer: "red", chinese: "我看见了红色。", explanation: "red 红色", tag: "词汇" },
  { sentence: "I see ___ (黄色).", answer: "yellow", chinese: "我看见了黄色。", explanation: "yellow 黄色", tag: "词汇" },
  { sentence: "I see ___ (绿色).", answer: "green", chinese: "我看见了绿色。", explanation: "green 绿色", tag: "词汇" },
  { sentence: "I see ___ (蓝色).", answer: "blue", chinese: "我看见了蓝色。", explanation: "blue 蓝色", tag: "词汇" },
  { sentence: "Good ___ (早上), Miss White.", answer: "morning", chinese: "早上好，怀特老师。", explanation: "morning 早上", tag: "交际" }
]

export const listenWordBankG3U2a = [
  { word: "red", options: ["bed", "red", "head", "read"], correct: 1, zh: "红色" },
  { word: "yellow", options: ["hello", "window", "yellow", "follow"], correct: 2, zh: "黄色" },
  { word: "green", options: ["green", "clean", "queen", "greet"], correct: 0, zh: "绿色" },
  { word: "blue", options: ["glue", "clue", "blue", "blow"], correct: 2, zh: "蓝色" },
  { word: "morning", options: ["evening", "morning", "meaning", "warning"], correct: 1, zh: "早上" }
]

export const listenSentenceBankG3U2a = [
  { sentence: "I see green.", zh: "我看见了绿色。", options: ["I see red.", "I see green.", "I see blue.", "I see yellow."], correct: 1 },
  { sentence: "Good morning.", zh: "早上好。", options: ["Good afternoon.", "Good evening.", "Good morning.", "Goodbye."], correct: 2 },
  { sentence: "Nice to meet you.", zh: "很高兴见到你。", options: ["Nice to meet you.", "Nice to see you.", "How are you?", "Goodbye."], correct: 0 },
  { sentence: "This is Mr Jones.", zh: "这是琼斯先生。", options: ["This is Miss White.", "This is Mr Jones.", "Hello, Mr Jones.", "He is Mr Jones."], correct: 1 },
  { sentence: "Show me blue.", zh: "让我看看蓝色。", options: ["Show me red.", "Show me green.", "Show me yellow.", "Show me blue."], correct: 3 }
]

export const listenOrderBankG3U2a = [
  { sentence: "I see red.", zh: "我看见了红色。", words: ["I", "see", "red."], answer: ["I", "see", "red."] },
  { sentence: "Good morning, Miss White.", zh: "早上好，怀特老师。", words: ["Good", "morning,", "Miss", "White."], answer: ["Good", "morning,", "Miss", "White."] },
  { sentence: "Nice to meet you.", zh: "见到你很高兴。", words: ["Nice", "to", "meet", "you."], answer: ["Nice", "to", "meet", "you."] },
  { sentence: "Show me green.", zh: "给我看看绿色。", words: ["Show", "me", "green."], answer: ["Show", "me", "green."] },
  { sentence: "This is Mr Jones.", zh: "这是琼斯先生。", words: ["This", "is", "Mr", "Jones."], answer: ["This", "is", "Mr", "Jones."] }
]

export const listenResponseBankG3U2a = [
  { question: "Good morning.", zh: "早上好。", options: ["Goodbye.", "Good morning.", "I see red.", "Me too."], correct: 1 },
  { question: "Nice to meet you.", zh: "见到你很高兴。", options: ["Nice to meet you, too.", "Good morning.", "I am Mike.", "Hello."], correct: 0 },
  { question: "Show me yellow.", zh: "给我指黄色看看。", options: ["OK. Here it is.", "No.", "I see red.", "Thank you."], correct: 0 },
  { question: "This is Mr Jones.", zh: "这是琼斯先生。", options: ["What's your name?", "Nice to meet you.", "Me too.", "Goodbye."], correct: 1 },
  { question: "I see blue.", zh: "我看见了蓝色。", options: ["I see red, too.", "Good morning.", "Nice to meet you.", "Show me."], correct: 0 }
]

export const listenTranslateBankG3U2a = [
  { sentence: "I see green.", options: ["我看见了红色。", "我看见了蓝色。", "我看见了绿色。", "我看见了黄色。"], correct: 2 },
  { sentence: "Good morning.", options: ["下午好。", "晚上好。", "早上好。", "晚安。"], correct: 2 },
  { sentence: "Nice to meet you.", options: ["早上好。", "很高兴见到你。", "再见。", "你好吗？"], correct: 1 },
  { sentence: "This is Mr Jones.", options: ["这是怀特小姐。", "这是吴斌斌。", "这是迈克。", "这是琼斯先生。"], correct: 3 },
  { sentence: "Show me red.", options: ["给我看绿色。", "给我看红色。", "给我看黄色。", "给我看蓝色。"], correct: 1 }
]
