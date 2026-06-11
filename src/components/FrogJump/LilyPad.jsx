// 荷叶 SVG + 单词文字
// state: pending | target | passed | wrong
// displayText: 实际显示文字（默认 word，可传中文）
// revealed: 是否已揭晓英文（拼写完成瞬间的状态）
export default function LilyPad({ word, state = 'pending', typedPrefix = '', size = 130, displayText, revealed = false }) {
  const showText = displayText ?? word
  // 中文文字字体放大
  const isChinese = /[一-龥]/.test(showText || '')
  const glow = state === 'target'
  const passed = state === 'passed'
  const wrong = state === 'wrong'

  const main = passed ? '#fbbf24' : wrong ? '#ef4444' : '#22c55e'
  const dark = passed ? '#b45309' : wrong ? '#991b1b' : '#15803d'
  const light = passed ? '#fde68a' : wrong ? '#fca5a5' : '#86efac'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* 荷叶 SVG */}
      <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full" style={glow ? { filter: 'drop-shadow(0 0 12px rgba(255,235,59,0.85))' } : undefined}>
        {/* 阴影 */}
        <ellipse cx="60" cy="110" rx="42" ry="6" fill="rgba(0,0,0,0.25)" />
        {/* 荷叶主体（带 V 形缺口） */}
        <path
          d="M 60 18 C 92 18, 108 48, 102 78 C 96 102, 78 110, 60 110 L 56 70 L 60 110 C 42 110, 24 102, 18 78 C 12 48, 28 18, 60 18 Z"
          fill={main}
          stroke={dark}
          strokeWidth="1.5"
        />
        {/* 叶脉 */}
        {[-50, -25, 0, 25, 50].map((deg, i) => (
          <line key={i} x1="60" y1="60" x2={60 + Math.sin(deg * Math.PI / 180) * 42} y2={60 + Math.cos(deg * Math.PI / 180) * 42}
            stroke={dark} strokeWidth="0.8" opacity="0.4" />
        ))}
        {/* 中心高光 */}
        <ellipse cx="48" cy="48" rx="14" ry="6" fill={light} opacity="0.55" />
        {/* 目标脉冲圈 */}
        {glow && (
          <circle cx="60" cy="60" r="50" fill="none" stroke="#fde047" strokeWidth="2" opacity="0.8">
            <animate attributeName="r" from="48" to="58" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.9" to="0" dur="1.2s" repeatCount="indefinite" />
          </circle>
        )}
        {/* 通过 ⭐ */}
        {passed && (
          <text x="60" y="35" textAnchor="middle" fontSize="18" fill="#fff" stroke="#b45309" strokeWidth="1.5" style={{ paintOrder: 'stroke' }}>⭐</text>
        )}
      </svg>

      {/* 单词文字 */}
      <div className="relative z-10 flex flex-col items-center pointer-events-none px-2"
        style={{ marginTop: 6, maxWidth: '90%' }}>
        <div className="font-extrabold leading-none text-center transition-all duration-200"
          style={{
            fontSize: isChinese
              ? Math.max(14, Math.min(24, 110 / Math.max(2, showText.length)))
              : Math.max(12, Math.min(22, 180 / Math.max(4, (showText || '').length))),
            color: '#fff',
            WebkitTextStroke: '1.5px #1a1a1a',
            paintOrder: 'stroke',
            letterSpacing: isChinese ? '1px' : '0.5px',
            animation: revealed ? 'pad-reveal 0.5s ease-out' : undefined,
          }}>
          {/* 揭晓后强制显示 word；目标且不显示中文时显示进度高亮 */}
          {revealed ? (
            word
          ) : glow && typedPrefix && !isChinese ? (
            <>
              <span style={{ color: '#fde047' }}>{typedPrefix}</span>
              <span style={{ opacity: 0.55 }}>{(showText || '').slice(typedPrefix.length)}</span>
            </>
          ) : (
            showText
          )}
        </div>
      </div>
      <style>{`
        @keyframes pad-reveal {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); color: #fde047; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
