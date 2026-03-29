// PEP四年级下册Unit1 听力题库
// 6种题型，每种5题

// 题型1：听单词，选出听到的单词
export const listenWordBank = [
  {
    word: "blackboard",
    options: ["blackboard", "playground", "keyboard", "cupboard"],
    correct: 0,
    zh: "黑板"
  },
  {
    word: "classroom",
    options: ["bedroom", "classroom", "bathroom", "storeroom"],
    correct: 1,
    zh: "教室"
  },
  {
    word: "clean",
    options: ["keen", "mean", "clean", "lean"],
    correct: 2,
    zh: "打扫/干净"
  },
  {
    word: "duty",
    options: ["beauty", "fruity", "duty", "booty"],
    correct: 2,
    zh: "值日"
  },
  {
    word: "tidy",
    options: ["tidy", "tiny", "tiger", "title"],
    correct: 0,
    zh: "整洁"
  }
]

// 题型2：听句子，选出听到的句子
export const listenSentenceBank = [
  {
    sentence: "Keep the classroom clean.",
    zh: "保持教室整洁。",
    options: [
      "Keep the classroom clean.",
      "Keep the classroom tidy.",
      "Clean the classroom now.",
      "The classroom is clean."
    ],
    correct: 0
  },
  {
    sentence: "Don't be late for class!",
    zh: "上课别迟到！",
    options: [
      "Don't be afraid of class!",
      "Don't be late for school!",
      "Don't be late for class!",
      "Hurry up for class!"
    ],
    correct: 2
  },
  {
    sentence: "Who's on duty today?",
    zh: "今天谁值日？",
    options: [
      "Who's on duty today?",
      "What's on duty today?",
      "Who's on duty yesterday?",
      "When's on duty today?"
    ],
    correct: 0
  },
  {
    sentence: "Turn off the lights after school.",
    zh: "放学后关灯。",
    options: [
      "Turn on the lights after school.",
      "Turn off the lights after class.",
      "Turn off the fans after school.",
      "Turn off the lights after school."
    ],
    correct: 3
  },
  {
    sentence: "Put your hand up to speak.",
    zh: "举手发言。",
    options: [
      "Put your hand up to speak.",
      "Put your hands up to clap.",
      "Raise your hand up to speak.",
      "Put your hand down to speak."
    ],
    correct: 0
  }
]

// 题型3：排序（听句子，将单词排成正确顺序）
export const listenOrderBank = [
  {
    sentence: "Don't eat in class.",
    zh: "不要在课堂上吃东西。",
    words: ["Don't", "eat", "in", "class"],
    answer: ["Don't", "eat", "in", "class"]
  },
  {
    sentence: "I can clean the blackboard.",
    zh: "我可以擦黑板。",
    words: ["I", "can", "clean", "the", "blackboard"],
    answer: ["I", "can", "clean", "the", "blackboard"]
  },
  {
    sentence: "We are on duty today.",
    zh: "我们今天值日。",
    words: ["We", "are", "on", "duty", "today"],
    answer: ["We", "are", "on", "duty", "today"]
  },
  {
    sentence: "Our classroom is clean and tidy.",
    zh: "我们的教室干净整洁。",
    words: ["Our", "classroom", "is", "clean", "and", "tidy"],
    answer: ["Our", "classroom", "is", "clean", "and", "tidy"]
  },
  {
    sentence: "Don't talk in class.",
    zh: "不要在课堂上说话。",
    words: ["Don't", "talk", "in", "class"],
    answer: ["Don't", "talk", "in", "class"]
  }
]

// 题型4：听问句，选出正确回答
export const listenResponseBank = [
  {
    question: "Can I take this apple?",
    zh: "我可以拿这个苹果吗？",
    options: [
      "Yes, but don't eat it in class.",
      "No, you can take it.",
      "Yes, please eat in class.",
      "Sorry, I don't know."
    ],
    correct: 0
  },
  {
    question: "Who's on duty today?",
    zh: "今天谁值日？",
    options: [
      "I'm on duty yesterday.",
      "We are, Miss White.",
      "Nobody is on duty.",
      "The teacher is on duty."
    ],
    correct: 1
  },
  {
    question: "Is the classroom clean and tidy?",
    zh: "教室干净整洁吗？",
    options: [
      "No, it's very dirty.",
      "Yes, it's nice and clean.",
      "The classroom is big.",
      "I don't like the classroom."
    ],
    correct: 1
  },
  {
    question: "What are the class rules?",
    zh: "班级规则是什么？",
    options: [
      "We play games in class.",
      "We sleep in class.",
      "Don't be late. Keep the classroom clean.",
      "We eat in class every day."
    ],
    correct: 2
  },
  {
    question: "What can you do for the classroom?",
    zh: "你能为教室做什么？",
    options: [
      "I can make noise.",
      "I can clean the blackboard and sweep the floor.",
      "I can eat in class.",
      "I can be late for class."
    ],
    correct: 1
  }
]

// 题型5：听英语，选出正确中文翻译
export const listenTranslateBank = [
  {
    sentence: "Jack, you can't take toys to school.",
    options: [
      "杰克，你不能带玩具到学校。",
      "杰克，你可以带玩具到学校。",
      "杰克，你不能带书到学校。",
      "杰克，你必须带玩具到学校。"
    ],
    correct: 0
  },
  {
    sentence: "Keep the classroom clean.",
    options: [
      "打扫教室。",
      "保持教室整洁。",
      "教室很干净。",
      "让教室变大。"
    ],
    correct: 1
  },
  {
    sentence: "Put your hand up to speak.",
    options: [
      "把手放下再说话。",
      "举手发言。",
      "说话时站起来。",
      "安静不要说话。"
    ],
    correct: 1
  },
  {
    sentence: "Some of us make wall newspapers.",
    options: [
      "我们都读报纸。",
      "我们中的一些人制作墙报。",
      "有些人买报纸。",
      "我们贴报纸在墙上。"
    ],
    correct: 1
  },
  {
    sentence: "Together, we make our classroom a good place for everyone.",
    options: [
      "我们一起打扫教室。",
      "教室是大家的好地方。",
      "我们一起让教室成为每个人的好地方。",
      "大家一起在教室里学习。"
    ],
    correct: 2
  }
]
