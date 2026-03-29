// PEP五年级上册 Unit 1 Part A《What's he like?》题库
// 主题：人物外貌与性格 (old, young, funny, kind, strict) + Is he young? Yes, he is. / No, he isn't.
// 7种题型，每种5题，共35题

export const quizBankG5U1a = [
  { question: "___ is your art teacher?", chinese: "谁是你的美术老师？", options: ["Who", "What", "Where", "How"], correct: 0, explanation: "询问人使用 Who（谁）。", tag: "疑问词" },
  { question: "Mr Jones is very ___.", chinese: "琼斯先生很风趣。", options: ["funny", "fun", "old", "young"], correct: 0, explanation: "funny 为风趣的、滑稽的。", tag: "形容词" },
  { question: "___ he strict?", chinese: "他很严厉吗？", options: ["Is", "Are", "Am", "Do"], correct: 0, explanation: "主语 he (他) 配系动词 Is。", tag: "系动词" },
  { question: "Yes, he ___.", chinese: "是的，他是。", options: ["is", "isn't", "are", "do"], correct: 0, explanation: "Is he...? 的肯定回答 Yes, he is.", tag: "语法" },
  { question: "He is our ___ teacher.", chinese: "他是我们的美术老师。", options: ["art", "math", "music", "science"], correct: 0, explanation: "美术老师 art teacher。", tag: "词汇" }
]

export const fillblankBankG5U1a = [
  { sentence: "___ (谁) is your art teacher?", answer: "Who", chinese: "谁是你的美术老师？", explanation: "Who 谁", tag: "疑问词" },
  { sentence: "He is ___ (年轻的).", answer: "young", chinese: "他是年轻的。", explanation: "young 年轻的", tag: "形容词" },
  { sentence: "She is very ___ (种类/和蔼的).", answer: "kind", chinese: "她非常和蔼。", explanation: "kind 和蔼的", tag: "形容词" },
  { sentence: "Is she ___ (严格的)?", answer: "strict", chinese: "她严格吗？", explanation: "strict 严格的", tag: "形容词" },
  { sentence: "Mr Jones is ___ (滑稽的).", answer: "funny", chinese: "琼斯先生很风趣。", explanation: "funny", tag: "形容词" }
]

export const listenWordBankG5U1a = [
  { word: "young", options: ["old", "young", "yellow", "your"], correct: 1, zh: "年轻的" },
  { word: "old", options: ["old", "cold", "out", "our"], correct: 0, zh: "年老的/旧的" },
  { word: "funny", options: ["fun", "sunny", "funny", "run"], correct: 2, zh: "滑稽的/风趣的" },
  { word: "kind", options: ["king", "kind", "kite", "find"], correct: 1, zh: "和蔼的" },
  { word: "strict", options: ["street", "strict", "straight", "star"], correct: 1, zh: "严格的" }
]

export const listenSentenceBankG5U1a = [
  { sentence: "Who is your art teacher?", zh: "谁是你的美术老师？", options: ["Who is your math teacher?", "Who is your art teacher?", "Where is your art teacher?", "Who is your music teacher?"], correct: 1 },
  { sentence: "Mr Jones.", zh: "琼斯先生。", options: ["Mr Smith.", "Miss White.", "Mr Jones.", "Mrs Jones."], correct: 2 },
  { sentence: "Is he young?", zh: "他年轻吗？", options: ["Is she young?", "Is he old?", "Is he kind?", "Is he young?"], correct: 3 },
  { sentence: "No, he isn't.", zh: "不，他不是。", options: ["Yes, he is.", "No, she isn't.", "No, he isn't.", "No, I'm not."], correct: 2 },
  { sentence: "He is very funny.", zh: "他非常风趣。", options: ["He is very kind.", "She is very funny.", "He is very strict.", "He is very funny."], correct: 3 }
]

export const listenOrderBankG5U1a = [
  { sentence: "Who is your art teacher?", zh: "谁是你的美术老师？", words: ["Who", "is", "your", "art", "teacher?"], answer: ["Who", "is", "your", "art", "teacher?"] },
  { sentence: "Is he young?", zh: "他年轻吗？", words: ["Is", "he", "young?"], answer: ["Is", "he", "young?"] },
  { sentence: "Yes, he is.", zh: "是的。", words: ["Yes,", "he", "is."], answer: ["Yes,", "he", "is."] },
  { sentence: "No, he isn't.", zh: "不，他不是。", words: ["No,", "he", "isn't."], answer: ["No,", "he", "isn't."] },
  { sentence: "He is very funny.", zh: "他很风趣。", words: ["He", "is", "very", "funny."], answer: ["He", "is", "very", "funny."] }
]

export const listenResponseBankG5U1a = [
  { question: "Who is your art teacher?", zh: "谁是你的美术老师？", options: ["Mr Jones.", "Yes, he is.", "She's kind.", "In the classroom."], correct: 0 },
  { question: "Is he strict?", zh: "他严格吗？", options: ["Yes, he is.", "He is old.", "I am strict.", "No, she isn't."], correct: 0 },
  { question: "What's he like?", zh: "他是个什么样的人？", options: ["He is very funny.", "She is young.", "I like apples.", "He likes monkeys."], correct: 0 },
  { question: "Is she kind?", zh: "她和蔼吗？", options: ["Yes, she is.", "No, he isn't.", "Thanks.", "You're welcome."], correct: 0 },
  { question: "Do you know Mr Jones?", zh: "你认识琼斯先生吗？", options: ["Yes, I do.", "He is strict.", "It's big.", "I know."], correct: 0 }
]

export const listenTranslateBankG5U1a = [
  { sentence: "Who is your art teacher?", options: ["谁是你的英语老师？", "谁是你的美术老师？", "你的美术老师在哪？", "这是你的美术老师吗？"], correct: 1 },
  { sentence: "Is she kind?", options: ["他严格吗？", "他年轻吗？", "她和蔼吗？", "她好笑吗？"], correct: 2 },
  { sentence: "No, he isn't.", options: ["是的，他是。", "不，她不是。", "是的，她和蔼。", "不，他不是。"], correct: 3 },
  { sentence: "He is very funny.", options: ["他很年轻。", "她很风趣。", "他非常严厉。", "他非常风趣。"], correct: 3 },
  { sentence: "Mr Jones is old.", options: ["琼斯先生很老。", "琼斯先生很年轻。", "琼斯太太很老。", "林先生很老。"], correct: 0 }
]
