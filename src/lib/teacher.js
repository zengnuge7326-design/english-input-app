/**
 * 教师端 API 工具 —— 使用主站 JWT，不依赖 Supabase
 */

const API = 'https://okenglish.site/api'

async function apiFetch(method, path, token, body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  if (body) opts.body = JSON.stringify(body)
  try {
    const res = await fetch(API + path, opts)
    return res.json()
  } catch (e) {
    return { error: e.message }
  }
}

// 获取教师档案（首次访问自动创建）
export async function getTeacherProfile(token) {
  return apiFetch('GET', '/teacher/profile', token)
}

// 更新教师档案
export async function updateTeacherProfile(token, { name, school }) {
  return apiFetch('POST', '/teacher/profile', token, { name, school })
}

// 获取我的班级列表
export async function getMyClasses(token) {
  const data = await apiFetch('GET', '/teacher/classes', token)
  return Array.isArray(data) ? data : []
}

// 创建班级
export async function createClass(token, name) {
  return apiFetch('POST', '/teacher/classes', token, { name })
}

// 删除班级
export async function deleteClass(token, classId) {
  return apiFetch('DELETE', '/teacher/classes/' + classId, token)
}

// 获取班级学生列表
export async function getClassStudents(token, classId) {
  const data = await apiFetch('GET', '/teacher/classes/' + classId + '/students', token)
  return Array.isArray(data) ? data : []
}

// 获取班级打卡记录（最近 days 天）
export async function getStudentCheckins(token, classId, days = 7) {
  const data = await apiFetch('GET', `/teacher/classes/${classId}/checkins?days=${days}`, token)
  return Array.isArray(data) ? data : []
}

// ── 学生端：公开接口（无需 token）────────────────────

async function publicFetch(method, path, body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  try {
    const res = await fetch(API + path, opts)
    return res.json()
  } catch (e) {
    return { error: e.message }
  }
}

// 班级排行榜（近 days 天积分排名，公开）
export async function getClassLeaderboard(classId, days = 7) {
  const data = await publicFetch('GET', `/class/${classId}/leaderboard?days=${days}`)
  if (data.error) return null
  return data
}

// 根据班级码查找班级（学生加入用）
export async function findClassByCode(code) {
  const data = await publicFetch('GET', '/class/find/' + encodeURIComponent(code.toUpperCase().trim()))
  if (data.error) return null
  return data
}

// 加入班级（学生端，无需登录）
export async function joinClass(classId, displayName) {
  const data = await publicFetch('POST', '/class/' + classId + '/join', { display_name: displayName })
  if (data.error) return { error: data.error }
  return { student: data }
}

// 学生打卡上报（无需登录，用 studentId）
export async function recordStudentCheckin(studentId, delta = {}) {
  return publicFetch('POST', '/student/' + studentId + '/checkin', {
    sentences: delta.sentences || 0,
    words: delta.words || 0,
    minutes: delta.minutes || 0,
  })
}
