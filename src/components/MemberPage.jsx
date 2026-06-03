import { useState, useEffect, useRef } from 'react'

const API = 'https://okenglish.site/api'

const PLANS = [
  {
    id: 'month',
    label: '月度会员',
    price: '¥4.90',
    originalPrice: null,
    days: 30,
    badge: null,
    color: 'border-blue-500/60 hover:border-blue-400',
    activeBg: 'bg-blue-500/10 border-blue-400',
    desc: '30天畅享所有功能',
  },
  {
    id: 'year',
    label: '年度会员',
    price: '¥39',
    originalPrice: '¥58.80',
    days: 365,
    badge: '最受欢迎',
    color: 'border-purple-500/60 hover:border-purple-400',
    activeBg: 'bg-purple-500/10 border-purple-400',
    desc: '365天，相当于月费的66折',
  },
  {
    id: 'forever',
    label: '永久会员',
    price: '¥88',
    originalPrice: null,
    days: null,
    badge: '超值',
    color: 'border-amber-500/60 hover:border-amber-400',
    activeBg: 'bg-amber-500/10 border-amber-400',
    desc: '一次购买，永久使用',
  },
  {
    id: 'founder',
    label: '创始成员',
    price: '¥198',
    originalPrice: null,
    days: null,
    badge: '限100名',
    color: 'border-yellow-400/60 hover:border-yellow-300',
    activeBg: 'bg-yellow-500/10 border-yellow-400',
    desc: '永久会员 + 推荐好友获取佣金直接提现 + 班级管理功能',
    isFounder: true,
  },
]

function MemberBenefits() {
  const items = [
    '全部教材课程无限练习',
    '多邻国课程完整解锁',
    '语音朗读 & 发音指导',
    '学习数据统计分析',
    '语法专项深度练习',
    '云端进度同步',
  ]
  return (
    <div className="grid grid-cols-2 gap-2 mb-6">
      {items.map((text, i) => (
        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
          <span className="text-green-400 text-xs font-bold shrink-0">✓</span>
          <span>{text}</span>
        </div>
      ))}
    </div>
  )
}

