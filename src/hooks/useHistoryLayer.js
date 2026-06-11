import { useEffect, useRef } from 'react'

/**
 * 给模态/全屏页接管浏览器返回。
 *
 * 与 App.jsx 已有的 pushState/popstate（tab/lesson 导航）协调：
 * - 用 window.__layerCount 标记当前活动层数
 * - App.jsx 的 popstate 看到 __layerCount > 0 时跳过原有处理（避免重复 applyLesson
 *   导致 exerciseIndex 重置、句子重拉、缓存数据失效等副作用）
 * - 计数仅在 popstate 中减一（无论是用户按浏览器返回，还是程序触发 history.back()）
 *
 * 多层叠加按 LIFO 顺序工作（每层独立 push）。
 */
export function useHistoryLayer(open, onClose) {
  const poppingRef = useRef(false)
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    if (!open) return
    if (typeof window === 'undefined') return

    const id = '_layer_' + Math.random().toString(36).slice(2, 9)
    window.__layerCount = (window.__layerCount || 0) + 1
    try {
      window.history.pushState({ layer: id }, '')
    } catch {}

    let attached = false
    const onPop = () => {
      if (!attached) return  // 忽略前一个模态清理时触发的 popstate
      poppingRef.current = true
      try { onCloseRef.current?.() } catch {}
    }
    // 延后挂监听器，避免捕获上一层模态 unmount 时触发的 history.back popstate
    const attachTid = setTimeout(() => {
      attached = true
      window.addEventListener('popstate', onPop)
    }, 80)

    return () => {
      clearTimeout(attachTid)
      if (attached) window.removeEventListener('popstate', onPop)
      if (!poppingRef.current && window.history.state?.layer === id) {
        try { window.history.back() } catch {}
      }
      poppingRef.current = false
    }
  }, [open])
}
