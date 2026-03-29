// PEP四年级下册 Unit 2《What time is it?》题库
// 7种题型，每种5题，共35题

// 题型1：选择题
export const quizBank2a = [
  {
    question: "___ time is it?",
    chinese: "现在几点了？",
    options: ["Who", "What", "Where", "When"],
    correct: 1,
    explanation: "What time is it? 是询问时间的固定句型。What 用于询问'是什么'。",
    tag: "句型"
  },
  {
    question: "It's ___ o'clock. Time to get up!",
    chinese: "六点整了，该起床了！",
    options: ["fifth", "six", "sixth", "sixes"],
    correct: 1,
    explanation: "o'clock 前面用基数词（one/two/three…），不用序数词。six o'clock 六点。",
    tag: "词汇"
  },
  {
    question: "We have lunch ___ 12 o'clock.",
    chinese: "我们十二点吃午饭。",
    options: ["in", "on", "at", "by"],
    correct: 2,
    explanation: "表示具体时刻用介词 at。at 12 o'clock 在十二点。",
    tag: "介词"
  },
  {
    question: "I usually ___ to bed at 9 o'clock.",
    chinese: "我通常九点睡觉。",
    options: ["get", "go", "come", "be"],
    correct: 1,
    explanation: "go to bed 意思是'去睡觉/就寝'，是固定短语，不能换成 get。",
    tag: "短语"
  },
  {
    question: "Which word has the same vowel sound as 'school'?",
    chinese: "哪个词和 school 的元音发音相同？",
    options: ["book", "cook", "food", "good"],
    correct: 2,
    explanation: "school 中 oo 发长音 /uː/，和 food 相同。book/cook/good 中 oo 发短音 /ʊ/。",
    tag: "拼读"
  }
]

// 题型2：填空题
export const fillblankBank2a = [
  {
    sentence: "What ___ is it? It's 7:00.",
    answer: "time",
    chinese: "几点了？现在七点。",
    explanation: "What time is it? 是询问时间的固定句型，time 不可省略。",
    tag: "句型"
  },
  {
    sentence: "It's ___ to go to school!",
    answer: "time",
    chinese: "该上学了！",
    explanation: "It's time to do sth. 意思是'该做某事了'，是 Unit 2 核心句型。",
    tag: "句型"
  },
  {
    sentence: "I get ___ at 6:30 in the morning.",
    answer: "up",
    chinese: "我早上6:30起床。",
    explanation: "get up 是固定短语，意思是起床。与 go to bed（睡觉）配对记忆。",
    tag: "短语"
  },
  {
    sentence: "English class starts ___ 8 o'clock.",
    answer: "at",
    chinese: "英语课8点开始。",
    explanation: "at + 具体时刻，表示在某一时间点，at 8 o'clock 在八点整。",
    tag: "介词"
  },
  {
    sentence: "___ up! We're late for school.",
    answer: "Hurry",
    chinese: "快点！我们上学要迟到了。",
    explanation: "Hurry up! 意思是'赶快/快点'，是祈使句，用于催促他人。",
    tag: "词汇"
  }
]

// 题型3：听单词，选出听到的单词
export const listenWordBank2a = [
  {
    word: "o'clock",
    options: ["o'clock", "clock", "block", "lock"],
    correct: 0,
    zh: "……点整"
  },
  {
    word: "morning",
    options: ["warning", "morning", "moaning", "burning"],
    correct: 1,
    zh: "早上/上午"
  },
  {
    word: "noon",
    options: ["moon", "soon", "noon", "boon"],
    correct: 2,
    zh: "正午/中午"
  },
  {
    word: "hurry",
    options: ["hurry", "hungry", "harry", "hobby"],
    correct: 0,
    zh: "赶快/急忙"
  },
  {
    word: "schedule",
    options: ["school", "schedule", "skill", "shale"],
    correct: 1,
    zh: "日程表/课程表"
  }
]

