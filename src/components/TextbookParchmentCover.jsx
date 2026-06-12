import './textbook-parchment.css'

function CornerOrnament({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2 2h6v2H4v4H2V2zm0 20v-6h2v4h4v2H2zm20-20h-6v2h4v4h2V2zm0 20v-6h-2v4h-4v2h6z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M3 3c4 2 6 5 6 9M3 21c4-2 6-5 6-9M21 3c-4 2-6 5-6 9M21 21c-4-2-6-5-6-9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

/**
 * @param {{ gradient: string, label?: string, coverText?: string, subject?: string, emoji?: string | null, variant?: 'grid' | 'compact' }} props
 */
export default function TextbookParchmentCover({
  gradient,
  label = '北师大版',
  coverText = '',
  subject = '高中英语',
  emoji = null,
  variant = 'grid',
}) {
  const isGrid = variant === 'grid'

  return (
    <div className="textbook-parchment absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40`} />
      <div className="textbook-parchment__paper absolute inset-0" />
      <div className="textbook-parchment__grain absolute inset-0" aria-hidden />

      <div className={`textbook-parchment__frame absolute ${isGrid ? 'inset-2' : 'inset-1'}`} aria-hidden>
        <div className="textbook-parchment__frame-inner" />
      </div>

      <CornerOrnament className={`textbook-parchment__corner textbook-parchment__corner--tl ${isGrid ? 'w-7 h-7' : 'w-4 h-4'}`} />
      <CornerOrnament className={`textbook-parchment__corner textbook-parchment__corner--tr ${isGrid ? 'w-7 h-7' : 'w-4 h-4'}`} />
      <CornerOrnament className={`textbook-parchment__corner textbook-parchment__corner--bl ${isGrid ? 'w-7 h-7' : 'w-4 h-4'}`} />
      <CornerOrnament className={`textbook-parchment__corner textbook-parchment__corner--br ${isGrid ? 'w-7 h-7' : 'w-4 h-4'}`} />

      <div
        className={`absolute flex flex-col items-center justify-center text-center ${
          isGrid ? 'inset-2 p-3' : 'inset-1 p-2'
        }`}
      >
        <span
          className={`text-white/90 font-bold tracking-widest opacity-90 drop-shadow-sm ${
            isGrid ? 'text-xs mb-3' : 'text-[9px] mb-1.5'
          }`}
        >
          {label}
        </span>
        <span
          className={`text-white font-black tracking-widest drop-shadow-md ${
            isGrid ? 'text-3xl mb-2' : 'text-base mb-1.5'
          }`}
        >
          {emoji ? (
            <span className={`block leading-none ${isGrid ? 'text-4xl' : 'text-2xl'}`} aria-hidden>{emoji}</span>
          ) : (
            coverText
          )}
        </span>
        <span
          className={`text-white/80 font-semibold tracking-wider mt-auto opacity-80 drop-shadow-sm ${
            isGrid ? 'text-sm' : 'text-[10px]'
          }`}
        >
          {subject}
        </span>
      </div>
    </div>
  )
}
