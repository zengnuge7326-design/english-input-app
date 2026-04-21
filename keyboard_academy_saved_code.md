# Keyboard Academy saved code

## `src/App.jsx`

```jsx
import { useMemo, useState } from 'react'
import AcademyHome from './components/AcademyHome'
import MissionMap from './components/MissionMap'
import MissionPlay from './components/MissionPlay'
import MissionResult from './components/MissionResult'
import WorldsPanel from './components/WorldsPanel'
import BattlePlay from './components/BattlePlay'
import BattleResult from './components/BattleResult'
import ProfilePanel from './components/ProfilePanel'
import AuditPanel from './components/AuditPanel'
import { useAcademyProgress } from './hooks/useAcademyProgress'
import missions from './data/missions.json'
import worlds from './data/worlds.json'
import wordSets from './data/word_sets.json'

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'missions', label: 'Mission Map' },
  { id: 'worlds', label: 'Worlds' },
  { id: 'profile', label: 'Profile' },
  { id: 'review', label: 'Audit Ready' },
]

export default function App() {
  const wordSetsById = useMemo(
    () => Object.fromEntries(wordSets.map(set => [set.id, set])),
    [],
  )
  const { progress, levelMeta, completeMission, completeBattle, nextMission, nextWorld } = useAcademyProgress(missions, worlds)

  const [tab, setTab] = useState('home')
  const [activeMissionId, setActiveMissionId] = useState(nextMission.id)
  const [activeWorldId, setActiveWorldId] = useState(nextWorld.id)
  const [playingMissionId, setPlayingMissionId] = useState(null)
  const [playingWorldId, setPlayingWorldId] = useState(null)
  const [missionResult, setMissionResult] = useState(null)
  const [battleResult, setBattleResult] = useState(null)

  const activeMission = missions.find(mission => mission.id === activeMissionId) || missions[0]
  const activeWorld = worlds.find(world => world.id === activeWorldId) || worlds[0]
  const playingMission = missions.find(mission => mission.id === playingMissionId)
  const playingWorld = worlds.find(world => world.id === playingWorldId)
  const battleWords = playingWorld
    ? playingWorld.wordSetIds.flatMap(id => wordSetsById[id]?.words || []).slice(0, 6)
    : []

  function openMission(missionId) {
    setActiveMissionId(missionId)
    setMissionResult(null)
    setPlayingMissionId(null)
    setTab('missions')
  }

  function startMission(missionId) {
    setActiveMissionId(missionId)
    setMissionResult(null)
    setPlayingMissionId(missionId)
    setTab('missions')
  }

  function handleMissionComplete(result) {
    completeMission(result)
    setMissionResult(result)
    setPlayingMissionId(null)
  }

  function openWorld(worldId) {
    setActiveWorldId(worldId)
    setBattleResult(null)
    setPlayingWorldId(null)
    setTab('worlds')
  }

  function startWorld(worldId) {
    setActiveWorldId(worldId)
    setBattleResult(null)
    setPlayingWorldId(worldId)
    setTab('worlds')
  }

  function handleBattleComplete(result) {
    completeBattle(result)
    setBattleResult(result)
    setPlayingWorldId(null)
  }

  const nextMissionAfterResult = missions.find(mission => !progress.completedMissions.includes(mission.id) && mission.id !== activeMission.id) || activeMission
  const nextWorldAfterResult = worlds.find(world => progress.unlockedWorlds.includes(world.id) && world.id !== activeWorld.id) || activeWorld

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(217,70,239,0.13),transparent_22%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.1),transparent_30%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-[34px] border border-white/10 bg-black/25 px-6 py-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-cyan-200/70">Keyboard-as-a-Skill System</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Keyboard Academy</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {tabs.map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-bold transition-all',
                  tab === item.id ? 'bg-white text-slate-950' : 'border border-white/10 bg-white/5 text-white/75 hover:bg-white/12',
                ].join(' ')}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="space-y-6">
          {tab === 'home' && (
            <AcademyHome
              progress={progress}
              levelMeta={levelMeta}
              nextMission={nextMission}
              nextWorld={nextWorld}
              onOpenMission={startMission}
              onOpenWorld={startWorld}
            />
          )}

          {tab === 'missions' && !playingMission && !missionResult && (
            <div className="space-y-6">
              <MissionMap
                missions={missions}
                progress={progress}
                selectedMissionId={activeMission.id}
                onSelectMission={setActiveMissionId}
              />
              <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Selected mission</p>
                    <h2 className="mt-2 text-3xl font-black text-white">{activeMission.title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">{activeMission.description}</p>
                  </div>
                  <button onClick={() => startMission(activeMission.id)} className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950">
                    Start mission
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'missions' && playingMission && (
            <MissionPlay
              mission={playingMission}
              onComplete={handleMissionComplete}
              onBack={() => setPlayingMissionId(null)}
            />
          )}

          {tab === 'missions' && missionResult && !playingMission && (
            <MissionResult
              result={missionResult}
              mission={activeMission}
              onReplay={() => startMission(activeMission.id)}
              onNext={() => startMission(nextMissionAfterResult.id)}
            />
          )}

          {tab === 'worlds' && !playingWorld && !battleResult && (
            <div className="space-y-6">
              <WorldsPanel
                worlds={worlds}
                wordSetsById={wordSetsById}
                progress={progress}
                selectedWorldId={activeWorld.id}
                onSelectWorld={setActiveWorldId}
              />
              <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-fuchsia-200/70">Selected world</p>
                    <h2 className="mt-2 text-3xl font-black text-white">{activeWorld.title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">{activeWorld.theme}</p>
                  </div>
                  <button
                    onClick={() => startWorld(activeWorld.id)}
                    disabled={!progress.unlockedWorlds.includes(activeWorld.id)}
                    className="rounded-full bg-fuchsia-300 px-5 py-3 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Launch battle
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'worlds' && playingWorld && (
            <BattlePlay
              world={playingWorld}
              words={battleWords}
              onComplete={handleBattleComplete}
              onBack={() => setPlayingWorldId(null)}
            />
          )}

          {tab === 'worlds' && battleResult && !playingWorld && (
            <BattleResult
              world={activeWorld}
              result={battleResult}
              onReplay={() => startWorld(activeWorld.id)}
              onBackToWorlds={() => openWorld(nextWorldAfterResult.id)}
            />
          )}

          {tab === 'profile' && <ProfilePanel progress={progress} levelMeta={levelMeta} />}
          {tab === 'review' && <AuditPanel />}
        </main>
      </div>
    </div>
  )
}

```

## `src/hooks/useAcademyProgress.js`

