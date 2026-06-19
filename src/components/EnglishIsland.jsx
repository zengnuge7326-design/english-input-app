/**
 * 英语岛 English Island — MVP
 * 学习 → 建设岛屿 → 吸引岛民 → 解锁功能
 */
import { useState, useMemo } from 'react'
import PetAvatar from './PetAvatar'
import { TIER_STYLES, TIER_LABELS } from '../data/pets'

import grade3UpData   from '../data/grade3_up.json'
import grade3DownData from '../data/grade3_down.json'
import grade4UpData   from '../data/grade4_up.json'
import grade4DownData from '../data/grade4_down.json'
import grade5UpData   from '../data/grade5_up.json'
import grade5DownData from '../data/grade5_down.json'
import grade6UpData   from '../data/grade6_up.json'
import grade6DownData from '../data/grade6_down.json'
import duolingoData   from '../data/duolingo.json'

// ── 岛屿区域定义 ─────────────────────────────────────────────
const ZONES = [
  {
    id: 'beach',
    name: '字母沙滩',
    subtitle: 'Alphabet Beach',
    emoji: '🏖️',
    color: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-900/20',
    border: 'border-amber-600/40',
    books: [
      { name: '三年级上册', data: grade3UpData },
      { name: '三年级下册', data: grade3DownData },
    ],
    residents: [
      { petId: 'pet_duck',    name: '小黄鸭',   tier: 'N',   threshold: 0,   fn: '开启每日学习', fnDesc: '每天陪你完成第一个练习，守护连续打卡' },
      { petId: 'pet_cat',     name: '橘猫',     tier: 'N',   threshold: 25,  fn: '错题管家',     fnDesc: '帮你整理近期错句，快速进入针对复习' },
      { petId: 'pet_penguin', name: '帝企鹅',   tier: 'N',   threshold: 60,  fn: '打卡督促师',   fnDesc: '连续打卡时送上专属鼓励和里程碑奖励' },
      { petId: 'pet_shiba',   name: '柴犬',     tier: 'N',   threshold: 100, fn: '解锁保卫战',   fnDesc: '解锁「单词保卫战」塔防小游戏' },
    ],
  },
  {
    id: 'forest',
    name: '单词森林',
    subtitle: 'Vocabulary Forest',
    emoji: '🌲',
    color: 'from-green-600 to-emerald-600',
    bgLight: 'bg-green-900/20',
    border: 'border-green-600/40',
    books: [
      { name: '四年级上册', data: grade4UpData },
      { name: '四年级下册', data: grade4DownData },
    ],
    residents: [
      { petId: 'pet_otter',    name: '小水獭', tier: 'N', threshold: 0,   fn: '词义向导',     fnDesc: '练习时自动展示生词音标和词义卡片' },
      { petId: 'pet_panda',    name: '熊猫',   tier: 'N', threshold: 25,  fn: '成就记录员',   fnDesc: '记录每天的学习成就，生成进步时间轴' },
      { petId: 'pet_fox',      name: '小狐狸', tier: 'N', threshold: 60,  fn: '每日提示+2',   fnDesc: '每天额外获得 2 次单词提示机会' },
      { petId: 'pet_capybara', name: '水豚',   tier: 'N', threshold: 100, fn: 'XP 丰收加成',  fnDesc: '每完成一课额外获得 20% XP 奖励' },
    ],
  },
  {
    id: 'mountain',
    name: '语法山',
    subtitle: 'Grammar Mountain',
    emoji: '⛰️',
    color: 'from-blue-600 to-indigo-600',
    bgLight: 'bg-blue-900/20',
    border: 'border-blue-600/40',
    books: [
      { name: '五年级上册', data: grade5UpData },
      { name: '五年级下册', data: grade5DownData },
    ],
    residents: [
      { petId: 'pet_axolotl',     name: '六角恐龙', tier: 'R',  threshold: 0,   fn: '语法实验室', fnDesc: '解锁「语法专项」互动分析功能' },
      { petId: 'pet_alien',       name: '三眼仔',   tier: 'R',  threshold: 30,  fn: '难句探索者', fnDesc: '解锁进阶难句挑战，突破能力上限' },
      { petId: 'pet_unicorn',     name: '独角兽',   tier: 'R',  threshold: 70,  fn: '彩虹守护者', fnDesc: '完美完成章节时触发彩虹动画奖励' },
      { petId: 'pet_dragon_baby', name: '小恐龙',   tier: 'R',  threshold: 100, fn: '龙族守护者', fnDesc: '获得「语法山之王」专属称号徽章' },
    ],
  },
  {
    id: 'harbor',
    name: '对话港口',
    subtitle: 'Dialogue Harbor',
    emoji: '🏛️',
    color: 'from-purple-600 to-violet-600',
    bgLight: 'bg-purple-900/20',
    border: 'border-purple-600/40',
    books: [
      { name: '六年级上册', data: grade6UpData },
      { name: '六年级下册', data: grade6DownData },
    ],
    residents: [
      { petId: 'pet_shield_dog', name: '刀盾狗',   tier: 'R',  threshold: 0,   fn: '解锁防御战', fnDesc: '解锁「字母飞船防御战」升级版模式' },
      { petId: 'pet_robot',      name: '像素机器人', tier: 'R', threshold: 40,  fn: 'AI 教练',    fnDesc: 'AI 分析你的弱点，推荐个性化练习' },
      { petId: 'pet_lucky_cat',  name: '招财猫',   tier: 'SR', threshold: 80,  fn: '幸运转盘',   fnDesc: '每天一次幸运转盘，赢取水晶和道具' },
    ],
  },
  {
    id: 'plaza',
    name: '多邻国广场',
    subtitle: 'Duolingo Plaza',
    emoji: '🌍',
    color: 'from-teal-500 to-cyan-500',
    bgLight: 'bg-teal-900/20',
    border: 'border-teal-500/40',
    books: [
      { name: '多邻国全课程', data: duolingoData },
    ],
    residents: [
      { petId: 'pet_yellow_chu', name: '电气鼠',   tier: 'SSR', threshold: 0,   fn: '每日能量+1',  fnDesc: '每天额外获得 1 点精力，多学一课' },
      { petId: 'pet_hero_red',   name: '光之巨人', tier: 'SSR', threshold: 25,  fn: 'XP 双倍周末', fnDesc: '周末完成练习，XP 翻倍计算' },
      { petId: 'pet_hero_blue',  name: '蓝色英雄', tier: 'SSR', threshold: 60,  fn: '超级挑战模式', fnDesc: '解锁限时挑战模式，冲击排行榜' },
      { petId: 'pet_dragon_god', name: '龙神',     tier: 'SSR', threshold: 100, fn: '传说学者',    fnDesc: '获得「英语岛传说」最高荣耀称号' },
    ],
  },
]

