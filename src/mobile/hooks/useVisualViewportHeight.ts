import { useEffect } from 'react'
import { useIsStandalone } from './useIsStandalone'

/**
 * 浏览器模式：用 visualViewport 高度贴合可见区域，避免内容被底栏「挡住」。
 * 主屏幕图标打开时不启用（已无浏览器底栏）。
 */
export function useVisualViewportHeight(enabled = true) {
  const isStandalone = useIsStandalone()

  useEffect(() => {
    if (!enabled || isStandalone) {
      document.documentElement.style.removeProperty('--app-vvh')
      return
    }

    const vv = window.visualViewport
    if (!vv) return

    const update = () => {
      document.documentElement.style.setProperty('--app-vvh', `${vv.height}px`)
    }

    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
      document.documentElement.style.removeProperty('--app-vvh')
    }
  }, [enabled, isStandalone])
}
