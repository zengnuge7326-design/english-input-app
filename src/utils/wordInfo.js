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
  play: { default: '玩；打（球）', verb: '玩；参加（运动）；打（球）', noun: '戏剧' },
  plays: { default: '玩；打（球）', verb: '玩；参加（运动）；打（球）', noun: '戏剧' },
  playing: { default: '正在玩／打（球）', verb: '正在参与（体育活动）', noun: '戏剧（行业说法）' },
  played: { default: '玩／打（球）（过去）', verb: '（过去）玩；打（球）', adjective: '（比赛）用过的' },
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
  again: '再次', often: '经常', sometimes: '有时', already: '已经',
  away: '离开', around: '周围',
  however: '然而', therefore: '因此',
  both: '两者都', such: '如此', own: '自己的',
  same: '相同的', different: '不同的',
  new: '新的', old: '旧的', good: '好的', great: '很好的',
  big: '大的', small: '小的', long: '长的',
  first: '第一', last: '最后', next: '下一个',
  right: '对的/右', sure: '确定',
  able: '能够', important: '重要的',

  // 常用形容词
  nice: '好的/漂亮的', glad: '高兴的', happy: '快乐的',
  sad: '伤心的', angry: '生气的', tired: '累的',
  hungry: '饿的', thirsty: '渴的',
  hot: '热的', cold: '冷的', warm: '暖和的', cool: '凉爽的/酷',
  fast: '快的', slow: '慢的', tall: '高的', short: '矮的/短的',
  fat: '胖的', thin: '瘦的', hard: '硬的/难的', soft: '软的',
  heavy: '重的', light: { default: '轻的', noun: '灯/光' },
  clean: { default: '干净的', verb: '打扫' }, dirty: '脏的',
  quiet: '安静的', loud: '吵闹的',
  beautiful: '美丽的', pretty: '漂亮的', handsome: '英俊的',
  strong: '强壮的', weak: '虚弱的', kind: '善良的',
  funny: '有趣的', clever: '聪明的', smart: '聪明的',
  brave: '勇敢的', shy: '害羞的', friendly: '友好的',
  busy: '忙碌的', free: '自由的/免费的',
  easy: '容易的', difficult: '困难的', careful: '小心的',
  healthy: '健康的', sick: '生病的', fine: '好的',
  sorry: '对不起', okay: '好的', ok: '好的', sure: '当然/确定',
  ready: '准备好了', favorite: '最喜欢的', favourite: '最喜欢的',
  wrong: '错误的', late: '迟的', early: '早的',
  far: '远的', near: '近的', behind: '在后面',

  // 常用动词
  meet: '见到/遇见', met: '见到了', meeting: '见面',
  look: '看', looks: '看', looked: '看了',
  stand: '站立', sit: '坐', sitting: '坐着',
  open: '打开', opens: '打开', opened: '打开了',
  close: { default: '关闭', adjective: '近的' }, closes: '关闭', closed: '已关闭',
  read: '读', reads: '读', reading: '正在读',
  write: '写', writes: '写', wrote: '写了', written: '已写',
  listen: '听', listens: '听', listened: '听了', listening: '正在听',
  speak: '说话', speaks: '说话', spoke: '说了', speaking: '正在说',
  draw: '画', draws: '画', drew: '画了', drawing: '正在画',
  run: '跑', runs: '跑', ran: '跑了', running: '正在跑',
  jump: '跳', jumps: '跳', jumped: '跳了', jumping: '正在跳',
  eat: '吃', eats: '吃', ate: '吃了', eating: '正在吃', eaten: '已吃',
  drink: '喝', drinks: '喝', drank: '喝了', drinking: '正在喝', drunk: '已喝',
  sleep: '睡觉', sleeps: '睡觉', slept: '睡了', sleeping: '正在睡',
  wake: '唤醒/醒来', wakes: '醒来', woke: '醒了',
  wash: '洗', washes: '洗', washed: '洗了', washing: '正在洗',
  cook: '做饭', cooks: '做饭', cooked: '做饭了', cooking: '正在做饭',
  ride: '骑', rides: '骑', rode: '骑了', riding: '正在骑',
  swim: '游泳', swims: '游泳', swam: '游了', swimming: '正在游泳',
  fly: '飞', flies: '飞', flew: '飞了', flying: '正在飞',
  walk: '走路', walks: '走路', walked: '走了', walking: '正在走',
  talk: '谈话', talks: '谈话', talked: '谈了', talking: '正在谈',
  sing: '唱歌', sings: '唱歌', sang: '唱了', singing: '正在唱',
  dance: '跳舞', dances: '跳舞', danced: '跳了', dancing: '正在跳舞',
  paint: '画/涂', paints: '涂', painted: '涂了', painting: '正在画',
  share: '分享', shares: '分享', shared: '分享了',
  learn: '学习', learns: '学习', learned: '学了', learning: '正在学习',
  study: '学习', studies: '学习', studied: '学了', studying: '正在学习',
  teach: '教', teaches: '教', taught: '教了', teaching: '正在教',
  buy: '买', buys: '买', bought: '买了', buying: '正在买',
  use: '使用', uses: '使用', used: '使用了', using: '正在使用',
  wait: '等待', waits: '等待', waited: '等了', waiting: '正在等',
  stop: '停止', stops: '停止', stopped: '停了', stopping: '正在停',
  love: '爱', loves: '爱', loved: '爱了', loving: '爱着',
  miss: '想念/错过', misses: '想念', missed: '想念了',
  bring: '带来', brings: '带来', brought: '带来了',
  wear: '穿/戴', wears: '穿', wore: '穿了', wearing: '穿着',
  save: '节省/保存', saves: '节省', saved: '节省了',
  visit: '参观/拜访', visits: '参观', visited: '参观了', visiting: '正在参观',
  live: '生活/住', lives: '住', lived: '住了', living: '正在住',
  like: { default: '喜欢', verb: '喜欢', preposition: '像' },
  love: '爱', hate: '讨厌', hates: '讨厌', hated: '讨厌了',
  work: '工作', works: '工作', worked: '工作了', working: '正在工作',
  play: { default: '玩；打（球）', verb: '玩；参加（运动）', noun: '戏剧' },
  watch: '观看', watches: '观看', watched: '看了', watching: '正在看',
  thank: '感谢', thanks: '谢谢', thanked: '感谢了', thanking: '正在感谢',
  answer: '回答', answers: '回答', answered: '回答了',
  count: '数', counts: '数', counted: '数了', counting: '正在数',
  color: '颜色/涂色', colour: '颜色/涂色', colors: '颜色',
  finish: '完成', finishes: '完成', finished: '完成了', finishing: '正在完成',
  start: '开始', starts: '开始', started: '开始了', starting: '正在开始',
  carry: '携带', carries: '携带', carried: '携带了', carrying: '正在携带',
  turn: '转/打开', turns: '转', turned: '转了', turning: '正在转',
  pick: '摘/选', picks: '摘', picked: '摘了', picking: '正在摘',
  change: '改变', changes: '改变', changed: '改变了', changing: '正在改变',
  check: '检查', checks: '检查', checked: '检查了', checking: '正在检查',

  // 问候和礼貌用语
  hello: '你好', hi: '嗨', hey: '嘿',
  bye: '再见', goodbye: '再见',
  please: '请', thank: '谢谢',
  welcome: '欢迎', yes: '是的', yeah: '对',

  // 常用名词（小学高频）
  school: '学校', class: '班级/课', classroom: '教室',
  teacher: '老师', student: '学生', friend: '朋友',
  family: '家庭', mother: '妈妈', father: '爸爸',
  mom: '妈妈', dad: '爸爸', parents: '父母',
  brother: '兄弟', sister: '姐妹', grandma: '奶奶/外婆',
  grandpa: '爷爷/外公', baby: '婴儿/宝宝', child: '孩子', children: '孩子们',
  boy: '男孩', girl: '女孩', man: '男人', woman: '女人', person: '人',
  people: '人们', everyone: '每个人', someone: '某人', anyone: '任何人',
  home: '家', house: '房子', room: '房间', door: '门', window: '窗户',
  book: '书', pen: '钢笔', pencil: '铅笔', eraser: '橡皮', ruler: '尺子',
  bag: '书包', desk: '课桌', chair: '椅子', board: '黑板',
  morning: '早上', afternoon: '下午', evening: '晚上', night: '夜晚',
  today: '今天', yesterday: '昨天', tomorrow: '明天',
  day: '天/白天', week: '周', month: '月', year: '年',
  time: '时间', hour: '小时', minute: '分钟',
  number: '数字', letter: '字母', word: '单词', sentence: '句子',
  name: '名字', age: '年龄', grade: '年级',
  food: '食物', water: '水', milk: '牛奶', juice: '果汁',
  apple: '苹果', banana: '香蕉', orange: '橙子',
  cat: '猫', dog: '狗', fish: '鱼', bird: '鸟', rabbit: '兔子',
  color: '颜色', red: '红色', blue: '蓝色', green: '绿色',
  yellow: '黄色', white: '白色', black: '黑色', pink: '粉色', purple: '紫色',
  weather: '天气', sunny: '晴天', rainy: '下雨', cloudy: '多云', snowy: '下雪',
  spring: '春天', summer: '夏天', autumn: '秋天', winter: '冬天',
  sport: '运动', football: '足球', basketball: '篮球', swimming: '游泳',
  music: '音乐', art: '艺术', dance: '舞蹈', story: '故事',
  birthday: '生日', party: '派对', present: '礼物/现在', gift: '礼物',
  park: '公园', zoo: '动物园', hospital: '医院', shop: '商店', market: '市场',
  city: '城市', town: '城镇', country: '国家/农村',
  way: '方法/路', place: '地方', world: '世界', nature: '自然',
  thing: '东西', idea: '主意', question: '问题', answer: '答案',
  game: '游戏', toy: '玩具', ball: '球', kite: '风筝',
  picture: '图片', photo: '照片', map: '地图',
  letter: '信/字母', card: '卡片', message: '消息',
  body: '身体', hand: '手', eye: '眼睛', ear: '耳朵', mouth: '嘴巴',
  nose: '鼻子', face: '脸', head: '头', arm: '手臂', leg: '腿', foot: '脚',
  clothes: '衣服', shirt: '衬衫', dress: '裙子', jacket: '夹克',
  pants: '裤子', shoes: '鞋子', hat: '帽子', coat: '外套', socks: '袜子',
}

