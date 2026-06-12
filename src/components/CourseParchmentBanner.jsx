import TextbookParchmentCover from './TextbookParchmentCover'

/** 课程广场 / 核心句群 · 横幅羊皮卷封面（h-28） */
export default function CourseParchmentBanner({
  gradient,
  label,
  coverText,
  subject,
  emoji = null,
  className = 'h-28',
}) {
  return (
    <div className={`relative w-full overflow-hidden bg-gray-800 ${className}`}>
      <TextbookParchmentCover
        gradient={gradient}
        label={label}
        coverText={coverText}
        subject={subject}
        emoji={emoji}
        variant="grid"
      />
    </div>
  )
}

export const NCE_COURSE_META = {
  nce1: {
    gradient: 'from-amber-600 to-amber-800',
    coverText: '第一册',
    label: '新概念英语',
    subject: '入门对话',
  },
  nce2: {
    gradient: 'from-emerald-600 to-emerald-800',
    coverText: '第二册',
    label: '新概念英语',
    subject: '中级故事',
  },
  nce3: {
    gradient: 'from-blue-600 to-blue-800',
    coverText: '第三册',
    label: '新概念英语',
    subject: '高级散文',
  },
  nce4: {
    gradient: 'from-violet-600 to-violet-800',
    coverText: '第四册',
    label: '新概念英语',
    subject: '精通散文',
  },
}
