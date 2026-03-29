// PEP四年级下册 Unit 1 Part C《Story time / Let's check》题库
// 主题：值日生对话 + 班规综合复习
// 7种题型，每种5题，共35题

// 题型1：选择题
export const quizBank1c = [
  {
    question: "Who's on duty ___?",
    chinese: "今天谁值日？",
    options: ["yesterday", "today", "tomorrow", "every day"],
    correct: 1,
    explanation: "Who's on duty today? 今天谁值日？today 表示今天，是课文核心问句。",
    tag: "词汇"
  },
  {
    question: "Let me ___ the floor.",
    chinese: "让我来扫地。",
    options: ["sweep", "sleep", "swim", "spray"],
    correct: 0,
    explanation: "sweep the floor 扫地，是值日工作。Let me + 动词原形，表示'让我来做'。",
    tag: "词汇"
  },
  {
    question: "I'll ___ the windows.",
    chinese: "我来擦窗户。",
    options: ["clean\u2028", "close", "colour", "count"],
    correct: 0,
    explanation: "clean the windows 擦窗户，clean 做动词表示打扫/擦拭。",
    tag: "词汇"
  },
  {
    question: "Great! Our classroom looks ___ and tidy.",
    chinese: "太棒了！我们的教室看起来干净整洁。",
    options: ["dirty", "noisy", "clean", "small"],
    correct: 2,
    explanation: "clean and tidy 干净整洁，是描述教室状态的固定搭配。",
    tag: "词汇"
  },
  {
    question: "Which word has the same 'ee' sound as 'sweep'?",
    chinese: "哪个词和 sweep 中 ee 的发音相同？",
    options: ["bread", "break", "sleep", "steak"],
    correct: 2,
    explanation: "sweep（/iː/）和 sleep（/iː/）中的 ee/ee 发相同长音。bread/steak 均不发 /iː/。",
    tag: "拼读"
  }
]

// 题型2：填空题
export const fillblankBank1c = [
  {
    sentence: "We ___ on duty today.",
    answer: "are",
    chinese: "我们今天值日。",
    explanation: "be on duty 表示值日，主语 We 配合动词 are。",
    tag: "语法"
  },
  {
    sentence: "Let me ___ the chairs.",
    answer: "put back",
    chinese: "让我来把椅子放回去。",
    explanation: "put back 放回原处，是值日整理教室的常见动作。",
    tag: "短语"
  },
  {
    sentence: "___ the lights, please. We're leaving.",
    answer: "Turn off",
    chinese: "请关灯，我们要走了。",
    explanation: "Turn off 关掉（电器），班规之一：离开后关灯。",
    tag: "短语"
  },
  {
    sentence: "Miss White, the classroom is ___ and tidy now.",
    answer: "clean",
    chinese: "怀特老师，教室现在干净整洁了。",
    explanation: "值日结束时向老师报告：The classroom is clean and tidy now.",
    tag: "词汇"
  },
  {
    sentence: "Good ___! You are great helpers.",
    answer: "job",
    chinese: "干得好！你们是很棒的小帮手。",
    explanation: "Good job! 干得好！是老师表扬学生的常用表达。",
    tag: "词汇"
  }
]

// 题型3：听单词，选出听到的单词
export const listenWordBank1c = [
  {
    word: "sweep",
    options: ["sleep", "sweep", "speak", "speed"],
    correct: 1,
    zh: "扫（地）"
  },
  {
    word: "tidy",
    options: ["tiny", "tidy", "tiger", "tired"],
    correct: 1,
    zh: "整洁的"
  },
  {
    word: "window",
    options: ["widow", "window", "willow", "winner"],
    correct: 1,
    zh: "窗户"
  },
  {
    word: "helper",
    options: ["helper", "hamper", "hopper", "halter"],
    correct: 0,
    zh: "小帮手"
  },
  {
    word: "together",
    options: ["together", "father", "brother", "another"],
    correct: 0,
    zh: "一起"
  }
]

// 题型4：听句子，选出听到的句子
export const listenSentenceBank1c = [
  {
    sentence: "We are on duty today.",
    zh: "我们今天值日。",
    options: [
      "We are on duty today.",
      "We are on duty tomorrow.",
      "They are on duty today.",
      "We were on duty today."
    ],
    correct: 0
  },
  {
    sentence: "Let me sweep the floor.",
    zh: "让我来扫地。",
    options: [
      "Let me clean the floor.",
      "Let me sweep the floor.",
      "Let me mop the floor.",
      "Help me sweep the floor."
    ],
    correct: 1
  },
  {
    sentence: "Good job! The classroom is clean now.",
    zh: "干得好！教室现在干净了。",
    options: [
      "Good job! The classroom is tidy now.",
      "Well done! The classroom is clean now.",
      "Good job! The classroom is clean now.",
      "Good work! The classroom is clean now."
    ],
    correct: 2
  },
  {
    sentence: "Don't forget to turn off the lights.",
    zh: "别忘了关灯。",
    options: [
      "Don't forget to turn on the lights.",
      "Don't forget to turn off the fan.",
      "Don't forget to turn off the lights.",
      "Remember to turn off the lights."
    ],
    correct: 2
  },
  {
    sentence: "Together we make the classroom clean.",
    zh: "我们一起让教室变得干净。",
    options: [
      "Together we make the classroom clean.",
      "Together we keep the classroom clean.",
      "Together we made the classroom clean.",
      "Together you make the classroom clean."
    ],
    correct: 0
  }
]

