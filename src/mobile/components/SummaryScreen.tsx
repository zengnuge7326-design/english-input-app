import { motion } from 'framer-motion'
import GemSVG from '../../components/GemSVG'
import type { GemReward } from '../data/mobileCrystalRules'

interface Props {
  title: string
  xpEarned: number
  correct: number
  total: number
  gemsEarned?: GemReward[]
  onContinue: () => void
}

export default function SummaryScreen({
  title,
  xpEarned,
  correct,
  total,
  gemsEarned = [],
  onContinue,
}: Props) {
  const pct = total ? Math.round((correct / total) * 100) : 0
  const gemTotal = gemsEarned.reduce((s, g) => s + g.amount, 0)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mobile-summary-screen flex flex-col items-center justify-center flex-1 px-6 py-10 text-center text-white"
    >
      <motion.div
        initial={{ rotate: -8, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="text-6xl mb-4"
      >
        🏝️
      </motion.div>
      <h2 className="text-2xl font-black text-white mb-1">关卡完成！</h2>
      <p className="text-white/65 mb-6">{title}</p>

      {gemsEarned.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          {gemsEarned.map((g, i) => (
            <div
              key={`${g.reason}-${i}`}
              className="result-gem-in flex flex-col items-center gap-0.5"
              style={{ animationDelay: `${0.15 + i * 0.2}s` }}
            >
              <GemSVG color={g.color} size={48} />
              <span className="text-sm font-black text-white tabular-nums">+{g.amount}</span>
            </div>
          ))}
        </div>
      )}

      <div className={`grid gap-3 w-full max-w-sm mb-8 ${gemTotal > 0 ? 'grid-cols-3' : 'grid-cols-3'}`}>
        <div className="rounded-2xl bg-white/90 p-4 border border-white">
          <div className="text-2xl font-black text-[#3ecf8e]">{correct}/{total}</div>
          <div className="text-xs text-[#7a8a9a] mt-1">正确</div>
        </div>
        <div className="rounded-2xl bg-white/90 p-4 border border-white">
          <div className="text-2xl font-black text-[#5a9cf5]">{pct}%</div>
          <div className="text-xs text-[#7a8a9a] mt-1">得分</div>
        </div>
        <div className="rounded-2xl bg-white/90 p-4 border border-white">
          <div className="text-2xl font-black text-[#f5b942]">+{xpEarned}</div>
          <div className="text-xs text-[#7a8a9a] mt-1">经验</div>
        </div>
      </div>

      {gemTotal > 0 && (
        <p className="text-sm text-white/65 mb-4 font-semibold">共获得 {gemTotal} 颗宝石</p>
      )}

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onContinue}
        className="w-full max-w-sm py-4 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-[#4ecdc4] to-[#3bb3ab] shadow-lg"
      >
        返回地图
      </motion.button>
    </motion.div>
  )
}
