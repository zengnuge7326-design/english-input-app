// PEP五年级上册 Unit 4 Part B《What can you do?》题库
// 主题：能力与活动2 (swim, speak English, cook, play basketball, play ping-pong) + Can you swim?
// 7种题型，每种5题，共35题

export const quizBankG5U4b = [
  { question: "___ you swim?", chinese: "你会游泳吗？", options: ["Can", "Do", "Are", "Is"], correct: 0, explanation: "询问能力用情态动词 Can。", tag: "情态动词" },
  { question: "Yes, I ___.", chinese: "是的，我会。", options: ["can", "can't", "am", "do"], correct: 0, explanation: "Can you... 的肯定回答 Yes, I can.", tag: "语法" },
  { question: "No, I ___.", chinese: "不，我不会。", options: ["can't", "can", "don't", "aren't"], correct: 0, explanation: "Can you...的否定回答 No, I can't.", tag: "语法" },
  { question: "I can speak ___.", chinese: "我会说英语。", options: ["English", "english", "Chinese", "Math"], correct: 0, explanation: "说某种语言用speak + 语言名词首字母大写，如 English。", tag: "名词" },
  { question: "Can you play ___ basketball?", chinese: "你会打篮球吗？", options: ["的(不填)", "the", "a", "an"], correct: 0, explanation: "球类运动前不加冠词，play basketball。", tag: "冠词" }
]

export const fillblankBankG5U4b = [
  { sentence: "___ (能) you swim?", answer: "Can", chinese: "你会游泳吗？", explanation: "Can 引导疑问句。", tag: "情态动词" },
  { sentence: "Yes, I ___ (能).", answer: "can", chinese: "是的，我会。", explanation: "Yes, I can.", tag: "语法" },
  { sentence: "No, I ___ (不能).", answer: "can't", chinese: "不，我不会。", explanation: "can't = can not", tag: "语法" },
  { sentence: "I can ___ (说) English.", answer: "speak", chinese: "我会说英语。", explanation: "speak 语言", tag: "动词" },
  { sentence: "I can ___ (做饭).", answer: "cook", chinese: "我会做饭。", explanation: "cook 做饭", tag: "动词" }
]

export const listenWordBankG5U4b = [
  { word: "swim", options: ["swing", "swim", "sweet", "swan"], correct: 1, zh: "游泳" },
  { word: "speak", options: ["speak", "spark", "spell", "speed"], correct: 0, zh: "说（语言）" },
  { word: "cook", options: ["look", "cook", "book", "cool"], correct: 1, zh: "做饭" },
  { word: "basketball", options: ["football", "baseball", "basketball", "volleyball"], correct: 2, zh: "篮球" },
  { word: "ping-pong", options: ["ping-pong", "pig", "piano", "pipa"], correct: 0, zh: "乒乓球" }
]

export const listenSentenceBankG5U4b = [
  { sentence: "Can you swim?", zh: "你会游泳吗？", options: ["Can you sing?", "Can you swim?", "Can you swing?", "Can you cook?"], correct: 1 },
  { sentence: "Yes, I can.", zh: "是的，我会。", options: ["Yes, I do.", "Yes, I am.", "Yes, I can.", "Yes, he can."], correct: 2 },
  { sentence: "No, I can't.", zh: "不，我不会。", options: ["No, I don't.", "No, she isn't.", "No, I can't.", "Yes, I can."], correct: 2 },
  { sentence: "I can speak English.", zh: "我会说英语。", options: ["I can speak Chinese.", "He can speak English.", "I can speak English.", "I can learn English."], correct: 2 },
  { sentence: "I can play basketball.", zh: "我会打篮球。", options: ["I can play football.", "I can play ping-pong.", "I can play basketball.", "I can play baseball."], correct: 2 }
]

export const listenOrderBankG5U4b = [
  { sentence: "Can you swim?", zh: "你会游泳吗？", words: ["Can", "you", "swim?"], answer: ["Can", "you", "swim?"] },
  { sentence: "Yes, I can.", zh: "是的，我会。", words: ["Yes,", "I", "can."], answer: ["Yes,", "I", "can."] },
  { sentence: "No, I cannot.", zh: "不，我不会。(完整)", words: ["No,", "I", "cannot."], answer: ["No,", "I", "cannot."] },
  { sentence: "I can speak English.", zh: "我会说英语。", words: ["I", "can", "speak", "English."], answer: ["I", "can", "speak", "English."] },
  { sentence: "Can you play ping-pong?", zh: "你会打乒乓球吗？", words: ["Can", "you", "play", "ping-pong?"], answer: ["Can", "you", "play", "ping-pong?"] }
]

export const listenResponseBankG5U4b = [
  { question: "Can you swim?", zh: "你会游泳吗？", options: ["Yes, I can.", "He can swim.", "I'm ten.", "Goodbye."], correct: 0 },
  { question: "Can you speak English?", zh: "你会说英语吗？", options: ["No, I can't.", "Yes, it is.", "She is very good.", "I like English."], correct: 0 },
  { question: "Can you play basketball?", zh: "你会打篮球吗？", options: ["Yes, I can.", "Play ping-pong.", "I have a ball.", "Nice to meet you."], correct: 0 },
  { question: "Can she cook?", zh: "她会做饭吗？", options: ["Yes, she can.", "Yes, he can.", "I can cook.", "She is kind."], correct: 0 },
  { question: "I can play ping-pong. What about you?", zh: "我会打乒乓球。你呢？", options: ["I can play football.", "Yes, I do.", "I am twelve.", "We are friends."], correct: 0 }
]

export const listenTranslateBankG5U4b = [
  { sentence: "Can you swim?", options: ["你会画画吗？", "你会游泳吗？", "你会做饭吗？", "你会跳舞吗？"], correct: 1 },
  { sentence: "Yes, I can.", options: ["是的，我可以。", "是的，我是。", "不，我不会。", "是的，我喜欢。"], correct: 0 },
  { sentence: "No, I can't.", options: ["不，她不是。", "是的，我会。", "不，我不会。", "不，我不知道。"], correct: 2 },
  { sentence: "I can speak English.", options: ["我会教英语。", "我会听英语。", "我会写英语。", "我会说英语。"], correct: 3 },
  { sentence: "I can cook.", options: ["我会看书。", "我会跑步。", "我会洗衣服。", "我会做饭。"], correct: 3 }
]
