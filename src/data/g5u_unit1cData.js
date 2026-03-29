// PEP五年级上册 Unit 1 Part C《Story time / Let's check》题库
// 主题：Unit 1 综合复习 (what's he like? 外貌性格词汇综合)
// 7种题型，每种5题，共35题

export const quizBankG5U1c = [
  { question: "___ your music teacher?", chinese: "谁是你的音乐老师？", options: ["Who's", "What's", "Where's", "How's"], correct: 0, explanation: "Who is 的缩写 Who's 用于询问是谁。", tag: "疑问词" },
  { question: "___ he funny?", chinese: "他风趣吗？", options: ["Is", "Are", "Do", "Does"], correct: 0, explanation: "系动词 Is 引导一般疑问句。", tag: "系动词" },
  { question: "What ___ she like?", chinese: "她是什么样的人？", options: ["is", "are", "do", "does"], correct: 0, explanation: "What is someone like? 询问人的性格。", tag: "口语交际" },
  { question: "He makes me ___.", chinese: "他让我笑起来。 / 他逗我笑。", options: ["laugh", "laughing", "laughs", "to laugh"], correct: 0, explanation: "make sb. do sth. 使得某人做某事，用动词原形。", tag: "动词用法" },
  { question: "They are very ___.", chinese: "他们非常乐于助人。", options: ["helpful", "help", "helps", "helping"], correct: 0, explanation: "系动词 are 后面跟形容词 helpful。", tag: "形容词" }
]

export const fillblankBankG5U1c = [
  { sentence: "___ (什么) is he like?", answer: "What", chinese: "他是怎样的人？", explanation: "What...like 句型。", tag: "疑问词" },
  { sentence: "He is ___ (严格的).", answer: "strict", chinese: "他是严格的。", explanation: "strict", tag: "形容词" },
  { sentence: "But he is very ___ (和蔼的).", answer: "kind", chinese: "但是他非常和蔼。", explanation: "kind", tag: "形容词" },
  { sentence: "Is she ___ (聪明的)?", answer: "clever", chinese: "她聪明吗？", explanation: "clever", tag: "形容词" },
  { sentence: "They are very ___ (滑稽的).", answer: "funny", chinese: "他们非常风趣。", explanation: "funny", tag: "形容词" }
]

export const listenWordBankG5U1c = [
  { word: "laugh", options: ["laugh", "love", "large", "leave"], correct: 0, zh: "笑" },
  { word: "strict", options: ["street", "strict", "straight", "start"], correct: 1, zh: "严格的" },
  { word: "funny", options: ["sunny", "funny", "run", "fun"], correct: 1, zh: "滑稽的/风趣的" },
  { word: "helpful", options: ["help", "helpful", "half", "hopeful"], correct: 1, zh: "乐于助人的" },
  { word: "polite", options: ["police", " pilot", "polite", "plate"], correct: 2, zh: "有礼貌的" }
]

export const listenSentenceBankG5U1c = [
  { sentence: "Who's your English teacher?", zh: "谁是你的英语老师？", options: ["Who's your music teacher?", "Who's your math teacher?", "Who's your English teacher?", "What's your English teacher?"], correct: 2 },
  { sentence: "Mr Carter.", zh: "卡特先生。", options: ["Mr Carter.", "Miss White.", "Mr Jones.", "Mrs Carter."], correct: 0 },
  { sentence: "What's he like?", zh: "他是怎样的人？", options: ["What's she like?", "What's he like?", "What does he like?", "Who is he like?"], correct: 1 },
  { sentence: "He's tall and strong.", zh: "他又高又壮。", options: ["He's short and thin.", "He's tall and strong.", "She's tall and strong.", "He's old and kind."], correct: 1 },
  { sentence: "Is he strict?", zh: "他严厉吗？", options: ["Is she kind?", "Is he clever?", "Is he strict?", "Is he young?"], correct: 2 }
]

export const listenOrderBankG5U1c = [
  { sentence: "What is he like?", zh: "他是怎样的人？", words: ["What", "is", "he", "like?"], answer: ["What", "is", "he", "like?"] },
  { sentence: "He is strict.", zh: "他很严格。", words: ["He", "is", "strict."], answer: ["He", "is", "strict."] },
  { sentence: "But he is kind.", zh: "但是他很和蔼。", words: ["But", "he", "is", "kind."], answer: ["But", "he", "is", "kind."] },
  { sentence: "Is she polite?", zh: "她有礼貌吗？", words: ["Is", "she", "polite?"], answer: ["Is", "she", "polite?"] },
  { sentence: "Yes, she is.", zh: "是的，她是。", words: ["Yes,", "she", "is."], answer: ["Yes,", "she", "is."] }
]

export const listenResponseBankG5U1c = [
  { question: "What's your math teacher like?", zh: "你的数学老师是个什么样的人？", options: ["She is very kind.", "She is Miss White.", "I like math.", "Yes, she is."], correct: 0 },
  { question: "Who is your art teacher?", zh: "谁是你的美术老师？", options: ["Mr Jones.", "He is tall.", "No, he isn't.", "Thank you."], correct: 0 },
  { question: "Is Mr Carter strict?", zh: "卡特先生严格吗？", options: ["Yes, he is.", "He is polite.", "I am strict.", "She is young."], correct: 0 },
  { question: "Are they helpful?", zh: "他们乐于助人吗？", options: ["Yes, they are.", "He is helpful.", "They are students.", "It's big."], correct: 0 },
  { question: "I like Mr Jones.", zh: "我喜欢琼斯先生。", options: ["Me too. He's funny.", "No, she isn't.", "Thanks.", "You're welcome."], correct: 0 }
]

export const listenTranslateBankG5U1c = [
  { sentence: "What is she like?", options: ["她喜欢什么？", "她是个怎样的人？", "他在哪儿？", "她是做什么的？"], correct: 1 },
  { sentence: "He is strict but kind.", options: ["他很和蔼且风趣。", "他既严格又和蔼。", "他老但是很健康。", "他很努力工作。"], correct: 1 },
  { sentence: "Who's your English teacher?", options: ["谁是你的语文老师？", "谁是你的数学老师？", "谁是你的音乐老师？", "谁是你的英语老师？"], correct: 3 },
  { sentence: "They are helpful.", options: ["他们很聪明。", "他们很有礼貌。", "他们乐于助人。", "他们很忙。"], correct: 2 },
  { sentence: "Is she clever?", options: ["她聪明吗？", "他聪明吗？", "她老吗？", "他们聪明吗？"], correct: 0 }
]
