// PEP四年级下册 Unit 1 Part B《Let's learn / Let's talk》题库
// 主题：学校功能室 + can/can't 进阶用法
// 7种题型，每种5题，共35题

// 题型1：选择题
export const quizBank1b = [
  {
    question: "Where can we draw and paint? In the ___.",
    chinese: "我们在哪里画画？在___。",
    options: ["music room", "computer room", "art room", "library"],
    correct: 2,
    explanation: "art room 美术室，是画画、手工的地方。",
    tag: "词汇"
  },
  {
    question: "We can read books in the ___.",
    chinese: "我们可以在___读书。",
    options: ["gym", "library", "washroom", "canteen"],
    correct: 1,
    explanation: "library 图书馆/图书室，是借阅和阅读图书的地方。",
    tag: "词汇"
  },
  {
    question: "___ we eat in the library?",
    chinese: "我们可以在图书馆吃东西吗？",
    options: ["Can", "Do", "Are", "Is"],
    correct: 0,
    explanation: "用 Can 提问是否有能力或是否被允许做某事：Can we eat in the library?",
    tag: "句型"
  },
  {
    question: "No, we ___. It's a library.",
    chinese: "不，我们不能。这是图书馆。",
    options: ["can", "can't", "don't", "aren't"],
    correct: 1,
    explanation: "can't = cannot，表示不被允许或不能做某事。",
    tag: "情态动词"
  },
  {
    question: "Which word has the same 'or' sound as 'floor'?",
    chinese: "哪个词和 floor 中 or 的发音相同？",
    options: ["for", "form", "floor", "fore"],
    correct: 1,
    explanation: "floor、form、for 中的 or/oor 都发 /ɔː/ 音。",
    tag: "拼读"
  }
]

// 题型2：填空题
export const fillblankBank1b = [
  {
    sentence: "We can play basketball in the ___.",
    answer: "gym",
    chinese: "我们可以在体育馆打篮球。",
    explanation: "gym 体育馆/运动房，是做运动的地方。",
    tag: "词汇"
  },
  {
    sentence: "Can I use the ___ in the computer room?",
    answer: "computer",
    chinese: "我可以在电脑室用电脑吗？",
    explanation: "computer room 电脑室，里面有 computer（电脑）。",
    tag: "词汇"
  },
  {
    sentence: "___ we sing here? Yes, we can!",
    answer: "Can",
    chinese: "我们可以在这里唱歌吗？是的，我们可以！",
    explanation: "Can we...? 是询问许可的常见句型，肯定回答：Yes, we can.",
    tag: "句型"
  },
  {
    sentence: "The music room is on the ___ floor.",
    answer: "second",
    chinese: "音乐教室在二楼。",
    explanation: "second（第二），楼层用序数词：first/second/third...",
    tag: "词汇"
  },
  {
    sentence: "You can ___ books from the library.",
    answer: "borrow",
    chinese: "你可以从图书馆借书。",
    explanation: "borrow（借入）与 lend（借出）意思相反，borrow books from 从某处借书。",
    tag: "词汇"
  }
]

// 题型3：听单词，选出听到的单词
export const listenWordBank1b = [
  {
    word: "library",
    options: ["laundry", "library", "lottery", "lightning"],
    correct: 1,
    zh: "图书馆"
  },
  {
    word: "computer",
    options: ["computer", "commuter", "compete", "complete"],
    correct: 0,
    zh: "电脑"
  },
  {
    word: "gym",
    options: ["gem", "jam", "gym", "gum"],
    correct: 2,
    zh: "体育馆"
  },
  {
    word: "borrow",
    options: ["borrow", "burrow", "below", "barrel"],
    correct: 0,
    zh: "借"
  },
  {
    word: "second",
    options: ["secret", "second", "sector", "secure"],
    correct: 1,
    zh: "第二"
  }
]

// 题型4：听句子，选出听到的句子
export const listenSentenceBank1b = [
  {
    sentence: "Can we draw in the art room?",
    zh: "我们可以在美术室画画吗？",
    options: [
      "Can we draw in the art room?",
      "Can we sing in the art room?",
      "Can we draw in the music room?",
      "Can I draw in the art room?"
    ],
    correct: 0
  },
  {
    sentence: "No, we can't eat in the library.",
    zh: "不，我们不能在图书馆吃东西。",
    options: [
      "No, we can eat in the library.",
      "No, we can't read in the library.",
      "No, we can't eat in the library.",
      "Yes, we can eat in the library."
    ],
    correct: 2
  },
  {
    sentence: "We can play football in the gym.",
    zh: "我们可以在体育馆踢足球。",
    options: [
      "We can play basketball in the gym.",
      "We can play football in the gym.",
      "We can play football in the park.",
      "We can play football after school."
    ],
    correct: 1
  },
  {
    sentence: "The art room is on the third floor.",
    zh: "美术室在三楼。",
    options: [
      "The art room is on the first floor.",
      "The music room is on the third floor.",
      "The art room is on the second floor.",
      "The art room is on the third floor."
    ],
    correct: 3
  },
  {
    sentence: "We can use computers here.",
    zh: "我们可以在这里用电脑。",
    options: [
      "We can use computers here.",
      "We can't use computers here.",
      "We can use phones here.",
      "We can use computers there."
    ],
    correct: 0
  }
]

