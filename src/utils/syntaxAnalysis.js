// 对常见英语句型做规则匹配，返回句法说明
const PATTERNS = [
  { re: /^(is|are|am|was|were)\s+.+ing\b/i,   label: '现在进行时',  desc: 'be + V-ing，表示正在进行的动作' },
  { re: /^(is|are|am)\s+/i,                    label: '一般现在时（be）', desc: 'S + be + 表语/名词/形容词' },
  { re: /^(was|were)\s+/i,                     label: '一般过去时（be）', desc: 'S + was/were + 表语' },
  { re: /\b(will|shall)\s+\w+/i,               label: '一般将来时',  desc: 'will/shall + 动词原形' },
  { re: /\b(can|could|may|might|should|must|would)\s+\w+/i, label: '情态动词', desc: '情态动词 + 动词原形' },
  { re: /^(do|does|did)\s+\w+\s+\w+/i,        label: '一般疑问句', desc: 'Do/Does/Did + S + V？' },
  { re: /\b(have|has)\s+\w+ed\b/i,             label: '现在完成时', desc: 'have/has + 过去分词' },
  { re: /\b(don't|doesn't|didn't|won't|can't|isn't|aren't)\b/i, label: '否定句', desc: '助动词/情态动词 + not 构成否定' },
  { re: /^(what|who|where|when|why|how)\b/i,   label: '特殊疑问句', desc: '疑问词 + 助动词/be + S + V？' },
  { re: /^(let's|let\s+us)\b/i,                label: '祈使句（建议）', desc: "Let's + 动词原形，表示建议" },
  { re: /^[A-Z][a-z]+,\s+/,                    label: '称呼语',     desc: '句首称呼语，用逗号与主句分隔' },
  { re: /\b(there\s+is|there\s+are)\b/i,       label: 'There be 句型', desc: '表示"某处存在某物"' },
  { re: /\b(whose|which)\b/i,                  label: '所有格/选择疑问', desc: 'Whose/Which 引导的疑问句' },
  { re: /\b(because|so|but|and|or|if|when|although)\b/i, label: '复合句', desc: '连词连接两个分句，构成复合句' },
]

export function analyzeSyntax(en) {
  const matched = PATTERNS.filter(p => p.re.test(en))
  const wordCount = en.trim().split(/\s+/).length
  const isQuestion = en.trim().endsWith('?')
  const isExclamation = en.trim().endsWith('!')
  const result = []
  if (matched.length) result.push(...matched.map(p => ({ label: p.label, desc: p.desc })))
  else result.push({ label: '陈述句', desc: 'S（主语）+ V（谓语）+ O/C（宾语/补语）基本结构' })
  if (isQuestion && !matched.some(p => p.label.includes('疑问')))
    result.push({ label: '疑问句', desc: '结尾用问号，询问信息' })
  if (isExclamation) result.push({ label: '感叹句', desc: '结尾用感叹号，表达强烈情感' })
  result.push({ label: `词数：${wordCount}`, desc: '' })
  return result
}
