import { getVocabBookData, type VocabUnit } from './data/vocabBooks'

interface Props {
  onStartDefender: (bookId: string, unit: VocabUnit) => void
}

const FIRST_LEVEL_BOOK = 'g3-1'
const FIRST_LEVEL_UNIT = 1

export default function GamePage({ onStartDefender }: Props) {
  const data = getVocabBookData(FIRST_LEVEL_BOOK)
  const unit1 = data?.units.find(u => u.unit === FIRST_LEVEL_UNIT) ?? null

  return (
    <div className="mobile-words-grid flex flex-col min-h-0 flex-1 overflow-hidden">
      <header className="mobile-words-page__header shrink-0 px-4 pt-3 pb-3 safe-top">
        <h1 className="text-base font-black text-white">游戏中心</h1>
        <p className="text-xs text-white/50 mt-0.5">边玩边学 · 闯关获取经验</p>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 min-h-0 flex flex-col gap-3">
        {/* 飞船防御战 · 第 1 关 */}
        <button
          type="button"
          className="game-card game-card--defender"
          disabled={!unit1}
          onClick={() => unit1 && onStartDefender(FIRST_LEVEL_BOOK, unit1)}
        >
          <div className="game-card__icon">🛸</div>
          <div className="game-card__body">
            <div className="game-card__title">字母飞船防御战</div>
            <div className="game-card__sub">PEP 三年级上册 · Unit 1 · {unit1?.words.length ?? 0} 词</div>
            <div className="game-card__tag">第 1 关 · 已解锁</div>
          </div>
          <span className="game-card__arrow">▶</span>
        </button>

        {/* 即将上线的占位卡 */}
        {[
          { id: 2, label: 'Unit 2 · 家人', emoji: '👨‍👩‍👧' },
          { id: 3, label: 'Unit 3 · 动物', emoji: '🐼' },
          { id: 4, label: 'Unit 4 · 植物', emoji: '🌱' },
        ].map(l => (
          <div key={l.id} className="game-card game-card--locked">
            <div className="game-card__icon">{l.emoji}</div>
            <div className="game-card__body">
              <div className="game-card__title">字母飞船防御战</div>
              <div className="game-card__sub">{l.label}</div>
              <div className="game-card__tag game-card__tag--lock">第 {l.id} 关 · 即将上线</div>
            </div>
            <span className="game-card__arrow">🔒</span>
          </div>
        ))}
      </div>
    </div>
  )
}
