import { useState } from 'react'
import ReferralCenter from './ReferralCenter'
import TeacherDashboard from './TeacherDashboard'

const TAB_ITEMS = [
  { id: 'referral', label: '💰 返佣中心' },
  { id: 'classes',  label: '🏫 班级管理' },
]

export default function FounderCenter({ token, username, onClose }) {
  const [activeTab, setActiveTab] = useState('referral')

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-5">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            <h2 className="text-lg font-bold text-white">创始成员中心</h2>
          </div>
          <p className="text-xs text-amber-400/80 mt-0.5">
            永久会员权益 · 30% 推荐返佣 · 班级管理
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          ← 返回
        </button>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-2 mb-5 bg-gray-900 border border-gray-800 rounded-xl p-1">
        {TAB_ITEMS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === t.id
                ? 'bg-amber-500 text-black'
                : 'text-gray-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 内容 */}
      {activeTab === 'referral' && (
        <ReferralCenter token={token} username={username} />
      )}
      {activeTab === 'classes' && (
        <div className="w-full">
          <TeacherDashboard token={token} username={username} />
        </div>
      )}
    </div>
  )
}
