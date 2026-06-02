/**
 * 成就徽章定义 + 纯函数评估
 * stats: { totalXp, streakMax, activeDays, maxDailyXp, isMember, isFounder }
 */

export const BADGES = [
  // 连续打卡
  { key: 'streak7',   icon: '🔥', name: '一周连击', desc: '连续打卡 7 天',   test: s => s.streakMax >= 7 },
  { key: 'streak30',  icon: '🔥', name: '月度坚持', desc: '连续打卡 30 天',  test: s => s.streakMax >= 30 },
  { key: 'streak100', icon: '💯', name: '百日筑基', desc: '连续打卡 100 天', test: s => s.streakMax >= 100 },
  // 累计 XP
  { key: 'xp100',  icon: '⭐', name: '初露锋芒', desc: '累计 100 XP',  test: s => s.totalXp >= 100 },
  { key: 'xp500',  icon: '🌟', name: '勤学不辍', desc: '累计 500 XP',  test: s => s.totalXp >= 500 },
  { key: 'xp2000', icon: '💫', name: '学海无涯', desc: '累计 2000 XP', test: s => s.totalXp >= 2000 },
  // 活跃天数
  { key: 'days7',  icon: '📅', name: '七日同行', desc: '累计学习 7 天',  test: s => s.activeDays >= 7 },
  { key: 'days30', icon: '🗓️', name: '月满勤学', desc: '累计学习 30 天', test: s => s.activeDays >= 30 },
  // 单日爆发
  { key: 'perfectDay', icon: '🎯', name: '全力以赴', desc: '单日获得 50 XP', test: s => s.maxDailyXp >= 50 },
  // 身份
  { key: 'member',  icon: '💎', name: '尊享会员', desc: '开通会员',     test: s => !!s.isMember },
  { key: 'founder', icon: '👑', name: '创始成员', desc: '成为创始成员', test: s => !!s.isFounder },
]

export function evaluateAchievements(stats) {
  const s = {
    totalXp: stats?.totalXp || 0,
    streakMax: stats?.streakMax || 0,
    activeDays: stats?.activeDays || 0,
    maxDailyXp: stats?.maxDailyXp || 0,
    isMember: !!stats?.isMember,
    isFounder: !!stats?.isFounder,
  }
  return BADGES.map(b => ({ key: b.key, icon: b.icon, name: b.name, desc: b.desc, earned: b.test(s) }))
}
