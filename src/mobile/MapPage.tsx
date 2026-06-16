import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import GradeBookPicker from './components/GradeBookPicker'
import LearningPathCard from './components/LearningPathCard'
import MobileStatusBar from './components/MobileStatusBar'
import UnitPathTrail from './components/UnitPathTrail'
import { getGrammarForUnit } from './data/bookGrammar'
import type { GradeBook } from './data/gradeBooks'
import type { MainCrystalSnapshot, MainXpSnapshot, MapNode, MobileProgress, Unit } from './types'

interface Props {
  units: Unit[]
  progress: MobileProgress
  selectedBook: GradeBook
  onSelectBook: (book: GradeBook) => void
  onSelectNode: (node: MapNode) => void
  onContinue: () => void
  bookProgress?: Record<string, number>
  shellMode?: boolean
  mainXp?: MainXpSnapshot
  mainCrystal?: MainCrystalSnapshot
  crystalPulse?: number
  onOpenLeaderboard?: () => void
  onOpenShop?: () => void
  onExitApp?: () => void
  /** 点击锁定岛（宝石跳关） */
  onLockedNode?: (node: MapNode) => void
}

const ISLANDS_PER_UNIT = 8

function unitProgress(unit: Unit) {
  const done = unit.nodes.filter(n => n.status === 'completed' || n.status === 'reward').length
  return { done, total: unit.nodes.length }
}

export default function MapPage({
  units,
  progress,
  selectedBook,
  onSelectBook,
  onSelectNode,
  onContinue,
  bookProgress = {},
  mainXp,
  mainCrystal,
  crystalPulse,
  onOpenLeaderboard,
  onOpenShop,
  onExitApp,
  onLockedNode,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const streak = mainXp?.streak ?? progress.streak
  const totalXp = mainXp?.totalXp ?? progress.totalXp
  const currentRef = useRef<HTMLDivElement>(null)

  const activeUnitId = useMemo(() => {
    for (const u of units) {
      if (u.nodes.some(n => n.id === progress.currentNodeId)) return u.id
    }
    return units[0]?.id ?? 'g3u1'
  }, [units, progress.currentNodeId])

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    for (const u of units) init[u.id] = u.id === activeUnitId
    return init
  })

  useEffect(() => {
    setExpanded(prev => ({ ...prev, [activeUnitId]: true }))
  }, [activeUnitId])

  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [progress.currentNodeId, expanded])

  const currentNode = units.flatMap(u => u.nodes).find(n => n.id === progress.currentNodeId)
  const activeUnit = units.find(u => u.id === activeUnitId) ?? units[0]
  const grammar = useMemo(() => getGrammarForUnit(activeUnit?.id), [activeUnit?.id])

  function handlePickBook(book: GradeBook) {
    onSelectBook(book)
    setPickerOpen(false)
  }

  if (pickerOpen) {
    return (
      <div className="mobile-home-page mobile-home-page--picker flex flex-col min-h-0 flex-1">
        <GradeBookPicker
          bookProgress={bookProgress}
          onSelect={handlePickBook}
          onClose={() => setPickerOpen(false)}
        />
      </div>
    )
  }

  return (
    <div className="mobile-home-page flex flex-col min-h-0 flex-1">
      <MobileStatusBar
        streak={streak}
        crystalTotal={mainCrystal?.total ?? 0}
        totalXp={totalXp}
        todayXp={mainXp?.todayXp}
        goal={mainXp?.goal}
        crystalPulse={crystalPulse}
        onOpenLeaderboard={onOpenLeaderboard}
        onOpenShop={onOpenShop}
        onExitApp={onExitApp}
      />

      <LearningPathCard
        selectedBook={selectedBook}
        activeUnit={activeUnit}
        currentNode={currentNode}
        grammar={grammar}
        onOpenPicker={() => setPickerOpen(true)}
      />

      <div className="flex-1 overflow-y-auto overscroll-contain px-2 pb-4 min-h-0">
        <div className="map-island-stage mx-auto max-w-[360px]">
          <div className="flex flex-col gap-4">
            {units.map(unit => {
              const { done, total } = unitProgress(unit)
              const isOpen = !!expanded[unit.id]

              return (
                <div key={unit.id} className="map-unit-panel rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpanded(e => ({ ...e, [unit.id]: !e[unit.id] }))}
                    className="map-unit-panel__head w-full flex items-center gap-3 px-4 py-3 text-left active:scale-[0.99] transition-transform"
                  >
                    <span
                      className="map-unit-panel__emoji w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shadow"
                      style={{ background: unit.color }}
                    >
                      {unit.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-white">{unit.title}</div>
                      <div className="text-xs text-white/55">{done}/{total || ISLANDS_PER_UNIT} 关卡完成</div>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="text-white/45 font-bold text-lg"
                    >
                      ▾
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <UnitPathTrail
                          nodes={unit.nodes}
                          currentNodeId={progress.currentNodeId}
                          currentRef={currentRef}
                          onSelectNode={onSelectNode}
                          onLockedNode={onLockedNode}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0 px-4 pt-1.5 pb-1">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onContinue}
          disabled={!currentNode || currentNode.status === 'locked'}
          className="mobile-home-page__continue w-full py-3.5 rounded-2xl font-black text-base text-white disabled:opacity-40"
        >
          继续学习
        </motion.button>
      </div>
    </div>
  )
}
