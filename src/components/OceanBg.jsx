// 复用海底背景：星空 + 气泡 + 鱼。与主学习页（ExerciseView）一致。
// 用法：在页面顶层放一个 <OceanBg />，会自动覆盖整个视口。

const BUBBLES = [
  { left: '4%',  size: 14, duration: 12, delay: 0 },
  { left: '11%', size: 8,  duration: 9,  delay: 4 },
  { left: '19%', size: 18, duration: 15, delay: 1 },
  { left: '28%', size: 10, duration: 11, delay: 5 },
  { left: '36%', size: 22, duration: 16, delay: 8 },
  { left: '44%', size: 12, duration: 10, delay: 2 },
  { left: '52%', size: 16, duration: 13, delay: 6 },
  { left: '63%', size: 12, duration: 10, delay: 3 },
  { left: '76%', size: 16, duration: 11, delay: 6 },
  { left: '88%', size: 9,  duration: 8,  delay: 2 },
  { left: '94%', size: 20, duration: 14, delay: 7 },
]
const FISH = [
  { top: '18%', fontSize: '1.6rem', duration: 20, delay: 0,  emoji: '🐠' },
  { top: '52%', fontSize: '1.2rem', duration: 28, delay: 9,  emoji: '🐟' },
  { top: '33%', fontSize: '1.8rem', duration: 24, delay: 16, emoji: '🐡' },
]
const STARS = [
  { left: '5%',  top: '8%',  size: 1.5, duration: 2.8, delay: 0 },
  { left: '12%', top: '22%', size: 1,   duration: 3.5, delay: 0.7 },
  { left: '20%', top: '5%',  size: 2,   duration: 2.2, delay: 1.2 },
  { left: '28%', top: '15%', size: 1,   duration: 4.0, delay: 0.3 },
  { left: '38%', top: '9%',  size: 1.5, duration: 3.1, delay: 1.8 },
  { left: '47%', top: '3%',  size: 1,   duration: 2.6, delay: 0.5 },
  { left: '55%', top: '18%', size: 2,   duration: 3.8, delay: 1.0 },
  { left: '64%', top: '7%',  size: 1,   duration: 2.4, delay: 2.1 },
  { left: '72%', top: '13%', size: 1.5, duration: 3.3, delay: 0.9 },
  { left: '80%', top: '4%',  size: 1,   duration: 4.2, delay: 1.5 },
  { left: '88%', top: '20%', size: 2,   duration: 2.9, delay: 0.2 },
  { left: '93%', top: '10%', size: 1,   duration: 3.6, delay: 1.7 },
  { left: '15%', top: '40%', size: 1,   duration: 5.0, delay: 2.5 },
  { left: '42%', top: '35%', size: 1.5, duration: 4.5, delay: 1.3 },
  { left: '70%', top: '42%', size: 1,   duration: 3.9, delay: 0.6 },
  { left: '85%', top: '38%', size: 1.5, duration: 2.7, delay: 2.0 },
]

export default function OceanBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <div className="milky-way" style={{ left: '-10%', top: '10%', width: '120%', height: '35%' }} />
      {STARS.map((s, i) => (
        <div key={`s${i}`} className="star" style={{
          left: s.left, top: s.top, width: s.size, height: s.size,
          animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`,
        }} />
      ))}
      {BUBBLES.map((b, i) => (
        <div key={`b${i}`} className="ocean-bubble" style={{
          left: b.left, bottom: '-5%', width: b.size, height: b.size,
          animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s`,
        }} />
      ))}
      {FISH.map((f, i) => (
        <div key={`f${i}`} className="ocean-fish" style={{
          top: f.top, animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s`,
        }}>
          <span style={{ display: 'inline-block', transform: 'scaleX(-1)', fontSize: f.fontSize }}>{f.emoji}</span>
        </div>
      ))}
    </div>
  )
}
