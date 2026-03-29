// PEP五年级上册 Unit 4 Part C《Story time / Let's check》题库
// 主题：Unit 4 综合复习 (can 引导的疑问句，各项能力动作)
// 7种题型，每种5题，共35题

export const quizBankG5U4c = [
  { question: "___ you do any kung fu?", chinese: "你会武术吗？", options: ["Can", "Are", "Do", "Is"], correct: 0, explanation: "你会做某事吗？用 can 引导。", tag: "情态动词" },
  { question: "No, I ___.", chinese: "不，我不会。", options: ["can't", "don't", "am not", "isn't"], correct: 0, explanation: "对Can的否定回答是 No, I can't.", tag: "语法" },
  { question: "I can play ___ pipa.", chinese: "我会弹琵琶。", options: ["the", "a", "an", "的(不填)"], correct: 0, explanation: "乐器前加the。", tag: "冠词" },
  { question: "I can play ___ football.", chinese: "我会踢足球。", options: ["的(不填)", "the", "a", "an"], correct: 0, explanation: "球类运动前不加the。", tag: "冠词" },
  { question: "We can ___ you.", chinese: "我们可以帮你。", options: ["help", "helps", "helping", "to help"], correct: 0, explanation: "情态动词 can 后接动词原形。", tag: "动词形式" }
]

export const fillblankBankG5U4c = [
  { sentence: "What ___ (能够) you do?", answer: "can", chinese: "你能做什么？", explanation: "can 能", tag: "助动词" },
  { sentence: "I can ___ (帮助) you.", answer: "help", chinese: "我会帮助你。", explanation: "help 帮助", tag: "动词" },
  { sentence: "I can play ___ (乒乓球).", answer: "ping-pong", chinese: "我会打乒乓球。", explanation: "ping-pong", tag: "名词" },
  { sentence: "No, I ___ (不能).", answer: "can't", chinese: "不，我不会。", explanation: "can't = can not", tag: "否定短语" },
  { sentence: "I can do ___ (武术).", answer: "kung fu", chinese: "我会练武。", explanation: "kung fu", tag: "短语" }
]

export const listenWordBankG5U4c = [
  { word: "can", options: ["cat", "can", "car", "cap"], correct: 1, zh: "能，会" },
  { word: "help", options: ["help", "half", "hello", "head"], correct: 0, zh: "帮助" },
  { word: "play", options: ["pay", "play", "plane", "plant"], correct: 1, zh: "玩/打" },
  { word: "speak", options: ["peak", "speak", "spark", "speed"], correct: 1, zh: "说" },
  { word: "dance", options: ["dark", "date", "dance", "desk"], correct: 2, zh: "跳舞" }
]

export const listenSentenceBankG5U4c = [
  { sentence: "What can you do?", zh: "你能做什么？", options: ["What do you do?", "What can you do?", "What can he do?", "How are you?"], correct: 1 },
  { sentence: "I can cook.", zh: "我会做饭。", options: ["I can swim.", "I can read.", "I can cook.", "I can jump."], correct: 2 },
  { sentence: "Can you swim?", zh: "你会游泳吗？", options: ["Can you sing?", "Can you jump?", "Can you swim?", "Can you cook?"], correct: 2 },
  { sentence: "Yes, I can.", zh: "是的，我会。", options: ["Yes, I can.", "Yes, I do.", "No, I can't.", "Yes, he is."], correct: 0 },
  { sentence: "I can help you.", zh: "我能帮助你。", options: ["I can see you.", "I can help you.", "I can hear you.", "You can help me."], correct: 1 }
]

export const listenOrderBankG5U4c = [
  { sentence: "What can you do?", zh: "你能做什么？", words: ["What", "can", "you", "do?"], answer: ["What", "can", "you", "do?"] },
  { sentence: "I can cook and swim.", zh: "我会做饭和游泳。", words: ["I", "can", "cook", "and", "swim."], answer: ["I", "can", "cook", "and", "swim."] },
  { sentence: "Can you play ping-pong?", zh: "你会打乒乓球吗？", words: ["Can", "you", "play", "ping-pong?"], answer: ["Can", "you", "play", "ping-pong?"] },
  { sentence: "No, I can not.", zh: "不，我不会。", words: ["No,", "I", "can", "not."], answer: ["No,", "I", "can", "not."] },
  { sentence: "We can help you.", zh: "我们可以帮你。", words: ["We", "can", "help", "you."], answer: ["We", "can", "help", "you."] }
]

export const listenResponseBankG5U4c = [
  { question: "What can you do?", zh: "你能干什么？", options: ["I can speak English.", "Yes, I can.", "I am ten.", "Fine, thank you."], correct: 0 },
  { question: "Can you do any kung fu?", zh: "你会练武术吗？", options: ["Yes, I can.", "He can swim.", "I play football.", "Thanks."], correct: 0 },
  { question: "Can you play the pipa?", zh: "你会弹琵琶吗？", options: ["No, I can't.", "Yes, he can.", "I have a pipa.", "You're welcome."], correct: 0 },
  { question: "Who can sing English songs?", zh: "谁会唱英文歌？", options: ["I can.", "Yes, she can.", "I am singing.", "OK."], correct: 0 },
  { question: "We can help you.", zh: "我们能帮你。", options: ["Thank you.", "Yes, I can.", "It is red.", "Me too."], correct: 0 }
]

export const listenTranslateBankG5U4c = [
  { sentence: "What can you do?", options: ["你想干什么？", "你在做什么？", "你能做什么？", "你是医生吗？"], correct: 2 },
  { sentence: "I can speak English.", options: ["我会说英语。", "我会唱歌。", "我可以说中文。", "我会听课。"], correct: 0 },
  { sentence: "Can you play basketball?", options: ["你喜欢打篮球吗？", "你会踢足球吗？", "你会打篮球吗？", "你会打乒乓球吗？"], correct: 2 },
  { sentence: "No, I can't.", options: ["是的，我能。", "不，我不知道。", "不，他不会。", "不，我不会。"], correct: 3 },
  { sentence: "I can help you.", options: ["你能帮我吗？", "我能帮助你。", "谢谢你的帮助。", "你在帮我。"], correct: 1 }
]
