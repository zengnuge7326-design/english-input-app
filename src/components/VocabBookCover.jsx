import { useState } from 'react'
import TextbookParchmentCover from './TextbookParchmentCover'

const GRADE_GRADIENTS = {
  7: { up: 'from-sky-600 to-sky-800', down: 'from-blue-600 to-blue-800' },
  8: { up: 'from-violet-600 to-violet-800', down: 'from-purple-600 to-purple-800' },
  9: { up: 'from-rose-600 to-rose-800', down: 'from-orange-600 to-orange-800' },
  '高中': {
    b1: 'from-blue-700 to-blue-900', b2: 'from-indigo-700 to-indigo-900', b3: 'from-violet-700 to-violet-900',
    s1: 'from-emerald-700 to-emerald-900', s2: 'from-teal-700 to-teal-900',
    s3: 'from-cyan-700 to-cyan-900', s4: 'from-sky-700 to-sky-900',
  },
}

const COVER_TEXT_MAP = {
  up: '上册', down: '下册',
  b1: '必修一', b2: '必修二', b3: '必修三',
  s1: '选必一', s2: '选必二', s3: '选必三', s4: '选必四',
}

const GRADE_COVER_TEXT = { 7: '七', 8: '八', 9: '九' }

export function bookCoverSrc(book) {
  if (typeof book.grade !== 'number' || !book.sem) return null
  if (book.grade >= 3 && book.grade <= 5) {
    return `/covers/grade${book.grade}_${book.sem}.jpg`
  }
  if (book.grade === 6) {
    return `/covers/grade6_${book.sem}.svg`
  }
  return null
}

function bookParchmentInfo(book) {
  const gradeMap = GRADE_GRADIENTS[book.grade]
  if (!gradeMap) return null
  const gradient = gradeMap[book.sem]
  if (!gradient) return null
  const semLabel = COVER_TEXT_MAP[book.sem] || book.sem
  const gradeChar = GRADE_COVER_TEXT[book.grade]
  const coverText = gradeChar ? `${gradeChar}${semLabel === '上册' ? '上' : '下'}` : semLabel
  const label = book.grade === '高中' ? '北师大版' : '仁爱版'
  const subject = book.grade === '高中' ? '高中英语' : '初中英语'
  return { gradient, coverText, label, subject }
}

export default function VocabBookCover({ book }) {
  const [coverOk, setCoverOk] = useState(true)
  const coverSrc = bookCoverSrc(book)
  const cover = coverSrc && coverOk ? coverSrc : null
  const parchment = cover ? null : bookParchmentInfo(book)

  if (parchment) {
    return (
      <TextbookParchmentCover
        gradient={parchment.gradient}
        label={parchment.label}
        coverText={parchment.coverText}
        subject={parchment.subject}
        variant="grid"
      />
    )
  }

  if (cover) {
    return (
      <img
        src={cover}
        alt={book.bookName}
        onError={() => setCoverOk(false)}
        className="w-full h-full object-cover"
      />
    )
  }

  return <span className="text-3xl text-gray-700">+</span>
}
