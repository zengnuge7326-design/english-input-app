/**
 * OK 英语吉祥物 — 熊猫比 OK 手势
 * 蓝→紫渐变圆角方形底，白胖熊猫，黑耳黑眼罩，OK 手势
 */
import { useId } from 'react'

export default function PandaLogo({ size = 40, className = '', style }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="OK英语 熊猫吉祥物"
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="55%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <radialGradient id={`${uid}-shine`} cx="0.3" cy="0.25" r="0.7">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* 圆角方形底 — 填满 viewBox，无白边 */}
      <rect width="64" height="64" rx="16" fill={`url(#${uid}-bg)`} />
      <rect width="64" height="64" rx="16" fill={`url(#${uid}-shine)`} />
      {/* 耳朵 */}
      <ellipse cx="20" cy="20" rx="6.5" ry="6.5" fill="#1f2937" />
      <ellipse cx="44" cy="20" rx="6.5" ry="6.5" fill="#1f2937" />
      <ellipse cx="20" cy="20" rx="3" ry="3" fill="#374151" />
      <ellipse cx="44" cy="20" rx="3" ry="3" fill="#374151" />
      {/* 脸 */}
      <ellipse cx="32" cy="32" rx="18" ry="16.5" fill="white" />
      {/* 眼罩 */}
      <ellipse cx="25" cy="30" rx="4.2" ry="5.2" fill="#1f2937" transform="rotate(-12 25 30)" />
      <ellipse cx="39" cy="30" rx="4.2" ry="5.2" fill="#1f2937" transform="rotate(12 39 30)" />
      {/* 眼睛 */}
      <circle cx="25.5" cy="30.5" r="1.6" fill="white" />
      <circle cx="38.5" cy="30.5" r="1.6" fill="white" />
      <circle cx="25.8" cy="30.7" r="0.7" fill="#1f2937" />
      <circle cx="38.8" cy="30.7" r="0.7" fill="#1f2937" />
      {/* 鼻子 */}
      <ellipse cx="32" cy="36" rx="1.8" ry="1.4" fill="#1f2937" />
      {/* 嘴 */}
      <path d="M 28 39 Q 32 42 36 39" stroke="#1f2937" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* 腮红 */}
      <circle cx="20" cy="37" r="2.2" fill="#fda4af" opacity="0.55" />
      <circle cx="44" cy="37" r="2.2" fill="#fda4af" opacity="0.55" />
      {/* OK 手势（右下角） */}
      <g transform="translate(45,44)">
        <circle r="6" fill="white" stroke="#1f2937" strokeWidth="1" />
        <circle r="2.4" fill={`url(#${uid}-bg)`} />
      </g>
    </svg>
  )
}
