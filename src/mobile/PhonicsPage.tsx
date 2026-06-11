const VOWELS = [
  { symbol: 'æ', example: 'cat', word: 'at' },
  { symbol: 'aʊ', example: 'out', word: 'out' },
  { symbol: 'æ', example: 'lad', word: 'lad' },
  { symbol: 'aʊ', example: 'loud', word: 'loud' },
  { symbol: 'ɪ', example: 'ship', word: 'ship' },
  { symbol: 'i', example: 'sheep', word: 'sheep' },
  { symbol: 'ɛ', example: 'bed', word: 'bed' },
  { symbol: 'eɪ', example: 'say', word: 'say' },
]

interface Props {
  onStartLesson: () => void
  onPlayWord?: (word: string) => void
}

export default function PhonicsPage({ onStartLesson, onPlayWord }: Props) {
  return (
    <div className="mobile-phonics-page flex flex-col min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <header className="mobile-phonics-page__header shrink-0 px-4 pt-3 pb-3 safe-top">
        <h1 className="text-xl font-black text-white">音标</h1>
        <p className="text-xs text-white/55 mt-0.5">元音发音 · 磨耳朵练辨音</p>
      </header>

      <div className="px-4 pb-4 flex flex-col gap-4">
        <div className="mobile-phonics-page__hero">
          <p className="font-bold text-white text-sm">本课重点</p>
          <p className="text-white/75 text-xs mt-1">区分短元音 æ 与双元音 aʊ</p>
          <button
            type="button"
            onClick={onStartLesson}
            className="mobile-phonics-page__start mt-3 w-full"
          >
            开始元音练习 +15 经验
          </button>
        </div>

        <section>
          <h2 className="mobile-phonics-page__section-title">元音</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {VOWELS.map((v, i) => (
              <button
                key={`${v.symbol}-${v.word}-${i}`}
                type="button"
                onClick={() => onPlayWord?.(v.word)}
                className="mobile-phonics-page__card"
              >
                <span className="mobile-phonics-page__symbol">/{v.symbol}/</span>
                <span className="text-xs text-white/50">{v.example}</span>
                <span className="font-bold text-white">{v.word}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