// ── 进度计算 ─────────────────────────────────────────────────
function calcZoneProgress(zone, progress) {
  let total = 0
  let attempted = 0
  let mastered = 0
  zone.books.forEach(({ data }) => {
    data.forEach(s => {
      total++
      const p = progress[`sentence_${s.id}`]
      if (p?.attempts > 0) attempted++
      if (p?.status === 'mastered') mastered++
    })
  })
  const pct = total > 0 ? Math.round((attempted / total) * 100) : 0
  return { total, attempted, mastered, pct }
}

// ── 居民头像 ─────────────────────────────────────────────────
function ResidentAvatar({ resident, unlocked, owned }) {
  const tierStyle = TIER_STYLES[resident.tier] || TIER_STYLES.N
  return (
    <div className={`relative flex flex-col items-center gap-1 ${unlocked ? '' : 'opacity-40 grayscale'}`}>
      <div className={`rounded-full border-2 overflow-hidden transition-all
        ${unlocked ? tierStyle.card : 'border-gray-700'}
        ${owned && unlocked ? 'ring-2 ring-green-400/60 ring-offset-1 ring-offset-gray-950' : ''}`}
      >
        <PetAvatar petId={resident.petId} size={44} />
      </div>
      {owned && unlocked && (
        <span className="absolute -top-1 -right-1 text-[9px] bg-green-500 text-white px-1 py-0.5 rounded-full font-bold leading-none">住</span>
      )}
      {!unlocked && (
        <span className="absolute -top-1 -right-1 text-[10px] bg-gray-700 text-gray-400 px-1 py-0.5 rounded-full font-bold leading-none">🔒</span>
      )}
    </div>
  )
}

