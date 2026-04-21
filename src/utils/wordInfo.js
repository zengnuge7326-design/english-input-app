import nlp from 'compromise'

// ── Static phonetics for high-frequency words (American English IPA) ─────────
const STATIC_PHONETICS = {
  a: '/ə/', an: '/ən/', the: '/ðə/',
  i: '/aɪ/', me: '/miː/', my: '/maɪ/', mine: '/maɪn/',
  you: '/juː/', your: '/jɔːr/', yours: '/jɔːrz/',
  he: '/hiː/', him: '/hɪm/', his: '/hɪz/',
  she: '/ʃiː/', her: '/hɜːr/', hers: '/hɜːrz/',
  it: '/ɪt/', its: '/ɪts/',
  we: '/wiː/', us: '/ʌs/', our: '/aʊər/', ours: '/aʊərz/',
  they: '/ðeɪ/', them: '/ðɛm/', their: '/ðɛr/', theirs: '/ðɛrz/',
  this: '/ðɪs/', that: '/ðæt/', these: '/ðiːz/', those: '/ðoʊz/',
  is: '/ɪz/', am: '/æm/', are: '/ɑːr/',
  was: '/wɑːz/', were: '/wɜːr/',
  be: '/biː/', been: '/bɪn/', being: '/ˈbiːɪŋ/',
  do: '/duː/', does: '/dʌz/', did: '/dɪd/',
  has: '/hæz/', have: '/hæv/', had: '/hæd/',
  can: '/kæn/', could: '/kʊd/',
  will: '/wɪl/', would: '/wʊd/',
  shall: '/ʃæl/', should: '/ʃʊd/',
  may: '/meɪ/', might: '/maɪt/', must: '/mʌst/',
  to: '/tuː/', of: '/ʌv/', in: '/ɪn/', on: '/ɑːn/', at: '/æt/',
  for: '/fɔːr/', with: '/wɪð/', by: '/baɪ/', from: '/frʌm/',
  as: '/æz/', into: '/ˈɪntuː/', up: '/ʌp/', out: '/aʊt/',
  and: '/ænd/', or: '/ɔːr/', but: '/bʌt/', so: '/soʊ/',
  yet: '/jɛt/', nor: '/nɔːr/', if: '/ɪf/',
  not: '/nɑːt/', no: '/noʊ/', just: '/dʒʌst/',
  what: '/wɑːt/', who: '/huː/', how: '/haʊ/',
  when: '/wɛn/', where: '/wɛr/', why: '/waɪ/',
  which: '/wɪtʃ/', there: '/ðɛr/', here: '/hɪr/',
  very: '/ˈvɛri/', too: '/tuː/', also: '/ˈɔːlsoʊ/',
  all: '/ɔːl/', each: '/iːtʃ/', every: '/ˈɛvri/',
  some: '/sʌm/', any: '/ˈɛni/', many: '/ˈmɛni/', much: '/mʌtʃ/',
  more: '/mɔːr/', most: '/moʊst/', other: '/ˈʌðər/',
  about: '/əˈbaʊt/', after: '/ˈæftər/', before: '/bɪˈfɔːr/',
  between: '/bɪˈtwiːn/', over: '/ˈoʊvər/', under: '/ˈʌndər/',
  then: '/ðɛn/', than: '/ðæn/', because: '/bɪˈkɔːz/',
  since: '/sɪns/', while: '/waɪl/', although: '/ɔːlˈðoʊ/',
  "i'm": '/aɪm/', "don't": '/doʊnt/', "doesn't": '/ˈdʌzənt/',
  "didn't": '/ˈdɪdənt/', "can't": '/kænt/', "won't": '/woʊnt/',
  "wouldn't": '/ˈwʊdənt/', "couldn't": '/ˈkʊdənt/', "shouldn't": '/ˈʃʊdənt/',
  "isn't": '/ˈɪzənt/', "aren't": '/ɑːrənt/', "wasn't": '/ˈwɑːzənt/',
  "weren't": '/wɜːrənt/', "hasn't": '/ˈhæzənt/', "haven't": '/ˈhævənt/',
  "it's": '/ɪts/', "he's": '/hiːz/', "she's": '/ʃiːz/',
  "that's": '/ðæts/', "there's": '/ðɛrz/', "what's": '/wɑːts/',
  "let's": '/lɛts/', "i've": '/aɪv/', "we've": '/wiːv/',
  "they've": '/ðeɪv/', "i'll": '/aɪl/', "we'll": '/wiːl/',
  "you'll": '/juːl/', "he'll": '/hiːl/', "she'll": '/ʃiːl/',
  "they'll": '/ðeɪl/', "i'd": '/aɪd/', "we'd": '/wiːd/',
  "you'd": '/juːd/', "he'd": '/hiːd/', "she'd": '/ʃiːd/',
  "they'd": '/ðeɪd/',
}

