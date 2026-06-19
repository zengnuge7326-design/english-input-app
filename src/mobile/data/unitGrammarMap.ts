/**
 * 单元 → 语法专题映射表
 * unitId 对应 MapPage 里的 unit.id（如 g31-u1、g32-u2 等）
 * topicId 对应 Grammar.jsx 里 STAGES 中各 tense 的 id
 */

export type GrammarTopicRef = {
  topicId: string
  stage: 'elementary' | 'junior' | 'senior'
  name: string
  icon: string
  /** 要展示的 lesson 索引（0-based），不填 = 显示全部 */
  lessonIdx?: number[]
}

// ─── 小学阶段 ──────────────────────────────────────────────────────────────

const G_PRO   = (li?: number[]): GrammarTopicRef => ({ topicId: 'pronouns',          stage: 'elementary', name: '代词',           icon: '🙋', lessonIdx: li })
const G_PS    = (li?: number[]): GrammarTopicRef => ({ topicId: 'present_simple',    stage: 'elementary', name: '一般现在时',     icon: '⏰', lessonIdx: li })
const G_PC    = (li?: number[]): GrammarTopicRef => ({ topicId: 'present_continuous',stage: 'elementary', name: '现在进行时',     icon: '🏃', lessonIdx: li })
const G_PAST  = (li?: number[]): GrammarTopicRef => ({ topicId: 'past_simple',       stage: 'elementary', name: '一般过去时',     icon: '📅', lessonIdx: li })
const G_ART   = (li?: number[]): GrammarTopicRef => ({ topicId: 'articles',          stage: 'elementary', name: '冠词',           icon: '📌', lessonIdx: li })
const G_PLU   = (li?: number[]): GrammarTopicRef => ({ topicId: 'plural_nouns',      stage: 'elementary', name: '名词复数',       icon: '📦', lessonIdx: li })
const G_PREP  = (li?: number[]): GrammarTopicRef => ({ topicId: 'basic_prepositions',stage: 'elementary', name: '基础介词',       icon: '📍', lessonIdx: li })
const G_THERE = (li?: number[]): GrammarTopicRef => ({ topicId: 'there_is_there_are',stage: 'elementary', name: 'There is/are',  icon: '🏠', lessonIdx: li })
const G_IMP   = (li?: number[]): GrammarTopicRef => ({ topicId: 'imperatives',       stage: 'elementary', name: '祈使句',         icon: '👆', lessonIdx: li })
const G_QF    = (li?: number[]): GrammarTopicRef => ({ topicId: 'question_formation',stage: 'elementary', name: '疑问句',         icon: '❓', lessonIdx: li })
const G_ADJ   = (li?: number[]): GrammarTopicRef => ({ topicId: 'adjective_comparison',stage:'elementary',name:'形容词比较级',   icon: '📊', lessonIdx: li })

// ─── 初中阶段 ──────────────────────────────────────────────────────────────

const G_PASTC = (li?: number[]): GrammarTopicRef => ({ topicId: 'past_continuous',           stage: 'junior', name: '过去进行时',     icon: '🎬', lessonIdx: li })
const G_FUT   = (li?: number[]): GrammarTopicRef => ({ topicId: 'future_simple',             stage: 'junior', name: '一般将来时',     icon: '🚀', lessonIdx: li })
const G_PP    = (li?: number[]): GrammarTopicRef => ({ topicId: 'present_perfect',           stage: 'junior', name: '现在完成时',     icon: '✅', lessonIdx: li })
const G_PASTP = (li?: number[]): GrammarTopicRef => ({ topicId: 'past_perfect',              stage: 'junior', name: '过去完成时',     icon: '🔙', lessonIdx: li })
const G_MOD   = (li?: number[]): GrammarTopicRef => ({ topicId: 'modal_verbs',               stage: 'junior', name: '情态动词',       icon: '💬', lessonIdx: li })
const G_PASS  = (li?: number[]): GrammarTopicRef => ({ topicId: 'passive_voice',             stage: 'junior', name: '被动语态',       icon: '🔄', lessonIdx: li })
const G_REL   = (li?: number[]): GrammarTopicRef => ({ topicId: 'relative_clauses',          stage: 'junior', name: '定语从句',       icon: '🔗', lessonIdx: li })
const G_REP   = (li?: number[]): GrammarTopicRef => ({ topicId: 'reported_speech',           stage: 'junior', name: '间接引语',       icon: '💭', lessonIdx: li })
const G_COND  = (li?: number[]): GrammarTopicRef => ({ topicId: 'conditional_sentences',     stage: 'junior', name: '条件句',         icon: '🔀', lessonIdx: li })
const G_GER   = (li?: number[]): GrammarTopicRef => ({ topicId: 'gerunds_infinitives',       stage: 'junior', name: '动名词与不定式', icon: '🌀', lessonIdx: li })
const G_CNT   = (li?: number[]): GrammarTopicRef => ({ topicId: 'countable_uncountable',     stage: 'junior', name: '可数与不可数',   icon: '🔢', lessonIdx: li })
const G_CON   = (li?: number[]): GrammarTopicRef => ({ topicId: 'conjunctions',              stage: 'junior', name: '连词',           icon: '🔁', lessonIdx: li })