// ── 区域卡片（列表页） ───────────────────────────────────────
function ZoneCard({ zone, stats, ownedPetIds, onClick }) {
  const unlockedCount = zone.residents.filter(r => stats.pct >= r.threshold).length
  const ownedCount = zone.residents.filter(r => ownedPetIds.has(r.petId) && stats.pct >= r.threshold).length

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border ${zone.border} ${zone.bgLight} p-4 hover:brightness-110 transition-all active:scale-[0.98]`}
    >
      {/* Zone header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${zone.color} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
          {zone.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-sm">{zone.name}</div>
          <div className="text-gray-500 text-xs">{zone.subtitle}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold text-white tabular-nums">{stats.pct}%</div>
          <div className="text-xs text-gray-500">{stats.attempted}/{stats.total}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${zone.color} transition-all duration-700`}
          style={{ width: `${stats.pct}%` }}
        />
      </div>

      {/* Residents row */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {zone.residents.map(r => {
            const unlocked = stats.pct >= r.threshold
            const owned = ownedPetIds.has(r.petId)
            return (
              <div key={r.petId} className={`rounded-full border-2 overflow-hidden shrink-0 transition-all
                ${unlocked ? 'border-gray-700' : 'border-gray-800 opacity-35 grayscale'}
                ${owned && unlocked ? 'ring-1 ring-green-400/60' : ''}`}
              >
                <PetAvatar petId={r.petId} size={28} />
              </div>
            )
          })}
        </div>
        <div className="text-xs text-gray-500 ml-1">
          {ownedCount > 0 ? (
            <span className="text-green-400">{ownedCount} 位已入住</span>
          ) : (
            <span>{unlockedCount}/{zone.residents.length} 位已解锁</span>
          )}
        </div>
        <div className="ml-auto text-gray-600 text-sm">›</div>
      </div>
    </button>
  )
}

