export default function SentenceList({ sentences, progress, onSelect }) {
  const counts = sentences.reduce((acc, s) => {
    const st = progress[`sentence_${s.id}`]?.status || 'new'
    acc[st] = (acc[st] || 0) + 1
    return acc
  }, {})

  const done = (counts.mastered || 0) + (counts.review || 0)

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Summary bar */}
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>✓ 已完成: <span className="text-green-400 font-medium">{done}</span></span>
        <span>待完成: <span className="text-gray-300 font-medium">{counts.new || 0}</span></span>
        <span className="text-gray-600">共 {sentences.length} 句</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sentences.map((s, i) => {
          const st = progress[`sentence_${s.id}`]?.status || 'new'
          const attempts = progress[`sentence_${s.id}`]?.attempts || 0
          const done = st === 'mastered' || st === 'review'

          return (
            <button
              key={s.id}
              onClick={() => onSelect(i)}
              className="text-left bg-gray-900 border border-gray-700 rounded-xl p-3 hover:border-gray-500 transition-colors flex flex-col justify-between gap-3 min-h-[90px]"
            >
              {/* Top row: title + badge */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-white text-sm font-medium leading-snug line-clamp-2">{s.zh}</span>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${done ? 'text-green-400 border-green-600' : 'text-orange-400 border-orange-600'}`}>
                  {done ? '已完成练习' : '待完成练习'}
                </span>
              </div>

              {/* Bottom row: attempts + number */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>✓ 已完成 {attempts} 次</span>
                <span className="text-gray-600 font-mono">#{i + 1}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
