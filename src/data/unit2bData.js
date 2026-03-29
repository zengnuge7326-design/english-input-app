// PEP四年级下册 Unit 2 Part B《Let's learn / Let's talk》题库
// 主题：Daily routine (get up, go to school, etc.) + time for / time to 辨析 + ir/ur 语音
// 7种题型，每种5题，共35题

// 题型1：选择题
export const quizBank2b = [
  {
    question: "It's time ___ PE class.",
    chinese: "该上体育课了。",
    options: ["to", "for", "of", "in"],
    correct: 1,
    explanation: "It's time for + 名词（PE class）。表示'该做某事了'。",
    tag: "语法"
  },
  {
    question: "It's time ___ get up.",
    chinese: "该起床了。",
    options: ["to", "for", "at", "on"],
    correct: 0,
    explanation: "It's time to + 动词原形（get up）。",
    tag: "语法"
  },
  {
    question: "Which word has the same 'ir' sound as 'bird'?",
    chinese: "哪个词的发音和 bird 中的 ir 相同？",
    options: ["girl", "fire", "tired", "iron"],
    correct: 0,
    explanation: "bird 和 girl 中的 ir 都发 /ɜː/ 这个长元音。",
    tag: "拼读"
  },
  {
    question: "They are ___.",
    chinese: "她们是护士。",
    options: ["nurse", "nurses", "nurse's", "a nurse"],
    correct: 1,
    explanation: "主语是 They (她们)，用复数 nureses。",
    tag: "语法"
  },
  {
    question: "School is over. Let's go ___.",
    chinese: "放学了。我们回家吧。",
    options: ["to home", "home", "at home", "in home"],
    correct: 1,
    explanation: "go home 是固定搭配，home 在这里是副词，前面不加 to。",
    tag: "词汇"
  }
]

// 题型2：填空题
export const fillblankBank2b = [
  {
    sentence: "It's 7:00 a.m. It's time to go to ___.",
    answer: "school",
    chinese: "早上7点了。该上学了。",
    explanation: "早上7点是上学 (go to school) 的时间。",
    tag: "词汇"
  },
  {
    sentence: "It's 9:00 p.m. It's time to go to ___.",
    answer: "bed",
    chinese: "晚上9点了。该睡觉了。",
    explanation: "晚上9点是睡觉 (go to bed) 的时间。",
    tag: "词汇"
  },
  {
    sentence: "I have a ___ (汉堡包) for lunch.",
    answer: "hamburger",
    chinese: "我午饭吃了一个汉堡。",
    explanation: "hamburger 汉堡包，注意 ur 发 /ɜː/ 的音。",
    tag: "拼写"
  },
  {
    sentence: "The ___ (小鸟) is singing.",
    answer: "bird",
    chinese: "小鸟在唱歌。",
    explanation: "bird 小鸟，ir 发 /ɜː/ 的音。",
    tag: "拼读"
  },
  {
    sentence: "It's time ___ English class.",
    answer: "for",
    chinese: "该上英语课了。",
    explanation: "time for + 名词 (class)。",
    tag: "语法"
  }
]

// 题型3：听单词，选出听到的单词
export const listenWordBank2b = [
  {
    word: "nurse",
    options: ["nurse", "purse", "noise", "nose"],
    correct: 0,
    zh: "护士"
  },
  {
    word: "girl",
    options: ["goal", "girl", "gold", "gulf"],
    correct: 1,
    zh: "女孩"
  },
  {
    word: "hamburger",
    options: ["ham", "hotdog", "hamburger", "hunger"],
    correct: 2,
    zh: "汉堡包"
  },
  {
    word: "breakfast",
    options: ["break", "breakfast", "fast", "first"],
    correct: 1,
    zh: "早餐"
  },
  {
    word: "dinner",
    options: ["dinner", "diner", "winner", "thinner"],
    correct: 0,
    zh: "晚餐"
  }
]

