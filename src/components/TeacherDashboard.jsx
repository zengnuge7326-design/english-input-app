import { useState, useEffect } from 'react'
import {
  teacherSignUp, teacherSignIn, teacherSignOut, getTeacherSession,
  createClass, getMyClasses, deleteClass,
  getClassStudents, getStudentCheckins
} from '../lib/teacher'

// ── 小工具 ────────────────────────────────────────────

function Card({ children, className = '' }) {
  return <div className={`bg-gray-900 border border-gray-800 rounded-2xl ${className}`}>{children}</div>
}

function Btn({ children, onClick, color = 'blue', size = 'md', disabled, className = '' }) {
  const colors = {
    blue:   'bg-blue-600 hover:bg-blue-500 text-white',
    red:    'bg-red-900/60 hover:bg-red-800 text-red-300 border border-red-800',
    gray:   'bg-gray-800 hover:bg-gray-700 text-gray-200',
    green:  'bg-green-700 hover:bg-green-600 text-white',
    ghost:  'text-gray-400 hover:text-white hover:bg-gray-800',
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

function Input({ label, ...props }) {
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
                backgroundColor: count === 0 ? '#1f2937' : `rgba(59,130,246,${0.3 + pct * 0.7})`
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

function StudentList({ classId }) {
  const [students, setStudents] = useState([])
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getClassStudents(classId),
      getStudentCheckins(classId, 7)
    ]).then(([s, c]) => {
      setStudents(s)
      setCheckins(c)
      setLoading(false)
    })
  }, [classId])

  const today = new Date().toISOString().slice(0, 10)

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
            <th className="text-center py-2 px-3">今日打卡</th>
            <th className="text-center py-2 px-3">本周句数</th>
            <th className="text-center py-2 px-3">本周词数</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => {
            const myCheckins = checkins.filter(c => c.student_id === s.id)
            const todayCheckin = myCheckins.find(c => c.date === today)
            const weekSentences = myCheckins.reduce((a, c) => a + (c.sentences_done || 0), 0)
            const weekWords = myCheckins.reduce((a, c) => a + (c.words_done || 0), 0)
            return (
              <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-3 text-white font-medium">{s.display_name}</td>
                <td className="py-3 px-3 text-center">
                  {todayCheckin
                    ? <span className="text-green-400 text-xs bg-green-900/40 border border-green-800 px-2 py-0.5 rounded-full">✓ 已打卡</span>
                    : <span className="text-gray-600 text-xs">—</span>
                  }
                </td>
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

// ── 班级详情页 ────────────────────────────────────────

function ClassDetail({ cls, onBack }) {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getStudentCheckins(cls.id, 7).then(c => { setCheckins(c); setLoading(false) })
  }, [cls.id])

  function copyCode() {
    const text = `加入 ${cls.name} 班级码：${cls.class_code}\n打开 https://okenglish.site 输入班级码即可进入`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const todayStr = new Date().toISOString().slice(0, 10)
  const todayCount = checkins.filter(c => c.date === todayStr).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      {/* 顶部 */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
          ← 返回
        </button>
        <h1 className="text-xl font-bold text-white flex-1">{cls.name}</h1>
      </div>

      {/* 班级信息卡 */}
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

      {/* 学生列表 */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">学生学习情况</h2>
        </div>
        <StudentList classId={cls.id} />
      </Card>
    </div>
  )
}

// ── 教师主界面 ────────────────────────────────────────

function TeacherHome({ teacher, onSignOut }) {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createErr, setCreateErr] = useState('')

  useEffect(() => { loadClasses() }, [])

  async function loadClasses() {
    setLoading(true)
    const list = await getMyClasses(teacher.id)
    setClasses(list)
    setLoading(false)
  }

  async function handleCreate() {
    if (!newClassName.trim()) return
    setCreating(true); setCreateErr('')
    const { data, error } = await createClass(teacher.id, newClassName.trim())
    if (error) { setCreateErr(error); setCreating(false); return }
    setClasses(prev => [data, ...prev])
    setNewClassName('')
    setShowCreate(false)
    setCreating(false)
  }

  async function handleDelete(cls) {
    if (!window.confirm(`确定删除班级「${cls.name}」？所有学生数据将一并删除。`)) return
    await deleteClass(cls.id)
    setClasses(prev => prev.filter(c => c.id !== cls.id))
  }

  if (detail) return <ClassDetail cls={detail} onBack={() => setDetail(null)} />

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">教师工作台</h1>
          <p className="text-gray-500 text-sm mt-0.5">{teacher.name}{teacher.school ? ` · ${teacher.school}` : ''}</p>
        </div>
        <div className="flex gap-2">
          <Btn color="green" onClick={() => setShowCreate(true)}>＋ 创建班级</Btn>
          <Btn color="ghost" size="sm" onClick={onSignOut}>退出</Btn>
        </div>
      </div>

      {/* 创建班级弹窗 */}
      {showCreate && (
        <Card className="p-5 space-y-4">
          <h2 className="text-white font-semibold">创建新班级</h2>
          <Input
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
      {loading ? (
        <p className="text-gray-600 text-sm text-center py-8">加载班级…</p>
      ) : classes.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-gray-500 text-sm mb-4">还没有班级，先创建一个</p>
          <Btn color="green" onClick={() => setShowCreate(true)}>＋ 创建第一个班级</Btn>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {classes.map(cls => {
            const studentCount = cls.class_students?.[0]?.count ?? 0
            return (
              <Card key={cls.id} className="p-5 hover:border-gray-700 transition-colors cursor-pointer group"
                onClick={() => setDetail(cls)}>
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

// ── 教师登录/注册 ─────────────────────────────────────

function TeacherAuth({ onAuth }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function handleSubmit() {
    if (!email || !password) return
    setLoading(true); setError(''); setInfo('')
    if (mode === 'login') {
      const res = await teacherSignIn(email, password)
      if (res.error) setError(res.error)
      else onAuth(res.teacher)
    } else {
      if (!name.trim()) { setError('请填写姓名'); setLoading(false); return }
      const res = await teacherSignUp(email, password, name.trim(), school.trim())
      if (res.error) setError(res.error)
      else {
        setInfo('注册成功！请检查邮箱点击确认链接后再登录。')
        setMode('login')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏫</div>
          <h1 className="text-2xl font-bold text-white">教师工作台</h1>
          <p className="text-gray-500 text-sm mt-1">OK English · 班级管理平台</p>
        </div>

        <Card className="p-8 space-y-4">
          <div className="flex gap-1 bg-gray-800 rounded-xl p-1 mb-2">
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setInfo('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                {m === 'login' ? '登录' : '注册'}
              </button>
            ))}
          </div>

          {mode === 'register' && (
            <>
              <Input label="姓名" placeholder="您的姓名" value={name} onChange={e => setName(e.target.value)} />
              <Input label="学校（选填）" placeholder="所在学校" value={school} onChange={e => setSchool(e.target.value)} />
            </>
          )}
          <Input label="邮箱" type="email" placeholder="teacher@school.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          <Input label="密码" type="password" placeholder="至少6位" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

          {error && <p className="text-red-400 text-xs bg-red-900/20 border border-red-900/40 rounded-lg px-3 py-2">{error}</p>}
          {info  && <p className="text-green-400 text-xs bg-green-900/20 border border-green-900/40 rounded-lg px-3 py-2">{info}</p>}

          <Btn color="blue" className="w-full justify-center" onClick={handleSubmit} disabled={loading}>
            {loading ? '请稍候…' : (mode === 'login' ? '登录' : '注册教师账号')}
          </Btn>
        </Card>

        <p className="text-center text-gray-700 text-xs mt-4">
          学生端访问：<a href="/" className="text-blue-600 hover:text-blue-400">okenglish.site</a>
        </p>
      </div>
    </div>
  )
}

// ── 主入口（自动检测已有 session）────────────────────

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTeacherSession().then(res => {
      if (res?.teacher) setTeacher(res.teacher)
      setLoading(false)
    })
  }, [])

  async function handleSignOut() {
    await teacherSignOut()
    setTeacher(null)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-gray-600 text-sm">加载中…</div>
    </div>
  )

  if (!teacher) return <TeacherAuth onAuth={setTeacher} />
  return <TeacherHome teacher={teacher} onSignOut={handleSignOut} />
}
