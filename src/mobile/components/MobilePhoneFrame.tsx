import type { ReactNode } from 'react'
import { useVisualViewportHeight } from '../hooks/useVisualViewportHeight'

interface Props {
  children: ReactNode
  className?: string
}

/** 手机视口框：真机满宽，桌面浏览器居中窄屏 + 左右留黑边 */
export default function MobilePhoneFrame({ children, className = '' }: Props) {
  useVisualViewportHeight(true)

  return (
    <div className="mobile-phone-frame">
      <div className={`mobile-phone-frame__inner flex flex-col overflow-hidden ${className}`.trim()}>
        {children}
      </div>
    </div>
  )
}
