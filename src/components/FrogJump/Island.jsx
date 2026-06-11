// 终点岛屿 — 比荷叶更大、带椰子树、有金光彩带
export default function Island({ size = 200 }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 0 18px rgba(255,215,0,0.7))' }}>
        {/* 阴影 */}
        <ellipse cx="100" cy="178" rx="70" ry="10" fill="rgba(0,0,0,0.3)" />
        {/* 沙滩外圈 */}
        <ellipse cx="100" cy="135" rx="78" ry="36" fill="#fde68a" />
        <ellipse cx="100" cy="135" rx="78" ry="36" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />
        {/* 草地 */}
        <ellipse cx="100" cy="120" rx="60" ry="22" fill="#86efac" />
        <ellipse cx="100" cy="115" rx="55" ry="16" fill="#4ade80" opacity="0.7" />
        {/* 椰子树树干 */}
        <path d="M 95 120 Q 92 90 96 65 Q 100 50 105 65 Q 108 90 105 120 Z" fill="#92400e" />
        <line x1="97" y1="90" x2="99" y2="100" stroke="#78350f" strokeWidth="0.5" />
        {/* 椰子树叶子 */}
        <ellipse cx="80" cy="55" rx="22" ry="8" fill="#16a34a" transform="rotate(-20 80 55)" />
        <ellipse cx="120" cy="55" rx="22" ry="8" fill="#16a34a" transform="rotate(20 120 55)" />
        <ellipse cx="100" cy="42" rx="20" ry="7" fill="#22c55e" />
        <ellipse cx="78" cy="62" rx="18" ry="6" fill="#15803d" transform="rotate(-35 78 62)" />
        <ellipse cx="122" cy="62" rx="18" ry="6" fill="#15803d" transform="rotate(35 122 62)" />
        {/* 椰子 */}
        <circle cx="92" cy="58" r="3.5" fill="#78350f" />
        <circle cx="108" cy="60" r="3.5" fill="#78350f" />
        {/* 旗杆 + 旗子 */}
        <line x1="135" y1="115" x2="135" y2="80" stroke="#475569" strokeWidth="1.5" />
        <path d="M 135 80 L 155 86 L 135 92 Z" fill="#ef4444" />
        {/* 闪光 */}
        <circle cx="60" cy="100" r="2" fill="#fde047">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="105" r="2.5" fill="#fde047">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="148" r="1.8" fill="#fde047">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="0.9s" repeatCount="indefinite" />
        </circle>
        {/* 文字 */}
        <text x="100" y="160" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff"
          stroke="#92400e" strokeWidth="2" style={{ paintOrder: 'stroke' }}>
          终点
        </text>
      </svg>
    </div>
  )
}