// 题型4：听句子，选出听到的句子
export const listenSentenceBank2b = [
  {
    sentence: "It's time for breakfast.",
    zh: "该吃早饭了。",
    options: [
      "It's time for lunch.",
      "It's time for breakfast.",
      "It's time for dinner.",
      "It's time to eat."
    ],
    correct: 1
  },
  {
    sentence: "Let's go home.",
    zh: "我们回家吧。",
    options: [
      "Let's go to school.",
      "Let's go home.",
      "Time to go home.",
      "Let me go home."
    ],
    correct: 1
  },
  {
    sentence: "School is over.",
    zh: "放学了。",
    options: [
      "School is over.",
      "Class is over.",
      "School begins.",
      "School is nice."
    ],
    correct: 0
  },
  {
    sentence: "That girl is my sister.",
    zh: "那个女孩是我妹妹。",
    options: [
      "That boy is my brother.",
      "That girl is my friend.",
      "This girl is my sister.",
      "That girl is my sister."
    ],
    correct: 3
  },
  {
    sentence: "The nurse is eating a hamburger.",
    zh: "护士正在吃汉堡。",
    options: [
      "The girl is eating a hamburger.",
      "The bird is eating a hamburger.",
      "The nurse is eating an apple.",
      "The nurse is eating a hamburger."
    ],
    correct: 3
  }
]

// 题型5：排序（连词成句）
export const listenOrderBank2b = [
  {
    sentence: "It's time for PE class.",
    zh: "该上体育课了。",
    words: ["It's", "time", "for", "PE", "class."],
    answer: ["It's", "time", "for", "PE", "class."]
  },
  {
    sentence: "School is over now.",
    zh: "现在放学了。",
    words: ["School", "is", "over", "now."],
    answer: ["School", "is", "over", "now."]
  },
  {
    sentence: "Let's go to the playground.",
    zh: "我们去操场吧。",
    words: ["Let's", "go", "to", "the", "playground."],
    answer: ["Let's", "go", "to", "the", "playground."]
  },
  {
    sentence: "It's time to get up.",
    zh: "该起床了。",
    words: ["It's", "time", "to", "get", "up."],
    answer: ["It's", "time", "to", "get", "up."]
  },
  {
    sentence: "The bird is in the tree.",
    zh: "鸟在树上。",
    words: ["The", "bird", "is", "in", "the", "tree."],
    answer: ["The", "bird", "is", "in", "the", "tree."]
  }
]

// 题型6：听问句，选出正确回答
export const listenResponseBank2b = [
  {
    question: "Is it time for lunch?",
    zh: "该吃午饭了吗？",
    options: [
      "Yes, let's eat.",
      "I have a hamburger.",
      "Lunch is good.",
      "No, it's a dog."
    ],
    correct: 0
  },
  {
    question: "What time is it?",
    zh: "几点了？",
    options: [
      "It's time for bed.",
      "It's red.",
      "It's 10 o'clock.",
      "I don't have time."
    ],
    correct: 2
  },
  {
    question: "School is over. What do we do?",
    zh: "放学了。我们做什么？",
    options: [
      "Let's go to school.",
      "Let's go home.",
      "School is big.",
      "I like class."
    ],
    correct: 1
  },
  {
    question: "Is she a nurse?",
    zh: "她是护士吗？",
    options: [
      "Yes, he is.",
      "No, she is a teacher.",
      "She is a girl.",
      "I have a nurse."
    ],
    correct: 1
  },
  {
    question: "It's 9 p.m. What time is it for?",
    zh: "晚上9点了。该干什么了？",
    options: [
      "It's time for lunch.",
      "It's time to go to bed.",
      "It's time to get up.",
      "It's time for school."
    ],
    correct: 1
  }
]

// 题型7：听英语，选出正确中文翻译
export const listenTranslateBank2b = [
  {
    sentence: "It's time for English class.",
    options: [
      "该上英语课了。",
      "该上数学课了。",
      "该上音乐课了。",
      "该上体育课了。"
    ],
    correct: 0
  },
  {
    sentence: "Let's go to the library.",
    options: [
      "我们去图书馆吧。",
      "我们去健身房吧。",
      "我们去操场吧。",
      "我们去食堂吧。"
    ],
    correct: 0
  },
  {
    sentence: "The nurse has a hamburger.",
    options: [
      "护士有一个汉堡。",
      "女孩有一个汉堡。",
      "护士有一只鸟。",
      "那个护士在吃东西。"
    ],
    correct: 0
  },
  {
    sentence: "It's time to go home.",
    options: [
      "该睡觉了。",
      "该回家了。",
      "该上学了。",
      "我们回家吧。"
    ],
    correct: 1
  },
  {
    sentence: "School is over. Let's play.",
    options: [
      "上课了。我们玩吧。",
      "放学了。我们玩吧。",
      "学校真大。我们玩吧。",
      "放学回家吧。"
    ],
    correct: 1
  }
]
