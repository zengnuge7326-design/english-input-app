// 池塘背景：渐变 + 多层水波 + 随机气泡
import { useEffect, useState } from 'react'

export default function Pond({ children }) {
  const [bubbles, setBubbles] = useState([])

  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() < 0.5) {
        const id = Math.random().toString(36).slice(2)
        const left = 10 + Math.random() * 80
        const size = 6 + Math.random() * 14
        const dur = 3 + Math.random() * 3
        setBubbles(prev => [...prev, { id, left, size, dur }])
        setTimeout(() => setBubbles(prev => prev.filter(b => b.id !== id)), dur * 1000)
      }
    }, 800)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #7dd3fc 0%, #38bdf8 35%, #0ea5e9 70%, #0369a1 100%)' }}>

      {/* 远景剪影 */}
      <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="absolute inset-x-0 top-0 w-full" style={{ height: '40%', opacity: 0.25 }}>
        <path d="M 0 120 Q 100 100, 200 110 T 400 105 T 600 115 T 800 110 L 800 0 L 0 0 Z" fill="#0c4a6e" />
        {/* 远处荷花苞 */}
        <ellipse cx="120" cy="125" rx="14" ry="4" fill="#86efac" opacity="0.6" />
        <ellipse cx="640" cy="118" rx="16" ry="5" fill="#86efac" opacity="0.6" />
      </svg>

      {/* 水波层（3 层错相位移动） */}
      <svg viewBox="0 0 1600 100" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 w-[200%] pointer-events-none" style={{ height: '50%', animation: 'wave1 14s linear infinite' }}>
        <path d="M0 50 Q 200 30 400 50 T 800 50 T 1200 50 T 1600 50 L 1600 100 L 0 100 Z" fill="rgba(125,211,252,0.25)" />
      </svg>
      <svg viewBox="0 0 1600 100" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 w-[200%] pointer-events-none" style={{ height: '38%', animation: 'wave2 10s linear infinite' }}>
        <path d="M0 50 Q 200 70 400 50 T 800 50 T 1200 50 T 1600 50 L 1600 100 L 0 100 Z" fill="rgba(56,189,248,0.30)" />
      </svg>
      <svg viewBox="0 0 1600 100" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 w-[200%] pointer-events-none" style={{ height: '24%', animation: 'wave1 7s linear infinite reverse' }}>
        <path d="M0 60 Q 200 40 400 60 T 800 60 T 1200 60 T 1600 60 L 1600 100 L 0 100 Z" fill="rgba(255,255,255,0.18)" />
      </svg>

      {/* 气泡 */}
      {bubbles.map(b => (
        <div key={b.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${b.left}%`,
            bottom: 0,
            width: b.size,
            height: b.size,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(125,211,252,0.4) 70%, transparent)',
            border: '1px solid rgba(255,255,255,0.5)',
            animation: `bubbleUp ${b.dur}s ease-out forwards`,
          }}
        />
      ))}

      {/* 内容层 */}
      <div className="relative z-10 w-full h-full">{children}</div>

      <style>{`
        @keyframes wave1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wave2 {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(-75%); }
        }
        @keyframes bubbleUp {
          0% { transform: translateY(0) scale(0.7); opacity: 0; }
          15% { opacity: 0.9; transform: translateY(-30px) scale(0.85); }
          90% { opacity: 0.7; }
          100% { transform: translateY(-100vh) scale(1.1); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