```js
import { useEffect, useMemo, useState } from 'react'
import {
  loadProgress,
  saveProgress,
  getLevelMeta,
  updateStreak,
} from '../lib/academyProgress'

export function useAcademyProgress(missions, worlds) {
  const [progress, setProgress] = useState(() => loadProgress())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const levelMeta = useMemo(() => getLevelMeta(progress.xp), [progress.xp])

  const completeMission = ({ missionId, stars, accuracy, errors, durationUsed, xpEarned }) => {
    setProgress(prev => {
      const streakUpdate = updateStreak(prev.lastActiveDate)
      const nextCompleted = prev.completedMissions.includes(missionId)
        ? prev.completedMissions
        : [...prev.completedMissions, missionId]

      const weakKeys = { ...prev.weakKeys }
      Object.entries(errors).forEach(([key, count]) => {
        weakKeys[key] = (weakKeys[key] || 0) + count
      })

      const next = {
        ...prev,
        xp: prev.xp + xpEarned,
        stars: prev.stars + Math.max(0, stars - (prev.missionStars[missionId] || 0)),
        streak: streakUpdate.streak === 'increment' ? prev.streak + 1 : streakUpdate.streak ?? prev.streak,
        lastActiveDate: streakUpdate.lastActiveDate,
        missionStars: {
          ...prev.missionStars,
          [missionId]: Math.max(stars, prev.missionStars[missionId] || 0),
        },
        completedMissions: nextCompleted,
        weakKeys,
        lastPlayed: { type: 'mission', id: missionId },
        lastMissionResult: { missionId, stars, accuracy, durationUsed },
      }

      next.unlockedWorlds = deriveUnlockedWorlds(next, worlds)
      return next
    })
  }

  const completeBattle = ({ worldId, stars, accuracy, score, defeatedWords, failedWords, xpEarned, shieldLeft }) => {
    setProgress(prev => {
      const streakUpdate = updateStreak(prev.lastActiveDate)
      const weakWords = { ...prev.weakWords }
      failedWords.forEach(word => {
        weakWords[word] = (weakWords[word] || 0) + 1
      })

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        stars: prev.stars + Math.max(0, stars - ((prev.battleResults[worldId]?.stars) || 0)),
        streak: streakUpdate.streak === 'increment' ? prev.streak + 1 : streakUpdate.streak ?? prev.streak,
        lastActiveDate: streakUpdate.lastActiveDate,
        battleResults: {
          ...prev.battleResults,
          [worldId]: {
            stars: Math.max(stars, prev.battleResults[worldId]?.stars || 0),
            accuracy,
            score: Math.max(score, prev.battleResults[worldId]?.score || 0),
            defeatedWords,
            shieldLeft,
          },
        },
        weakWords,
        lastPlayed: { type: 'world', id: worldId },
        lastBattleResult: { worldId, stars, accuracy, score, defeatedWords },
      }
    })
  }

  const resetProgress = () => setProgress(loadProgress())

  return {
    progress,
    setProgress,
    levelMeta,
    completeMission,
    completeBattle,
    resetProgress,
    nextMission: deriveNextMission(progress, missions),
    nextWorld: deriveNextWorld(progress, worlds),
  }
}

function deriveUnlockedWorlds(progress, worlds) {
  return worlds
    .filter(world => {
      const unlockRule = world.unlockRule || {}
      const requiredMissionIds = unlockRule.requiredMissionIds || []
      const requiredWorldIds = unlockRule.requiredWorldIds || []
      return requiredMissionIds.every(id => progress.completedMissions.includes(id))
        && requiredWorldIds.every(id => progress.battleResults[id])
    })
    .map(world => world.id)
}

function deriveNextMission(progress, missions) {
  return missions.find(mission => !progress.completedMissions.includes(mission.id)) || missions[missions.length - 1]
}

function deriveNextWorld(progress, worlds) {
  return worlds.find(world => progress.unlockedWorlds.includes(world.id) && !progress.battleResults[world.id]) || worlds[0]
}

```

## `src/lib/academyProgress.js`

```js
export const MISSIONS_STORAGE_KEY = 'keyboard_academy_progress'

const DEFAULT_PROGRESS = {
  xp: 0,
  stars: 0,
  streak: 0,
  lastActiveDate: null,
  missionStars: {},
  completedMissions: [],
  unlockedWorlds: ['world-cvc-garden'],
  battleResults: {},
  weakKeys: {},
  weakWords: {},
  lastPlayed: {
    type: 'mission',
    id: 'mission-anchor-fj',
  },
}

export const LEVELS = [
  { rank: 'Rookie', minXp: 0 },
  { rank: 'Key Explorer', minXp: 120 },
  { rank: 'Word Ranger', minXp: 320 },
  { rank: 'Word Ace', minXp: 620 },
  { rank: 'Keyboard Captain', minXp: 980 },
  { rank: 'Sentence Pilot', minXp: 1450 },
]

function cloneDefault() {
  return JSON.parse(JSON.stringify(DEFAULT_PROGRESS))
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(MISSIONS_STORAGE_KEY)
    if (!raw) return cloneDefault()
    return mergeProgress(JSON.parse(raw))
  } catch {
    return cloneDefault()
  }
}

export function saveProgress(progress) {
  localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(progress))
}

export function mergeProgress(progress = {}) {
  return {
    ...cloneDefault(),
    ...progress,
    missionStars: { ...cloneDefault().missionStars, ...(progress.missionStars || {}) },
    completedMissions: [...new Set(progress.completedMissions || [])],
    unlockedWorlds: [...new Set(progress.unlockedWorlds || ['world-cvc-garden'])],
    battleResults: progress.battleResults || {},
    weakKeys: progress.weakKeys || {},
    weakWords: progress.weakWords || {},
    lastPlayed: progress.lastPlayed || cloneDefault().lastPlayed,
  }
}

export function getLevelMeta(xp) {
  const current = [...LEVELS].reverse().find(level => xp >= level.minXp) || LEVELS[0]
  const currentIndex = LEVELS.findIndex(level => level.rank === current.rank)
  const next = LEVELS[currentIndex + 1] || null
  const progressInLevel = next ? (xp - current.minXp) / (next.minXp - current.minXp) : 1

  return {
    current,
    next,
    progressInLevel,
  }
}

export function updateStreak(lastActiveDate) {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  if (!lastActiveDate) {
    return { streak: 1, lastActiveDate: todayStr }
  }

  if (lastActiveDate === todayStr) {
    return { streak: null, lastActiveDate: todayStr }
  }

  const previous = new Date(lastActiveDate)
  const diffDays = Math.round((today.setHours(0, 0, 0, 0) - previous.setHours(0, 0, 0, 0)) / 86400000)

  if (diffDays === 1) {
    return { streak: 'increment', lastActiveDate: todayStr }
  }

  return { streak: 1, lastActiveDate: todayStr }
}

export function fingerForKey(key) {
  const normalized = String(key).toLowerCase()
  const map = {
    q: 'left pinky', a: 'left pinky', z: 'left pinky',
    w: 'left ring', s: 'left ring', x: 'left ring',
    e: 'left middle', d: 'left middle', c: 'left middle',
    r: 'left index', f: 'left index', v: 'left index', t: 'left index', g: 'left index', b: 'left index',
    y: 'right index', h: 'right index', n: 'right index', u: 'right index', j: 'right index', m: 'right index',
    i: 'right middle', k: 'right middle',
    o: 'right ring', l: 'right ring',
    p: 'right pinky', ';': 'right pinky', enter: 'right pinky', backspace: 'right pinky', shift: 'pinky',
    space: 'thumbs',
  }

  return map[normalized] || 'home fingers'
}

export function normalizeInputKey(eventKey) {
  if (eventKey === ' ') return 'space'
  if (eventKey === 'Spacebar') return 'space'
  if (eventKey === 'Enter') return 'enter'
  if (eventKey === 'Backspace') return 'backspace'
  if (eventKey === 'Shift') return 'shift'
  return String(eventKey).toLowerCase()
}

export function calculateMissionStars({ accuracy, durationUsed, durationTarget }) {
  if (accuracy >= 98 && durationUsed <= durationTarget * 0.9) return 3
  if (accuracy >= 90) return 2
  if (accuracy >= 72) return 1
  return 0
}

export function calculateBattleStars({ accuracy, defeated, total, shield }) {
  if (defeated === total && accuracy >= 94 && shield >= 2) return 3
  if (defeated >= Math.ceil(total * 0.75) && accuracy >= 82) return 2
  if (defeated >= Math.ceil(total * 0.5)) return 1
  return 0
}

```

