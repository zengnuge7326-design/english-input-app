/**
 * 教师端 Supabase 操作工具
 */
import { supabase } from './supabase'

// ── 教师注册/登录 ──────────────────────────────────────

export async function teacherSignUp(email, password, name, school) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: error.message }
  const uid = data.user?.id
  if (!uid) return { error: '注册失败，请重试' }
  // 写入 teachers 表
  const { error: dbErr } = await supabase.from('teachers').insert({ id: uid, name, school })
  if (dbErr) return { error: dbErr.message }
  return { ok: true }
}

export async function teacherSignIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  // 取教师信息
  const { data: teacher } = await supabase.from('teachers').select('*').eq('id', data.user.id).single()
  return { ok: true, session: data.session, teacher }
}

export async function teacherSignOut() {
  await supabase.auth.signOut()
}

export async function getTeacherSession() {
  const { data } = await supabase.auth.getSession()
  if (!data.session) return null
  const { data: teacher } = await supabase.from('teachers').select('*').eq('id', data.session.user.id).single()
  return teacher ? { session: data.session, teacher } : null
}

// ── 班级管理 ──────────────────────────────────────────

export async function createClass(teacherId, name) {
  // 生成不重复的班级码
  let code, exists = true
  while (exists) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const { data } = await supabase.from('classes').select('id').eq('class_code', code).single()
    exists = !!data
  }
  const { data, error } = await supabase.from('classes')
    .insert({ teacher_id: teacherId, name, class_code: code })
    .select().single()
  if (error) return { error: error.message }
  return { data }
}

export async function getMyClasses(teacherId) {
  const { data, error } = await supabase.from('classes')
    .select('*, class_students(count)')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data
}

export async function deleteClass(classId) {
  const { error } = await supabase.from('classes').delete().eq('id', classId)
  return !error
}

// ── 学生数据 ──────────────────────────────────────────

export async function getClassStudents(classId) {
  const { data, error } = await supabase.from('class_students')
    .select('*')
    .eq('class_id', classId)
    .order('display_name')
  if (error) return []
  return data
}

export async function getStudentCheckins(classId, days = 7) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString().slice(0, 10)
  const { data, error } = await supabase.from('student_checkins')
    .select('*, class_students!inner(class_id, display_name)')
    .eq('class_students.class_id', classId)
    .gte('date', sinceStr)
    .order('date', { ascending: false })
  if (error) return []
  return data
}

// ── 学生端：加入班级 ──────────────────────────────────

export async function findClassByCode(code) {
  const { data, error } = await supabase.from('classes')
    .select('id, name, teacher_id')
    .eq('class_code', code.toUpperCase().trim())
    .single()
  if (error) return null
  return data
}

export async function joinClass(classId, displayName) {
  // 如果同名学生已存在，直接返回现有记录
  const { data: existing } = await supabase.from('class_students')
    .select('*').eq('class_id', classId).eq('display_name', displayName).single()
  if (existing) return { student: existing }

  const { data, error } = await supabase.from('class_students')
    .insert({ class_id: classId, display_name: displayName })
    .select().single()
  if (error) return { error: error.message }
  return { student: data }
}

// ── 学生端：打卡 ──────────────────────────────────────

export async function recordStudentCheckin(studentId, delta = {}) {
  const today = new Date().toISOString().slice(0, 10)
  // 先查是否已有今日记录
  const { data: existing } = await supabase.from('student_checkins')
    .select('*').eq('student_id', studentId).eq('date', today).single()

  if (existing) {
    await supabase.from('student_checkins').update({
      sentences_done: (existing.sentences_done || 0) + (delta.sentences || 0),
      words_done: (existing.words_done || 0) + (delta.words || 0),
      minutes: (existing.minutes || 0) + (delta.minutes || 0),
    }).eq('id', existing.id)
  } else {
    await supabase.from('student_checkins').insert({
      student_id: studentId,
      date: today,
      sentences_done: delta.sentences || 0,
      words_done: delta.words || 0,
      minutes: delta.minutes || 0,
    })
  }
}