// ── Static translations for function words ───────────────────────────────────
// Keys: lowercase word. Values: string OR { pos: translation } for multi-meaning.
export const FUNCTION_WORDS = {
  a: { default: '一个', determiner: '一个' },
  an: { default: '一个', determiner: '一个' },
  the: '定冠词',
  i: '我', me: '我', my: '我的', mine: '我的',
  you: '你', your: '你的', yours: '你的',
  he: '他', him: '他', his: '他的',
  she: '她', her: '她/她的', hers: '她的',
  it: '它', its: '它的',
  we: '我们', us: '我们', our: '我们的', ours: '我们的',
  they: '他们', them: '他们', their: '他们的', theirs: '他们的',
  this: { default: '这个', pronoun: '这个', determiner: '这个', adverb: '这么' },
  that: { default: '那个', pronoun: '那个', conjunction: '连词', determiner: '那个' },
  these: '这些', those: '那些',
  is: '是', am: '是', are: '是',
  was: '曾是', were: '曾是',
  be: '是', been: '已是', being: '正在',
  do: { default: '做', verb: '做', auxiliary: '助动词' },
  does: { default: '做', verb: '做', auxiliary: '助动词' },
  did: { default: '做了', verb: '做了', auxiliary: '助动词' },
  has: { default: '有', verb: '有', auxiliary: '助动词' },
  have: { default: '有', verb: '有', auxiliary: '助动词' },
  had: { default: '有过', verb: '有过', auxiliary: '助动词' },
  can: '能', could: '能/可能',
  will: { default: '将', verb: '意愿', auxiliary: '将要' },
  would: '会/将',
  shall: '将', should: '应该',
  may: '可以/也许', might: '可能', must: '必须',
  to: { default: '到', preposition: '到/向', particle: '不定式' },
  of: '的/属于', in: '在…里', on: '在…上', at: '在',
  for: '为了', with: '和/用', by: '被/通过', from: '从',
  as: '作为/如同', into: '进入', up: '向上', out: '向外',
  and: '和', or: '或', but: '但是', so: '所以',
  yet: '然而/还', nor: '也不', if: '如果',
  not: '不', no: '没有', just: '只是/刚刚',
  what: '什么', who: '谁', how: '怎样',
  when: '何时', where: '哪里', why: '为什么',
  which: '哪个', there: '那里', here: '这里',
  very: '非常', too: '也/太', also: '也',
  all: '所有', each: '每个', every: '每个',
  some: '一些', any: '任何', many: '许多', much: '很多',
  more: '更多', most: '最', other: '其他',
  about: '关于', after: '之后', before: '之前',
  between: '之间', over: '在…上方', under: '在…下面',
  then: '然后', than: '比', because: '因为',
  since: '自从', while: '当…时', although: '虽然',
  like: { default: '喜欢', verb: '喜欢', preposition: '像' },
  get: '得到', got: '得到了', gets: '得到',
  go: '去', goes: '去', went: '去了', gone: '已去',
  come: '来', comes: '来', came: '来了',
  make: '制作', makes: '制作', made: '制作了',
  take: '拿', takes: '拿', took: '拿了', taken: '已拿',
  give: '给', gives: '给', gave: '给了', given: '已给',
  say: '说', says: '说', said: '说了',
  tell: '告诉', tells: '告诉', told: '告诉了',
  know: '知道', knows: '知道', knew: '知道了', known: '已知',
  think: '认为', thinks: '认为', thought: '认为了',
  see: '看见', sees: '看见', saw: '看见了', seen: '已看见',
  want: '想要', wants: '想要', wanted: '想要了',
  need: '需要', needs: '需要', needed: '需要了',
  put: '放置',
  keep: '保持', keeps: '保持', kept: '保持了',
  let: '让', lets: '让',
  begin: '开始', begins: '开始', began: '开始了',
  seem: '似乎', seems: '似乎',
  help: '帮助', helps: '帮助',
  show: '展示', shows: '展示', showed: '展示了',
  try: '尝试', tries: '尝试', tried: '尝试了',
  ask: '问', asks: '问', asked: '问了',
  find: '找到', finds: '找到', found: '找到了',
  feel: '感觉', feels: '感觉', felt: '感觉了',
  become: '成为', becomes: '成为', became: '成为了',
  leave: '离开', leaves: '离开', left: '离开了',
  call: '称呼/打电话', calls: '称呼', called: '称呼了',
  own: '自己的',
  well: '好', still: '仍然', even: '甚至',
  back: '回来', now: '现在', only: '只有',
  really: '真的', always: '总是', never: '从不',
  again: '再次', often: '经常', already: '已经',
  away: '离开', around: '周围',
  however: '然而', therefore: '因此',
  both: '两者都', such: '如此', own: '自己的',
  same: '相同的', different: '不同的',
  new: '新的', old: '旧的', good: '好的', great: '伟大的',
  big: '大的', small: '小的', long: '长的',
  first: '第一', last: '最后', next: '下一个',
  right: '对的/右', sure: '确定',
  able: '能够', important: '重要的',
}

