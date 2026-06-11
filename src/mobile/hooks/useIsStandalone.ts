import { useEffect, useState } from 'react'

/** 是否从主屏幕图标打开（无 Safari/Chrome 底栏） */
export function useIsStandalone() {
  const [standalone, setStandalone] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(display-mode: standalone)')
    const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
    const update = () => setStandalone(mq.matches || iosStandalone)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return standalone
}
