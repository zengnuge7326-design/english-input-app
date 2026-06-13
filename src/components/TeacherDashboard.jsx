import { useState, useEffect } from 'react'
import {
  getTeacherProfile, updateTeacherProfile,
  getMyClasses, createClass, deleteClass,
  getClassStudents, getStudentCheckins, getClassLeaderboard,
} from '../lib/teacher'

// ── 小工具 ────────────────────────────────────────────

function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-2xl ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

function Btn({ children, onClick, color = 'blue', size = 'md', disabled, className = '' }) {
  const colors = {
    blue:  'bg-blue-600 hover:bg-blue-500 text-white',
    red:   'bg-red-900/60 hover:bg-red-800 text-red-300 border border-red-800',
    gray:  'bg-gray-800 hover:bg-gray-700 text-gray-200',
    green: 'bg-green-700 hover:bg-green-600 text-white',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-800',
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl font-medium transition-colors disabled:opacity-40 ${colors[color]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

function InputField({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      <input
        {...props}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  )
}

// ── 打卡热力图（7 天）────────────────────────────────

function CheckinHeatmap({ checkins }) {
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })
  const labels = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="flex gap-1 items-end">
      {days.map(date => {
        const count = checkins.filter(c => c.date === date).length
        const max = 30
        const pct = Math.min(count / max, 1)
        const d = new Date(date + 'T00:00:00')
        const label = labels[d.getDay()]
        return (
          <div key={date} className="flex flex-col items-center gap-1">
            <div
              className="w-7 rounded-md transition-all"
              style={{
                height: `${Math.max(8, pct * 48)}px`,
                backgroundColor: count === 0 ? '#1f2937' : `rgba(59,130,246,${0.3 + pct * 0.7})`,
              }}
              title={`${date}: ${count}人打卡`}
            />
            <span className="text-gray-600 text-[10px]">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── 学生列表 ─────────────────────────────────────────

function StudentList({ token, classId }) {
  const [students, setStudents] = useState([])
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getClassStudents(token, classId),
      getStudentCheckins(token, classId, 7),
    ]).then(([s, c]) => {
      setStudents(s)
      setCheckins(c)
      setLoading(false)
    })
  }, [token, classId])

  const today = new Date().toISOString().slice(0, 10)
  // 最近 7 天日期（升序）
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })

  // 从打卡日期集合算「当前连续天数」（今天或昨天起往前数）
  function currentStreak(dateSet) {
    let streak = 0
    const d = new Date()
    // 今天未打卡则从昨天起算，避免今天还没打卡就断成 0
    if (!dateSet.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1)
    for (;;) {
      const key = d.toISOString().slice(0, 10)
      if (dateSet.has(key)) { streak += 1; d.setDate(d.getDate() - 1) }
      else break
    }
    return streak
  }

  if (loading) return <p className="text-gray-600 text-sm py-4 text-center">加载中…</p>
  if (students.length === 0) return (
    <p className="text-gray-600 text-sm py-8 text-center">暂无学生加入，把班级码发给他们吧</p>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-xs border-b border-gray-800">
            <th className="text-left py-2 px-3">学生</th>
            <th className="text-center py-2 px-3">今日</th>
            <th className="text-center py-2 px-3 hidden sm:table-cell">近 7 天</th>
            <th className="text-center py-2 px-3">连续</th>
            <th className="text-center py-2 px-3">活跃</th>
            <th className="text-center py-2 px-3">本周句数</th>
            <th className="text-center py-2 px-3">本周词数</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => {
            const myCheckins = checkins.filter(c => c.student_id === s.id)
            const dateSet = new Set(myCheckins.map(c => c.date))
            const todayCheckin = dateSet.has(today)
            const weekSentences = myCheckins.reduce((a, c) => a + (c.sentences_done || 0), 0)
            const weekWords = myCheckins.reduce((a, c) => a + (c.words_done || 0), 0)
            const activeDays = dateSet.size
            const streak = currentStreak(dateSet)
            return (
              <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-3 text-white font-medium">{s.display_name}</td>
                <td className="py-3 px-3 text-center">
                  {todayCheckin
                    ? <span className="text-green-400 text-xs bg-green-900/40 border border-green-800 px-2 py-0.5 rounded-full">✓</span>
                    : <span className="text-gray-600 text-xs">—</span>
                  }
                </td>
                <td className="py-3 px-3 hidden sm:table-cell">
                  <div className="flex gap-1 justify-center">
                    {week.map(date => (
                      <span
                        key={date}
                        title={`${date}: ${dateSet.has(date) ? '已打卡' : '未打卡'}`}
                        className={`w-2.5 h-2.5 rounded-sm ${dateSet.has(date) ? 'bg-green-400' : 'bg-gray-700'}`}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-3 text-center tabular-nums">
                  {streak > 0
                    ? <span className="text-amber-400 font-semibold">🔥{streak}</span>
                    : <span className="text-gray-600">—</span>}
                </td>
                <td className="py-3 px-3 text-center text-gray-300 tabular-nums">{activeDays || '—'}</td>
                <td className="py-3 px-3 text-center text-blue-300 tabular-nums">{weekSentences || '—'}</td>
                <td className="py-3 px-3 text-center text-purple-300 tabular-nums">{weekWords || '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── 班级排行榜（老师视角，带奖牌）──────────────────────

function ClassLeaderboard({ classId }) {
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getClassLeaderboard(classId, 7).then(d => { setBoard(d); setLoading(false) })
  }, [classId])
  const medal = (r) => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `${r}`
  const list = board?.students || []
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">🏆 本周排行榜</h2>
        <span className="text-xs text-gray-600">积分 = 句数×2 + 词数</span>
      </div>
      {loading ? (
        <p className="text-gray-600 text-sm py-6 text-center">加载中…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-600 text-sm py-6 text-center">暂无学生</p>
      ) : (
        <div className="flex flex-col">
          {list.map(s => (
            <div key={s.id} className="flex items-center gap-3 px-5 py-2.5 border-b border-gray-800/50 text-sm">
              <span className={`w-7 text-center font-bold ${s.rank <= 3 ? 'text-lg' : 'text-gray-500 text-xs'}`}>{medal(s.rank)}</span>
              <span className="flex-1 truncate text-white">{s.name}</span>
              <span className="text-gray-500 text-xs">{s.sentences}句 · {s.daysActive}天</span>
              <span className="text-amber-400 font-bold tabular-nums w-12 text-right">{s.points}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

// ── 班级详情页 ────────────────────────────────────────

function ClassDetail({ token, cls, onBack }) {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getStudentCheckins(token, cls.id, 7).then(c => { setCheckins(c); setLoading(false) })
  }, [token, cls.id])

  function copyCode() {
    navigator.clipboard.writeText(cls.class_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const todayStr = new Date().toISOString().slice(0, 10)
  const todayCount = checkins.filter(c => c.date === todayStr).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
          ← 返回
        </button>
        <h1 className="text-xl font-bold text-white flex-1">{cls.name}</h1>
      </div>

      <Card className="p-5 flex flex-wrap gap-6 items-center">
        <div>
          <p className="text-xs text-gray-500 mb-1">班级码</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-mono font-bold text-blue-400 tracking-widest">{cls.class_code}</span>
            <Btn size="sm" color="gray" onClick={copyCode}>{copied ? '已复制 ✓' : '复制邀请'}</Btn>
          </div>
          <p className="text-xs text-gray-600 mt-1">学生在 okenglish.site 输入此码即可加入</p>
        </div>
        <div className="border-l border-gray-800 pl-6">
          <p className="text-xs text-gray-500 mb-1">今日打卡</p>
          <p className="text-2xl font-bold text-green-400">{loading ? '…' : todayCount} 人</p>
        </div>
        <div className="ml-auto">
          <p className="text-xs text-gray-500 mb-2">近7天打卡趋势</p>
          {!loading && <CheckinHeatmap checkins={checkins} />}
        </div>
      </Card>

      <ClassLeaderboard classId={cls.id} />

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">学生学习情况</h2>
        </div>
        <StudentList token={token} classId={cls.id} />
      </Card>
    </div>
  )
}

// ── 教师主界面 ────────────────────────────────────────

function TeacherHome({ token, username }) {
  const [profile, setProfile] = useState(null)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createErr, setCreateErr] = useState('')

  useEffect(() => {
    Promise.all([
      getTeacherProfile(token),
      getMyClasses(token),
    ]).then(([prof, list]) => {
      setProfile(prof)
      setClasses(list)
      setLoading(false)
    })
  }, [token])

  async function loadClasses() {
    const list = await getMyClasses(token)
    setClasses(list)
  }

  async function handleCreate() {
    if (!newClassName.trim()) return
    setCreating(true); setCreateErr('')
    const data = await createClass(token, newClassName.trim())
    if (data.error) { setCreateErr(data.error); setCreating(false); return }
    setClasses(prev => [data, ...prev])
    setNewClassName('')
    setShowCreate(false)
    setCreating(false)
  }

  async function handleDelete(cls) {
    if (!window.confirm(`确定删除班级「${cls.name}」？所有学生数据将一并删除。`)) return
    await deleteClass(token, cls.id)
    setClasses(prev => prev.filter(c => c.id !== cls.id))
  }

  if (detail) return <ClassDetail token={token} cls={detail} onBack={() => setDetail(null)} />

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <span className="text-gray-600 text-sm">加载中…</span>
    </div>
  )

  const displayName = profile?.name || username || '老师'
  const school = profile?.school || ''

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">班级管理</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {displayName}{school ? ` · ${school}` : ''}
          </p>
        </div>
        <Btn color="green" onClick={() => setShowCreate(true)}>＋ 创建班级</Btn>
      </div>

      {/* 创建班级弹窗 */}
      {showCreate && (
        <Card className="p-5 space-y-4">
          <h2 className="text-white font-semibold">创建新班级</h2>
          <InputField
            label="班级名称"
            placeholder="如：五年级2班 / 英语A班"
            value={newClassName}
            onChange={e => setNewClassName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          {createErr && <p className="text-red-400 text-xs">{createErr}</p>}
          <div className="flex gap-2">
            <Btn color="green" onClick={handleCreate} disabled={creating}>
              {creating ? '创建中…' : '确认创建'}
            </Btn>
            <Btn color="gray" onClick={() => { setShowCreate(false); setCreateErr('') }}>取消</Btn>
          </div>
        </Card>
      )}

      {/* 班级列表 */}
      {classes.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-gray-500 text-sm mb-4">还没有班级，先创建一个吧</p>
          <Btn color="green" onClick={() => setShowCreate(true)}>＋ 创建第一个班级</Btn>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {classes.map(cls => {
            const studentCount = cls.student_count ?? 0
            return (
              <Card
                key={cls.id}
                className="p-5 hover:border-gray-700 transition-colors cursor-pointer group"
                onClick={() => setDetail(cls)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                      {cls.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">{studentCount} 名学生</p>
                  </div>
                  <button
                    className="text-gray-700 hover:text-red-400 text-xs transition-colors p-1"
                    onClick={e => { e.stopPropagation(); handleDelete(cls) }}
                    title="删除班级"
                  >✕</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-blue-400 text-sm font-bold tracking-widest bg-blue-950/50 px-3 py-1 rounded-lg">
                    {cls.class_code}
                  </span>
                  <span className="text-gray-600 text-xs">点击查看详情 →</span>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── 主入口（接受主站 JWT）────────────────────────────

export default function TeacherDashboard({ token, username }) {
  if (!token) return (
    <div className="flex items-center justify-center py-12 text-gray-600 text-sm">
      未检测到登录状态，请重新进入
    </div>
  )
  return <TeacherHome token={token} username={username} />
}