// 题型5：连词成句
export const listenOrderBank1b = [
  {
    sentence: "Can we sing in the music room?",
    zh: "我们可以在音乐室唱歌吗？",
    words: ["Can", "we", "sing", "in", "the", "music", "room?"],
    answer: ["Can", "we", "sing", "in", "the", "music", "room?"]
  },
  {
    sentence: "Yes, we can.",
    zh: "是的，我们可以。",
    words: ["Yes,", "we", "can."],
    answer: ["Yes,", "we", "can."]
  },
  {
    sentence: "I can borrow books here.",
    zh: "我可以在这里借书。",
    words: ["I", "can", "borrow", "books", "here."],
    answer: ["I", "can", "borrow", "books", "here."]
  },
  {
    sentence: "We can't run in the library.",
    zh: "我们不能在图书馆里跑。",
    words: ["We", "can't", "run", "in", "the", "library."],
    answer: ["We", "can't", "run", "in", "the", "library."]
  },
  {
    sentence: "The gym is on the first floor.",
    zh: "体育馆在一楼。",
    words: ["The", "gym", "is", "on", "the", "first", "floor."],
    answer: ["The", "gym", "is", "on", "the", "first", "floor."]
  }
]

// 题型6：听问句，选出正确回答
export const listenResponseBank1b = [
  {
    question: "Can we play games in the library?",
    zh: "我们可以在图书馆玩游戏吗？",
    options: [
      "No, we can't. We must be quiet.",
      "Yes, we can play any game.",
      "The library is very big.",
      "I love the library."
    ],
    correct: 0
  },
  {
    question: "Where can we use computers?",
    zh: "我们在哪里可以用电脑？",
    options: [
      "We can use computers in the gym.",
      "We can use computers in the art room.",
      "We can use computers in the computer room.",
      "We can use computers in the library."
    ],
    correct: 2
  },
  {
    question: "What can you do in the music room?",
    zh: "你在音乐室可以做什么？",
    options: [
      "I can read books.",
      "I can sing and play music.",
      "I can draw pictures.",
      "I can play basketball."
    ],
    correct: 1
  },
  {
    question: "Is the art room on the second floor?",
    zh: "美术室在二楼吗？",
    options: [
      "Yes, it's on the second floor.",
      "No, it's on the third floor.",
      "The art room is big.",
      "I don't know."
    ],
    correct: 1
  },
  {
    question: "Can I borrow this book?",
    zh: "我可以借这本书吗？",
    options: [
      "No, this is my book.",
      "Yes, you can. Return it next week.",
      "Books are on the shelf.",
      "I don't like books."
    ],
    correct: 1
  }
]

// 题型7：听英语，选出正确中文翻译
export const listenTranslateBank1b = [
  {
    sentence: "Can we draw pictures in the art room?",
    options: [
      "我们可以在音乐室画画吗？",
      "我们可以在美术室画画吗？",
      "我们不能在美术室画画。",
      "我们可以在美术室唱歌吗？"
    ],
    correct: 1
  },
  {
    sentence: "No, we can't eat in the library.",
    options: [
      "是的，我们可以在图书馆吃东西。",
      "不，我们不能在图书馆读书。",
      "不，我们不能在图书馆吃东西。",
      "是的，我们可以在教室里吃东西。"
    ],
    correct: 2
  },
  {
    sentence: "The computer room is on the second floor.",
    options: [
      "电脑室在三楼。",
      "音乐室在二楼。",
      "电脑室在一楼。",
      "电脑室在二楼。"
    ],
    correct: 3
  },
  {
    sentence: "We can play basketball in the gym.",
    options: [
      "我们可以在体育馆踢足球。",
      "我们可以在体育馆打篮球。",
      "我们不能在体育馆运动。",
      "我们可以在操场打篮球。"
    ],
    correct: 1
  },
  {
    sentence: "You can borrow two books from the library.",
    options: [
      "你可以从图书馆借三本书。",
      "你不能从图书馆借书。",
      "你可以从图书馆借两本书。",
      "你可以在图书馆买两本书。"
    ],
    correct: 2
  }
]
