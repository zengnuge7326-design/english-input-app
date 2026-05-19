/**
 * StudentJoin —— 学生通过班级码加入班级
 * 成功后把 { studentId, studentName, classId, className } 存 localStorage
 * 并通知父组件 onJoined()
 */
import { useState } from 'react'
import { findClassByCode, joinClass } from '../lib/teacher'

export default function StudentJoin({ onJoined, onSkip }) {
  const [step, setStep] = useState('code')   // 'code' | 'name'
  const [code, setCode] = useState('')
  const [classInfo, setClassInfo] = useState(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFindClass() {
    if (!code.trim()) return
    setLoading(true); setError('')
    const cls = await findClassByCode(code.trim())
    if (!cls) {
      setError('班级码不存在，请确认后重试')
    } else {
      setClassInfo(cls)
      setStep('name')
    }
    setLoading(false)
  }

  async function handleJoin() {
    if (!name.trim()) return
    setLoading(true); setError('')
    const { student, error: err } = await joinClass(classInfo.id, name.trim())
    if (err) {
      setError(err)
    } else {
      // 存入 localStorage 供全局使用
      localStorage.setItem('student_id', student.id)
      localStorage.setItem('student_name', student.display_name)
      localStorage.setItem('student_class_id', student.class_id)
      localStorage.setItem('student_class_name', classInfo.name)
      onJoined?.({ studentId: student.id, studentName: student.display_name, classId: student.class_id, className: classInfo.name })
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl space-y-5">

        {step === 'code' ? (
          <>
            <div className="text-center">
              <div className="text-3xl mb-2">🏫</div>
              <h2 className="text-xl font-bold text-white">加入班级</h2>
              <p className="text-gray-500 text-sm mt-1">输入老师给的班级码</p>
            </div>
            <input
              type="text"
              placeholder="班级码（6位大写字母/数字）"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleFindClass()}
              maxLength={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-center text-xl font-mono font-bold tracking-widest outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button
              onClick={handleFindClass}
              disabled={loading || code.length < 4}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? '查找中…' : '确认班级码'}
            </button>
            <button onClick={onSkip} className="w-full text-gray-600 hover:text-gray-400 text-sm transition-colors">
              跳过，先自由练习
            </button>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="text-2xl mb-2">✅</div>
              <h2 className="text-xl font-bold text-white">找到班级了！</h2>
              <p className="text-blue-300 font-medium mt-1">{classInfo.name}</p>
              <p className="text-gray-500 text-sm mt-1">请输入你的姓名</p>
            </div>
            <input
              type="text"
              placeholder="你的姓名（如：李明）"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-center text-lg outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={loading || !name.trim()}
              className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? '加入中…' : '加入班级，开始学习！'}
            </button>
            <button onClick={() => { setStep('code'); setClassInfo(null); setError('') }}
              className="w-full text-gray-600 hover:text-gray-400 text-sm transition-colors">
              ← 重新输入班级码
            </button>
          </>
        )}
      </div>
    </div>
  )
}
