// PEP五年级上册 Unit 4 Part A《What can you do?》题库
// 主题：能力与活动1 (dance, sing English songs, do kung fu, draw pictures, play the pipa) + What can you do for the party?
// 7种题型，每种5题，共35题

export const quizBankG5U4a = [
  { question: "What ___ you do for the party?", chinese: "你能为聚会做什么？", options: ["can", "do", "are", "is"], correct: 0, explanation: "can 表示能、会。询问能力用 What can you do?", tag: "情态动词" },
  { question: "I can ___ English songs.", chinese: "我会唱英文歌。", options: ["sing", "sings", "singing", "sang"], correct: 0, explanation: "can 后面接动词原形。", tag: "动词形式" },
  { question: "Can you do any ___?", chinese: "你会些武术吗？", options: ["kung fu", "kung", "fu", "kong fu"], correct: 0, explanation: "do kung fu 打功夫(武术)。", tag: "固定搭配" },
  { question: "I can play ___ pipa.", chinese: "我会弹琵琶。", options: ["the", "a", "an", "的(不填)"], correct: 0, explanation: "西洋和民族传统乐器前面通常加定冠词 the，如 play the pipa。", tag: "冠词" },
  { question: "___ about you?", chinese: "你呢？", options: ["What", "Who", "Where", "When"], correct: 0, explanation: "What about you? / How about you? = 你呢？", tag: "交际用语" }
]

export const fillblankBankG5U4a = [
  { sentence: "What ___ (能) you do?", answer: "can", chinese: "你能做什么？", explanation: "can", tag: "助动词" },
  { sentence: "I can ___ (跳舞).", answer: "dance", chinese: "我会跳舞。", explanation: "dance", tag: "动词" },
  { sentence: "I can ___ (唱) English songs.", answer: "sing", chinese: "我会唱英文歌。", explanation: "sing", tag: "动词" },
  { sentence: "I can play the ___ (琵琶).", answer: "pipa", chinese: "我会弹琵琶。", explanation: "pipa", tag: "名词" },
  { sentence: "We can ___ (画) pictures.", answer: "draw", chinese: "我们会画画。", explanation: "draw pictures 画画", tag: "动词" }
]

export const listenWordBankG5U4a = [
  { word: "dance", options: ["dance", "dark", "date", "desk"], correct: 0, zh: "跳舞" },
  { word: "sing", options: ["song", "sing", "sink", "swim"], correct: 1, zh: "唱" },
  { word: "kung fu", options: ["kung fu", "kong", "king fu", "kufu"], correct: 0, zh: "功夫（武术）" },
  { word: "pipa", options: ["pizza", "pipa", "papa", "panda"], correct: 1, zh: "琵琶" },
  { word: "draw", options: ["draw", "door", "down", "drink"], correct: 0, zh: "画画" }
]

export const listenSentenceBankG5U4a = [
  { sentence: "What can you do for the party?", zh: "你能为聚会做点什么？", options: ["What do you do for the party?", "What can you do for the party?", "What can he do for the party?", "What can you do for the school?"], correct: 1 },
  { sentence: "I can sing English songs.", zh: "我会唱英文歌。", options: ["I can sing English songs.", "I can dance.", "I can do kung fu.", "I can draw pictures."], correct: 0 },
  { sentence: "I can play the pipa.", zh: "我会弹琵琶。", options: ["I can play the piano.", "I can play the pipa.", "I can play football.", "I can play ping-pong."], correct: 1 },
  { sentence: "Can you do any kung fu?", zh: "你会打武术吗？", options: ["Can you do any kung fu?", "Can you dance?", "Can you draw pictures?", "Can you sing?"], correct: 0 },
  { sentence: "What about you?", zh: "你呢？", options: ["How are you?", "What about him?", "What about you?", "Who are you?"], correct: 2 }
]

export const listenOrderBankG5U4a = [
  { sentence: "What can you do?", zh: "你能做什么？", words: ["What", "can", "you", "do?"], answer: ["What", "can", "you", "do?"] },
  { sentence: "I can sing English songs.", zh: "我会唱英文歌。", words: ["I", "can", "sing", "English", "songs."], answer: ["I", "can", "sing", "English", "songs."] },
  { sentence: "I can do kung fu.", zh: "我会练武术。", words: ["I", "can", "do", "kung", "fu."], answer: ["I", "can", "do", "kung", "fu."] },
  { sentence: "I can play the pipa.", zh: "我会弹琵琶。", words: ["I", "can", "play", "the", "pipa."], answer: ["I", "can", "play", "the", "pipa."] },
  { sentence: "What about you?", zh: "你呢？", words: ["What", "about", "you?"], answer: ["What", "about", "you?"] }
]

export const listenResponseBankG5U4a = [
  { question: "What can you do?", zh: "你能做什么？", options: ["I can dance.", "I am singing.", "Yes, I can.", "Ten."], correct: 0 },
  { question: "What can you do for the party?", zh: "你能为晚会做什么？", options: ["I can play the pipa.", "He can dance.", "She is young.", "Yes, I can."], correct: 0 },
  { question: "I can sing English songs. What about you?", zh: "我会唱英文歌。你呢？", options: ["I can do kung fu.", "I am twelve.", "Thank you.", "It's a cat."], correct: 0 },
  { question: "Who can play the pipa?", zh: "谁会弹琵琶？", options: ["I can.", "Yes, he can.", "She is tall.", "We are friends."], correct: 0 },
  { question: "Can you do kung fu?", zh: "你会武术吗？", options: ["No, I can't.", "I do kung fu.", "I wash clothes.", "See you."], correct: 0 }
]

export const listenTranslateBankG5U4a = [
  { sentence: "What can you do for the party?", options: ["你想为聚会做什么？", "你能为聚会做什么？", "我们在派对上做什么？", "聚会在哪里？"], correct: 1 },
  { sentence: "I can sing English songs.", options: ["我喜欢英文歌。", "我会教英文。", "我会唱英文歌。", "她会唱英文歌。"], correct: 2 },
  { sentence: "I can do kung fu.", options: ["我会空手道。", "太神奇了。", "我会练武术。", "他在练武术。"], correct: 2 },
  { sentence: "I can play the pipa.", options: ["我会弹钢琴。", "我会弹吉他。", "我会弹琵琶。", "我会玩游戏。"], correct: 2 },
  { sentence: "What about you?", options: ["你好吗？", "关于你什么？", "你呢？", "你叫什么名字？"], correct: 2 }
]