export default function MemberPage({ user, token, onClose, initialPlan = 'year', onFounderSuccess, onOpenFounder, onShowLogin }) {
  const [selectedPlan, setSelectedPlan] = useState(initialPlan)
  const [step, setStep] = useState('select') // 'select' | 'pay' | 'success'
  const [payUrl, setPayUrl] = useState('')
  const [qrcode, setQrcode] = useState('')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(null)  // null | planId (which card is loading)
  const [error, setError] = useState('')
  const [polling, setPolling] = useState(false)
  const [memberInfo, setMemberInfo] = useState(null)
  const [showVerifyBtn, setShowVerifyBtn] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [founderRemaining, setFounderRemaining] = useState(null)
  const pollRef = useRef(null)
  const verifyTimerRef = useRef(null)

  useEffect(() => {
    fetch(`${API}/founder/count`)
      .then(r => r.json())
      .then(d => setFounderRemaining(d.remaining ?? null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current)
    }
  }, [])

  // planId: which plan to create order for (defaults to selectedPlan)
  async function handleCreateOrder(planId) {
    const pid = planId || selectedPlan
    setSelectedPlan(pid)
    setLoading(pid)
    setError('')
    try {
      const res = await fetch(`${API}/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: pid }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '创建订单失败')
      setPayUrl(json.url)
      setQrcode(json.qrcode || '')
      setOrderId(json.orderId)
      setStep('pay')
      startPolling(json.orderId)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(null)
    }
  }

  // Called when a plan card is clicked
  function handlePlanClick(planId) {
    if (!user) {
      onShowLogin?.()
      return
    }
    handleCreateOrder(planId)
  }

  function handlePaid(json) {
    clearInterval(pollRef.current)
    clearTimeout(verifyTimerRef.current)
    setPolling(false)
    setShowVerifyBtn(false)
    setMemberInfo(json)
    setStep('success')
    if (json.is_founder && onFounderSuccess) onFounderSuccess()
  }

  function startPolling(oid) {
    setPolling(true)
    setShowVerifyBtn(false)
    // 30秒后显示"我已完成支付"按钮
    verifyTimerRef.current = setTimeout(() => setShowVerifyBtn(true), 30000)
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API}/payment/status/${oid}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (json.status === 'paid') handlePaid(json)
      } catch { /* ignore */ }
    }, 3000)
    // 10分钟后停止
    setTimeout(() => { clearInterval(pollRef.current); setPolling(false) }, 600000)
  }

  async function handleVerify() {
    setVerifying(true)
    try {
      const res = await fetch(`${API}/payment/query/${orderId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.status === 'paid') {
        handlePaid(json)
      } else {
        setVerifying(false)
        setError('暂未检测到支付记录，请稍候再试或联系客服')
        setTimeout(() => setError(''), 4000)
      }
    } catch {
      setVerifying(false)
    }
  }

  const plan = PLANS.find(p => p.id === selectedPlan)

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">开通成功！</h2>
          <p className="text-gray-400 mb-1">欢迎加入，{user}</p>
          {memberInfo?.memberUntil && (
            <p className="text-sm text-gray-500 mb-6">
              会员有效期至：{new Date(memberInfo.memberUntil).toLocaleDateString('zh-CN')}
            </p>
          )}
          {!memberInfo?.memberUntil && (
            <p className="text-sm text-purple-400 mb-6">永久会员，终身有效 🌟</p>
          )}
          <button
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
          >
            开始学习
          </button>
        </div>
      </div>
    )
  }

  if (step === 'pay') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <button
            onClick={() => { clearInterval(pollRef.current); setStep('select') }}
            className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
          >
            ← 返回
          </button>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-lg font-bold text-white mb-1">{plan.label}</div>
            <div className="text-3xl font-bold text-yellow-400 mb-4">{plan.price}</div>
            <p className="text-gray-400 text-sm mb-5">请使用微信扫码支付</p>

            {/* QR code / link */}
            <div className="flex flex-col items-center gap-4">
              {qrcode ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={qrcode} alt="支付二维码" className="w-44 h-44 rounded-xl border border-gray-700 bg-white p-1" />
                  <div className="text-xs text-gray-500">微信扫码支付</div>
                </div>
              ) : null}
              <a
                href={payUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                📱 {qrcode ? '也可点此打开支付页' : '点击打开支付页面'}
              </a>
              {!qrcode && (
                <div className="text-xs text-gray-600 leading-relaxed text-center">
                  手机端：直接点击链接<br />
                  电脑端：点击后扫描页面二维码
                </div>
              )}
            </div>

            {polling && (
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                等待支付确认中…
              </div>
            )}

            {/* 30秒后出现：主动核验按钮 */}
            {showVerifyBtn && (
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="mt-4 w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                {verifying ? '核验中…' : '✅ 我已完成支付'}
              </button>
            )}
            {error && <p className="mt-2 text-red-400 text-xs text-center">{error}</p>}

            <div className="mt-4 text-xs text-gray-700">订单号：{orderId}</div>
          </div>

          <p className="text-center text-xs text-gray-700 mt-4">
            支付完成后页面将自动跳转，如未跳转请稍等片刻
          </p>
        </div>
      </div>
    )
  }

  // step === 'select'
  return (
    <div className="min-h-screen bg-gray-950 overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← 返回
          </button>
          <div className="text-center">
            <div className="text-2xl">👑</div>
            <div className="text-lg font-bold text-white">开通会员</div>
          </div>
          <div className="w-12" />
        </div>

        {/* Current status */}
        {user && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
              {user[0].toUpperCase()}
            </div>
            <div>
              <div className="text-sm text-white font-medium">{user}</div>
              <div className="text-xs text-gray-500">当前：免费用户</div>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="text-sm font-semibold text-gray-300 mb-3">会员专属权益</div>
          <MemberBenefits />
        </div>

        {/* Plan cards — click = login if guest, pay if logged in */}
        <div className="space-y-3 mb-6">
          {PLANS.map(p => {
            const isLoadingThis = loading === p.id
            return (
              <button
                key={p.id}
                onClick={() => handlePlanClick(p.id)}
                disabled={loading !== null}
                className={`w-full text-left rounded-xl border-2 p-4 transition-all relative group
                  ${p.isFounder ? 'bg-gradient-to-r from-yellow-950/60 to-amber-950/60' : ''}
                  ${!user ? 'cursor-pointer' : ''}
                  ${selectedPlan === p.id ? p.activeBg : `border-gray-800 bg-gray-900/40 ${p.color}`}
                  disabled:opacity-70`}
              >
                {/* Badge top-right */}
                {p.badge && (
                  <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full
                    ${p.isFounder ? 'bg-yellow-400 text-black' : 'bg-amber-500 text-black'}`}>
                    {p.badge}{p.isFounder && founderRemaining !== null ? `（剩${founderRemaining}名）` : ''}
                  </span>
                )}

                {/* Price + label row */}
                <div className="flex items-baseline gap-3 mb-1">
                  <span className={`font-bold text-lg ${p.isFounder ? 'text-yellow-300' : 'text-white'}`}>{p.price}</span>
                  {p.originalPrice && (
                    <span className="text-gray-600 text-sm line-through">{p.originalPrice}</span>
                  )}
                  <span className={`text-sm font-medium ${p.isFounder ? 'text-yellow-400' : 'text-gray-400'}`}>{p.label}</span>
                  {p.isFounder && <span className="text-yellow-500/70 text-xs">💎</span>}
                </div>
                <div className={`text-xs mb-3 ${p.isFounder ? 'text-yellow-600' : 'text-gray-500'}`}>{p.desc}</div>

                {/* Action strip — only shown when logged in */}
                {user && (
                  <div className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors
                    ${p.isFounder
                      ? 'bg-yellow-400/15 text-yellow-300 group-hover:bg-yellow-400/25'
                      : 'bg-blue-500/15 text-blue-300 group-hover:bg-blue-500/25'}`}>
                    {isLoadingThis
                      ? <><span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin inline-block" /> 创建订单中…</>
                      : <>💚 微信支付 · 立即开通</>}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Payment method - WeChat only for now */}
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-green-800/60 bg-green-900/20">
          <span>💚</span>
          <span className="text-green-300 text-sm font-medium">微信支付</span>
          <span className="text-green-600 text-xs ml-auto">支持微信扫码</span>
        </div>

        {/* 快捷入口 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              const pwd = window.prompt('请输入站长密码')
              if (pwd === null) return
              if (pwd === 'OkAdmin2024!@#') {
                window.open('/admin-panel', '_blank')
              } else {
                window.alert('密码错误')
              }
            }}
            className="flex-1 py-2 rounded-xl border border-gray-700 bg-gray-900/60 text-gray-400 hover:border-gray-500 hover:text-gray-200 text-xs font-medium transition-colors"
          >
            🔧 站长入口
          </button>
          <button
            onClick={() => { if (onOpenFounder) onOpenFounder() }}
            className="flex-1 py-2 rounded-xl border border-amber-700/60 bg-amber-950/30 text-amber-400 hover:border-amber-500 hover:text-amber-200 text-xs font-medium transition-colors"
          >
            💎 创始会员入口
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-400 mb-4">
            {error}
          </div>
        )}


        <p className="text-center text-xs text-gray-700 mt-4 leading-relaxed">
          支持微信 / 支付宝 · 支付安全加密 · 如有问题请联系客服
        </p>
      </div>
    </div>
  )
}
