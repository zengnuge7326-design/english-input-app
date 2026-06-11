import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMobileTTS } from '../hooks/useMobileTTS'
import { dedupeDisplayText, toSpeakableText } from './speakText'

export type SentenceVariant = 'bubble' | 'plain' | 'panel' | 'story'

interface Props {
  en: string
  zh?: string
  speaker?: string
  variant?: SentenceVariant
  storyIndex?: number
  align?: 'left' | 'right'
}

export default function SentenceLine({
  en,
  zh,
  speaker,
  variant = 'plain',
  storyIndex,
  align = 'left',
}: Props) {
  const display = dedupeDisplayText(en, zh)
  const speakText = toSpeakableText(display.en)
  const [revealed, setRevealed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const playTimer = useRef<number | null>(null)
  const { speak } = useMobileTTS()

  useEffect(() => () => {
    if (playTimer.current) window.clearTimeout(playTimer.current)
  }, [])

  function handleTap() {
    setPlaying(true)
    if (!speakText) return
    speak(speakText, 0.85)
    const dur = Math.max(900, speakText.length * 75)
    if (playTimer.current) window.clearTimeout(playTimer.current)
    playTimer.current = window.setTimeout(() => setPlaying(false), dur)
  }

  function handleZhTap(e: React.MouseEvent) {
    e.stopPropagation()
    setRevealed(v => !v)
  }

  const classes = [
    'tb-sentence',
    `tb-sentence--${variant}`,
    align === 'right' ? 'tb-sentence--right' : '',
    playing ? 'tb-sentence--playing' : '',
  ].filter(Boolean).join(' ')

  return (
    <motion.div
      className={classes}
      whileTap={{ scale: 0.985 }}
      onClick={handleTap}
      role="button"
      tabIndex={0}
    >
      {storyIndex != null && <div className="tb-sentence__index">{storyIndex}</div>}
      {speaker && <div className="tb-sentence__speaker">{speaker}</div>}
      <div className="tb-sentence__en">{display.en}</div>
      {display.zh && (
        <button
          type="button"
          className={`tb-sentence__zh${revealed ? ' tb-sentence__zh--on' : ''}`}
          onClick={handleZhTap}
          aria-label={revealed ? '隐藏中文' : '显示中文'}
        >
          {display.zh}
        </button>
      )}
      <span className="tb-sentence__wave" aria-hidden>
        <span /><span /><span />
      </span>
    </motion.div>
  )
}
