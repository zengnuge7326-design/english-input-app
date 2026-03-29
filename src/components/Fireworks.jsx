import { useEffect, useState } from 'react'

const COLORS = ['#ff4d4d','#ffcc00','#4dff88','#4db8ff','#ff80ff','#ff9933','#fff','#c084fc']

function makeBurst(cx, cy, delay) {
  return Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.3
    const dist = 80 + Math.random() * 140
    return {
      id: Math.random(),
      cx, cy,
      fx: Math.cos(angle) * dist,
      fy: Math.sin(angle) * dist - 40,
      size: 4 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 0.6 + Math.random() * 0.5,
      delay,
    }
  })
}

export default function Fireworks({ active }) {
  const [sparks, setSparks] = useState([])

  useEffect(() => {
    if (!active) { setSparks([]); return }
    const W = window.innerWidth, H = window.innerHeight
    const all = [
      ...makeBurst(W * 0.25 + Math.random() * W * 0.5, H * 0.2 + Math.random() * H * 0.25, 0),
      ...makeBurst(W * 0.2  + Math.random() * W * 0.6, H * 0.15 + Math.random() * H * 0.3, 0.18),
      ...makeBurst(W * 0.3  + Math.random() * W * 0.4, H * 0.1  + Math.random() * H * 0.35, 0.36),
    ]
    setSparks(all)
    const t = setTimeout(() => setSparks([]), 1600)
    return () => clearTimeout(t)
  }, [active])

  if (!sparks.length) return null

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {sparks.map(s => (
        <div
          key={s.id}
          className="fw-spark"
          style={{
            left: s.cx, top: s.cy,
            width: s.size, height: s.size,
            background: s.color,
            boxShadow: `0 0 6px ${s.color}`,
            '--fx': `${s.fx}px`,
            '--fy': `${s.fy}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
