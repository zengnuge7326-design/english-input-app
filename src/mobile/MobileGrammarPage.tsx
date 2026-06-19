import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import LessonFlow, { type LessonRewardMeta } from './LessonFlow'
import UnitPathTrail from './components/UnitPathTrail'
import { getGrammarForUnit, type GrammarTopicRef } from './data/unitGrammarMap'
import {
  buildGrammarLesson,
  GRAMMAR_STAGES,
  hasTopicData,
  topicSentenceCount,
  type GrammarStage,
} from './data/grammarQuizBuilder'
import type { CrystalEarnFn, Lesson, MapNode } from './types'

// ── 进度存储（独立 key，不污染主进度/经济）─────────────────────────────────────
const PKEY = 'grammar_progress_v1'

function loadDone(): Record<string, true> {
  try { return JSON.parse(localStorage.getItem(PKEY) || '{}') } catch { return {} }
}
function saveDone(map: Record<string, true>) {
  try { localStorage.setItem(PKEY, JSON.stringify(map)) } catch { /* ignore */ }
}
function doneKey(unitId: string, topicId: string, stage: GrammarStage) {
  return `${unitId}|${topicId}|${stage}`
}

function hashSeed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// ── 4 节点路径：学→练→用→测（顺序解锁）──────────────────────────────────────
function buildStageNodes(unitId: string, ref: GrammarTopicRef, done: Record<string, true>): MapNode[] {
  return GRAMMAR_STAGES.map((s, i) => {
    const isDone = !!done[doneKey(unitId, ref.topicId, s.stage)]
    const prevDone = i === 0 || !!done[doneKey(unitId, ref.topicId, GRAMMAR_STAGES[i - 1].stage)]
    const status: MapNode['status'] = isDone ? 'completed' : prevDone ? 'current' : 'locked'
    return {
      id: `${ref.topicId}-${s.stage}`,
      unitId,
      title: `${s.label} · ${s.sub}`,
      kind: 'lesson',
      status,
      xp: 5,
      setsCompleted: isDone ? 3 : 0,
    }
  })
}

interface ActiveLesson {
  lesson: Lesson
  ref: GrammarTopicRef
  stage: GrammarStage
  firstClear: boolean
}

interface Props {
  unitId: string
  unitTitle?: string
  onBack: () => void
  onAddXp?: (amount: number) => void
  onCrystalEarn?: CrystalEarnFn
}

export default function MobileGrammarPage({ unitId, unitTitle, onBack, onAddXp, onCrystalEarn }: Props) {
  const topics = useMemo(() => getGrammarForUnit(unitId).filter(hasTopicData), [unitId])
  const [activeTopic, setActiveTopic] = useState<GrammarTopicRef | null>(null)
  const [active, setActive] = useState<ActiveLesson | null>(null)
  const [done, setDone] = useState<Record<string, true>>(loadDone)
  const currentRef = useRef<HTMLDivElement>(null)

  function openStage(ref: GrammarTopicRef, node: MapNode) {
    if (node.status === 'locked') return
    const stage = node.id.split('-').pop() as GrammarStage
    const firstClear = !done[doneKey(unitId, ref.topicId, stage)]
    const seed = hashSeed(`${unitId}-${ref.topicId}-${stage}`)
    setActive({ lesson: buildGrammarLesson(ref, stage, seed), ref, stage, firstClear })
  }

  function handleComplete(result: { correct: number; total: number }) {
    if (!active) return
    const k = doneKey(unitId, active.ref.topicId, active.stage)
    if (active.firstClear) {
      const next = { ...done, [k]: true as const }
      setDone(next)
      saveDone(next)
    }
    const perfect = result.correct === result.total && result.total > 0
    onAddXp?.((active.firstClear ? 5 : 2) + (perfect ? 2 : 0))
    setActive(null)
  }

  // ── 关卡运行中 ──
  if (active) {
    const rewardMeta: LessonRewardMeta = {
      nodeId: `grammar-${unitId}-${active.ref.topicId}-${active.stage}`,
      baseXp: 5,
      firstClear: active.firstClear,
      isExam: active.stage === 'test',
      setsDone: active.firstClear ? 0 : 1,
      maxSets: 1,
    }
    return (
      <LessonFlow
        lesson={active.lesson}
        rewardMeta={rewardMeta}
        onCrystalEarn={onCrystalEarn}
        onComplete={handleComplete}
        onExit={() => setActive(null)}
      />
    )
  }

  // ── 话题路径（4 节点）──
  if (activeTopic) {
    const nodes = buildStageNodes(unitId, activeTopic, done)
    const currentNode = nodes.find(n => n.status === 'current') ?? nodes[0]
    return (
      <div className="flex flex-col flex-1 min-h-0 bg-[#0f1320]">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
          <button type="button" onClick={() => setActiveTopic(null)} className="text-white/60 text-sm active:text-white transition-colors">
            ← 返回
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black text-white truncate">{activeTopic.icon} {activeTopic.name}</div>
            <div className="text-[11px] text-white/45">学 → 练 → 用 → 测</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-4 min-h-0">
          <div className="map-island-stage mx-auto max-w-[360px]">
            <UnitPathTrail
              nodes={nodes}
              variant="grammar"
              currentNodeId={currentNode.id}
              currentRef={currentRef}
              onSelectNode={node => openStage(activeTopic, node)}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── 话题列表 ──
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#0f1320]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
        <button type="button" onClick={onBack} className="text-white/60 text-sm active:text-white transition-colors">
          ← 返回
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-black text-white truncate">📖 {unitTitle ?? unitId} · 语法</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        {topics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <span className="text-3xl">📭</span>
            <p className="text-white/40 text-sm">本单元暂无语法内容</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">本单元语法专题</p>
            {topics.map((topic, i) => {
              const total = GRAMMAR_STAGES.length
              const doneCount = GRAMMAR_STAGES.filter(s => done[doneKey(unitId, topic.topicId, s.stage)]).length
              const count = topicSentenceCount(topic)
              return (
                <motion.button
                  key={i}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTopic(topic)}
                  className="w-full text-left bg-white/10 border border-white/15 rounded-2xl px-4 py-4 flex items-center gap-4 active:bg-white/15 transition-colors"
                >
                  <span className="text-3xl shrink-0">{topic.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white">{topic.name}</div>
                    <div className="text-xs text-white/45 mt-0.5">学·练·用·测 · {count} 句素材</div>
                    <div className="flex gap-1 mt-2">
                      {GRAMMAR_STAGES.map(s => {
                        const ok = !!done[doneKey(unitId, topic.topicId, s.stage)]
                        return (
                          <span
                            key={s.stage}
                            className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${ok ? 'bg-[#5b4fb0]/60 text-white' : 'bg-white/8 text-white/40'}`}
                          >
                            {s.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-center gap-0.5">
                    <span className="text-white/30 text-lg">›</span>
                    <span className="text-[10px] text-white/40 tabular-nums">{doneCount}/{total}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
