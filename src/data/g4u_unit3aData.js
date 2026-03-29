// PEP四年级上册 Unit 3 Part A《My friends》题库
// 主题：外貌与性格特征 (strong, friendly, quiet, hair, shoe, glasses) + He is... He has...
// 7种题型，每种5题，共35题

export const quizBankG4U3a = [
  { question: "My friend is tall and ___.", chinese: "我的朋友又高又壮。", options: ["strong", "hair", "glasses", "shoe"], correct: 0, explanation: "tall (高) 常用 strong (壮) 搭配形容体型。", tag: "词汇" },
  { question: "She ___ long hair.", chinese: "她留着长发。", options: ["is", "have", "has", "are"], correct: 2, explanation: "表示某人“有”某个特征(如头发)，第三人称单数用 has。", tag: "语法" },
  { question: "He ___ quiet and friendly.", chinese: "他安静又友善。", options: ["have", "has", "is", "are"], correct: 2, explanation: "形容性格特征用 be 动词。主语 He 配 is。", tag: "语法" },
  { question: "His ___ are blue.", chinese: "他的鞋子是蓝色的。", options: ["shoe", "shoes", "glasses", "hair"], correct: 1, explanation: "鞋子一般是复数 shoes，且 be 动词是 are。", tag: "单复数" },
  { question: "He has blue ___.", chinese: "他戴着蓝色的眼镜。", options: ["glass", "glasses", "shoe", "hair"], correct: 1, explanation: "眼镜是复数形式 glasses。", tag: "单复数" }
]

export const fillblankBankG4U3a = [
  { sentence: "He is tall and ___ (强壮的).", answer: "strong", chinese: "他很高大强壮。", explanation: "strong 强壮的。", tag: "词汇" },
  { sentence: "She is a ___ (安静的) girl.", answer: "quiet", chinese: "她是个安静的女孩。", explanation: "quiet 安静的。", tag: "词汇" },
  { sentence: "My friend is very ___ (友好的).", answer: "friendly", chinese: "我的朋友非常友好。", explanation: "friendly 友好的。", tag: "词汇" },
  { sentence: "She ___ (有) long hair.", answer: "has", chinese: "她留着长头发。", explanation: "第三人称单数 有：has。", tag: "语法" },
  { sentence: "He has black ___ (鞋).", answer: "shoes", chinese: "他穿着黑色的鞋子。", explanation: "鞋子复数 shoes。", tag: "拼写" }
]

export const listenWordBankG4U3a = [
  { word: "strong", options: ["strong", "song", "long", "stone"], correct: 0, zh: "强壮的" },
  { word: "quiet", options: ["queen", "quite", "quiet", "quick"], correct: 2, zh: "安静的" },
  { word: "friendly", options: ["friend", "friendly", "fly", "family"], correct: 1, zh: "友好的" },
  { word: "glasses", options: ["grass", "glass", "classes", "glasses"], correct: 3, zh: "眼镜" },
  { word: "hair", options: ["here", "hair", "air", "hare"], correct: 1, zh: "头发" }
]

export const listenSentenceBankG4U3a = [
  { sentence: "He is tall and strong.", zh: "他既高又强壮。", options: ["He is short and thin.", "He is tall and strong.", "She is tall and strong.", "He is quiet and friendly."], correct: 1 },
  { sentence: "She has long hair.", zh: "她留着长发。", options: ["She has short hair.", "He has long hair.", "She has long hair.", "She is long hair."], correct: 2 },
  { sentence: "His glasses are blue.", zh: "他的眼镜是蓝色的。", options: ["His shoes are blue.", "His glasses are black.", "Her glasses are blue.", "His glasses are blue."], correct: 3 },
  { sentence: "My friend is quiet.", zh: "我的朋友很文静。", options: ["My friend is friendly.", "My friend is tall.", "My friend is quiet.", "Your friend is quiet."], correct: 2 },
  { sentence: "He has a green bag.", zh: "他背着一个绿色的包。", options: ["He has a red bag.", "She has a green bag.", "He has a green bag.", "He has a green book."], correct: 2 }
]

export const listenOrderBankG4U3a = [
  { sentence: "He is tall and strong.", zh: "他既高大又强壮。", words: ["He", "is", "tall", "and", "strong."], answer: ["He", "is", "tall", "and", "strong."] },
  { sentence: "She has long hair.", zh: "她留着长头发。", words: ["She", "has", "long", "hair."], answer: ["She", "has", "long", "hair."] },
  { sentence: "My friend is very friendly.", zh: "我的朋友非常友好。", words: ["My", "friend", "is", "very", "friendly."], answer: ["My", "friend", "is", "very", "friendly."] },
  { sentence: "His shoes are blue.", zh: "他的鞋子是蓝色的。", words: ["His", "shoes", "are", "blue."], answer: ["His", "shoes", "are", "blue."] },
  { sentence: "He has orange glasses.", zh: "他戴着橙色的眼镜。", words: ["He", "has", "orange", "glasses."], answer: ["He", "has", "orange", "glasses."] }
]

export const listenResponseBankG4U3a = [
  { question: "Is he tall and strong?", zh: "他又高又壮吗？", options: ["Yes, he is.", "He has short hair.", "Yes, it is.", "She is friendly."], correct: 0 },
  { question: "I have a new friend.", zh: "我有一个新朋友。", options: ["Is it a boy or a girl?", "He is strong.", "Yes, it is.", "She has long hair."], correct: 0 },
  { question: "Does she have long hair?", zh: "她留着长发吗？", options: ["Yes, he does.", "Yes, she does.", "She is quiet.", "Yes, it is."], correct: 1 },
  { question: "Who is your friend?", zh: "谁是你的朋友？", options: ["He has glasses.", "It's John.", "Yes, he is.", "My shoes are blue."], correct: 1 },
  { question: "What colour are his shoes?", zh: "他的鞋子是什么颜色的？", options: ["They are big.", "They are black.", "He is tall.", "Yes, they are."], correct: 1 }
]

export const listenTranslateBankG4U3a = [
  { sentence: "He is tall and strong.", options: ["他又矮又瘦。", "他非常友好。", "他又高又壮。", "他很安静。"], correct: 2 },
  { sentence: "She has long hair.", options: ["她留着短发。", "她留着长发。", "他的头发很长。", "她是一个长发女孩。"], correct: 1 },
  { sentence: "My friend is friendly.", options: ["我的家人非常友好。", "我的朋友很安静。", "我的朋友很强壮。", "我的朋友非常友好。"], correct: 3 },
  { sentence: "His glasses are blue.", options: ["他的鞋子是蓝色的。", "他的书包是蓝色的。", "他的眼镜是黑色的。", "他的眼镜是蓝色的。"], correct: 3 },
  { sentence: "She is quiet.", options: ["她很活泼。", "她很瘦。", "她很安静。", "他很安静。"], correct: 2 }
]
