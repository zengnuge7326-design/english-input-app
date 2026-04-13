/**
 * Structured Literacy Scope & Sequence — 10 Lessons
 * Based on UFLI Foundations / Letters and Sounds / systematic synthetic phonics.
 *
 * Each lesson:
 *  id           - lesson number
 *  title        - lesson name
 *  newGraphemes - graphemes introduced this lesson
 *  cumulativeGraphemes - all graphemes taught so far
 *  phonemes     - IPA phoneme(s) for new graphemes
 *  decodableWords - words that can be fully decoded with taught graphemes only
 *  heartWords   - common irregular / tricky words to memorize
 *  sentence     - decodable sentence using lesson + prior graphemes
 *  blendingCards - show these sequences one chunk at a time
 */

export const PHONICS_LESSONS = [
  {
    id: 1,
    title: 'Lesson 1: s, a, t, p',
    newGraphemes: ['s', 'a', 't', 'p'],
    phonemes:     ['s', 'æ', 't', 'p'],
    decodableWords: ['sat', 'tap', 'pat', 'at', 'as', 'sap', 'pas', 'spa', 'apt'],
    heartWords: ['a', 'the'],
    sentence: 'Pat sat on a mat.',
    blendingCards: [
      { chunks: ['s', 'a', 't'], word: 'sat' },
      { chunks: ['t', 'a', 'p'], word: 'tap' },
      { chunks: ['p', 'a', 't'], word: 'pat' },
    ],
  },
  {
    id: 2,
    title: 'Lesson 2: i, n, m, d',
    newGraphemes: ['i', 'n', 'm', 'd'],
    phonemes:     ['ɪ', 'n', 'm', 'd'],
    decodableWords: ['sit', 'pin', 'dim', 'nip', 'tin', 'mid', 'dip', 'man', 'nap', 'dam', 'tan', 'ant', 'inn'],
    heartWords: ['is', 'in'],
    sentence: 'Tim and Sam sat.',
    blendingCards: [
      { chunks: ['s', 'i', 't'], word: 'sit' },
      { chunks: ['p', 'i', 'n'], word: 'pin' },
      { chunks: ['m', 'a', 'n'], word: 'man' },
    ],
  },
  {
    id: 3,
    title: 'Lesson 3: g, o, c, k',
    newGraphemes: ['g', 'o', 'c', 'k'],
    phonemes:     ['g', 'ɒ', 'k', 'k'],
    decodableWords: ['got', 'cot', 'kit', 'kid', 'dog', 'cod', 'top', 'cop', 'dig', 'gap', 'god', 'mop', 'nod', 'pod'],
    heartWords: ['on', 'no'],
    sentence: 'A dog got on top.',
    blendingCards: [
      { chunks: ['d', 'o', 'g'], word: 'dog' },
      { chunks: ['c', 'o', 't'], word: 'cot' },
      { chunks: ['k', 'i', 't'], word: 'kit' },
    ],
  },
  {
    id: 4,
    title: 'Lesson 4: ck, e, u, r',
    newGraphemes: ['ck', 'e', 'u', 'r'],
    phonemes:     ['k',  'e', 'ʌ', 'r'],
    decodableWords: ['duck', 'rack', 'deck', 'run', 'red', 'mud', 'bug', 'rut', 'peck', 'ruck', 'tuck', 'neck'],
    heartWords: ['up', 'and'],
    sentence: 'The duck ran up the deck.',
    blendingCards: [
      { chunks: ['d', 'u', 'ck'], word: 'duck' },
      { chunks: ['r', 'e', 'd'], word: 'red' },
      { chunks: ['r', 'u', 'n'], word: 'run' },
    ],
  },
  {
    id: 5,
    title: 'Lesson 5: h, b, f, l',
    newGraphemes: ['h', 'b', 'f', 'l'],
    phonemes:     ['h', 'b', 'f', 'l'],
    decodableWords: ['hot', 'bat', 'fat', 'lot', 'hub', 'bed', 'fun', 'lid', 'hen', 'bud', 'fig', 'lab', 'fog', 'leg'],
    heartWords: ['to', 'do'],
    sentence: 'A big fat hen had fun.',
    blendingCards: [
      { chunks: ['h', 'e', 'n'], word: 'hen' },
      { chunks: ['b', 'a', 't'], word: 'bat' },
      { chunks: ['f', 'u', 'n'], word: 'fun' },
    ],
  },
  {
    id: 6,
    title: 'Lesson 6: ff, ll, ss, j',
    newGraphemes: ['ff', 'll', 'ss', 'j'],
    phonemes:     ['f',  'l',  's',  'dʒ'],
    decodableWords: ['off', 'bell', 'miss', 'jam', 'jeff', 'fill', 'less', 'jot', 'hill', 'boss', 'jug', 'sell'],
    heartWords: ['he', 'she'],
    sentence: 'Jill sat on the hill.',
    blendingCards: [
      { chunks: ['j', 'i', 'll'], word: 'Jill' },
      { chunks: ['h', 'i', 'll'], word: 'hill' },
      { chunks: ['b', 'e', 'll'], word: 'bell' },
    ],
  },
  {
    id: 7,
    title: 'Lesson 7: v, w, x, y',
    newGraphemes: ['v', 'w', 'x', 'y'],
    phonemes:     ['v', 'w', 'ks', 'j'],
    decodableWords: ['van', 'vet', 'win', 'web', 'fox', 'box', 'yes', 'yak', 'vat', 'wax', 'mix', 'yet'],
    heartWords: ['we', 'me'],
    sentence: 'A fox and a yak mix wax.',
    blendingCards: [
      { chunks: ['f', 'o', 'x'], word: 'fox' },
      { chunks: ['v', 'a', 'n'], word: 'van' },
      { chunks: ['y', 'e', 't'], word: 'yet' },
    ],
  },
  {
    id: 8,
    title: 'Lesson 8: z, zz, qu, ch',
    newGraphemes: ['z', 'zz', 'qu', 'ch'],
    phonemes:     ['z', 'z',  'kw', 'tʃ'],
    decodableWords: ['zip', 'buzz', 'quiz', 'chip', 'chin', 'chop', 'quit', 'jazz', 'rich', 'zap', 'fizz', 'such'],
    heartWords: ['be', 'have'],
    sentence: 'The chick did a quick zip.',
    blendingCards: [
      { chunks: ['ch', 'i', 'p'], word: 'chip' },
      { chunks: ['qu', 'i', 't'], word: 'quit' },
      { chunks: ['b', 'u', 'zz'], word: 'buzz' },
    ],
  },
  {
    id: 9,
    title: 'Lesson 9: sh, th, ng, nk',
    newGraphemes: ['sh', 'th', 'ng', 'nk'],
    phonemes:     ['ʃ',  'θ',  'ŋ',  'ŋk'],
    decodableWords: ['ship', 'thin', 'ring', 'sink', 'fish', 'that', 'long', 'pink', 'rush', 'this', 'song', 'bank'],
    heartWords: ['the', 'that', 'this'],
    sentence: 'This fish can sing a long song.',
    blendingCards: [
      { chunks: ['sh', 'i', 'p'], word: 'ship' },
      { chunks: ['r', 'i', 'ng'], word: 'ring' },
      { chunks: ['s', 'i', 'nk'], word: 'sink' },
    ],
  },
  {
    id: 10,
    title: 'Lesson 10: ai, ee, igh, oa',
    newGraphemes: ['ai', 'ee', 'igh', 'oa'],
    phonemes:     ['eɪ', 'iː', 'aɪ', 'əʊ'],
    decodableWords: ['rain', 'see', 'light', 'goat', 'sail', 'feet', 'night', 'road', 'tail', 'tree', 'right', 'coat'],
    heartWords: ['said', 'they', 'some'],
    sentence: 'The goat can see the light at night.',
    blendingCards: [
      { chunks: ['r', 'ai', 'n'], word: 'rain' },
      { chunks: ['l', 'igh', 't'], word: 'light' },
      { chunks: ['g', 'oa', 't'], word: 'goat' },
    ],
  },
]

export default PHONICS_LESSONS
