interface Props {
  index: number
  className?: string
}

/** 书籍封面 SVG，色调跟随当前 Tab 主题（--theme-accent） */
export default function BookCoverIcon({ index, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="8" y="6" width="32" height="36" rx="3" fill="var(--theme-cover, var(--theme-accent))" opacity="0.85" />
      <path d="M8 9c0-1.1.9-2 2-2h6v34h-6c-1.1 0-2-.9-2-2V9z" fill="var(--theme-accent-deep, var(--theme-accent))" />
      <rect x="18" y="14" width="16" height="2.5" rx="1.25" fill="rgba(255,255,255,0.55)" />
      <rect x="18" y="20" width="12" height="2" rx="1" fill="rgba(255,255,255,0.35)" />
      <rect x="18" y="25" width="14" height="2" rx="1" fill="rgba(255,255,255,0.35)" />
      <text x="24" y="36" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7" fontWeight="700">{index}</text>
      <path d="M36 8v32" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  )
}
