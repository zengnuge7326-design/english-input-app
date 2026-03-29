// PEP四年级下册 Unit 2 Part C《Story time / Let's check》题库
// 主题：Unit 2 综合复习
// 7种题型，每种5题，共35题

// 题型1：选择题
export const quizBank2c = [
  {
    question: "Wake up! ___ time to go to school.",
    chinese: "醒醒！该上学了。",
    options: ["It", "Its", "It's", "Is"],
    correct: 2,
    explanation: "It's = It is。It's time to do sth.",
    tag: "语法"
  },
  {
    question: "We have ___ class at ten 10:00. We sing songs.",
    chinese: "我们十点有音乐课。我们唱歌。",
    options: ["music", "PE", "art", "math"],
    correct: 0,
    explanation: "sing songs 唱歌是音乐课(music)的内容。",
    tag: "词汇"
  },
  {
    question: "Are you ready ___ breakfast?",
    chinese: "你准备好吃早饭了吗？",
    options: ["to", "for", "in", "on"],
    correct: 1,
    explanation: "Are you ready for sth? 你准备好做某事了吗？固定搭配。",
    tag: "语法"
  },
  {
    question: "Which word has the 'ur' sound like in 'nurse'?",
    chinese: "哪个词里的 ur 发音像 nurse 里的一样？",
    options: ["purple", "pure", "curl", "both A and C"],
    correct: 3,
    explanation: "purple 和 curl 里的 ur 均发 /ɜː/。",
    tag: "拼读"
  },
  {
    question: "I want to sleep. It's time ___.",
    chinese: "我想睡觉。该睡觉了。",
    options: ["for bed", "to bed", "bed", "in bed"],
    correct: 0,
    explanation: "It's time for bed (名词短语) 或者 It's time to go to bed (动词短语)。",
    tag: "语法"
  }
]

// 题型2：填空题
export const fillblankBank2c = [
  {
    sentence: "It's 6:00. Time for ___ (晚餐).",
    answer: "dinner",
    chinese: "6点了。该吃晚餐了。",
    explanation: "dinner = 晚餐。",
    tag: "拼写"
  },
  {
    sentence: "___ up! You will be late.",
    answer: "Hurry",
    chinese: "快点！你要迟到了。",
    explanation: "Hurry up 快点，常结合时间话题出现。",
    tag: "短语"
  },
  {
    sentence: "___ time is it? It's noon.",
    answer: "What",
    chinese: "几点了？中午了。",
    explanation: "What time is it 问时间。",
    tag: "句型"
  },
  {
    sentence: "Time to ___ (回家) home.",
    answer: "go",
    chinese: "该回家了。",
    explanation: "go home 回家，注意 home 前面不用 to。",
    tag: "词汇"
  },
  {
    sentence: "I get up ___ seven o'clock.",
    answer: "at",
    chinese: "我七点起床。",
    explanation: "具体时刻前用介词 at。",
    tag: "介词"
  }
]

// 题型3：听单词，选出听到的单词
export const listenWordBank2c = [
  {
    word: "ready",
    options: ["read", "ready", "real", "really"],
    correct: 1,
    zh: "准备好"
  },
  {
    word: "dinner",
    options: ["diner", "inner", "dinner", "thinner"],
    correct: 2,
    zh: "晚餐"
  },
  {
    word: "subject",
    options: ["subject", "object", "project", "reject"],
    correct: 0,
    zh: "科目"
  },
  {
    word: "thirty",
    options: ["thirteen", "thirsty", "thirty", "dirty"],
    correct: 2,
    zh: "三十"
  },
  {
    word: "clock",
    options: ["clock", "o'clock", "cock", "cloak"],
    correct: 0,
    zh: "钟表"
  }
]

