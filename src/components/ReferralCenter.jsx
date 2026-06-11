import { useState, useEffect, useCallback } from 'react'
import { IconUsers, IconRefresh } from './Icons'
import { REFERRAL_COMMISSION_PERCENT } from '../config/referral'

// 简单本地图标
const IconLink = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
const IconCopy = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
const IconCheck2 = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>

const API = 'https://okenglish.site/api'

async function apiFetch(path, token, opts = {}) {
  const res = await fetch(API + path, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...opts,
  })
  return res.json()
}

// 申请提现弹窗
function WithdrawModal({ available, token, onClose, onSuccess }) {
  const [method, setMethod] = useState('wechat')
  const [account, setAccount] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!account.trim() || !name.trim()) { setError('请填写完整收款信息'); return }
    setLoading(true); setError('')
    const res = await apiFetch('/referral/withdraw', token, {
      method: 'POST',
      body: JSON.stringify({ pay_method: method, pay_account: account.trim(), pay_name: name.trim() }),
    })
    setLoading(false)
    if (res.error) { setError(res.error); return }
    onSuccess(res.amount)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-white mb-1">申请提现</h3>
        <p className="text-gray-500 text-sm mb-5">可提现金额：<span className="text-yellow-400 font-bold">¥{available}</span></p>

        {/* 收款方式 */}
        <div className="flex gap-2 mb-4">
          {[['wechat', '微信'], ['alipay', '支付宝']].map(([v, label]) => (
            <button key={v} onClick={() => setMethod(v)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors
                ${method === v ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
              {label}
            </button>
          ))}
        </div>

        <input
          placeholder={method === 'wechat' ? '微信号 / 手机号' : '支付宝账号 / 手机号'}
          value={account}
          onChange={e => setAccount(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm mb-3 outline-none focus:border-blue-500"
        />
        <input
          placeholder="收款人真实姓名"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm mb-4 outline-none focus:border-blue-500"
        />

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-colors mb-2"
        >
          {loading ? '提交中…' : `申请提现 ¥${available}`}
        </button>
        <button onClick={onClose} className="w-full text-gray-600 hover:text-gray-400 text-sm transition-colors">取消</button>
      </div>
    </div>
  )
}

export default function ReferralCenter({ token, username }) {
  const [data, setData] = useState(null)
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawSuccess, setWithdrawSuccess] = useState('')

  const [summary, setSummary] = useState(null)  // Phase 1 状态明细
  const [invitees, setInvitees] = useState([])
  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const [stats, wds, sum, invs] = await Promise.all([
      apiFetch('/referral/my-code', token),
      apiFetch('/referral/withdrawals', token),
      apiFetch('/referral/v2/my-summary', token).catch(() => null),
      apiFetch('/referral/v2/my-invitees', token).catch(() => null),
    ])
    setData(stats)
    setWithdrawals(Array.isArray(wds) ? wds : [])
    if (sum?.ok) setSummary(sum)
    if (invs?.ok) setInvitees(invs.items || [])
    setLoading(false)
  }, [token])

  useEffect(() => { load() }, [load])

  function copyLink() {
    if (!data?.referral_url) return
    navigator.clipboard.writeText(data.referral_url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // 可提现 = 总佣金 - 已申请未被拒绝的
  const totalCommission = parseFloat(data?.commission_total || 0)
  const alreadyWithdrawn = withdrawals
    .filter(w => w.status !== 'rejected')
    .reduce((s, w) => s + parseFloat(w.amount), 0)
  const available = Math.max(0, totalCommission - alreadyWithdrawn).toFixed(2)

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-4xl">🔐</div>
        <p className="text-gray-400 text-sm">请先登录账号</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500 text-sm animate-pulse">加载中…</div>
      </div>
    )
  }

  if (data?.error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-red-400 text-sm">{data.error}</p>
        <button onClick={load} className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
          <IconRefresh size={14} /> 重试
        </button>
      </div>
    )
  }

  const referredUsers = data?.referred_users || []
  const hasPendingWithdraw = withdrawals.some(w => w.status === 'pending')

  const statusLabel = { pending: '处理中', paid: '已打款', rejected: '已拒绝' }
  const statusColor = { pending: 'text-yellow-400', paid: 'text-green-400', rejected: 'text-red-400' }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* 标题 */}
      <div>
        <h2 className="text-lg font-bold text-white">推荐返佣</h2>
        <p className="text-gray-500 text-sm mt-1">分享你的专属链接，好友付费后你获得 <span className="text-yellow-400 font-semibold">{REFERRAL_COMMISSION_PERCENT}%</span> 佣金，可直接申请提现</p>
        {username && (
          <p className="text-xs text-blue-400/70 mt-1">当前账号：<span className="font-mono font-semibold text-blue-400">{username}</span></p>
        )}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{data?.referred_count ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">已推荐好友</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{data?.commission_count ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">已付费人数</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">¥{data?.commission_total ?? '0.00'}</div>
          <div className="text-xs text-gray-500 mt-1">累计佣金</div>
        </div>
      </div>

      {/* 提现按钮区 */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400 mb-1">可提现余额</div>
          <div className="text-3xl font-bold text-yellow-400">¥{available}</div>
          {hasPendingWithdraw && <div className="text-xs text-yellow-600 mt-1">已有申请在处理中</div>}
        </div>
        <button
          onClick={() => { setWithdrawSuccess(''); setShowWithdraw(true) }}
          disabled={parseFloat(available) < 1 || hasPendingWithdraw}
          className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold text-sm transition-colors"
        >
          申请提现
        </button>
      </div>
      {withdrawSuccess && (
        <div className="bg-green-900/30 border border-green-700/50 rounded-xl px-4 py-3 text-green-400 text-sm">
          ✅ 提现申请已提交（¥{withdrawSuccess}），管理员将在1-3个工作日内打款
        </div>
      )}

      {/* 推荐链接 */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <IconLink size={16} className="text-blue-400" />
          <span className="text-sm font-medium text-white">我的专属链接</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2.5 mb-3">
          <span className="flex-1 text-xs text-gray-300 font-mono truncate">{data?.referral_url}</span>
          <button
            onClick={copyLink}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shrink-0"
          >
            {copied ? <IconCheck2 size={13} /> : <IconCopy size={13} />}
            {copied ? '已复制' : '复制'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">推荐码：</span>
          <span className="font-mono text-lg font-bold text-blue-400 tracking-widest">{data?.code}</span>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">如何推广</h3>
        <div className="space-y-2.5">
          {[
            ['1', '复制你的专属链接，分享给朋友、学生、家长'],
            ['2', '好友点击链接注册，自动绑定你的推荐关系'],
            ['3', `好友购买任意会员，你立即获得 ${REFERRAL_COMMISSION_PERCENT}% 佣金`],
            ['4', '点击「申请提现」，1-3个工作日内到账'],
          ].map(([n, t]) => (
            <div key={n} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{n}</div>
              <p className="text-gray-400 text-sm">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 提现记录 */}
      {withdrawals.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">提现记录</h3>
          <div className="space-y-2">
            {withdrawals.map((w, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800/60 last:border-0">
                <div>
                  <div className="text-sm text-white font-bold">¥{w.amount}</div>
                  <div className="text-xs text-gray-600">{w.pay_method === 'wechat' ? '微信' : '支付宝'} · {w.pay_account}</div>
                  <div className="text-xs text-gray-700">{w.created_at?.slice(0, 10)}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${statusColor[w.status] || 'text-gray-400'}`}>{statusLabel[w.status] || w.status}</div>
                  {w.note && <div className="text-xs text-gray-600 mt-0.5">{w.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 1 · 三档佣金状态 */}
      {summary && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>📊</span> 佣金状态明细
          </div>
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            <div className="bg-amber-900/30 border border-amber-800/40 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-amber-300">¥{summary.pending?.amount?.toFixed(2) || '0.00'}</div>
              <div className="text-[11px] text-amber-400/80 mt-1">冷静期 ({summary.pending?.count || 0})</div>
              <div className="text-[9px] text-amber-500/60 mt-0.5">30天后转待付</div>
            </div>
            <div className="bg-blue-900/30 border border-blue-800/40 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-blue-300">¥{summary.settled?.amount?.toFixed(2) || '0.00'}</div>
              <div className="text-[11px] text-blue-400/80 mt-1">待付款 ({summary.settled?.count || 0})</div>
              <div className="text-[9px] text-blue-500/60 mt-0.5">等管理员转账</div>
            </div>
            <div className="bg-emerald-900/30 border border-emerald-800/40 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-emerald-300">¥{summary.paid?.amount?.toFixed(2) || '0.00'}</div>
              <div className="text-[11px] text-emerald-400/80 mt-1">已付 ({summary.paid?.count || 0})</div>
              <div className="text-[9px] text-emerald-500/60 mt-0.5">已到账</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 flex items-center justify-between border-t border-gray-800 pt-3">
            <span>邀请 <span className="text-white font-semibold">{summary.invited}</span> 人 · 付费 <span className="text-emerald-400 font-semibold">{summary.paid_invitees}</span> 人</span>
            {summary.reversed > 0 && (
              <span className="text-rose-400">退款冲销 ¥{summary.reversed.toFixed(2)}</span>
            )}
          </div>
        </div>
      )}

      {/* 邀请人列表（脱敏）*/}
      {invitees.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <IconUsers size={16} className="text-purple-400" />
            <span className="text-sm font-medium text-white">我的邀请记录</span>
            <span className="text-xs text-gray-600">{invitees.length} 人</span>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {invitees.map((u, i) => {
              const statusColor = {
                paid: 'text-emerald-400 bg-emerald-900/30',
                settled: 'text-blue-400 bg-blue-900/30',
                pending: 'text-amber-400 bg-amber-900/30',
                suspicious: 'text-rose-400 bg-rose-900/30',
                reversed: 'text-gray-500 bg-gray-800',
              }
              const statusLabel = {
                paid: '已付', settled: '待付', pending: '冷静期',
                suspicious: '审查中', reversed: '已退款',
              }
              return (
                <div key={i} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div>
                    <div className="text-sm text-white font-medium">{u.name}</div>
                    <div className="text-[10px] text-gray-600">
                      注册 {u.joined_at?.slice(0, 10)} · {u.is_member ? '会员' : '免费'}
                    </div>
                  </div>
                  <div className="text-right">
                    {u.commission > 0 && (
                      <div className="text-emerald-400 text-sm font-bold">+¥{u.commission.toFixed(2)}</div>
                    )}
                    {u.last_status && (
                      <span className={`inline-block mt-0.5 text-[9px] px-1.5 py-0.5 rounded-full ${statusColor[u.last_status] || 'text-gray-500 bg-gray-800'}`}>
                        {statusLabel[u.last_status] || u.last_status}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 推荐记录 */}
      {referredUsers.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <IconUsers size={16} className="text-purple-400" />
            <span className="text-sm font-medium text-white">推荐记录</span>
          </div>
          <div className="space-y-2">
            {referredUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800/60 last:border-0">
                <div>
                  <div className="text-sm text-white font-medium">{u.username}</div>
                  <div className="text-xs text-gray-600">{u.created_at?.slice(0, 10)}</div>
                </div>
                <div className="text-right">
                  {u.commission != null ? (
                    <div className="text-green-400 text-sm font-semibold">+¥{u.commission}</div>
                  ) : (
                    <div className="text-gray-600 text-xs">未付费</div>
                  )}
                  <div className="text-xs text-gray-700">{u.is_member ? '会员' : '免费用户'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={load} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors mx-auto">
        <IconRefresh size={13} /> 刷新数据
      </button>

      {/* 提现弹窗 */}
      {showWithdraw && (
        <WithdrawModal
          available={available}
          token={token}
          onClose={() => setShowWithdraw(false)}
          onSuccess={(amount) => {
            setShowWithdraw(false)
            setWithdrawSuccess(amount)
            load()
          }}
        />
      )}
    </div>
  )
}