// 题型5：连词成句
export const listenOrderBank1c = [
  {
    sentence: "Who's on duty today?",
    zh: "今天谁值日？",
    words: ["Who's", "on", "duty", "today?"],
    answer: ["Who's", "on", "duty", "today?"]
  },
  {
    sentence: "Let me sweep the floor.",
    zh: "让我来扫地。",
    words: ["Let", "me", "sweep", "the", "floor."],
    answer: ["Let", "me", "sweep", "the", "floor."]
  },
  {
    sentence: "Our classroom is clean and tidy.",
    zh: "我们的教室干净整洁。",
    words: ["Our", "classroom", "is", "clean", "and", "tidy."],
    answer: ["Our", "classroom", "is", "clean", "and", "tidy."]
  },
  {
    sentence: "Turn off the lights after school.",
    zh: "放学后关灯。",
    words: ["Turn", "off", "the", "lights", "after", "school."],
    answer: ["Turn", "off", "the", "lights", "after", "school."]
  },
  {
    sentence: "We work together as a team.",
    zh: "我们作为团队一起合作。",
    words: ["We", "work", "together", "as", "a", "team."],
    answer: ["We", "work", "together", "as", "a", "team."]
  }
]

// 题型6：听问句，选出正确回答
export const listenResponseBank1c = [
  {
    question: "Who's on duty today?",
    zh: "今天谁值日？",
    options: [
      "I'm on duty yesterday.",
      "It's Tom's turn.",
      "Mike and I are on duty.",
      "The teacher is on duty."
    ],
    correct: 2
  },
  {
    question: "What's your job today?",
    zh: "你今天的任务是什么？",
    options: [
      "My job is to be a doctor.",
      "I sweep the floor and clean the blackboard.",
      "I like my job.",
      "The floor is very dirty."
    ],
    correct: 1
  },
  {
    question: "Is the classroom clean now?",
    zh: "教室现在干净了吗？",
    options: [
      "No, I don't like cleaning.",
      "The classroom is very big.",
      "Yes, it's clean and tidy now.",
      "We cleaned it yesterday."
    ],
    correct: 2
  },
  {
    question: "Did you turn off the lights?",
    zh: "你关灯了吗？",
    options: [
      "Yes, I turn off the lights.",
      "No, the lights is off.",
      "Yes, I turned off the lights.",
      "Lights are very bright."
    ],
    correct: 2
  },
  {
    question: "How do you keep the classroom clean?",
    zh: "你怎么保持教室整洁？",
    options: [
      "The classroom is always clean.",
      "We sweep, clean, and put things back every day.",
      "I don't know how.",
      "The teacher does it."
    ],
    correct: 1
  }
]

// 题型7：听英语，选出正确中文翻译
export const listenTranslateBank1c = [
  {
    sentence: "We are on duty today. Let's get to work!",
    options: [
      "我们今天值日，开始工作吧！",
      "他们今天值日，开始工作吧！",
      "我们明天值日，开始工作吧！",
      "我们今天值日，好好学习吧！"
    ],
    correct: 0
  },
  {
    sentence: "Let me sweep the floor. You clean the windows.",
    options: [
      "让我扫地，你来擦窗户。",
      "让我扫地，你来擦黑板。",
      "你来扫地，让我擦窗户。",
      "让我们一起扫地。"
    ],
    correct: 0
  },
  {
    sentence: "Good job! The classroom looks clean and tidy.",
    options: [
      "做得不好！教室还是很脏。",
      "干得好！教室看起来干净整洁。",
      "干得好！教室看起来很大。",
      "很好！让我们一起打扫教室。"
    ],
    correct: 1
  },
  {
    sentence: "Don't forget to turn off the lights before you leave.",
    options: [
      "离开前别忘了关灯。",
      "离开前别忘了开灯。",
      "进来时别忘了关灯。",
      "离开前别忘了关窗。"
    ],
    correct: 0
  },
  {
    sentence: "Together, we make our classroom a better place.",
    options: [
      "一起，我们让教室变得更大。",
      "一起，我们让教室变得更好。",
      "一起，我们让学校变得更好。",
      "单独地，我们能让教室变好。"
    ],
    correct: 1
  }
]