// ── 区域详情页 ───────────────────────────────────────────────
function ZoneDetail({ zone, stats, ownedPetIds, onBack }) {
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className={`rounded-2xl bg-gradient-to-br ${zone.color} p-5 mb-5 shadow-xl`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{zone.emoji}</span>
          <div>
            <div className="text-white font-bold text-xl">{zone.name}</div>
            <div className="text-white/70 text-sm">{zone.subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80 rounded-full transition-all duration-700"
              style={{ width: `${stats.pct}%` }}
            />
          </div>
          <span className="text-white font-bold tabular-nums text-sm">{stats.pct}%</span>
        </div>
        <div className="flex gap-4 mt-2 text-white/70 text-xs">
          <span>已练习 {stats.attempted} 句</span>
          <span>已掌握 {stats.mastered} 句</span>
          <span>共 {stats.total} 句</span>
        </div>
      </div>

      {/* Residents */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">岛民 · 居住功能</div>
        <div className="flex flex-col gap-3">
          {zone.residents.map(r => {
            const unlocked = stats.pct >= r.threshold
            const owned = ownedPetIds.has(r.petId)
            const tierStyle = TIER_STYLES[r.tier] || TIER_STYLES.N

            return (
              <div
                key={r.petId}
                className={`flex items-center gap-3 rounded-xl border p-3 transition-all
                  ${unlocked
                    ? `${zone.bgLight} ${zone.border}`
                    : 'bg-gray-900/40 border-gray-800 opacity-50'
                  }`}
              >
                {/* Avatar */}
                <div className={`relative rounded-full border-2 overflow-hidden shrink-0
                  ${unlocked ? tierStyle.card : 'border-gray-700 grayscale'}
                  ${owned && unlocked ? 'ring-2 ring-green-400/50 ring-offset-1 ring-offset-gray-950' : ''}`}
                >
                  <PetAvatar petId={r.petId} size={48} />
                  {owned && unlocked && (
                    <div className="absolute bottom-0 inset-x-0 text-center bg-green-500/80 text-white text-[8px] font-bold leading-3 pb-0.5">住</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm font-semibold text-white">{r.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${tierStyle.badge}`}>{r.tier}</span>
                    {owned && unlocked && <span className="text-[10px] text-green-400 font-medium">已入住 ✓</span>}
                  </div>
                  <div className="text-xs font-medium text-blue-400 mb-0.5">🔧 {r.fn}</div>
                  <div className="text-xs text-gray-500">{r.fnDesc}</div>
                </div>

                {/* Unlock condition */}
                <div className="shrink-0 text-right">
                  {unlocked ? (
                    <span className="text-xs text-green-400">✓ 已解锁</span>
                  ) : (
                    <div className="text-xs text-gray-600">
                      <div>需达到</div>
                      <div className="font-bold text-gray-400">{r.threshold}%</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Books in zone */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">包含教材</div>
        <div className="flex gap-2">
          {zone.books.map(b => (
            <div key={b.name} className={`flex-1 rounded-xl border ${zone.border} ${zone.bgLight} px-3 py-2 text-center`}>
              <div className="text-xs text-gray-300 font-medium">{b.name}</div>
              <div className="text-xs text-gray-500">{b.data.length} 句</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── 岛屿总览 ─────────────────────────────────────────────────
function IslandOverview({ zones, zoneStats, ownedPetIds }) {
  const totalSentences = zoneStats.reduce((sum, s) => sum + s.total, 0)
  const totalAttempted = zoneStats.reduce((sum, s) => sum + s.attempted, 0)
  const totalMastered  = zoneStats.reduce((sum, s) => sum + s.mastered, 0)
  const islandPct = totalSentences > 0 ? Math.round((totalAttempted / totalSentences) * 100) : 0

  const totalResidents = zones.reduce((sum, z) => sum + z.residents.length, 0)
  const unlockedResidents = zones.reduce((sum, z, i) =>
    sum + z.residents.filter(r => zoneStats[i].pct >= r.threshold).length, 0)
  const ownedResidents = zones.reduce((sum, z, i) =>
    sum + z.residents.filter(r => ownedPetIds.has(r.petId) && zoneStats[i].pct >= r.threshold).length, 0)

  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-700 p-4 mb-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">🏝️</div>
        <div>
          <div className="text-white font-bold">英语岛</div>
          <div className="text-gray-500 text-xs">English Island</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xl font-bold text-white tabular-nums">{islandPct}%</div>
          <div className="text-xs text-gray-500">整体建设</div>
        </div>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700"
          style={{ width: `${islandPct}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-white tabular-nums">{totalAttempted}</div>
          <div className="text-xs text-gray-500">已练习句</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-400 tabular-nums">{totalMastered}</div>
          <div className="text-xs text-gray-500">已掌握</div>
        </div>
        <div>
          <div className="text-lg font-bold text-amber-400 tabular-nums">{ownedResidents}<span className="text-gray-500 text-sm">/{totalResidents}</span></div>
          <div className="text-xs text-gray-500">岛民入住</div>
        </div>
      </div>
    </div>
  )
}

// ── 主组件 ───────────────────────────────────────────────────
export default function EnglishIsland({ progress = {}, inventory }) {
  const [activeZone, setActiveZone] = useState(null)

  const ownedPetIds = useMemo(
    () => new Set((inventory?.pets || []).map(p => p.item_id)),
    [inventory?.pets],
  )

  const zoneStats = useMemo(
    () => ZONES.map(z => calcZoneProgress(z, progress)),
    [progress],
  )

  if (activeZone !== null) {
    const zone = ZONES[activeZone]
    const stats = zoneStats[activeZone]
    return (
      <div>
        <button
          onClick={() => setActiveZone(null)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
        >
          ‹ 返回英语岛
        </button>
        <ZoneDetail zone={zone} stats={stats} ownedPetIds={ownedPetIds} onBack={() => setActiveZone(null)} />
      </div>
    )
  }

  return (
    <div>
      <IslandOverview zones={ZONES} zoneStats={zoneStats} ownedPetIds={ownedPetIds} />

      <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">五大区域</div>
      <div className="flex flex-col gap-3">
        {ZONES.map((zone, i) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            stats={zoneStats[i]}
            ownedPetIds={ownedPetIds}
            onClick={() => setActiveZone(i)}
          />
        ))}
      </div>

      <div className="mt-5 p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-600 text-center">
        完成练习 → 解锁岛民 → 激活居住功能 → 岛屿不断成长 🌱
      </div>
    </div>
  )
}
