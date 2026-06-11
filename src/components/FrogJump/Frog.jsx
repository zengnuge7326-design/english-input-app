// 俯视青蛙：朝上跳，跳跃时 4 条腿张开伸展
// state: idle | crouch | jump | land | drown
export default function Frog({ state = 'idle', wet = false }) {
  const isJump = state === 'jump'
  const isCrouch = state === 'crouch'
  const isLand = state === 'land'
  const isDrown = state === 'drown'

  const skin = wet || isDrown ? '#3f8a3f' : '#4ade80'
  const skinDark = wet || isDrown ? '#2a5e2a' : '#16a34a'
  const skinLight = wet || isDrown ? '#7fb87f' : '#86efac'
  const belly = '#fefce8'

  // 腿的角度：跳跃时往外张大，蹲着时收紧
  const hindAngle = isJump ? 55 : isCrouch ? 15 : 35
  const frontAngle = isJump ? 45 : isCrouch ? 10 : 25
  // 腿伸长（跳跃时）
  const hindLen = isJump ? 14 : isCrouch ? 7 : 10
  const frontLen = isJump ? 9 : isCrouch ? 5 : 7

  // 整体缩放：蹲下压扁，落地弹起
  const bodyScale = isCrouch ? 'scale(1.1, 0.85)' : isLand ? 'scale(1.15, 0.82)' : isJump ? 'scale(0.92, 1.08)' : 'scale(1, 1)'

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none drop-shadow-lg overflow-visible">
      <g style={{ transform: bodyScale, transformOrigin: 'center', transition: 'transform .12s ease' }}>
        {/* 后腿（左右各一，朝身体后下方） */}
        <ellipse cx="20" cy="70" rx={hindLen} ry={hindLen * 0.5} fill={skinDark}
          transform={`rotate(${-hindAngle} 20 70)`}
          style={{ transition: 'all .12s ease' }} />
        <ellipse cx="80" cy="70" rx={hindLen} ry={hindLen * 0.5} fill={skinDark}
          transform={`rotate(${hindAngle} 80 70)`}
          style={{ transition: 'all .12s ease' }} />
        {/* 后蹼（脚掌） */}
        <ellipse cx={isJump ? 6 : 13} cy={isJump ? 86 : 80} rx="4" ry="2.5" fill={skin}
          transform={`rotate(${-hindAngle} 13 80)`}
          style={{ transition: 'all .12s ease' }} />
        <ellipse cx={isJump ? 94 : 87} cy={isJump ? 86 : 80} rx="4" ry="2.5" fill={skin}
          transform={`rotate(${hindAngle} 87 80)`}
          style={{ transition: 'all .12s ease' }} />

        {/* 前腿（更短，朝前侧外） */}
        <ellipse cx="32" cy="38" rx={frontLen} ry={frontLen * 0.45} fill={skinDark}
          transform={`rotate(${-frontAngle} 32 38)`}
          style={{ transition: 'all .12s ease' }} />
        <ellipse cx="68" cy="38" rx={frontLen} ry={frontLen * 0.45} fill={skinDark}
          transform={`rotate(${frontAngle} 68 38)`}
          style={{ transition: 'all .12s ease' }} />

        {/* 身体椭圆（俯视，纵向稍长） */}
        <ellipse cx="50" cy="56" rx="30" ry="32" fill={skin} />
        {/* 背部纹路高光 */}
        <ellipse cx="50" cy="46" rx="20" ry="8" fill={skinLight} opacity="0.5" />
        {/* 肚皮（俯视看到下半部分） */}
        <ellipse cx="50" cy="72" rx="22" ry="12" fill={belly} opacity={wet ? 0.5 : 1} />

        {/* 头部凸起（顶端） */}
        <ellipse cx="50" cy="32" rx="26" ry="18" fill={skin} />

        {/* 眼睛凸起（顶部两侧，俯视像两个小山丘） */}
        <circle cx="38" cy="20" r="10" fill={skin} />
        <circle cx="62" cy="20" r="10" fill={skin} />
        {/* 眼白 */}
        <circle cx="38" cy="18" r="6.5" fill="#fff" />
        <circle cx="62" cy="18" r="6.5" fill="#fff" />
        {/* 瞳孔（朝向前方/上方） */}
        {isDrown ? (
          <>
            <line x1="33" y1="18" x2="43" y2="18" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <line x1="57" y1="18" x2="67" y2="18" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="38" cy={isJump ? 16 : 18} r={isJump ? 2.5 : 3.2} fill="#1a1a1a" />
            <circle cx="62" cy={isJump ? 16 : 18} r={isJump ? 2.5 : 3.2} fill="#1a1a1a" />
            <circle cx="39.5" cy="16.5" r="1" fill="#fff" />
            <circle cx="63.5" cy="16.5" r="1" fill="#fff" />
          </>
        )}

        {/* 嘴巴 */}
        {isJump ? (
          <ellipse cx="50" cy="38" rx="5" ry="3.5" fill="#7c2d12" />
        ) : (
          <path d={isDrown ? "M 42 40 Q 50 36 58 40" : "M 40 38 Q 50 46 60 38"}
            stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* 红晕 */}
        <circle cx="28" cy="40" r="3.5" fill="#ec4899" opacity="0.3" />
        <circle cx="72" cy="40" r="3.5" fill="#ec4899" opacity="0.3" />

        {/* 鼻孔 */}
        <circle cx="46" cy="30" r="0.8" fill="#1a1a1a" />
        <circle cx="54" cy="30" r="0.8" fill="#1a1a1a" />
      </g>
    </svg>
  )
}