// ─── 高中阶段 ──────────────────────────────────────────────────────────────

const G_SUBJ  = (li?: number[]): GrammarTopicRef => ({ topicId: 'subjunctive_mood',       stage: 'senior', name: '虚拟语气',     icon: '🌈', lessonIdx: li })
const G_INV   = (li?: number[]): GrammarTopicRef => ({ topicId: 'inversion',              stage: 'senior', name: '倒装句',       icon: '🔃', lessonIdx: li })
const G_CLEFT = (li?: number[]): GrammarTopicRef => ({ topicId: 'cleft_sentences',        stage: 'senior', name: '强调句',       icon: '💡', lessonIdx: li })
const G_NOUN  = (li?: number[]): GrammarTopicRef => ({ topicId: 'noun_clauses',           stage: 'senior', name: '名词性从句',   icon: '📋', lessonIdx: li })
const G_NONFIN = (li?: number[]): GrammarTopicRef => ({ topicId: 'non_finite_verbs',      stage: 'senior', name: '非谓语动词',   icon: '⚙️', lessonIdx: li })
const G_ADVP  = (li?: number[]): GrammarTopicRef => ({ topicId: 'advanced_passive',       stage: 'senior', name: '高级被动结构', icon: '🔄', lessonIdx: li })
const G_MIX   = (li?: number[]): GrammarTopicRef => ({ topicId: 'mixed_conditionals',     stage: 'senior', name: '混合条件句',   icon: '🎯', lessonIdx: li })

// ─── 映射表 ────────────────────────────────────────────────────────────────
// unitId 规则：
//   三上g3-1 的单元1 → 'g31-u1'  (bookSlug 把 g3-1 → g31)
//   旧三上单元 → 'g3u1'
// ────────────────────────────────────────────────────────────────────────────

