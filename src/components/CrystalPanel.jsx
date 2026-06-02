/**
 * 钻石面板：点击顶部 💎 徽章后弹出
 * - 五色分别显示数量
 * - 钻石塔等级 + 总数
 * - 最近流水 20 条
 * - 各色解释（教学）
 */
import { useEffect, useState } from 'react'
import { COLOR_META } from '../hooks/useCrystal'
import GemSVG from './GemSVG'

const REASON_LABEL = {
  unit_complete:  '完成单元',
  combo_5:        '5 连击',
  combo_10:       '10 连击',
  combo_20:       '20 连击',
  sentence_clean: '一句无错',
  sentence_recover: '错后坚持',
  sync_done:      '同步习题完成',
  sync_perfect:   '同步习题全对',
  sync_correct:   '同步答对',
  daily_login:    '每日登录',
  member_bonus:   '会员奖励',
  redeem_pet:     '兑换宠物',
  redeem_theme:   '兑换主题',
  unknown:        '未知',
}

function reasonText(r) {
  return REASON_LABEL[r] || r
}

export default function CrystalPanel({ crystal, onClose }) {
  const [log, setLog] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    crystal.getLog(20).then(items => {
      if (alive) { setLog(items); setLoading(false) }
    })
    return () => { alive = false }
  }, [crystal])

  const total = crystal.total
  const nextLevel = (crystal.towerLevel + 1) * 100
  const needForNext = nextLevel - total

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-5 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GemSVG color="blue" size={24} />
            <span>钻石收藏</span>
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white text-xl leading-none">×</button>
        </div>

        {/* 钻石塔 */}
        <div className="px-5 pt-4">
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-700/40 rounded-xl p-4 flex items-center gap-4">
            <div className="text-5xl">🏰</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-indigo-300 mb-0.5">钻石塔</div>
              <div className="text-2xl font-bold text-white">Lv. {crystal.towerLevel}</div>
              <div className="text-xs text-gray-400 mt-1">
                共 <span className="text-white font-semibold">{total}</span> 颗钻石
                {needForNext > 0 && (
                  <span className="ml-1">· 距下一层还需 {needForNext} 颗</span>
                )}
              </div>
              <div className="mt-1.5 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all"
                  style={{ width: `${((total % 100) / 100) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 五色钻石 */}
        <div className="px-5 py-4">
          <div className="grid grid-cols-5 gap-2">
            {['blue', 'green', 'red', 'purple', 'gold'].map(c => {
              const m = COLOR_META[c]
              return (
                <div key={c} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-2 flex flex-col items-center text-center">
                  <GemSVG color={c} size={32} />
                  <div className="text-lg font-bold text-white tabular-nums mt-0.5">{crystal[c]}</div>
                  <div className="text-[10px] text-gray-500 truncate w-full" title={m.desc}>{m.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 获取规则速查 */}
        <div className="px-5 pb-3">
          <details className="bg-gray-800/40 border border-gray-700/40 rounded-lg">
            <summary className="px-3 py-2 text-xs text-gray-400 cursor-pointer select-none hover:text-gray-200">
              📖 怎么获得钻石？
            </summary>
            <div className="px-3 pb-3 text-xs text-gray-300 space-y-1.5">
              <div className="flex items-center gap-1.5"><GemSVG color="blue" size={16} /><span className="text-blue-300">蓝钻石</span>：完成一个单元 +1</div>
              <div className="flex items-center gap-1.5"><GemSVG color="green" size={16} /><span className="text-emerald-300">绿钻石</span>：单元零错误 +1</div>
              <div className="flex items-center gap-1.5"><GemSVG color="red" size={16} /><span className="text-rose-300">红钻石</span>：错后坚持完成本句 +1</div>
              <div className="flex items-center gap-1.5"><GemSVG color="purple" size={16} /><span className="text-purple-300">紫钻石</span>：5连击 +1，10连击 +2</div>
              <div className="flex items-center gap-1.5"><GemSVG color="gold" size={16} /><span className="text-amber-300">金钻石</span>：充值获得（付费货币）</div>
            </div>
          </details>
        </div>

        {/* 流水 */}
        <div className="px-5 pb-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">最近获得</div>
          {loading ? (
            <div className="text-xs text-gray-600 text-center py-4">加载中…</div>
          ) : log.length === 0 ? (
            <div className="text-xs text-gray-600 text-center py-4">还没有钻石记录，开始练习赚取吧！</div>
          ) : (
            <ul className="space-y-1">
              {log.map((item, i) => {
                const ts = item.created_at ? new Date(item.created_at) : new Date(item.ts)
                return (
                  <li key={i} className="flex items-center gap-2 text-xs py-1.5 px-2 rounded hover:bg-gray-800/40">
                    <GemSVG color={item.color} size={20} />
                    <span className="flex-1 text-gray-300 truncate">{reasonText(item.reason)}</span>
                    <span className={`font-semibold tabular-nums ${item.delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.delta > 0 ? '+' : ''}{item.delta}
                    </span>
                    <span className="text-gray-600 text-[10px] w-12 text-right">
                      {ts.getMonth() + 1}/{ts.getDate()}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
