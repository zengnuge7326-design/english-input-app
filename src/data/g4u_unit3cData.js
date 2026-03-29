// PEP四年级上册 Unit 3 Part C《Story time / Let's check》题库
// 主题：Unit 3 综合复习 (外貌特征 + 名字 + 朋友)
// 7种题型，每种5题，共35题

export const quizBankG4U3c = [
  { question: "A boy ___ a girl?", chinese: "男孩还是女孩？", options: ["or", "and", "but", "with"], correct: 0, explanation: "选择疑问句：男孩还是女孩？用 or。", tag: "连词" },
  { question: "He is tall ___ strong.", chinese: "他既高又壮。", options: ["or", "and", "under", "in"], correct: 1, explanation: "表示并列的两个评价可以用 and 相连。", tag: "连词" },
  { question: "___ name is Sarah.", chinese: "她的名字是萨拉。", options: ["His", "She", "Her", "He"], correct: 2, explanation: "Sarah是女孩的名字，应该用 Her。", tag: "代词" },
  { question: "Does she have glasses? Yes, she ___.", chinese: "她戴眼镜吗？是的，她戴。", options: ["do", "does", "is", "has"], correct: 1, explanation: "问句是由 Does 引导的，简略回答也用 does。", tag: "语法" },
  { question: "She ___ quiet. She ___ long hair.", chinese: "她很安静。她留着长发。", options: ["is, is", "has, has", "is, has", "has, is"], correct: 2, explanation: "修饰性格特征用 is (She is quiet)；说明有某物(头发)用 has (She has...)。", tag: "语法" }
]

export const fillblankBankG4U3c = [
  { sentence: "He is a ___ (男孩).", answer: "boy", chinese: "他是个男孩。", explanation: "boy 男孩。", tag: "词汇" },
  { sentence: "What's ___ (她的) name?", answer: "her", chinese: "她叫什么名字？", explanation: "her 她的。", tag: "代词" },
  { sentence: "He ___ (有) glasses.", answer: "has", chinese: "他戴着眼镜。", explanation: "第三人称单数“有”：has。", tag: "语法" },
  { sentence: "My friend is ___ (友好的).", answer: "friendly", chinese: "我的朋友很友好。", explanation: "friendly 友好的。", tag: "词汇" },
  { sentence: "His ___ (鞋子) are white.", answer: "shoes", chinese: "他的鞋子是白色的。", explanation: "鞋子的复数 shoes。", tag: "拼写" }
]

export const listenWordBankG4U3c = [
  { word: "glasses", options: ["classes", "glass", "glasses", "grass"], correct: 2, zh: "眼镜" },
  { word: "shoes", options: ["socks", "shoes", "shorts", "ships"], correct: 1, zh: "鞋子" },
  { word: "strong", options: ["strong", "song", "long", "stop"], correct: 0, zh: "强壮的" },
  { word: "quiet", options: ["quite", "quiet", "quick", "queen"], correct: 1, zh: "安静的" },
  { word: "hair", options: ["hare", "hair", "air", "here"], correct: 1, zh: "头发" }
]

export const listenSentenceBankG4U3c = [
  { sentence: "A boy or a girl?", zh: "一个男孩还是一个女孩？", options: ["A man or a woman?", "A boy and a girl.", "A boy or a girl?", "A tall boy or a thin boy?"], correct: 2 },
  { sentence: "He has short hair.", zh: "他留着短头发。", options: ["She has short hair.", "He has long hair.", "He has short hair.", "He is short."], correct: 2 },
  { sentence: "Her name is Chen Jie.", zh: "她叫陈洁。", options: ["His name is Wu Binbin.", "Her name is Chen Jie.", "Her name is Amy.", "She is Chen Jie."], correct: 1 },
  { sentence: "Who is he?", zh: "他是谁？", options: ["Who is she?", "Where is he?", "Who is he?", "What is he?"], correct: 2 },
  { sentence: "My friend is very friendly.", zh: "我的朋友非常友好。", options: ["My friend is very quiet.", "Your friend is very friendly.", "My friend is very friendly.", "She is very friendly."], correct: 2 }
]

export const listenOrderBankG4U3c = [
  { sentence: "A boy or a girl?", zh: "一个男孩还是一个女孩？", words: ["A", "boy", "or", "a", "girl?"], answer: ["A", "boy", "or", "a", "girl?"] },
  { sentence: "He has short hair.", zh: "他留着短发。", words: ["He", "has", "short", "hair."], answer: ["He", "has", "short", "hair."] },
  { sentence: "Her name is Chen Jie.", zh: "她的名字叫陈洁。", words: ["Her", "name", "is", "Chen", "Jie."], answer: ["Her", "name", "is", "Chen", "Jie."] },
  { sentence: "Who is your friend?", zh: "谁是你的朋友？", words: ["Who", "is", "your", "friend?"], answer: ["Who", "is", "your", "friend?"] },
  { sentence: "He is tall and strong.", zh: "他既高大又强壮。", words: ["He", "is", "tall", "and", "strong."], answer: ["He", "is", "tall", "and", "strong."] }
]

export const listenResponseBankG4U3c = [
  { question: "I have a new friend.", zh: "我有一个新朋友。", options: ["Yes, I do.", "A boy or a girl?", "Where is it?", "Thank you."], correct: 1 },
  { question: "What's his name?", zh: "他叫什么名字？", options: ["He is strong.", "Her name is Amy.", "His name is John.", "Yes, he is."], correct: 2 },
  { question: "Is she quiet?", zh: "她很文静吗？", options: ["Yes, she has long hair.", "Yes, she is.", "No, he isn't.", "She is tall."], correct: 1 },
  { question: "Does he have glasses?", zh: "他戴眼镜吗？", options: ["Yes, he does.", "Yes, he is.", "His glasses are blue.", "No, she doesn't."], correct: 0 },
  { question: "Who is she?", zh: "她是谁？", options: ["He is my friend.", "Her name is Jane.", "She is my friend, Lily.", "She has short hair."], correct: 2 }
]

export const listenTranslateBankG4U3c = [
  { sentence: "A boy or a girl?", options: ["一个男孩还是一个女孩？", "这是男孩还是女孩？", "男孩和女孩？", "你是男孩还是女孩？"], correct: 0 },
  { sentence: "What's her name?", options: ["他叫什么名字？", "她叫什么名字？", "她是谁？", "你的名字是什么？"], correct: 1 },
  { sentence: "He has short hair.", options: ["他留着长头发。", "她留着短头发。", "他留着短头发。", "他又高又壮。"], correct: 2 },
  { sentence: "Who is your friend?", options: ["谁是你的朋友？", "他是你朋友吗？", "你有朋友吗？", "她的朋友是谁？"], correct: 0 },
  { sentence: "His shoes are blue.", options: ["他的眼镜是蓝色的。", "他的鞋子是黑色的。", "我的鞋子是蓝色的。", "他的鞋子是蓝色的。"], correct: 3 }
]