const UNIT_GRAMMAR: Record<string, GrammarTopicRef[]> = {
  // ── 三年级上册 ──────────────────────
  'g3u1':   [ G_PRO([0]),  G_IMP([0]),   G_QF([1])         ],
  'g31-u1': [ G_PRO([0]),  G_IMP([0]),   G_QF([1])         ],
  'g31-u2': [ G_ART([0]),  G_PLU([0]),   G_QF([0])         ],
  'g31-u3': [ G_PS([0,1]), G_QF([1])                       ],
  'g31-u4': [ G_THERE([0]),G_PREP([0])                     ],
  'g31-u5': [ G_QF([2]),   G_PRO([0])                      ],
  'g31-u6': [ G_ADJ([0]),  G_QF([0])                       ],

  // ── 三年级下册 ──────────────────────
  'g32-u1': [ G_PS([2]),   G_QF([0])                       ],
  'g32-u2': [ G_PRO([1]),  G_ART([0])                      ],
  'g32-u3': [ G_PC([0,1]), G_PS([1])                       ],
  'g32-u4': [ G_THERE([1]),G_PREP([0,1])                   ],
  'g32-u5': [ G_PAST([0]), G_QF([0,1])                     ],
  'g32-u6': [ G_ADJ([1,2]),G_PAST([2])                     ],

  // ── 四年级上册 ──────────────────────
  'g41-u1': [ G_QF([1,2]), G_PS([1])                       ],
  'g41-u2': [ G_THERE(),   G_PREP([0])                     ],
  'g41-u3': [ G_PS(),      G_PRO()                         ],
  'g41-u4': [ G_PREP([1]), G_IMP([1])                      ],
  'g41-u5': [ G_PC(),      G_QF([0,1])                     ],
  'g41-u6': [ G_ADJ(),     G_PS([3])                       ],

  // ── 四年级下册 ──────────────────────
  'g42-u1': [ G_PLU(),     G_ART([1])                      ],
  'g42-u2': [ G_PAST([1]), G_QF([0])                       ],
  'g42-u3': [ G_PAST([2,3]),G_FUT([0])                     ],
  'g42-u4': [ G_PAST([3]), G_PC([0])                       ],
  'g42-u5': [ G_PC(),      G_PS([2])                       ],
  'g42-u6': [ G_ADJ([2]),  G_PS([3])                       ],

  // ── 五年级上册 ──────────────────────
  'g51-u1': [ G_PAST(),    G_PASTC([0])                    ],
  'g51-u2': [ G_PASTC(),   G_FUT([0])                      ],
  'g51-u3': [ G_FUT(),     G_MOD([0])                      ],
  'g51-u4': [ G_CON([0,1]),G_QF()                          ],
  'g51-u5': [ G_PP([0,1]), G_CNT([0])                      ],
  'g51-u6': [ G_CNT(),     G_PP([1])                       ],

  // ── 五年级下册 ──────────────────────
  'g52-u1': [ G_PP(),      G_PAST([3])                     ],
  'g52-u2': [ G_PASTP(),   G_PP([2])                       ],
  'g52-u3': [ G_MOD(),     G_GER([0])                      ],
  'g52-u4': [ G_REL([0,1]),G_CON([2])                      ],
  'g52-u5': [ G_PASS([0]), G_PP([0])                       ],
  'g52-u6': [ G_REP([0]),  G_COND([0])                     ],

  // ── 六年级上册 ──────────────────────
  'g61-u1': [ G_PP([2]),   G_PASTP()                       ],
  'g61-u2': [ G_COND([0,1]),G_CON([2])                     ],
  'g61-u3': [ G_PASS(),    G_REL([2])                      ],
  'g61-u4': [ G_REL(),     G_GER([1,2])                    ],
  'g61-u5': [ G_REP(),     G_GER([0])                      ],
  'g61-u6': [ G_GER(),     G_CON()                         ],

  // ── 六年级下册 ──────────────────────
  'g62-u1': [ G_COND([2]), G_CON([0])                      ],
  'g62-u2': [ G_FUT([1]),  G_MOD([1])                      ],
  'g62-u3': [ G_ADJ(),     G_REL([2])                      ],
  'g62-u4': [ G_MOD(),     G_GER()                         ],
  'g62-u5': [ G_PP([2]),   G_PASS([1])                     ],
  'g62-u6': [ G_CON([1,2]),G_REP([1])                      ],

  // ── 七年级上册 ──────────────────────
  'g71-u1': [ G_PS(),      G_PRO()                         ],
  'g71-u2': [ G_PAST(),    G_QF()                          ],
  'g71-u3': [ G_PC(),      G_PASTC([0])                    ],
  'g71-u4': [ G_FUT(),     G_MOD([0])                      ],
  'g71-u5': [ G_PP([0,1]), G_THERE()                       ],
  'g71-u6': [ G_CNT(),     G_ART()                         ],

  // ── 七年级下册 ──────────────────────
  'g72-u1': [ G_PP(),      G_PAST([3])                     ],
  'g72-u2': [ G_PASTC(),   G_COND([0])                     ],
  'g72-u3': [ G_PASS([0]), G_MOD([1])                      ],
  'g72-u4': [ G_GER([0,1]),G_REP([0])                      ],
  'g72-u5': [ G_REL([0,1]),G_CON([0])                      ],
  'g72-u6': [ G_PASTP(),   G_FUT([1])                      ],

  // ── 八年级上册 ──────────────────────
  'g81-u1': [ G_PASTC(),   G_REL([0])                      ],
  'g81-u2': [ G_PP([2]),   G_PASTP()                       ],
  'g81-u3': [ G_PASS(),    G_GER([1])                      ],
  'g81-u4': [ G_COND([1]), G_MOD()                         ],
  'g81-u5': [ G_REL(),     G_CON([1,2])                    ],
  'g81-u6': [ G_REP(),     G_GER([2])                      ],

  // ── 八年级下册 ──────────────────────
  'g82-u1': [ G_COND([2]), G_CON()                         ],
  'g82-u2': [ G_GER(),     G_INV([0])                      ],
  'g82-u3': [ G_PASS([1]), G_REL([2])                      ],
  'g82-u4': [ G_NOUN([0]), G_CLEFT([0])                    ],
  'g82-u5': [ G_SUBJ([0]), G_MOD()                         ],
  'g82-u6': [ G_REP([1]),  G_COND()                        ],

  // ── 九年级上册 ──────────────────────
  'g91-u1': [ G_SUBJ(),    G_COND([1,2])                   ],
  'g91-u2': [ G_INV(),     G_CLEFT()                       ],
  'g91-u3': [ G_NOUN(),    G_ADVP([0])                     ],
  'g91-u4': [ G_NONFIN(),  G_PASS()                        ],
  'g91-u5': [ G_MIX(),     G_SUBJ([2])                     ],
  'g91-u6': [ G_ADVP([1]), G_INV([1])                      ],

  // ── 九年级下册 ──────────────────────
  'g92-u1': [ G_CLEFT(),   G_NOUN([1])                     ],
  'g92-u2': [ G_NONFIN([1]),G_MIX()                        ],
  'g92-u3': [ G_ADVP(),    G_SUBJ([1,2])                   ],

  // ── 高中 北师大版（按单元主题配语法）──────
  'bsdab1-u1': [ G_NOUN([0]), G_NONFIN([0]), G_ADVP([0])   ],
  'bsdab1-u2': [ G_SUBJ([0]), G_INV([0]),    G_COND([1])   ],
  'bsdab1-u3': [ G_MIX(),     G_CLEFT(),     G_ADVP([1])   ],

  // bsda-b2: unit 编号 4/5/6
  'bsdab2-u4': [ G_NOUN(),    G_NONFIN(),    G_INV([0])    ],
  'bsdab2-u5': [ G_SUBJ([1]), G_PASS([1]),   G_CLEFT()     ],
  'bsdab2-u6': [ G_MIX([0]),  G_ADVP(),      G_NONFIN([1]) ],

  // bsda-b3: unit 编号 7/8/9
  'bsdab3-u7': [ G_NOUN([1]), G_INV(),       G_MIX()       ],
  'bsdab3-u8': [ G_SUBJ(),    G_NONFIN(),    G_ADVP()      ],
  'bsdab3-u9': [ G_CLEFT([1]),G_NOUN(),      G_INV([1])    ],

  // bsda-s1: unit 编号 1/2/3
  'bsdas1-u1': [ G_SUBJ(),    G_MIX(),       G_INV()       ],
  'bsdas1-u2': [ G_NOUN(),    G_NONFIN(),    G_CLEFT()     ],
  'bsdas1-u3': [ G_ADVP(),    G_SUBJ([2]),   G_MIX([1])    ],

  // bsda-s2: unit 编号 4/5/6
  'bsdas2-u4': [ G_INV(),     G_CLEFT(),     G_ADVP()      ],
  'bsdas2-u5': [ G_SUBJ([1,2]),G_NOUN([1]),  G_MIX()       ],
  'bsdas2-u6': [ G_NONFIN(),  G_PASS([1]),   G_INV([1])    ],

  // bsda-s3: unit 编号 7/8/9
  'bsdas3-u7': [ G_NOUN(),    G_SUBJ(),      G_NONFIN()    ],
  'bsdas3-u8': [ G_MIX(),     G_CLEFT([1]),  G_ADVP([1])   ],
  'bsdas3-u9': [ G_INV(),     G_NOUN([1]),   G_MIX([0])    ],

  // bsda-s4: unit 编号 10/11/12
  'bsdas4-u10': [ G_SUBJ([2]), G_INV([1]),   G_NOUN()      ],
  'bsdas4-u11': [ G_MIX(),     G_CLEFT(),    G_NONFIN([1]) ],
  'bsdas4-u12': [ G_ADVP(),    G_SUBJ(),     G_PASS([1])   ],
}

// ── 快捷别名（旧格式 unitId 兼容）─────────────────────────────────────
const ALIASES: Record<string, string> = {
  'u1': 'g31-u1',
  'u2': 'g31-u2',
  'g3u1': 'g31-u1',
}

export function getGrammarForUnit(unitId?: string): GrammarTopicRef[] {
  if (!unitId) return []
  const key = ALIASES[unitId] ?? unitId
  return UNIT_GRAMMAR[key] ?? []
}