// 题型4：听句子，选出听到的句子
export const listenSentenceBank2c = [
  {
    sentence: "Are you ready?",
    zh: "你准备好了吗？",
    options: [
      "Are you hungry?",
      "Are you ready?",
      "Are you busy?",
      "Are you happy?"
    ],
    correct: 1
  },
  {
    sentence: "It's seven thirty. Time for school.",
    zh: "七点半了。该上学了。",
    options: [
      "It's seven thirty. Time for home.",
      "It's seven thirty. Time for bed.",
      "It's seven o'clock. Time for school.",
      "It's seven thirty. Time for school."
    ],
    correct: 3
  },
  {
    sentence: "Let's drink some milk.",
    zh: "我们喝点牛奶吧。",
    options: [
      "Let's drink some water.",
      "Let's eat some food.",
      "Let's drink some milk.",
      "Let's drink some tea."
    ],
    correct: 2
  },
  {
    sentence: "Oh, it's late!",
    zh: "噢，太晚了！",
    options: [
      "Oh, it's great!",
      "Oh, it's late!",
      "Oh, it's early!",
      "Oh, it's eight!"
    ],
    correct: 1
  },
  {
    sentence: "Wake up, little boy.",
    zh: "醒醒，小男孩。",
    options: [
      "Wake up, little girl.",
      "Wake up, little boy.",
      "Get up, little boy.",
      "Stand up, little boy."
    ],
    correct: 1
  }
]

// 题型5：排序（连词成句）
export const listenOrderBank2c = [
  {
    sentence: "What time is it now?",
    zh: "现在几点了？",
    words: ["What", "time", "is", "it", "now?"],
    answer: ["What", "time", "is", "it", "now?"]
  },
  {
    sentence: "It's time for lunch.",
    zh: "该吃午饭了。",
    words: ["It's", "time", "for", "lunch."],
    answer: ["It's", "time", "for", "lunch."]
  },
  {
    sentence: "It's time to get up.",
    zh: "该起床了。",
    words: ["It's", "time", "to", "get", "up."],
    answer: ["It's", "time", "to", "get", "up."]
  },
  {
    sentence: "Are you ready for dinner?",
    zh: "你准备好吃晚餐了吗？",
    words: ["Are", "you", "ready", "for", "dinner?"],
    answer: ["Are", "you", "ready", "for", "dinner?"]
  },
  {
    sentence: "Let's drink some milk.",
    zh: "我们喝点牛奶吧。",
    words: ["Let's", "drink", "some", "milk."],
    answer: ["Let's", "drink", "some", "milk."]
  }
]

// 题型6：听问句，选出正确回答
export const listenResponseBank2c = [
  {
    question: "Are you ready?",
    zh: "你准备好了吗？",
    options: [
      "Yes, I'm ready.",
      "I like reading.",
      "I am ready for bed.",
      "It is red."
    ],
    correct: 0
  },
  {
    question: "What time is it?",
    zh: "几点了？",
    options: [
      "It is ten o'clock.",
      "It is time to go.",
      "It is big.",
      "My name is Tom."
    ],
    correct: 0
  },
  {
    question: "Is it time for music class?",
    zh: "到了上音乐课的时间了吗？",
    options: [
      "Music is fun.",
      "No, it's time for math.",
      "I like music.",
      "My teacher is nice."
    ],
    correct: 1
  },
  {
    question: "When do you have dinner?",
    zh: "你什么时候吃晚餐？",
    options: [
      "I have a burger.",
      "I have dinner at home.",
      "I have dinner at six o'clock.",
      "Dinner is good."
    ],
    correct: 2
  },
  {
    question: "Hurry up!",
    zh: "快点！",
    options: [
      "I'm sorry. I'm coming.",
      "You are fast.",
      "I like running.",
      "Where is it?"
    ],
    correct: 0
  }
]

// 题型7：听英语，选出正确中文翻译
export const listenTranslateBank2c = [
  {
    sentence: "It's time for bed.",
    options: [
      "该上床睡觉了。",
      "该起床了。",
      "该吃饭了。",
      "该上学了。"
    ],
    correct: 0
  },
  {
    sentence: "Wake up!",
    options: [
      "站起来！",
      "快走！",
      "醒醒！",
      "等一下！"
    ],
    correct: 2
  },
  {
    sentence: "I have breakfast at seven o'clock.",
    options: [
      "我七点吃早餐。",
      "我七点吃午餐。",
      "我七点吃晚餐。",
      "我七点去学校。"
    ],
    correct: 0
  },
  {
    sentence: "What time is it?",
    options: [
      "今天是星期几？",
      "现在几点了？",
      "你多大了？",
      "他在哪里？"
    ],
    correct: 1
  },
  {
    sentence: "Let's run to school.",
    options: [
      "我们走去学校吧。",
      "我们跑着回家吧。",
      "我们跑去学校吧。",
      "我们别跑了。"
    ],
    correct: 2
  }
]
