import { useEffect, type RefObject } from 'react'

/**
 * 自动把光标弹入输入框（题目切换时）。
 *
 * 多次重试 + preventScroll，尽量在各端唤起键盘；
 * iOS Safari 在异步场景下可能只聚焦不弹键盘——已是浏览器层面限制。
 */
export function useAutoFocus(
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const focus = () => {
      try {
        el.focus({ preventScroll: true } as FocusOptions)
        // 光标移到末尾
        const len = el.value.length
        el.setSelectionRange?.(len, len)
      } catch {
        try { el.focus() } catch { /* ignore */ }
      }
    }
    focus()
    // 入场动画/渲染后再补一次，提升成功率
    const t1 = window.setTimeout(focus, 60)
    const t2 = window.setTimeout(focus, 220)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
