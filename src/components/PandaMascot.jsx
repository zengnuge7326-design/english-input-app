// 熊猫陪练吉祥物。4 种表情：idle（待命）/ listening（捧耳听）/ correct（拍手）/ wrong（歪头）
// 用法：<PandaMascot mood="listening" size={120} />

export default function PandaMascot({ mood = 'idle', size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      className={`panda-${mood}`}>
      {/* 阴影 */}
      <ellipse cx="100" cy="186" rx="50" ry="6" fill="#000" opacity="0.25"/>

      {/* 耳朵 */}
      <ellipse cx="48" cy="56" rx="20" ry="22" fill="#1f2937" stroke="#0f172a" strokeWidth="2.5"/>
      <ellipse cx="152" cy="56" rx="20" ry="22" fill="#1f2937" stroke="#0f172a" strokeWidth="2.5"/>
      <ellipse cx="48" cy="56" rx="9" ry="11" fill="#374151"/>
      <ellipse cx="152" cy="56" rx="9" ry="11" fill="#374151"/>

      {/* 脸 */}
      <ellipse cx="100" cy="108" rx="62" ry="58" fill="#f9fafb" stroke="#1f2937" strokeWidth="3"/>

      {/* 眼周黑斑 — 不同 mood 不同形状 */}
      {mood === 'correct' ? (
        <>
          {/* happy closed eyes - upward curve */}
          <path d="M64 96 Q80 84 88 100" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" fill="none"/>
          <path d="M112 100 Q120 84 136 96" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" fill="none"/>
        </>
      ) : mood === 'wrong' ? (
        <>
          {/* sad slanted eyes */}
          <ellipse cx="76" cy="100" rx="13" ry="16" fill="#1f2937" transform="rotate(-25 76 100)"/>
          <ellipse cx="124" cy="100" rx="13" ry="16" fill="#1f2937" transform="rotate(25 124 100)"/>
          <circle cx="76" cy="100" r="4" fill="white"/>
          <circle cx="124" cy="100" r="4" fill="white"/>
          <circle cx="74" cy="98" r="1.5" fill="#1f2937"/>
          <circle cx="122" cy="98" r="1.5" fill="#1f2937"/>
          {/* tear */}
          <path d="M86 116 Q88 124 86 130 Q82 124 86 116 Z" fill="#60a5fa" opacity="0.8"/>
        </>
      ) : mood === 'listening' ? (
        <>
          {/* alert wide eyes */}
          <ellipse cx="76" cy="98" rx="14" ry="17" fill="#1f2937" transform="rotate(-15 76 98)"/>
          <ellipse cx="124" cy="98" rx="14" ry="17" fill="#1f2937" transform="rotate(15 124 98)"/>
          <circle cx="76" cy="96" r="6" fill="white"/>
          <circle cx="124" cy="96" r="6" fill="white"/>
          <circle cx="77" cy="95" r="3" fill="#1f2937"/>
          <circle cx="125" cy="95" r="3" fill="#1f2937"/>
          <circle cx="78" cy="93" r="1.2" fill="white"/>
          <circle cx="126" cy="93" r="1.2" fill="white"/>
        </>
      ) : (
        <>
          {/* idle */}
          <ellipse cx="76" cy="100" rx="13" ry="16" fill="#1f2937" transform="rotate(-15 76 100)"/>
          <ellipse cx="124" cy="100" rx="13" ry="16" fill="#1f2937" transform="rotate(15 124 100)"/>
          <circle cx="76" cy="100" r="5" fill="white"/>
          <circle cx="124" cy="100" r="5" fill="white"/>
          <circle cx="77" cy="99" r="2.5" fill="#1f2937"/>
          <circle cx="125" cy="99" r="2.5" fill="#1f2937"/>
          <circle cx="78" cy="97" r="1" fill="white"/>
          <circle cx="126" cy="97" r="1" fill="white"/>
        </>
      )}

      {/* 鼻子 */}
      <ellipse cx="100" cy="124" rx="7" ry="5" fill="#1f2937"/>

      {/* 嘴 - 不同 mood */}
      {mood === 'correct' ? (
        <path d="M86 134 Q100 152 114 134" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" fill="#7c2d12"/>
      ) : mood === 'wrong' ? (
        <path d="M88 144 Q100 134 112 144" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" fill="none"/>
      ) : mood === 'listening' ? (
        <ellipse cx="100" cy="140" rx="6" ry="4" fill="#1f2937"/>
      ) : (
        <path d="M88 138 Q100 144 112 138" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      )}

      {/* 腮红 */}
      <circle cx="58" cy="130" r="9" fill="#fb7185" opacity="0.55"/>
      <circle cx="142" cy="130" r="9" fill="#fb7185" opacity="0.55"/>

      {/* 手 - listening 状态时捧耳；correct 状态时举手；其他状态不画手 */}
      {mood === 'listening' && (
        <>
          <ellipse cx="36" cy="84" rx="14" ry="10" fill="#1f2937" stroke="#0f172a" strokeWidth="2" transform="rotate(-30 36 84)"/>
          <ellipse cx="164" cy="84" rx="14" ry="10" fill="#1f2937" stroke="#0f172a" strokeWidth="2" transform="rotate(30 164 84)"/>
          {/* 声波 */}
          <path d="M14 70 Q22 80 14 90" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" fill="none" className="panda-wave-l"/>
          <path d="M186 70 Q178 80 186 90" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" fill="none" className="panda-wave-r"/>
        </>
      )}
      {mood === 'correct' && (
        <>
          <ellipse cx="34" cy="70" rx="12" ry="14" fill="#1f2937" stroke="#0f172a" strokeWidth="2" transform="rotate(-45 34 70)"/>
          <ellipse cx="166" cy="70" rx="12" ry="14" fill="#1f2937" stroke="#0f172a" strokeWidth="2" transform="rotate(45 166 70)"/>
          {/* 星星 */}
          <text x="22" y="46" fontSize="22" fill="#fbbf24">✦</text>
          <text x="160" y="40" fontSize="22" fill="#fbbf24">✦</text>
          <text x="84" y="32" fontSize="18" fill="#fde047">✦</text>
        </>
      )}
    </svg>
  )
}
