import { useMemo, useState } from 'react'
import {
  buildUnits,
  DEFAULT_PRACTICE_BOOK_ID,
  getLessonForNode,
  getNodeSetsCompleted,
  loadProgress,
  resetProgress,
  saveProgress,
  switchPracticeBook,
} from './data/courseData'
import { gemsForVocabComplete } from './data/mobileCrystalRules'
import { ISLAND_SET_COUNT } from './data/lessonSets'
import { isG3U1ExamNode, isG3U1Node, maxSetsForG3U1Node } from './data/g3u1/plan'
import { isPepExamNode, maxSetsForPepNode } from './data/pepPractice/plan'
import { getGradeBook } from './data/gradeBooks'
import LessonFlow, { type LessonRewardMeta } from './LessonFlow'
import GamePage, { markDefenderLevelPassed, markFrogLevelPassed, markBeeLevelPassed, buildLevels } from './GamePage'
import MapPage from './MapPage'
import MobileGrammarPage from './MobileGrammarPage'
import MobileStatusBar from './components/MobileStatusBar'
import MorePage from './MorePage'
import VocabMatchGame from './VocabMatchGame'
import WordDefenderGame from './games/WordDefenderGame'
import FrogJumpGame from './games/FrogJumpGame'
import BeeBusterGame from './games/BeeBusterGame'
import AlphabetGame from './games/AlphabetGame'
import VocabPracticeFlow from './VocabPracticeFlow'
import WordsPage from './WordsPage'
import TextbookPage from './textbook/TextbookPage'
import type { VocabUnit } from './data/vocabBooks'
import { defaultVocabBook } from './data/vocabBooks'
import type { VocabWord } from './data/unit1Vocab'
import { tabThemeClass } from './data/tabThemes'
import MobilePhoneFrame from './components/MobilePhoneFrame'
import MobileTabBar, { type MobileTabId } from './components/MobileTabBar'
import MicPermissionSheet from '../components/MicPermissionSheet'
import UnlockConfirmModal from '../components/UnlockConfirmModal'
import './mobile.css'
import './styles/map-island-legacy.css'
import type {
  CrystalEarnFn,
  Lesson,
  MainCrystalSnapshot,
  MainXpSnapshot,
  MapNode,
  MobileProgress,
} from './types'

interface Props {
  onClose: () => void
  shellMode?: boolean
  onExitShell?: () => void
  onAddXp?: (amount: number) => void
  onCrystalEarn?: CrystalEarnFn
  onCrystalSpend?: (color: string, amount: number, reason: string) => Promise<boolean>
  onOpenShop?: () => void
  onOpenLeaderboard?: () => void
  /** 宝石跳关：useUnlocks 实例 + 蓝钻余额 */
  unlocks?: {
    isUnlocked: (scope: string, id: string) => boolean
    unlock: (scope: string, id: string, cost: number, color?: string) => Promise<{ ok: boolean; reason?: string; need?: number; have?: number }>
  }
  crystalBalance?: number
  mainXp?: MainXpSnapshot
  mainCrystal?: MainCrystalSnapshot
  crystalPulse?: number
  crystalSpend?: number
}

type Screen = 'main' | 'lesson' | 'vocabPractice' | 'vocabGame' | 'wordDefender' | 'frogJump' | 'grammar' | 'alphabet' | 'beeBuster'

