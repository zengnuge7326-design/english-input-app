import { useRef, useState } from 'react'
import { useMobileTTS } from '../hooks/useMobileTTS'
import { toSpeakableText } from './speakText'
import SentenceLine, { type SentenceVariant } from './SentenceLine'
import type { TextbookSection } from './data/sections'

interface Props {
  section: TextbookSection
}

function variantFor(kind: TextbookSection['kind']): SentenceVariant {
  switch (kind) {
    case 'talk':
    case 'play':
    case 'opening':
      return 'bubble'
    case 'story':
      return 'story'
    case 'chant':
    case 'sing':
      return 'panel'
    default:
      return 'plain'
  }
}

export default function SectionView({ section }: Props) {
  const { speak, speakAndWait, stop } = useMobileTTS()
  const [playing, setPlaying] = useState(false)
  const cancelRef = useRef(false)

  async function playAll() {
    if (!section.sentences) return
    if (playing) { stop(); cancelRef.current = true; setPlaying(false); return }
    cancelRef.current = false
    setPlaying(true)
    for (const s of section.sentences) {
      if (cancelRef.current) break
      const line = toSpeakableText(s.en)
      if (line) await speakAndWait(line, 0.85)
    }
    setPlaying(false)
  }

  const variant = variantFor(section.kind)

  return (
    <section className="tb-section" id={`sec-${section.id}`}>
      <header className="tb-section__head">
        <span className="tb-section__emoji">{section.emoji}</span>
        <div className="tb-section__head-text">
          <div className="tb-section__title">{section.title}</div>
          {section.part && <span className="tb-section__part">Part {section.part}</span>}
        </div>
        {section.sentences && section.sentences.length > 1 && (
          <button
            type="button"
            className={`tb-section__playall${playing ? ' tb-section__playall--active' : ''}`}
            onClick={playAll}
            aria-label={playing ? '停止' : '全部播放'}
          >
            {playing ? '■ 停止' : '▶ 连播'}
          </button>
        )}
      </header>

      {/* Let's learn 词卡 */}
      {section.kind === 'learn' && section.words && (
        <div className="tb-words-grid">
          {section.words.map(w => (
            <button
              key={w.en}
              type="button"
              className="tb-word-card"
              onClick={() => speak(toSpeakableText(w.en), 0.8)}
            >
              {w.emoji && <span className="tb-word-card__emoji" aria-hidden>{w.emoji}</span>}
              <span className="tb-word-card__en">{w.en}</span>
              <span className="tb-word-card__zh">{w.zh}</span>
            </button>
          ))}
        </div>
      )}

      {/* 句子列表 */}
      {section.sentences && section.sentences.length > 0 && (
        <div className={`tb-sentences tb-sentences--${variant}`}>
          {section.sentences.map((s, i) => (
            <SentenceLine
              key={s.id}
              en={s.en}
              zh={s.zh || undefined}
              speaker={s.speaker}
              variant={variant}
              storyIndex={section.kind === 'story' ? i + 1 : undefined}
              align={variant === 'bubble' && i % 2 === 1 ? 'right' : 'left'}
            />
          ))}
        </div>
      )}
    </section>
  )
}
