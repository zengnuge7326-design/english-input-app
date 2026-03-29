// PEP五年级上册 Unit 1 Part B《What's he like?》题库
// 主题：性格品质 (polite, hard-working, helpful, clever, shy) + What's she like? She's kind.
// 7种题型，每种5题，共35题

export const quizBankG5U1b = [
  { question: "___ she like?", chinese: "她是什么样的人？", options: ["What's", "Who's", "Where's", "How's"], correct: 0, explanation: "What is she like? 询问人的性格或外貌。", tag: "疑问词" },
  { question: "She ___ clever.", chinese: "她很聪明。", options: ["is", "are", "am", "be"], correct: 0, explanation: "主语 She 配系动词 is。", tag: "系动词" },
  { question: "They ___ hard-working.", chinese: "他们很努力工作。", options: ["are", "is", "am", "do"], correct: 0, explanation: "主语 They 配 are。", tag: "系动词" },
  { question: "He is very ___ at home.", chinese: "他在家很有帮助（乐于助人）。", options: ["helpful", "help", "polite", "shy"], correct: 0, explanation: "helpful：乐于助人的。", tag: "形容词" },
  { question: "The boy is ___. Pls say hello.", chinese: "这男孩很害羞。请向他问好。", options: ["shy", "polite", "funny", "strict"], correct: 0, explanation: "shy 害羞的；polite 有礼貌的。", tag: "形容词" }
]

export const fillblankBankG5U1b = [
  { sentence: "___ (什么) is she like?", answer: "What", chinese: "她是个什么样的人？", explanation: "What ... like? 问为人。", tag: "疑问词" },
  { sentence: "She is ___ (聪明的).", answer: "clever", chinese: "她很聪明。", explanation: "clever 聪明", tag: "形容词" },
  { sentence: "They are ___ (努力工作的).", answer: "hard-working", chinese: "他们工作很努力。", explanation: "hard-working", tag: "形容词" },
  { sentence: "He is ___ (有礼貌的).", answer: "polite", chinese: "他很有礼貌。", explanation: "polite 有礼貌的", tag: "形容词" },
  { sentence: "She is a bit ___ (害羞的).", answer: "shy", chinese: "她有点害羞。", explanation: "shy 害羞的", tag: "形容词" }
]

export const listenWordBankG5U1b = [
  { word: "clever", options: ["clean", "clever", "class", "never"], correct: 1, zh: "聪明的" },
  { word: "polite", options: ["police", "pilot", "polite", "plate"], correct: 2, zh: "有礼貌的" },
  { word: "helpful", options: ["help", "helpful", "hopeful", "half"], correct: 1, zh: "有用的/乐于助人的" },
  { word: "shy", options: ["she", "shoe", "shy", "sky"], correct: 2, zh: "害羞的" },
  { word: "hard-working", options: ["hard", "working", "hard-working", "homework"], correct: 2, zh: "工作努力的" }
]

export const listenSentenceBankG5U1b = [
  { sentence: "What's she like?", zh: "她是个什么样的人？", options: ["What's he like?", "What's she like?", "Who is she?", "How is she?"], correct: 1 },
  { sentence: "She is polite.", zh: "她很有礼貌。", options: ["She is shy.", "She is kind.", "She is polite.", "He is polite."], correct: 2 },
  { sentence: "They are hard-working.", zh: "他们工作很努力。", options: ["They are helpful.", "They are clever.", "We are hard-working.", "They are hard-working."], correct: 3 },
  { sentence: "He is very helpful.", zh: "他非常乐于助人。", options: ["She is very helpful.", "He is very helpful.", "He is very kind.", "He is very clever."], correct: 1 },
  { sentence: "She is quiet.", zh: "她很安静。", options: ["She is quick.", "He is quiet.", "She is quiet.", "She is quite."], correct: 2 }
]

export const listenOrderBankG5U1b = [
  { sentence: "What is she like?", zh: "她是什么样的人？", words: ["What", "is", "she", "like?"], answer: ["What", "is", "she", "like?"] },
  { sentence: "She is very clever.", zh: "她非常聪明。", words: ["She", "is", "very", "clever."], answer: ["She", "is", "very", "clever."] },
  { sentence: "They are hard-working.", zh: "他们很努力。", words: ["They", "are", "hard-working."], answer: ["They", "are", "hard-working."] },
  { sentence: "He is helpful at home.", zh: "他在家很乐于助人。", words: ["He", "is", "helpful", "at", "home."], answer: ["He", "is", "helpful", "at", "home."] },
  { sentence: "She is shy.", zh: "她很害羞。", words: ["She", "is", "shy."], answer: ["She", "is", "shy."] }
]

export const listenResponseBankG5U1b = [
  { question: "What's he like?", zh: "他是个什么样的人？", options: ["He's hard-working.", "Yes, he is.", "He is my teacher.", "I'm ten."], correct: 0 },
  { question: "What's she like?", zh: "她是什么样的人？", options: ["She is helpful.", "No, she isn't.", "I like apples.", "She is my sister."], correct: 0 },
  { question: "Are they polite?", zh: "他们有礼貌吗？", options: ["Yes, they are.", "Yes, he is.", "They are clever.", "Thanks."], correct: 0 },
  { question: "Is he helpful at home?", zh: "他在家乐于助人吗？", options: ["Yes, he is.", "He is clever.", "She is shy.", "OK."], correct: 0 },
  { question: "She is very clever.", zh: "她很聪明。", options: ["Yes, and she is kind.", "No, I don't.", "Thank you.", "Bye."], correct: 0 }
]

export const listenTranslateBankG5U1b = [
  { sentence: "What's he like?", options: ["他长什么样？", "他是个什么样的人？", "他喜欢什么？", "他是谁？"], correct: 1 },
  { sentence: "She is polite.", options: ["她很聪明。", "她很严格。", "她很有礼貌。", "她很害羞。"], correct: 2 },
  { sentence: "They are hard-working.", options: ["他们很聪明。", "他们工作很努力。", "他们很忙。", "他们乐于助人。"], correct: 1 },
  { sentence: "He is very helpful.", options: ["他非常聪明。", "他很努力工作。", "她非常乐于助人。", "他非常乐于助人（有用）。"], correct: 3 },
  { sentence: "She is shy.", options: ["她很活泼。", "她很害羞。", "她很高。", "她很快。"], correct: 1 }
]