## `src/components/AcademyHome.jsx`

```jsx
import { IconCrown, IconStar, IconRefresh } from './Icons'

export default function AcademyHome({ progress, levelMeta, nextMission, nextWorld, onOpenMission, onOpenWorld }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(67,56,202,0.55),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.22),transparent_28%),#09090f] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)]">
        <p className="text-xs uppercase tracking-[0.38em] text-cyan-200/70">Keyboard Academy</p>
        <h1 className="mt-3 max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl">
          Train fingers like a pilot. Spell like a hero.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74 sm:text-base">
          Short missions build keyboard muscle memory. Neon word battles turn typing into a skill loop you actually want to replay.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Rank" value={levelMeta.current.rank} icon={<IconCrown size={16} />} />
          <StatCard label="Total Stars" value={String(progress.stars)} icon={<IconStar size={16} />} />
          <StatCard label="Daily Streak" value={`${progress.streak} days`} icon={<IconRefresh size={16} />} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => onOpenMission(nextMission.id)}
            className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition-transform hover:-translate-y-0.5"
          >
            Continue Mission · {nextMission.title}
          </button>
          <button
            onClick={() => onOpenWorld(nextWorld.id)}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            Jump into Battle · {nextWorld.title}
          </button>
        </div>
      </div>

      <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-200/70">XP progress</p>
        <div className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-3xl font-black text-white">{progress.xp}</div>
              <div className="mt-1 text-sm text-white/55">current XP</div>
            </div>
            <div className="text-right text-xs text-white/55">
              {levelMeta.next ? `Next rank · ${levelMeta.next.rank}` : 'Top rank reached'}
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#67e8f9,#c084fc,#f9a8d4)]"
              style={{ width: `${Math.max(6, Math.min(levelMeta.progressInLevel * 100, 100))}%` }}
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <MiniCard title="Next mission" subtitle={nextMission.description} />
          <MiniCard title="Next world" subtitle={nextWorld.theme} />
        </div>
      </div>
    </section>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
      <div className="flex items-center gap-2 text-cyan-100/75">{icon}<span className="text-xs uppercase tracking-[0.22em]">{label}</span></div>
      <div className="mt-4 text-2xl font-black text-white">{value}</div>
    </div>
  )
}

function MiniCard({ title, subtitle }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
      <div className="text-sm font-bold text-white">{title}</div>
      <div className="mt-1 text-sm leading-6 text-white/58">{subtitle}</div>
    </div>
  )
}

```

## `src/components/MissionMap.jsx`

```jsx
export default function MissionMap({ missions, progress, onSelectMission, selectedMissionId }) {
  return (
    <section className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Foundation missions</p>
          <h2 className="mt-2 text-2xl font-black text-white">Build the keyboard from anchor to word.</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/70">
          {progress.completedMissions.length}/{missions.length} completed
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {missions.map((mission, index) => {
          const stars = progress.missionStars[mission.id] || 0
          const completed = progress.completedMissions.includes(mission.id)
          const isSelected = selectedMissionId === mission.id
          return (
            <button
              key={mission.id}
              onClick={() => onSelectMission(mission.id)}
              className={[
                'rounded-[28px] border p-5 text-left transition-all',
                isSelected ? 'border-cyan-300 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.16)]' : 'border-white/10 bg-black/20 hover:bg-white/10',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-white/45">step {index + 1}</p>
                  <h3 className="mt-2 text-xl font-black text-white">{mission.title}</h3>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                  {completed ? 'cleared' : 'ready'}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/60">{mission.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                <span>{mission.duration}s micro-session</span>
                <span>{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

```

## `src/components/MissionPlay.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react'
import KeyboardVisualizer from './KeyboardVisualizer'
import {
  calculateMissionStars,
  fingerForKey,
  normalizeInputKey,
} from '../lib/academyProgress'

