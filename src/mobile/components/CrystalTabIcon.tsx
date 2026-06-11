import type { ReactNode } from 'react'

export type CrystalTabColor = 'green' | 'blue' | 'purple' | 'orange' | 'black'

interface Props {
  color: CrystalTabColor
  active?: boolean
  children: ReactNode
}

export default function CrystalTabIcon({ color, active = false, children }: Props) {
  return (
    <span
      className={[
        'crystal-tab-icon',
        `crystal-tab-icon--${color}`,
        active ? 'crystal-tab-icon--active' : '',
      ].filter(Boolean).join(' ')}
      aria-hidden
    >
      <span className="crystal-tab-icon__glass">
        <span className="crystal-tab-icon__shine" />
        <span className="crystal-tab-icon__glyph">{children}</span>
      </span>
    </span>
  )
}