// ── Phonetic cache ───────────────────────────────────────────────────────────
const phoneticCache = new Map()

export async function fetchWordPhonetic(word) {
  if (!word) return ''
  const key = word.toLowerCase().replace(/[^a-z']/g, '')
  if (!key) return ''

  if (STATIC_PHONETICS[key]) return STATIC_PHONETICS[key]

  const lowerWord = word.toLowerCase()
  if (STATIC_PHONETICS[lowerWord]) return STATIC_PHONETICS[lowerWord]

  if (phoneticCache.has(key)) return phoneticCache.get(key)

  const stored = sessionStorage.getItem(`ph_${key}`)
  if (stored !== null) {
    phoneticCache.set(key, stored)
    return stored
  }

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${key}`,
      { signal: AbortSignal.timeout(3000) }
    )
    if (!res.ok) { phoneticCache.set(key, ''); sessionStorage.setItem(`ph_${key}`, ''); return '' }
    const data = await res.json()
    const entry = data[0]
    const phonetic = entry?.phonetic
      || entry?.phonetics?.find(p => p.text && p.audio?.includes('us'))?.text
      || entry?.phonetics?.find(p => p.text)?.text
      || ''
    phoneticCache.set(key, phonetic)
    sessionStorage.setItem(`ph_${key}`, phonetic)
    return phonetic
  } catch {
    phoneticCache.set(key, '')
    sessionStorage.setItem(`ph_${key}`, '')
    return ''
  }
}

// ── POS tagging via compromise ───────────────────────────────────────────────
const POS_MAP = {
  Noun: 'noun', Singular: 'noun', Plural: 'noun', Uncountable: 'noun',
  Verb: 'verb', Infinitive: 'verb', PastTense: 'verb', Gerund: 'verb',
  PresentTense: 'verb', FutureTense: 'verb', Copula: 'verb',
  Modal: 'verb', Auxiliary: 'verb',
  Adjective: 'adjective', Comparable: 'adjective', Superlative: 'adjective',
  Adverb: 'adverb',
  Pronoun: 'pronoun',
  Preposition: 'preposition',
  Conjunction: 'conjunction', Subordinating: 'conjunction',
  Determiner: 'other', Article: 'other',
  Negative: 'other', QuestionWord: 'other',
}

export function getSentencePOS(sentenceEn) {
  if (!sentenceEn) return {}
  const doc = nlp(sentenceEn)
  const result = {}
  doc.terms().forEach(term => {
    const word = term.text('normal')
    const tags = Array.from(term.json()[0]?.terms?.[0]?.tags || [])
    let pos = 'other'
    for (const tag of tags) {
      if (POS_MAP[tag]) { pos = POS_MAP[tag]; break }
    }
    result[word.toLowerCase()] = pos
  })
  return result
}

// ── Resolve function word translation with POS context ───────────────────────
export function getFunctionWordTranslation(word, pos) {
  const key = word.toLowerCase()
  const entry = FUNCTION_WORDS[key]
  if (!entry) return null
  if (typeof entry === 'string') return entry
  if (pos && entry[pos]) return entry[pos]
  return entry.default || Object.values(entry)[0]
}
