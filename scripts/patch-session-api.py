#!/usr/bin/env python3
"""Patch /www/wwwroot/api/index.js: isActiveMember + /api/session"""
from pathlib import Path

p = Path("/www/wwwroot/api/index.js")
text = p.read_text()

helper = """
function isActiveMember(row) {
  if (betaMode) return true
  if (!row || !row.is_member) return false
  if (!row.member_until) return true
  return new Date(row.member_until) > new Date()
}

"""

if "function isActiveMember" not in text:
    text = text.replace("function auth(req, res, next) {", helper + "function auth(req, res, next) {")

old_login = "    res.json({ token, username, is_member: betaMode || !!rows[0].is_member, is_founder: !!rows[0].is_founder })"
new_login = """    const u = rows[0]
    res.json({ token, username, is_member: isActiveMember(u), is_founder: !!u.is_founder, member_until: u.member_until || null })"""
if old_login in text:
    text = text.replace(old_login, new_login)

session_route = """
app.get('/api/session', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT username, is_member, is_founder, member_until FROM users WHERE id = ?',
      [req.user.id]
    )
    if (!rows.length) return res.status(401).json({ error: '用户不存在' })
    const u = rows[0]
    res.json({
      username: u.username,
      is_member: isActiveMember(u),
      is_founder: !!u.is_founder,
      member_until: u.member_until || null,
    })
  } catch {
    res.status(500).json({ error: '服务器错误' })
  }
})

"""

if "/api/session" not in text:
    text = text.replace("app.post('/api/sync', auth,", session_route + "app.post('/api/sync', auth,")

p.write_text(text)
print("server patched OK")
