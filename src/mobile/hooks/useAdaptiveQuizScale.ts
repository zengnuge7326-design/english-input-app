import { useEffect, useState, type RefObject } from 'react'

const MIN_SCALE = 0.78
const MAX_SCALE = 1.55
const TARGET_FILL = 0.9

/**
 * 根据答题区实际内容高度 vs 可用高度，自动计算 --mq-scale。
 * 内容少 → 放大填满；内容多 → 缩小避免溢出。
 */
export function useAdaptiveQuizScale(
  containerRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let frame = 0

    const measure = () => {
      const available = el.clientHeight
      if (available < 80) return

      let s = 1
      el.style.setProperty('--mq-scale', '1')

      for (let i = 0; i < 6; i++) {
        el.style.setProperty('--mq-scale', String(s))
        void el.offsetHeight
        const content = el.scrollHeight
        const fill = content / available

        if (fill < TARGET_FILL - 0.04) {
          s = Math.min(s * (TARGET_FILL / fill), MAX_SCALE)
        } else if (fill > 1.02) {
          s = Math.max(s * (0.98 / fill), MIN_SCALE)
        } else {
          break
        }
      }

      const rounded = Math.round(s * 1000) / 1000
      el.style.setProperty('--mq-scale', String(rounded))
      setScale(rounded)
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    schedule()
    const ro = new ResizeObserver(schedule)
    ro.observe(el)
    Array.from(el.children).forEach(child => ro.observe(child))

    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', schedule)
    }
  }, deps)

  return scale
}