// ── Phonetic cache ───────────────────────────────────────────────────────────
const phoneticCache = new Map()

export async function fetchWordPhonetic(word) {
  if (!word) return ''
  const key = word.toLowerCase().replace(/[^a-z']/g, '')
  if (!key) return ''
  const fallback = ''

  // Validate that a phonetic string looks like real IPA (not just the word itself)
  function isValidIPA(ph) {
    if (!ph) return false
    const inner = ph.replace(/[/ˈˌ]/g, '').toLowerCase()
    // Must contain at least one character outside basic ASCII a-z
    if (/[^\x00-\x7F]/.test(inner)) return true
    // Or contain a recognized IPA-only ASCII symbol
    if (/[ːʔ]/.test(ph)) return true
    // If it's just ASCII letters, it's probably the word itself — reject
    return false
  }

  if (STATIC_PHONETICS[key]) return STATIC_PHONETICS[key]

  if (phoneticCache.has(key)) return phoneticCache.get(key)

  const stored = sessionStorage.getItem(`ph_${key}`)
  if (stored !== null) {
    phoneticCache.set(key, stored)
    return stored
  }

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${key}`,
      { signal: AbortSignal.timeout(1500) }
    )
    if (!res.ok) {
      phoneticCache.set(key, fallback)
      sessionStorage.setItem(`ph_${key}`, fallback)
      return fallback
    }
    const data = await res.json()
    const entry = data[0]
    const candidates = [
      entry?.phonetic,
      entry?.phonetics?.find(p => p.text && p.audio?.includes('us'))?.text,
      entry?.phonetics?.find(p => p.text)?.text,
    ]
    const phonetic = candidates.find(isValidIPA) || fallback
    phoneticCache.set(key, phonetic)
    sessionStorage.setItem(`ph_${key}`, phonetic)
    return phonetic
  } catch {
    phoneticCache.set(key, fallback)
    sessionStorage.setItem(`ph_${key}`, fallback)
    return fallback
  }
}

// ── POS tagging via compromise ───────────────────────────────────────────────
const POS_MAP = {
  Noun: 'noun', Singular: 'noun', Plural: 'noun', Uncountable: 'noun',
  Verb: 'verb', Infinitive: 'verb', PastTense: 'verb', Gerund: 'verb',
  PresentTense: 'verb', FutureTense: 'verb', Copula: 'verb',
  Modal: 'auxiliary', Auxiliary: 'auxiliary',
  Adjective: 'adjective', Comparable: 'adjective', Superlative: 'adjective',
  Adverb: 'adverb',
  Pronoun: 'pronoun',
  Preposition: 'preposition',
  Conjunction: 'conjunction', Subordinating: 'conjunction',
  Determiner: 'determiner', Article: 'determiner',
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
