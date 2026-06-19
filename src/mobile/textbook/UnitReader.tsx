import { useEffect, useRef, useState } from 'react'
import { useMobileTTS } from '../hooks/useMobileTTS'
import SectionView from './SectionView'
import type { TextbookUnit } from './data/sections'
import { toSpeakableText } from './speakText'

interface Props {
  unit: TextbookUnit
  onBack: () => void
}

export default function UnitReader({ unit, onBack }: Props) {
  const [activePill, setActivePill] = useState(unit.sections[0]?.id ?? '')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const pillsRef = useRef<HTMLDivElement | null>(null)
  const { prefetch } = useMobileTTS()

  useEffect(() => {
    const texts = unit.sections.flatMap(sec => [
      ...(sec.words?.map(w => toSpeakableText(w.en)) ?? []),
      ...(sec.sentences?.map(s => toSpeakableText(s.en)) ?? []),
    ]).filter(Boolean)
    prefetch(texts)
  }, [unit.id, prefetch])

  // 滚动时同步高亮当前 pill
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const observer = new IntersectionObserver(
      entries => {
        const hit = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) {
          const id = (hit.target as HTMLElement).dataset.secId
          if (id) setActivePill(id)
        }
      },
      { root: scroller, threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -40% 0px' },
    )
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [unit.id])

  // 高亮 pill 时滚到可见
  useEffect(() => {
    const el = pillsRef.current?.querySelector<HTMLElement>(`[data-pill-id="${activePill}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activePill])

  function jumpTo(secId: string) {
    setActivePill(secId)
    sectionRefs.current[secId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const empty = unit.sections.length === 0

  return (
    <div className="tb-reader">
      <header className="tb-reader__header safe-top">
        <button type="button" className="tb-reader__back" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="13,4 7,10 13,16" /></svg>
        </button>
        <div className="tb-reader__title">
          <div className="tb-reader__unit">{unit.title}</div>
          <div className="tb-reader__sub">{unit.subtitle}</div>
        </div>
        <span className="tb-reader__hint">点击模糊处<br/>显示翻译</span>
      </header>

      {!empty && (
        <nav className="tb-reader__pills" ref={pillsRef} aria-label="章节导航">
          {unit.sections.map(sec => (
            <button
              key={sec.id}
              type="button"
              data-pill-id={sec.id}
              data-kind={sec.kind}
              className={`tb-pill${activePill === sec.id ? ' tb-pill--on' : ''}`}
              onClick={() => jumpTo(sec.id)}
            >
              <span aria-hidden>{sec.emoji}</span>
              <span>{sec.title.replace(/^Let's\s+/i, '').split('·')[0].trim()}</span>
            </button>
          ))}
        </nav>
      )}

      <div ref={scrollerRef} className="tb-reader__scroll">
        {empty ? (
          <div className="tb-reader__empty">
            <div className="tb-reader__empty-emoji">{unit.emoji}</div>
            <div className="tb-reader__empty-title">{unit.title}</div>
            <div className="tb-reader__empty-sub">内容正在整理中，敬请期待</div>
          </div>
        ) : (
          unit.sections.map(sec => (
            <div
              key={sec.id}
              data-sec-id={sec.id}
              ref={el => { sectionRefs.current[sec.id] = el }}
            >
              <SectionView section={sec} />
            </div>
          ))
        )}
        <div className="tb-reader__bottom-spacer" />
      </div>
    </div>
  )
}