// 题型4：听句子，选出听到的句子
export const listenSentenceBank2a = [
  {
    sentence: "What time is it?",
    zh: "几点了？",
    options: [
      "What time is it?",
      "What time was it?",
      "What's the time now?",
      "What time will it be?"
    ],
    correct: 0
  },
  {
    sentence: "It's time to go to school.",
    zh: "该上学了。",
    options: [
      "It's time to go home.",
      "It's time to go to school.",
      "It's time to go to bed.",
      "It's time to come to school."
    ],
    correct: 1
  },
  {
    sentence: "I usually get up at 6:30.",
    zh: "我通常6:30起床。",
    options: [
      "I usually get up at 6:00.",
      "I always get up at 6:30.",
      "I usually get up at 6:30.",
      "I usually wake up at 6:30."
    ],
    correct: 2
  },
  {
    sentence: "Hurry up! It's late.",
    zh: "快点！已经晚了。",
    options: [
      "Hurry up! It's great.",
      "Come on! It's late.",
      "Hurry on! It's late.",
      "Hurry up! It's late."
    ],
    correct: 3
  },
  {
    sentence: "We have PE at two o'clock.",
    zh: "我们两点有体育课。",
    options: [
      "We have art at two o'clock.",
      "We have PE at two o'clock.",
      "We have PE at three o'clock.",
      "We have music at two o'clock."
    ],
    correct: 1
  }
]

// 题型5：排序（连词成句）
export const listenOrderBank2a = [
  {
    sentence: "What time is it?",
    zh: "现在几点了？",
    words: ["What", "time", "is", "it?"],
    answer: ["What", "time", "is", "it?"]
  },
  {
    sentence: "It's time to get up.",
    zh: "该起床了。",
    words: ["It's", "time", "to", "get", "up."],
    answer: ["It's", "time", "to", "get", "up."]
  },
  {
    sentence: "I get up at 6:30.",
    zh: "我6:30起床。",
    words: ["I", "get", "up", "at", "6:30."],
    answer: ["I", "get", "up", "at", "6:30."]
  },
  {
    sentence: "We have lunch at noon.",
    zh: "我们中午吃午饭。",
    words: ["We", "have", "lunch", "at", "noon."],
    answer: ["We", "have", "lunch", "at", "noon."]
  },
  {
    sentence: "It's seven o'clock.",
    zh: "现在是七点整。",
    words: ["It's", "seven", "o'clock."],
    answer: ["It's", "seven", "o'clock."]
  }
]

// 题型6：听问句，选出正确回答
export const listenResponseBank2a = [
  {
    question: "What time is it?",
    zh: "现在几点了？",
    options: [
      "It's Monday.",
      "It's seven o'clock.",
      "I don't know the time.",
      "Time flies."
    ],
    correct: 1
  },
  {
    question: "What time do you get up?",
    zh: "你几点起床？",
    options: [
      "I get up every day.",
      "I go to bed at 9 o'clock.",
      "I get up at 6:30.",
      "I like getting up early."
    ],
    correct: 2
  },
  {
    question: "Is it time for class?",
    zh: "该上课了吗？",
    options: [
      "Class is very good.",
      "Yes, hurry up!",
      "No, I don't have class.",
      "I like my class."
    ],
    correct: 1
  },
  {
    question: "When do you have lunch?",
    zh: "你什么时候吃午饭？",
    options: [
      "I have lunch in a restaurant.",
      "I have lunch with my friends.",
      "I like to have lunch.",
      "I have lunch at 12 o'clock."
    ],
    correct: 3
  },
  {
    question: "What do you do after school?",
    zh: "放学后你做什么？",
    options: [
      "I go home and do my homework.",
      "I go to school.",
      "My school is big.",
      "After school is nice."
    ],
    correct: 0
  }
]

// 题型7：听英语，选出正确中文翻译
export const listenTranslateBank2a = [
  {
    sentence: "What time is it? It's eight o'clock.",
    options: [
      "几点了？现在是八点整。",
      "几点了？现在是七点整。",
      "现在是八点，几点了？",
      "几点了？现在是十点整。"
    ],
    correct: 0
  },
  {
    sentence: "It's time to go to school.",
    options: [
      "该回家了。",
      "现在到了上学的时候了。",
      "上学去。",
      "学校快开始了。"
    ],
    correct: 1
  },
  {
    sentence: "I usually go to bed at 9 o'clock.",
    options: [
      "我总是9点睡觉。",
      "我通常9点起床。",
      "我通常9点睡觉。",
      "我通常9点上学。"
    ],
    correct: 2
  },
  {
    sentence: "Hurry up! It's time for English class.",
    options: [
      "快点！数学课要开始了。",
      "快点！体育课要开始了。",
      "英语课开始了，快点！",
      "快点！英语课要开始了。"
    ],
    correct: 3
  },
  {
    sentence: "We have PE on Monday and Thursday.",
    options: [
      "我们周二和周四有体育课。",
      "我们周一和周四有体育课。",
      "我们周一和周三有体育课。",
      "我们每天都有体育课。"
    ],
    correct: 1
  }
]