export default function MobileLearnApp({
  onClose,
  shellMode,
  onExitShell,
  onAddXp,
  onCrystalEarn,
  onCrystalSpend,
  onOpenShop,
  onOpenLeaderboard,
  unlocks,
  crystalBalance = 0,
  mainXp,
  mainCrystal,
  crystalPulse = 0,
  crystalSpend = 0,
}: Props) {
  const [progress, setProgress] = useState<MobileProgress>(() => loadProgress())
  const [screen, setScreen] = useState<Screen>('main')
  const [activeTab, setActiveTab] = useState<MobileTabId>('practice')
  const [activeNode, setActiveNode] = useState<MapNode | null>(null)
  const [activeSetIndex, setActiveSetIndex] = useState(0)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [vocabBookId, setVocabBookId] = useState<string>('g3-1')
  const [vocabBookProgress, setVocabBookProgress] = useState<Record<string, number>>({ 'g3-1': 8 })
  const [vocabUnitProgress, setVocabUnitProgress] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem('vocab_unit_progress') || '{}') } catch { return {} }
  })
  const [practiceWords, setPracticeWords] = useState<VocabWord[]>(() => defaultVocabBook().units[0]?.words ?? [])
  const [practiceUnitLabel, setPracticeUnitLabel] = useState('Unit 1')
  const [practiceUnitKey, setPracticeUnitKey] = useState('')
  const [defenderBookId, setDefenderBookId] = useState('g3-1')
  const [defenderUnitNum, setDefenderUnitNum] = useState(1)
  const [frogBookId, setFrogBookId] = useState('g3-1')
  const [frogUnitNum, setFrogUnitNum] = useState(1)
  const [beeBookId, setBeeBookId] = useState('g3-1')
  const [beeUnitNum, setBeeUnitNum] = useState(1)
  const [skipNode, setSkipNode] = useState<MapNode | null>(null)
  const [grammarUnitId, setGrammarUnitId] = useState<string | null>(null)
  const [grammarUnitTitle, setGrammarUnitTitle] = useState<string | undefined>(undefined)

  const practiceBookId = progress.practiceBookId ?? DEFAULT_PRACTICE_BOOK_ID
  const selectedPracticeBook = getGradeBook(practiceBookId) ?? getGradeBook(DEFAULT_PRACTICE_BOOK_ID)!
  const units = useMemo(() => buildUnits(progress, practiceBookId), [progress, practiceBookId])
  const completedCount = progress.completedNodes.length
  const streak = mainXp?.streak ?? progress.streak
  const totalXp = mainXp?.totalXp ?? progress.totalXp

  function updateProgress(next: MobileProgress) {
    setProgress(next)
    saveProgress(next)
  }

  function maxSetsForNode(node: MapNode) {
    if (isG3U1Node(node.id)) return maxSetsForG3U1Node(node.id)
    if (node.id.includes('-u') && node.id.match(/-\d{2}$/)) return maxSetsForPepNode(node.id)
    return ISLAND_SET_COUNT
  }

  function startNode(node: MapNode) {
    if (node.status === 'locked') return
    const setsDone = getNodeSetsCompleted(progress, node.id)
    if ((isG3U1ExamNode(node.id) || isPepExamNode(node.id)) && setsDone >= 3) return
    const maxSets = maxSetsForNode(node)
    const setIndex = setsDone >= maxSets ? maxSets - 1 : setsDone
    try {
      const { lesson, progress: nextProgress } = getLessonForNode(node.id, setIndex, progress)
      if (!lesson?.questions?.length) {
        window.alert('暂时无法加载本题，请稍后重试。')
        return
      }
      setActiveSetIndex(setIndex)
      setActiveNode(node)
      setActiveLesson(lesson)
      updateProgress(nextProgress)
      setScreen('lesson')
    } catch (err) {
      console.error('[mobile] startNode failed', err)
      window.alert('开课失败，已尝试恢复。请再点一次继续学习。')
    }
  }

  function startPhonicsLesson() {
    const { lesson } = getLessonForNode('u1-phonics', 0, progress)
    setActiveSetIndex(0)
    setActiveNode({
      id: 'u1-phonics',
      unitId: 'phonics',
      title: '元音发音',
      kind: 'lesson',
      status: 'current',
      xp: 15,
    })
    setActiveLesson(lesson)
    setScreen('lesson')
  }

  function handleContinue() {
    const current = units.flatMap(u => u.nodes).find(n => n.id === progress.currentNodeId)
    if (current && current.status !== 'locked') startNode(current)
  }

  // 宝石跳关：解锁成功 → 把学习进度推进到该岛
  const SKIP_COST = 15
  async function handleSkipUnlock() {
    if (!skipNode) return { ok: false }
    const r = await unlocks?.unlock?.('island', skipNode.id, SKIP_COST, 'blue')
      ?? { ok: false, reason: 'no_unlocks' }
    if (r.ok) {
      updateProgress({ ...progress, currentNodeId: skipNode.id })
      setSkipNode(null)
    }
    return r
  }

  function handleLessonComplete(result: { correct: number; total: number }) {
    if (!activeNode) return
    const allIds = units.flatMap(u => u.nodes.map(n => n.id))
    const curIdx = allIds.indexOf(activeNode.id)
    const nextId = allIds[curIdx + 1] || activeNode.id

    const perfect = result.correct === result.total && result.total > 0
    const setsDone = getNodeSetsCompleted(progress, activeNode.id)
    const maxSets = maxSetsForNode(activeNode)
    const isExam = activeNode.kind === 'exam'
    const newSets = isExam
      ? 3
      : Math.min(maxSets, (progress.nodeSetsCompleted?.[activeNode.id] ?? setsDone) + 1)
    const firstClear = setsDone === 0
    const xpGain = activeNode.xp
      + (perfect ? 2 : 0)
      + (newSets >= maxSets && setsDone < maxSets && !isExam ? 3 : 0)
      + (isExam && firstClear ? 5 : 0)
    onAddXp?.(xpGain)

    const next: MobileProgress = {
      ...progress,
      nodeSetsCompleted: {
        ...(progress.nodeSetsCompleted ?? {}),
        [activeNode.id]: newSets,
      },
      completedNodes: firstClear && !progress.completedNodes.includes(activeNode.id)
        ? [...progress.completedNodes, activeNode.id]
        : progress.completedNodes,
      currentNodeId: firstClear ? nextId : progress.currentNodeId,
      todayDone: Math.min(progress.todayGoal, progress.todayDone + 1),
    }
    updateProgress(next)
    setScreen('main')
    setActiveNode(null)
    setActiveLesson(null)
    setActiveTab('lessons')
    void result
  }

  function handleExitApp() {
    if (shellMode && onExitShell) onExitShell()
    else onClose()
  }

  function handleResetProgress() {
    const next = resetProgress()
    setProgress(next)
    saveProgress(next)
    setVocabBookProgress({ 'g3-1': 0 })
    setScreen('main')
    setActiveTab('lessons')
    setActiveNode(null)
    setActiveLesson(null)
    setActiveSetIndex(0)
  }

  function handleVocabComplete(xp: number) {
    onAddXp?.(xp)
    for (const g of gemsForVocabComplete()) {
      onCrystalEarn?.(g.color, g.amount, g.reason, { source: 'vocab' })
    }
    updateProgress(progress)
    setVocabBookProgress(prev => ({
      ...prev,
      [vocabBookId]: Math.min(100, (prev[vocabBookId] ?? 0) + 25),
    }))
    if (practiceUnitKey) {
      setVocabUnitProgress(prev => {
        const next = { ...prev, [practiceUnitKey]: (prev[practiceUnitKey] ?? 0) + 1 }
        try { localStorage.setItem('vocab_unit_progress', JSON.stringify(next)) } catch {}
        return next
      })
    }
    setScreen('main')
    setActiveTab('words')
  }

  function handlePracticeBookChange(bookId: string) {
    updateProgress(switchPracticeBook(progress, bookId))
  }

  function handleStartVocabPractice(bookId: string, unit: VocabUnit) {
    setVocabBookId(bookId)
    setPracticeWords(unit.words)
    setPracticeUnitLabel(unit.title)
    setPracticeUnitKey(`${bookId}|${unit.unit}`)
    setScreen('vocabPractice')
  }

  function handleStartVocabGame(bookId: string, unit: VocabUnit) {
    setVocabBookId(bookId)
    setPracticeWords(unit.words)
    setPracticeUnitLabel(unit.title)
    setPracticeUnitKey(`${bookId}|${unit.unit}`)
    setScreen('vocabGame')
  }

  function handleStartDefender(bookId: string, unit: VocabUnit) {
    setVocabBookId(bookId)
    setPracticeWords(unit.words)
    setPracticeUnitLabel(unit.title)
    setDefenderBookId(bookId)
    setDefenderUnitNum(unit.unit)
    setScreen('wordDefender')
  }

  function handleDefenderComplete(result: { hit: number; total: number; combo: number; accuracy: number; won: boolean }) {
    // 统一奖励：击毁数 × 2 XP，零失误 +1 绿钻，10+ 连击 +1 紫钻，全部击毁 +1 蓝钻
    onAddXp?.(result.hit * 2)
    if (result.hit > 0) onCrystalEarn?.('blue', 1, 'defender_round', { hit: result.hit })
    if (result.accuracy >= 100 && result.hit > 0) onCrystalEarn?.('green', 1, 'defender_zero_error')
    if (result.combo >= 10) onCrystalEarn?.('purple', 1, 'defender_combo_10', { combo: result.combo })
    if (result.hit === result.total && result.total > 0) onCrystalEarn?.('gold', 1, 'defender_perfect')
    if (result.won) markDefenderLevelPassed(defenderBookId, defenderUnitNum)
  }

  function handleStartFrog(bookId: string, unit: VocabUnit) {
    setVocabBookId(bookId)
    setPracticeWords(unit.words)
    setPracticeUnitLabel(unit.title)
    setFrogBookId(bookId)
    setFrogUnitNum(unit.unit)
    setScreen('frogJump')
  }

  function handleFrogComplete(result: { hit: number; total: number; combo: number; accuracy: number; won: boolean }) {
    // 奖励对齐飞船：跳跃数 × 2 XP，零失误 +1 绿钻，10+ 连击 +1 紫钻，全部完成 +1 金钻
    onAddXp?.(result.hit * 2)
    if (result.hit > 0) onCrystalEarn?.('green', 1, 'frog_round', { hit: result.hit })
    if (result.accuracy >= 100 && result.hit > 0) onCrystalEarn?.('green', 1, 'frog_zero_error')
    if (result.combo >= 10) onCrystalEarn?.('purple', 1, 'frog_combo_10', { combo: result.combo })
    if (result.hit === result.total && result.total > 0) onCrystalEarn?.('gold', 1, 'frog_perfect')
    if (result.won) markFrogLevelPassed(frogBookId, frogUnitNum)
  }

  function handleFrogNextLevel() {
    const allLevels = buildLevels()
    const curKey = `${frogBookId}|${frogUnitNum}`
    const curIdx = allLevels.findIndex(l => l.key === curKey)
    if (curIdx >= 0 && curIdx < allLevels.length - 1) {
      const next = allLevels[curIdx + 1]
      handleStartFrog(next.bookId, next.unit)
    } else {
      setScreen('main')
      setActiveTab('game')
    }
  }

  function handleStartBee(bookId: string, unit: VocabUnit) {
    setVocabBookId(bookId)
    setPracticeWords(unit.words)
    setPracticeUnitLabel(unit.title)
    setBeeBookId(bookId)
    setBeeUnitNum(unit.unit)
    setScreen('beeBuster')
  }

  function handleBeeComplete(result: { hit: number; total: number; combo: number; accuracy: number; won: boolean }) {
    onAddXp?.(result.hit * 2)
    if (result.hit > 0) onCrystalEarn?.('blue', 1, 'bee_round', { hit: result.hit })
    if (result.accuracy >= 100 && result.hit > 0) onCrystalEarn?.('green', 1, 'bee_perfect')
    if (result.combo >= 10) onCrystalEarn?.('purple', 1, 'bee_combo_10', { combo: result.combo })
    if (result.won) markBeeLevelPassed(beeBookId, beeUnitNum)
  }

  function handleBeeNextLevel() {
    const allLevels = buildLevels()
    const curKey = `${beeBookId}|${beeUnitNum}`
    const curIdx = allLevels.findIndex(l => l.key === curKey)
    if (curIdx >= 0 && curIdx < allLevels.length - 1) {
      const next = allLevels[curIdx + 1]
      handleStartBee(next.bookId, next.unit)
    } else {
      setScreen('main'); setActiveTab('game')
    }
  }

  function handleVocabGameComplete() {
    onAddXp?.(3)
    setScreen('main')
    setActiveTab('game')
  }

  function handleTabChange(next: MobileTabId) {
    setActiveTab(next)
  }

  function handleUnitGrammar(unitId: string) {
    const unit = units.find(u => u.id === unitId)
    setGrammarUnitId(unitId)
    setGrammarUnitTitle(unit?.title)
    setScreen('grammar')
  }

  function handleStartAlphabet() {
    setScreen('alphabet')
  }

  if (screen === 'alphabet') {
    return (
      <MobilePhoneFrame className="mobile-main-shell h-[100dvh] max-h-[100dvh]">
        <AlphabetGame
          onExit={() => { setScreen('main'); setActiveTab('game') }}
          onComplete={() => { setScreen('main'); setActiveTab('game') }}
        />
      </MobilePhoneFrame>
    )
  }

  if (screen === 'vocabPractice') {
    return (
      <MobilePhoneFrame className="mobile-main-shell h-[100dvh] max-h-[100dvh]">
        <MicPermissionSheet elevated preferLight />
        <VocabPracticeFlow
          words={practiceWords}
          unitLabel={practiceUnitLabel}
          bookId={vocabBookId}
          onExit={() => { setScreen('main'); setActiveTab('words') }}
          onComplete={handleVocabComplete}
        />
      </MobilePhoneFrame>
    )
  }

  if (screen === 'vocabGame') {
    return (
      <MobilePhoneFrame className="mobile-main-shell h-[100dvh] max-h-[100dvh]">
        <VocabMatchGame
          words={practiceWords}
          onExit={() => { setScreen('main'); setActiveTab('game') }}
          onComplete={handleVocabGameComplete}
        />
      </MobilePhoneFrame>
    )
  }

  if (screen === 'grammar' && grammarUnitId) {
    return (
      <MobilePhoneFrame className="mobile-main-shell h-[100dvh] max-h-[100dvh]">
        <MobileGrammarPage
          unitId={grammarUnitId}
          unitTitle={grammarUnitTitle}
          onBack={() => { setScreen('main'); setGrammarUnitId(null) }}
          onAddXp={onAddXp}
          onCrystalEarn={onCrystalEarn}
        />
      </MobilePhoneFrame>
    )
  }

  if (screen === 'wordDefender') {
    return (
      <MobilePhoneFrame className="mobile-main-shell h-[100dvh] max-h-[100dvh]">
        <WordDefenderGame
          words={practiceWords}
          unitLabel={practiceUnitLabel}
          onExit={() => { setScreen('main'); setActiveTab('game') }}
          onComplete={handleDefenderComplete}
          onCrystalEarn={onCrystalEarn}
          onCrystalSpend={onCrystalSpend}
        />
      </MobilePhoneFrame>
    )
  }

  if (screen === 'frogJump') {
    return (
      <MobilePhoneFrame className="mobile-main-shell h-[100dvh] max-h-[100dvh]">
        <FrogJumpGame
          key={`${frogBookId}-${frogUnitNum}`}
          words={practiceWords}
          unitLabel={practiceUnitLabel}
          onExit={() => { setScreen('main'); setActiveTab('game') }}
          onComplete={handleFrogComplete}
          onNextLevel={handleFrogNextLevel}
          onCrystalEarn={onCrystalEarn}
          onCrystalSpend={onCrystalSpend}
        />
      </MobilePhoneFrame>
    )
  }

  if (screen === 'beeBuster') {
    return (
      <MobilePhoneFrame className="mobile-main-shell h-[100dvh] max-h-[100dvh]">
        <BeeBusterGame
          key={`${beeBookId}-${beeUnitNum}`}
          words={practiceWords}
          unitLabel={practiceUnitLabel}
          onExit={() => { setScreen('main'); setActiveTab('game') }}
          onComplete={handleBeeComplete}
          onNextLevel={handleBeeNextLevel}
          onCrystalEarn={onCrystalEarn}
          onCrystalSpend={onCrystalSpend}
        />
      </MobilePhoneFrame>
    )
  }

  if (screen === 'lesson' && activeNode && activeLesson) {
    const setsDone = getNodeSetsCompleted(progress, activeNode.id)
    const rewardMeta: LessonRewardMeta = {
      nodeId: activeNode.id,
      baseXp: activeNode.xp,
      firstClear: setsDone === 0,
      isExam: activeNode.kind === 'exam',
      setsDone,
      maxSets: maxSetsForNode(activeNode),
    }
    return (
      <MobilePhoneFrame className="mobile-main-shell h-[100dvh] max-h-[100dvh]">
        <MicPermissionSheet elevated preferLight />
        <LessonFlow
          lesson={activeLesson}
          rewardMeta={rewardMeta}
          onCrystalEarn={onCrystalEarn}
          onComplete={handleLessonComplete}
          onExit={() => { setScreen('main'); setActiveNode(null); setActiveLesson(null) }}
        />
      </MobilePhoneFrame>
    )
  }

  return (
    <MobilePhoneFrame className={`mobile-main-shell h-[100dvh] max-h-[100dvh] ${tabThemeClass(activeTab)}`}>
      <MicPermissionSheet elevated preferLight />
      <MobileStatusBar
        streak={streak}
        crystalTotal={mainCrystal?.total ?? 0}
        totalXp={totalXp}
        todayXp={mainXp?.todayXp}
        goal={mainXp?.goal}
        crystalPulse={crystalPulse}
        crystalSpend={crystalSpend}
        onOpenLeaderboard={onOpenLeaderboard}
        onOpenShop={onOpenShop}
        onExitApp={handleExitApp}
      />
      <main className={`flex-1 min-h-0 flex flex-col overflow-hidden ${tabThemeClass(activeTab)}`}>
        {activeTab === 'words' && (
          <WordsPage
            bookProgress={vocabBookProgress}
            unitProgress={vocabUnitProgress}
            onStartPractice={handleStartVocabPractice}
          />
        )}
        {activeTab === 'lessons' && (
          <TextbookPage />
        )}
        {activeTab === 'practice' && (
          <MapPage
            units={units}
            progress={progress}
            selectedBook={selectedPracticeBook}
            onSelectBook={book => handlePracticeBookChange(book.id)}
            onSelectNode={startNode}
            onContinue={handleContinue}
            bookProgress={vocabBookProgress}
            shellMode={shellMode}
            onLockedNode={node => setSkipNode(node)}
            onUnitGrammar={handleUnitGrammar}
          />
        )}
        {skipNode && (
          <UnlockConfirmModal
            title={`跳关 · ${skipNode.title}`}
            reason="完成前面的关卡可自动解锁，也可花钻石直接跳到这一关"
            cost={SKIP_COST}
            crystalBalance={crystalBalance}
            onCancel={() => setSkipNode(null)}
            onConfirm={handleSkipUnlock}
            onGoShop={() => { setSkipNode(null); onOpenShop?.() }}
          />
        )}
        {activeTab === 'game' && (
          <GamePage
            onStartDefender={handleStartDefender}
            onStartFrog={handleStartFrog}
            onStartBee={handleStartBee}
            onStartAlphabet={handleStartAlphabet}
            crystalBalance={crystalBalance}
            onCrystalSpend={onCrystalSpend}
          />
        )}
        {activeTab === 'menu' && (
          <MorePage
            streak={streak}
            totalXp={totalXp}
            crystalTotal={mainCrystal?.total ?? 0}
            completedCount={completedCount}
            todayXp={mainXp?.todayXp}
            goal={mainXp?.goal}
            onBackHome={() => setActiveTab('lessons')}
            onExitApp={handleExitApp}
            onResetProgress={handleResetProgress}
            onOpenPhonics={startPhonicsLesson}
            onOpenShop={onOpenShop}
            shellMode={shellMode}
          />
        )}
      </main>
      <MobileTabBar active={activeTab} onChange={handleTabChange} />
    </MobilePhoneFrame>
  )
}