export default function MissionPlay({ mission, onComplete, onBack }) {
  const prompts = mission.prompts
  const [index, setIndex] = useState(0)
  const [correctHits, setCorrectHits] = useState(0)
  const [errors, setErrors] = useState({})
  const [recentKey, setRecentKey] = useState('')
  const [incorrectKey, setIncorrectKey] = useState('')
  const [startedAt] = useState(() => performance.now())
  const [feedback, setFeedback] = useState('Lock in your fingers and follow the glowing key.')

  const targetPrompt = prompts[index]
  const targetKey = useMemo(() => {
    if (!targetPrompt) return ''
    if (mission.type === 'short-words') return targetPrompt
    return String(targetPrompt).toLowerCase()
  }, [mission.type, targetPrompt])

  useEffect(() => {
    function onKeyDown(event) {
      const normalized = normalizeInputKey(event.key)
      setRecentKey(normalized)

      if (mission.type === 'short-words') {
        if (event.key.length === 1 || event.key === 'Backspace') {
          event.preventDefault()
        }
        return
      }

      if (normalized === targetKey) {
        setIncorrectKey('')
        setCorrectHits(prev => prev + 1)
        setFeedback(`Perfect. ${normalized.toUpperCase()} belongs to your ${fingerForKey(normalized)}.`)
        advance()
      } else {
        setIncorrectKey(normalized)
        setErrors(prev => ({ ...prev, [targetKey]: (prev[targetKey] || 0) + 1 }))
        setFeedback(`Use your ${fingerForKey(targetKey)} for ${targetKey.toUpperCase()}.`)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  function advance() {
    setIndex(prev => {
      const nextIndex = prev + 1
      if (nextIndex >= prompts.length) {
        finishMission(correctHits + 1)
        return prev
      }
      return nextIndex
    })
  }

  function finishMission(totalCorrect) {
    const durationUsed = (performance.now() - startedAt) / 1000
    const attempts = totalCorrect + Object.values(errors).reduce((sum, count) => sum + count, 0)
    const accuracy = attempts === 0 ? 100 : Math.round((totalCorrect / attempts) * 100)
    const stars = calculateMissionStars({
      accuracy,
      durationUsed,
      durationTarget: mission.duration,
    })

    onComplete({
      missionId: mission.id,
      stars,
      accuracy,
      errors,
      durationUsed,
      xpEarned: mission.rewards.xp,
    })
  }

  function handleWordSubmit(event) {
    event.preventDefault()
    const input = new FormData(event.currentTarget).get('word')?.toString().trim().toLowerCase() || ''
    if (!input) return

    if (input === targetKey) {
      setIncorrectKey('')
      setCorrectHits(prev => prev + 1)
      setFeedback(`Word locked. ${input.toUpperCase()} now feels automatic.`)
      event.currentTarget.reset()
      setIndex(prev => {
        const nextIndex = prev + 1
        if (nextIndex >= prompts.length) {
          const durationUsed = (performance.now() - startedAt) / 1000
          const attempts = correctHits + 1 + Object.values(errors).reduce((sum, count) => sum + count, 0)
          const accuracy = attempts === 0 ? 100 : Math.round(((correctHits + 1) / attempts) * 100)
          const stars = calculateMissionStars({ accuracy, durationUsed, durationTarget: mission.duration })
          onComplete({
            missionId: mission.id,
            stars,
            accuracy,
            errors,
            durationUsed,
            xpEarned: mission.rewards.xp,
          })
          return prev
        }
        return nextIndex
      })
    } else {
      const failedLetters = targetKey.split('').filter(letter => !input.includes(letter))
      const bucket = { ...errors }
      failedLetters.forEach(letter => {
        bucket[letter] = (bucket[letter] || 0) + 1
      })
      setErrors(bucket)
      setFeedback(`Try again. Let ${targetKey.toUpperCase()} flow from memory, not from searching.`)
      event.currentTarget.reset()
    }
  }

  const completion = Math.round((index / prompts.length) * 100)
  const suggestedFinger = mission.type === 'short-words'
    ? 'Blend the whole word into one smooth action.'
    : `Suggested finger · ${fingerForKey(targetKey)}`

  return (
    <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <button onClick={onBack} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10">Back</button>
          <div className="text-sm text-white/55">Prompt {Math.min(index + 1, prompts.length)} / {prompts.length}</div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,#67e8f9,#38bdf8,#818cf8)]" style={{ width: `${completion}%` }} />
        </div>

        <div className="mt-8 rounded-[30px] border border-cyan-300/15 bg-black/30 p-6 text-center shadow-[0_0_50px_rgba(6,182,212,0.12)]">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">current target</p>
          <div className="mt-4 text-6xl font-black uppercase tracking-[0.08em] text-white sm:text-7xl">{targetKey}</div>
          <p className="mt-4 text-sm leading-7 text-white/65">{feedback}</p>
        </div>

        {mission.type === 'short-words' && (
          <form onSubmit={handleWordSubmit} className="mt-5 flex gap-3">
            <input
              name="word"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              placeholder="Type the word here"
              className="flex-1 rounded-full border border-white/10 bg-black/30 px-5 py-4 text-lg font-bold text-white outline-none placeholder:text-white/25 focus:border-cyan-300/40"
            />
            <button className="rounded-full bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950">Fire</button>
          </form>
        )}
      </div>

      <KeyboardVisualizer
        targetKey={mission.type === 'short-words' ? targetKey[0] : targetKey}
        recentKey={recentKey}
        incorrectKey={incorrectKey}
        suggestedFinger={suggestedFinger}
      />
    </section>
  )
}

```

## `src/components/MissionResult.jsx`

```jsx
export default function MissionResult({ result, mission, onReplay, onNext }) {
  const topErrors = Object.entries(result.errors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return (
    <section className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Mission clear</p>
      <h2 className="mt-3 text-3xl font-black text-white">{mission.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
        You just moved one step closer to automatic typing. Keep stacking tiny wins.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Metric label="Stars" value={`${'★'.repeat(result.stars)}${'☆'.repeat(3 - result.stars)}`} />
        <Metric label="Accuracy" value={`${result.accuracy}%`} />
        <Metric label="Time" value={`${result.durationUsed.toFixed(1)}s`} />
        <Metric label="XP" value={`+${mission.rewards.xp}`} />
      </div>

      <div className="mt-6 rounded-[30px] border border-white/10 bg-black/25 p-5">
        <p className="text-sm font-bold text-white">Weak spot recap</p>
        {topErrors.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-3">
            {topErrors.map(([key, count]) => (
              <div key={key} className="rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-100">
                {key.toUpperCase()} · missed {count}x
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-emerald-200/80">Clean run. No recurring weak keys in this mission.</p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={onReplay} className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">Replay mission</button>
        <button onClick={onNext} className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950">Keep moving</button>
      </div>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-white/45">{label}</div>
      <div className="mt-3 text-2xl font-black text-white">{value}</div>
    </div>
  )
}

```

## `src/components/WorldsPanel.jsx`

```jsx
export default function WorldsPanel({ worlds, wordSetsById, progress, onSelectWorld, selectedWorldId }) {
  return (
    <section className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-fuchsia-200/70">Battle worlds</p>
          <h2 className="mt-2 text-2xl font-black text-white">Practice becomes combat the moment words appear.</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {worlds.map(world => {
          const unlocked = progress.unlockedWorlds.includes(world.id)
          const result = progress.battleResults[world.id]
          const wordCount = world.wordSetIds.flatMap(id => wordSetsById[id]?.words || []).length
          return (
            <button
              key={world.id}
              disabled={!unlocked}
              onClick={() => onSelectWorld(world.id)}
              className={[
                'rounded-[28px] border p-5 text-left transition-all',
                selectedWorldId === world.id ? 'border-fuchsia-300 bg-fuchsia-300/10 shadow-[0_0_35px_rgba(217,70,239,0.16)]' : 'border-white/10 bg-black/20',
                unlocked ? 'hover:bg-white/10' : 'cursor-not-allowed opacity-45',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-white/45">{world.difficultyTag}</p>
                  <h3 className="mt-2 text-xl font-black text-white">{world.title}</h3>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                  {unlocked ? 'unlocked' : 'locked'}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/60">{world.theme}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-white/58">
                <span>{wordCount} words · boss {world.bossWord}</span>
                <span>{result ? `${'★'.repeat(result.stars)}${'☆'.repeat(3 - result.stars)}` : '☆☆☆'}</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

```

## `src/components/BattlePlay.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react'
import { calculateBattleStars } from '../lib/academyProgress'

function makeWave(words) {
  return words.map((word, index) => ({
    id: `${word}-${index}`,
    word,
    progress: 0,
    distance: 0,
    destroyed: false,
  }))
}

export default function BattlePlay({ world, words, onComplete, onBack }) {
  const [enemies, setEnemies] = useState(() => makeWave(words))
  const [lockedEnemyId, setLockedEnemyId] = useState(null)
  const [combo, setCombo] = useState(0)
  const [score, setScore] = useState(0)
  const [shield, setShield] = useState(3)
  const [feedback, setFeedback] = useState('Type to lock onto the nearest word target.')
  const [startedAt] = useState(() => performance.now())

  const activeEnemies = useMemo(() => enemies.filter(enemy => !enemy.destroyed && enemy.distance < 100), [enemies])
  const lockedEnemy = activeEnemies.find(enemy => enemy.id === lockedEnemyId) || activeEnemies[0] || null

  useEffect(() => {
    if (activeEnemies.length === 0 || shield <= 0) return

    const interval = window.setInterval(() => {
      setEnemies(prev => prev.map(enemy => {
        if (enemy.destroyed || enemy.distance >= 100) return enemy
        const nextDistance = enemy.distance + 1.6
        if (nextDistance >= 100) {
          setShield(current => Math.max(current - 1, 0))
          setCombo(0)
          setFeedback(`${enemy.word.toUpperCase()} slipped through your shield.`)
        }
        return { ...enemy, distance: Math.min(nextDistance, 100) }
      }))
    }, 180)

    return () => window.clearInterval(interval)
  }, [activeEnemies.length, shield])

  useEffect(() => {
    function onKeyDown(event) {
      if (shield <= 0) return
      if (!lockedEnemy) return
      if (event.key.length !== 1) return

      const key = event.key.toLowerCase()
      const expected = lockedEnemy.word[lockedEnemy.progress]

      if (key === expected) {
        setEnemies(prev => prev.map(enemy => {
          if (enemy.id !== lockedEnemy.id) return enemy
          const nextProgress = enemy.progress + 1
          const completed = nextProgress >= enemy.word.length
          return {
            ...enemy,
            progress: nextProgress,
            destroyed: completed,
            distance: completed ? enemy.distance : enemy.distance,
          }
        }))

        if (lockedEnemy.progress + 1 >= lockedEnemy.word.length) {
          const nextCombo = combo + 1
          setCombo(nextCombo)
          setScore(prev => prev + lockedEnemy.word.length * 14 + nextCombo * 9)
          setFeedback(`${lockedEnemy.word.toUpperCase()} destroyed. Combo x${nextCombo}.`)
          setLockedEnemyId(null)
        } else {
          setScore(prev => prev + 8)
          setFeedback(`Hit ${key.toUpperCase()} · keep firing.`)
        }
      } else {
        setCombo(0)
        setShield(prev => Math.max(prev - 1, 0))
        setFeedback(`Miss. ${expected.toUpperCase()} was the next strike.`)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [combo, lockedEnemy, shield])

  useEffect(() => {
    if (activeEnemies.length > 0 && !lockedEnemyId) {
      setLockedEnemyId(activeEnemies[0].id)
    }
  }, [activeEnemies, lockedEnemyId])

  useEffect(() => {
    const allDestroyed = enemies.every(enemy => enemy.destroyed || enemy.distance >= 100)
    if (!allDestroyed) return

    const defeatedWords = enemies.filter(enemy => enemy.destroyed).map(enemy => enemy.word)
    const failedWords = enemies.filter(enemy => !enemy.destroyed).map(enemy => enemy.word)
    const totalTyped = enemies.reduce((sum, enemy) => sum + enemy.progress, 0)
    const totalLetters = enemies.reduce((sum, enemy) => sum + enemy.word.length, 0)
    const accuracy = totalLetters === 0 ? 100 : Math.round((totalTyped / totalLetters) * 100)
    const stars = calculateBattleStars({
      accuracy,
      defeated: defeatedWords.length,
      total: enemies.length,
      shield,
    })

    onComplete({
      worldId: world.id,
      stars,
      accuracy,
      score,
      defeatedWords,
      failedWords,
      shieldLeft: shield,
      durationUsed: (performance.now() - startedAt) / 1000,
      xpEarned: 120 + defeatedWords.length * 16,
    })
  }, [enemies, onComplete, score, shield, startedAt, world.id])

  return (
    <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.24),transparent_34%),#07070b] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between gap-4">
          <button onClick={onBack} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10">Back</button>
          <div className="text-sm text-white/60">{world.title}</div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Hud label="Shield" value={String(shield)} />
          <Hud label="Combo" value={`x${combo}`} />
          <Hud label="Score" value={String(score)} />
        </div>

        <div className="relative mt-6 min-h-[360px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.95),rgba(2,6,23,0.98))] p-4">
          {activeEnemies.map(enemy => {
            const isLocked = enemy.id === lockedEnemy?.id
            return (
              <button
                key={enemy.id}
                onClick={() => setLockedEnemyId(enemy.id)}
                className={[
                  'absolute left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border px-4 py-2 transition-all',
                  isLocked ? 'border-fuchsia-300 bg-fuchsia-400/16 shadow-[0_0_30px_rgba(217,70,239,0.26)]' : 'border-white/10 bg-white/6',
                ].join(' ')}
                style={{ top: `${enemy.distance}%`, transform: `translateX(${(enemy.distance % 2 === 0 ? -1 : 1) * enemy.word.length * 4}px)` }}
              >
                <span className="text-sm font-black uppercase tracking-[0.08em] text-white">{enemy.word.slice(0, enemy.progress)}</span>
                <span className="text-sm font-black uppercase tracking-[0.08em] text-white/35">{enemy.word.slice(enemy.progress)}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-200/70">Combat feed</p>
        <h2 className="mt-3 text-3xl font-black text-white">{lockedEnemy ? lockedEnemy.word : 'Wave complete'}</h2>
        <p className="mt-4 text-sm leading-7 text-white/64">{feedback}</p>

        <div className="mt-6 rounded-[30px] border border-white/10 bg-black/25 p-5">
          <p className="text-sm font-bold text-white">How this teaches</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-white/58">
            <li>• Correct letters feel like attacks, so spelling stays meaningful.</li>
            <li>• Combo rewards smooth flow instead of hesitant hunting.</li>
            <li>• Shield softens failure so learners stay in the loop longer.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function Hud({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-white/42">{label}</div>
      <div className="mt-3 text-2xl font-black text-white">{value}</div>
    </div>
  )
}

```

## `src/components/BattleResult.jsx`

```jsx
export default function BattleResult({ world, result, onReplay, onBackToWorlds }) {
  return (
    <section className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-200/70">Battle report</p>
      <h2 className="mt-3 text-3xl font-black text-white">{world.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
        Every clean word destroy makes your spelling faster, calmer, and more automatic.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-5">
        <Metric label="Stars" value={`${'★'.repeat(result.stars)}${'☆'.repeat(3 - result.stars)}`} />
        <Metric label="Accuracy" value={`${result.accuracy}%`} />
        <Metric label="Score" value={String(result.score)} />
        <Metric label="Shield" value={String(result.shieldLeft)} />
        <Metric label="XP" value={`+${result.xpEarned}`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <WordList title="Destroyed words" items={result.defeatedWords} tone="emerald" />
        <WordList title="Words to revisit" items={result.failedWords} tone="rose" />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={onReplay} className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">Replay battle</button>
        <button onClick={onBackToWorlds} className="rounded-full bg-fuchsia-300 px-5 py-3 text-sm font-black text-slate-950">Back to worlds</button>
      </div>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-white/42">{label}</div>
      <div className="mt-3 text-2xl font-black text-white">{value}</div>
    </div>
  )
}

function WordList({ title, items, tone }) {
  const styles = tone === 'emerald'
    ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100'
    : 'border-rose-300/20 bg-rose-400/10 text-rose-100'

  return (
    <div className="rounded-[30px] border border-white/10 bg-black/25 p-5">
      <p className="text-sm font-bold text-white">{title}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {items.length > 0 ? items.map(item => (
          <span key={item} className={`rounded-full border px-4 py-2 text-sm ${styles}`}>{item}</span>
        )) : <span className="text-sm text-white/45">None this round.</span>}
      </div>
    </div>
  )
}

```

## `src/components/ProfilePanel.jsx`

```jsx
export default function ProfilePanel({ progress, levelMeta }) {
  const weakKeys = Object.entries(progress.weakKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  const weakWords = Object.entries(progress.weakWords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Pilot profile</p>
        <h2 className="mt-2 text-3xl font-black text-white">{levelMeta.current.rank}</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">
          Your growth system connects missions and battle runs into one continuous typing identity.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Metric label="XP" value={String(progress.xp)} />
          <Metric label="Stars" value={String(progress.stars)} />
          <Metric label="Streak" value={`${progress.streak} days`} />
          <Metric label="Worlds Cleared" value={String(Object.keys(progress.battleResults).length)} />
        </div>
      </div>

      <div className="space-y-5">
        <WordBuckets title="Weak keys" items={weakKeys} emptyText="No recurring misses yet." formatter={([key, count]) => `${key.toUpperCase()} · ${count}x`} />
        <WordBuckets title="Weak words" items={weakWords} emptyText="Your battle misses will surface here." formatter={([word, count]) => `${word} · ${count}x`} />
      </div>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-white/42">{label}</div>
      <div className="mt-3 text-2xl font-black text-white">{value}</div>
    </div>
  )
}

function WordBuckets({ title, items, emptyText, formatter }) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="text-lg font-black text-white">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-3">
        {items.length > 0 ? items.map(item => (
          <span key={item[0]} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/74">
            {formatter(item)}
          </span>
        )) : <span className="text-sm text-white/45">{emptyText}</span>}
      </div>
    </div>
  )
}

```

## `src/components/AuditPanel.jsx`

```jsx
const architecture = [
  { label: 'training engine', text: 'Mission timing, prompt order, key validation, star rating.' },
  { label: 'battle engine', text: 'Enemy words, target lock, combo loop, shield loss, score.' },
  { label: 'progression engine', text: 'XP, levels, stars, streak, weak-key and weak-word tracking.' },
  { label: 'content layer', text: 'JSON-driven missions, worlds, and word sets for fast expansion.' },
]

const qualityChecks = [
  'Short loops stay under one minute for low cognitive load.',
  'Errors correct movement first instead of only saying “wrong”.',
  'Battle rewards smooth spelling rather than random button mash.',
  'Weak spots are recorded so replay becomes targeted practice.',
]

export default function AuditPanel() {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.28em] text-fuchsia-200/70">Architecture snapshot</p>
        <div className="mt-5 space-y-4">
          {architecture.map(item => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-white/42">{item.label}</div>
              <div className="mt-2 text-sm leading-6 text-white/72">{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Review checklist</p>
        <div className="mt-5 space-y-3">
          {qualityChecks.map(item => (
            <div key={item} className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-white/72">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

```

## `src/components/KeyboardVisualizer.jsx`

```jsx
const rows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ['shift', 'space', 'enter', 'backspace'],
]

const fingerGroups = {
  'left pinky': ['q', 'a', 'z'],
  'left ring': ['w', 's', 'x'],
  'left middle': ['e', 'd', 'c'],
  'left index': ['r', 't', 'f', 'g', 'v', 'b'],
  'right index': ['y', 'u', 'h', 'j', 'n', 'm'],
  'right middle': ['i', 'k'],
  'right ring': ['o', 'l'],
  'right pinky': ['p', ';', 'enter', 'backspace'],
  thumbs: ['space'],
  pinky: ['shift'],
}

const colorMap = {
  'left pinky': 'rgba(255, 132, 132, 0.22)',
  'left ring': 'rgba(255, 177, 79, 0.22)',
  'left middle': 'rgba(255, 221, 89, 0.22)',
  'left index': 'rgba(121, 210, 138, 0.22)',
  'right index': 'rgba(90, 197, 255, 0.22)',
  'right middle': 'rgba(116, 149, 255, 0.22)',
  'right ring': 'rgba(176, 121, 255, 0.22)',
  'right pinky': 'rgba(255, 126, 223, 0.22)',
  thumbs: 'rgba(255, 255, 255, 0.18)',
  pinky: 'rgba(255, 126, 223, 0.22)',
}

function groupForKey(key) {
  return Object.keys(fingerGroups).find(group => fingerGroups[group].includes(key)) || 'left index'
}

export default function KeyboardVisualizer({ targetKey, recentKey, incorrectKey, suggestedFinger }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-black/40 p-4 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Finger guide</p>
          <p className="mt-1 text-lg font-black text-white">{suggestedFinger}</p>
        </div>
        <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          target · {targetKey}
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map(key => {
              const isTarget = key === targetKey
              const isRecent = key === recentKey
              const isIncorrect = key === incorrectKey
              const group = groupForKey(key)
              return (
                <div
                  key={key}
                  className={[
                    'flex min-h-[54px] min-w-[54px] flex-1 items-center justify-center rounded-2xl border text-sm font-black uppercase transition-all duration-150',
                    isTarget ? 'border-cyan-300 bg-cyan-300/20 text-cyan-50 shadow-[0_0_24px_rgba(77,208,225,0.35)] -translate-y-1' : 'border-white/10 text-white/86',
                    isRecent ? 'scale-[1.04]' : '',
                    isIncorrect ? 'border-rose-300 bg-rose-400/20 text-rose-50' : '',
                  ].join(' ')}
                  style={{ backgroundColor: isTarget || isIncorrect ? undefined : colorMap[group] }}
                >
                  <span>{key === 'space' ? 'space' : key}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

```

## `src/data/missions.json`

```json
[
  {
    "id": "mission-anchor-fj",
    "title": "Mission 1 · F / J Anchor",
    "type": "anchor",
    "targetKeys": ["f", "j"],
    "prompts": ["f", "j", "f", "j", "f", "j", "j", "f", "f", "j", "f", "j"],
    "duration": 25,
    "unlockRule": { "type": "default" },
    "rewards": { "xp": 60 },
    "description": "Find the two anchor keys and build your home position."
  },
  {
    "id": "mission-home-row",
    "title": "Mission 2 · Home Row",
    "type": "home-row",
    "targetKeys": ["a", "s", "d", "f", "j", "k", "l", ";"],
    "prompts": ["a", "s", "d", "f", "j", "k", "l", ";", "f", "d", "s", "a", ";", "l", "k", "j"],
    "duration": 32,
    "unlockRule": { "type": "mission_complete", "missionId": "mission-anchor-fj" },
    "rewards": { "xp": 75 },
    "description": "Own the keyboard center line before you move anywhere else."
  },
  {
    "id": "mission-top-row",
    "title": "Mission 3 · Top Row",
    "type": "top-row",
    "targetKeys": ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    "prompts": ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "p", "o", "i", "u", "y", "t", "r", "e", "w", "q"],
    "duration": 35,
    "unlockRule": { "type": "mission_complete", "missionId": "mission-home-row" },
    "rewards": { "xp": 80 },
    "description": "Reach upward without losing your home-row reference."
  },
  {
    "id": "mission-bottom-row",
    "title": "Mission 4 · Bottom Row",
    "type": "bottom-row",
    "targetKeys": ["z", "x", "c", "v", "b", "n", "m"],
    "prompts": ["z", "x", "c", "v", "b", "n", "m", "m", "n", "b", "v", "c", "x", "z"],
    "duration": 30,
    "unlockRule": { "type": "mission_complete", "missionId": "mission-top-row" },
    "rewards": { "xp": 85 },
    "description": "Train the lower reach and keep your hands relaxed."
  },
  {
    "id": "mission-utility-keys",
    "title": "Mission 5 · Utility Keys",
    "type": "utility",
    "targetKeys": ["space", "enter", "shift", "backspace"],
    "prompts": ["space", "space", "enter", "shift", "space", "backspace", "shift", "enter", "space", "backspace"],
    "duration": 28,
    "unlockRule": { "type": "mission_complete", "missionId": "mission-bottom-row" },
    "rewards": { "xp": 90 },
    "description": "Master the support keys that keep real typing flowing."
  },
  {
    "id": "mission-short-words",
    "title": "Mission 6 · Short Words",
    "type": "short-words",
    "targetKeys": ["cat", "run", "map", "sun", "red", "ship"],
    "prompts": ["cat", "run", "map", "sun", "red", "ship"],
    "duration": 40,
    "unlockRule": { "type": "mission_complete", "missionId": "mission-utility-keys" },
    "rewards": { "xp": 120 },
    "description": "Turn isolated keys into real language chunks."
  }
]

```

## `src/data/worlds.json`

```json
[
  {
    "id": "world-cvc-garden",
    "title": "World 1 · CVC Garden",
    "theme": "Warm up with tiny creatures and quick three-letter hits.",
    "difficultyTag": "starter",
    "wordSetIds": ["set-three-letter"],
    "bossWord": "rocket",
    "unlockRule": { "requiredMissionIds": ["mission-anchor-fj", "mission-home-row", "mission-top-row"] }
  },
  {
    "id": "world-sight-metro",
    "title": "World 2 · Sight Metro",
    "theme": "Higher-frequency words rush in like neon trains.",
    "difficultyTag": "flow",
    "wordSetIds": ["set-high-frequency"],
    "bossWord": "community",
    "unlockRule": { "requiredMissionIds": ["mission-short-words"], "requiredWorldIds": ["world-cvc-garden"] }
  }
]

```

## `src/data/word_sets.json`

```json
[
  {
    "id": "set-three-letter",
    "category": "3-letter words",
    "words": ["cat", "run", "map", "sun", "pen", "box", "pig", "hat", "jam", "log"],
    "phonicsTag": "cvc",
    "difficulty": 1
  },
  {
    "id": "set-high-frequency",
    "category": "high-frequency words",
    "words": ["the", "and", "with", "from", "there", "come", "little", "people", "because", "friend"],
    "phonicsTag": "sight",
    "difficulty": 2
  }
]

```

## `src/index.css`

```css
@import "tailwindcss";

:root {
  color: rgba(255, 255, 255, 0.92);
  background: #050816;
}

* {
  box-sizing: border-box;
  font-family: 'Azeret Mono', 'Noto Sans SC', sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #050816;
}

button,
input {
  font: inherit;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.shake {
  animation: shake 0.4s ease-in-out;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.pop {
  animation: pop 0.2s ease-in-out;
}

/* Space theme (replaces ocean) */
@keyframes bubble-rise {
  0%   { transform: translateY(0) translateX(0); opacity: 0.55; }
  50%  { transform: translateY(-45vh) translateX(10px); opacity: 0.3; }
  100% { transform: translateY(-92vh) translateX(-6px); opacity: 0; }
}

@keyframes fish-drift {
  0%   { transform: translateX(-100px); opacity: 0; }
  5%   { opacity: 1; }
  95%  { opacity: 1; }
  100% { transform: translateX(110vw); opacity: 0; }
}

.ocean-bubble {
  position: absolute;
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 28%, rgba(255,255,255,0.32) 0%, transparent 22%),
    radial-gradient(circle at 65% 68%, rgba(140,210,255,0.1) 0%, transparent 28%),
    radial-gradient(circle at 50% 50%, rgba(80,160,220,0.04) 0%, transparent 70%);
  border: 1px solid rgba(180, 220, 255, 0.3);
  box-shadow: inset 1px 1px 4px rgba(255,255,255,0.22), 0 0 5px rgba(100,180,255,0.08);
  animation: bubble-rise linear infinite;
  pointer-events: none;
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.bikini-character {
  animation: bob ease-in-out infinite;
}

.ocean-fish {
  position: absolute;
  animation: fish-drift linear infinite;
  pointer-events: none;
  line-height: 1;
  filter: drop-shadow(0 0 8px rgba(160, 120, 255, 0.5));
}

/* Space background */
.ocean-main {
  background: linear-gradient(to bottom, #0a0a0a 0%, #111111 50%, #0d0d0d 100%) !important;
}

/* Twinkling stars */
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
}
.star {
  position: fixed;
  border-radius: 50%;
  background: white;
  pointer-events: none;
  animation: twinkle ease-in-out infinite;
}

/* Milky way */
.milky-way {
  position: fixed;
  pointer-events: none;
  background: linear-gradient(105deg,
    transparent 0%,
    rgba(200,200,200,0.02) 20%,
    rgba(220,220,220,0.04) 40%,
    rgba(200,200,200,0.02) 60%,
    transparent 80%
  );
  filter: blur(18px);
}

@keyframes word-bubble-pop {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  12%  { opacity: 0.85; }
  100% { transform: translateY(-110px) translateX(var(--dx, 0px)); opacity: 0; }
}
.word-bubble {
  position: absolute;
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55) 0%, transparent 22%),
    radial-gradient(circle at 50% 50%, rgba(120,200,255,0.08) 0%, transparent 70%);
  border: 1px solid rgba(180, 230, 255, 0.5);
  box-shadow: inset 1px 1px 4px rgba(255,255,255,0.35);
  animation: word-bubble-pop 0.7s ease-out both;
  pointer-events: none;
  bottom: 4px;
}

/* Word translation popup */
.word-translation span {
  font-family: "Kaiti SC", "STKaiti", "KaiTi", serif !important;
  font-weight: bold !important;
}

.word-translation {
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
  pointer-events: none;
  white-space: nowrap;
}
.word-translation.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@keyframes color-bubble-rise {
  0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.92; }
  70%  { opacity: 0.65; }
  100% { transform: translateY(-280px) translateX(var(--dx, 0px)) scale(0.4); opacity: 0; }
}
@keyframes fw-spark {
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--fx), var(--fy)) scale(0); opacity: 0; }
}
.fw-spark {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  animation: fw-spark ease-out forwards;
}

.color-bubble {
  position: absolute;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,0.7) 0%, transparent 20%),
    radial-gradient(circle at 68% 68%, rgba(180,230,255,0.18) 0%, transparent 26%),
    radial-gradient(circle at 50% 50%, rgba(200,160,255,0.08) 0%, transparent 65%);
  border: 1.5px solid rgba(210, 240, 255, 0.5);
  box-shadow:
    inset 2px 2px 6px rgba(255,255,255,0.45),
    inset -1px -1px 4px rgba(150,200,255,0.18);
  animation: color-bubble-rise ease-out forwards;
  pointer-events: none;
}

```

## `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;500;700;900&family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet" />
    <title>Keyboard Academy</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

## `README.md`

```md
# Keyboard Academy

Keyboard Academy 是一个把英语输入能力拆成两层循环的 Web MVP：

- `Foundation Missions`：从 `F/J` 锚点、Home Row、上下排到功能键与短词输入
- `Typing Shooter Worlds`：把单词输入映射成战斗行为，用 combo、shield、score 和 XP 驱动重复游玩

这个版本不是传统打字工具，而是一个围绕“键盘是技能系统”构建的可审核原型。

## MVP 覆盖内容

### 基础训练层
- 6 个 Mission：`F/J`、`Home Row`、`Top Row`、`Bottom Row`、`Utility Keys`、`Short Words`
- 虚拟键盘可视化
- 实时目标键高亮
- 指法提示与错误反馈
- 任务结果页：准确率、时间、星级、错误键

### 实战应用层
- 2 个 World：`CVC Garden`、`Sight Metro`
- 单词敌人推进
- 输入锁定当前目标词
- 正确字母推进攻击
- 错误输入打断节奏并扣 shield
- Battle 结果页：星级、准确率、得分、错词复现

### 成长系统
- XP 与等级称号
- 星星累计
- streak 本地记录
- weak keys / weak words 追踪
- Mission → World 解锁关系

## 主要目录

- `src/App.jsx`：主入口与页面切换
- `src/components/AcademyHome.jsx`：首页
- `src/components/MissionMap.jsx`：Mission 路径图
- `src/components/MissionPlay.jsx`：Mission 训练界面
- `src/components/MissionResult.jsx`：Mission 结算
- `src/components/WorldsPanel.jsx`：World 选择页
- `src/components/BattlePlay.jsx`：Typing Shooter 战斗页
- `src/components/BattleResult.jsx`：Battle 结算
- `src/components/ProfilePanel.jsx`：进度与弱项面板
- `src/components/AuditPanel.jsx`：技术架构与审核检查摘要
- `src/hooks/useAcademyProgress.js`：统一成长状态
- `src/lib/academyProgress.js`：等级、星级、streak、输入工具函数
- `src/data/missions.json`：Mission 配置
- `src/data/worlds.json`：World 配置
- `src/data/word_sets.json`：词库配置

## 本地数据存储

应用当前使用 `localStorage` 保存：

- 完成的 Mission
- 每关星级
- 已解锁 World
- XP / level progress
- streak
- weak keys
- weak words

核心 key：`keyboard_academy_progress`

## 运行方式

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

## 适合 Claude 审核的点

1. 训练层与战斗层是否共享统一成长系统
2. 数据结构是否足够支持新 Mission / World 扩展
3. Mission 与 Battle 的状态边界是否清晰
4. 本地存储结构是否足够支撑 MVP 验证
5. 即时反馈是否影响输入节奏
6. 错词与错键复现是否足够简单可落地

## 当前取舍

为了收敛 MVP，当前版本没有实现：

- 账号系统
- 云同步
- 多人玩法
- AI 动态生成词库
- 教师/家长后台
- 音效与复杂动画管线

但相关扩展点已经通过 `JSON + progression engine` 预留。

```
