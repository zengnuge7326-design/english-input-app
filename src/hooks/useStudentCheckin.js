/**
 * 学生端打卡 hook
 * 当 studentId 存在时，自动在每次完成句子/词语时向 Supabase 汇报
 */
import { useCallback, useRef } from 'react'
import { recordStudentCheckin } from '../lib/teacher'

export function useStudentCheckin() {
  const studentId = localStorage.getItem('student_id')
  // 累积缓冲，每 30 秒批量上报一次，避免频繁网络请求
  const bufRef = useRef({ sentences: 0, words: 0 })
  const timerRef = useRef(null)

  const flush = useCallback(async () => {
    if (!studentId) return
    const { sentences, words } = bufRef.current
    if (sentences === 0 && words === 0) return
    bufRef.current = { sentences: 0, words: 0 }
    await recordStudentCheckin(studentId, { sentences, words })
  }, [studentId])

  const scheduledFlush = useCallback(() => {
    if (timerRef.current) return
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      flush()
    }, 30_000)
  }, [flush])

  /** 完成一句练习时调用 */
  const onSentenceDone = useCallback(() => {
    if (!studentId) return
    bufRef.current.sentences += 1
    scheduledFlush()
  }, [studentId, scheduledFlush])

  /** 完成一个单词时调用 */
  const onWordDone = useCallback(() => {
    if (!studentId) return
    bufRef.current.words += 1
    scheduledFlush()
  }, [studentId, scheduledFlush])

  /** 页面关闭/切换时立即上报 */
  const forceFlush = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    flush()
  }, [flush])

  return { onSentenceDone, onWordDone, forceFlush, studentId }
}
