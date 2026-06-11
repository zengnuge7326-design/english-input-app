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
import GamePage from './GamePage'
import MapPage from './MapPage'
import MorePage from './MorePage'
import VocabMatchGame from './VocabMatchGame'
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
  onOpenShop?: () => void
  onOpenLeaderboard?: () => void
  mainXp?: MainXpSnapshot
  mainCrystal?: MainCrystalSnapshot
  crystalPulse?: number
}

type Screen = 'main' | 'lesson' | 'vocabPractice' | 'vocabGame'

export default function MobileLearnApp({
  onClose,
  shellMode,
  onExitShell,
  onAddXp,
  onCrystalEarn,
  onOpenShop,
  onOpenLeaderboard,
  mainXp,
  mainCrystal,
  crystalPulse = 0,
}: Props) {
  const [progress, setProgress] = useState<MobileProgress>(() => loadProgress())
  const [screen, setScreen] = useState<Screen>('main')
  const [activeTab, setActiveTab] = useState<MobileTabId>('practice')
  const [activeNode, setActiveNode] = useState<MapNode | null>(null)
  const [activeSetIndex, setActiveSetIndex] = useState(0)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [vocabBookId, setVocabBookId] = useState<string>('g3-1')
  const [vocabBookProgress, setVocabBookProgress] = useState<Record<string, number>>({ 'g3-1': 8 })
  const [practiceWords, setPracticeWords] = useState<VocabWord[]>(() => defaultVocabBook().units[0]?.words ?? [])
  const [practiceUnitLabel, setPracticeUnitLabel] = useState('Unit 1')

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
    setScreen('vocabPractice')
  }

  function handleStartVocabGame(bookId: string, unit: VocabUnit) {
    setVocabBookId(bookId)
    setPracticeWords(unit.words)
    setPracticeUnitLabel(unit.title)
    setScreen('vocabGame')
  }

  function handleVocabGameComplete() {
    onAddXp?.(3)
    setScreen('main')
    setActiveTab('game')
  }

  function handleTabChange(next: MobileTabId) {
    setActiveTab(next)
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
    <MobilePhoneFrame className="mobile-main-shell h-[100dvh] max-h-[100dvh]">
      <MicPermissionSheet elevated preferLight />
      <main className={`flex-1 min-h-0 flex flex-col overflow-hidden ${tabThemeClass(activeTab)}`}>
        {activeTab === 'words' && (
          <WordsPage
            bookProgress={vocabBookProgress}
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
            mainXp={mainXp}
            mainCrystal={mainCrystal}
            crystalPulse={crystalPulse}
            onOpenLeaderboard={onOpenLeaderboard}
            onOpenShop={onOpenShop}
          />
        )}
        {activeTab === 'game' && (
          <GamePage
            practiceBookId={practiceBookId}
            onStartGame={handleStartVocabGame}
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
