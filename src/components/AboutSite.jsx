// 了解本站 — 弹窗式介绍文档
import { useHistoryLayer } from '../hooks/useHistoryLayer'
import CloseBadge from './CloseBadge'

export default function AboutSite({ onClose }) {
  useHistoryLayer(true, onClose)

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/70 backdrop-blur-sm px-3 sm:px-4 py-6 overflow-y-auto"
      onClick={onClose}>
      <div className="w-full max-w-3xl mx-auto" onClick={e => e.stopPropagation()}>
        <article className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-white/15 rounded-3xl shadow-2xl p-5 sm:p-8 text-slate-200">

          {/* 头图 + 标题 */}
          <header className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-3xl shadow-xl mb-3">
              🐼
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">OK 英语</h1>
            <p className="text-sm text-slate-400 mt-1">输入式英语学习 · 0 到 1 的可视化路径</p>
          </header>

          {/* 一句话定位 */}
          <p className="text-center text-base text-slate-300 mb-6 px-3">
            把"被动背"变成"主动敲"——通过<span className="text-amber-400 font-semibold">逐词输入</span>、
            <span className="text-emerald-400 font-semibold">即时反馈</span>、
            <span className="text-purple-400 font-semibold">钻石奖励</span>，
            让英语练习像玩游戏一样上瘾。
          </p>

          {/* 适合人群 */}
          <section className="mb-5">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-400 rounded-full" /> 适合谁
            </h2>
            <ul className="space-y-1.5 text-sm text-slate-300 ml-3">
              <li>📘 <span className="text-white">小学 / 初中 / 高中</span>学生 · 同步教材课文练习</li>
              <li>👨‍🏫 <span className="text-white">英语老师</span> · 班级管理 + 学生进度追踪</li>
              <li>🧑‍💻 <span className="text-white">职场学习者</span> · 新概念 / 自由导入文本</li>
              <li>👶 <span className="text-white">零基础</span> · 26 字母 / 音标 / 自然拼读启蒙</li>
            </ul>
          </section>

          {/* 核心功能 */}
          <section className="mb-5">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-400 rounded-full" /> 核心功能
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                ['📖', '教材同步', '人教 PEP（三上至六下）+ 仁爱 + 北师大全套，按单元逐句练'],
                ['📚', '课程广场', '新概念英语 1-4 册 / 多邻国课程 / 核心句群'],
                ['⌨', '逐词输入', '空格分词 → 错误高亮 → 多级提示 → 完成进度推进'],
                ['🎤', '口语门控', 'Web Speech 识别 → 模糊匹配 → 自动跳关'],
                ['🔊', '混合 TTS', 'L1 离线 + L2 系统 + L3 Edge Neural 三级降级'],
                ['📝', '语法专项', '小学/初中分阶段，每个时态 / 词法 / 句型一关'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="flex items-baseline gap-1.5 mb-0.5">
                    <span className="text-lg">{icon}</span>
                    <span className="font-bold text-white text-sm">{title}</span>
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 游戏化 */}
          <section className="mb-5">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-400 rounded-full" /> 游戏化激励
            </h2>
            <div className="grid grid-cols-2 gap-2.5 text-sm">
              <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/10 border border-orange-700/30 rounded-xl p-3">
                <div className="text-white font-bold mb-1">🔥 连续打卡</div>
                <div className="text-xs text-orange-200/80">每日 ≥ 20 XP 续火，断了归零</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-700/30 rounded-xl p-3">
                <div className="text-white font-bold mb-1">💎 五色钻石</div>
                <div className="text-xs text-purple-200/80">蓝绿红紫金 · 不同行为奖不同色</div>
              </div>
              <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/10 border border-pink-700/30 rounded-xl p-3">
                <div className="text-white font-bold mb-1">🎮 小游戏</div>
                <div className="text-xs text-pink-200/80">打地鼠（键位）· 青蛙跳（拼写/默写）</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 border border-emerald-700/30 rounded-xl p-3">
                <div className="text-white font-bold mb-1">🏪 钻石小店</div>
                <div className="text-xs text-emerald-200/80">用钻石兑换宠物 / 头像 / 主题</div>
              </div>
            </div>
          </section>

          {/* AI Coach */}
          <section className="mb-5">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-purple-400 rounded-full" /> AI 教练（新）
            </h2>
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/30 rounded-xl p-3 text-sm">
              <p className="text-slate-200 mb-2">由智谱 <span className="font-mono text-purple-300">GLM-4-Flash</span> 驱动，三个场景：</p>
              <ul className="space-y-1 text-xs text-slate-300 ml-3">
                <li>📚 <span className="text-white">教材陪练</span> — 对话演练课本句子，错就 ✅ ❌ 💡 立刻纠正</li>
                <li>🏆 <span className="text-white">汉译英挑战</span> — 给你 2-3 个不同难度的译法</li>
                <li>💬 <span className="text-white">自由表达</span> — 像真人聊天，语法错误实时提示</li>
              </ul>
            </div>
          </section>

          {/* 数据 & 隐私 */}
          <section className="mb-5">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-slate-400 rounded-full" /> 数据与隐私
            </h2>
            <ul className="text-xs text-slate-400 space-y-1 ml-3 leading-relaxed">
              <li>· 学习进度优先存浏览器 localStorage，登录后同步云端</li>
              <li>· 钻石、XP、商店购买记录加密存数据库</li>
              <li>· 不收集敏感个人信息，仅用作用户识别和成就计算</li>
              <li>· AI Coach 对话不留存，每次请求即时转发不落库</li>
            </ul>
          </section>

          {/* 快速上手 */}
          <section className="mb-5">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-rose-400 rounded-full" /> 快速上手
            </h2>
            <ol className="text-sm text-slate-300 space-y-1.5 ml-3 list-decimal list-inside">
              <li>从右上角 <span className="text-white font-semibold">≡ 菜单</span> 选 <span className="text-white">教材</span> 或 <span className="text-white">课程广场</span></li>
              <li>选教材 → 选单元 → 进入练习</li>
              <li>看汉语，<span className="text-amber-400">逐词敲对应英文</span>（空格分词，回车结句）</li>
              <li>错了会高亮，可用 <span className="text-white">提示</span> 按钮逐级揭示</li>
              <li>每日累计 20 XP 就续火 🔥，挑战连击赚钻石 💎</li>
            </ol>
          </section>

          {/* 技术 */}
          <section className="mb-5">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-cyan-400 rounded-full" /> 技术栈
            </h2>
            <div className="text-xs text-slate-400 leading-relaxed">
              React 19 + Vite + Tailwind CSS · 后端 Node + Express + MySQL ·
              语音 Web Speech API + Edge TTS · AI 智谱 GLM-4-Flash ·
              支付迅虎 / 微信原生 · 部署腾讯云 + Nginx
            </div>
          </section>

          {/* 联系 / 反馈 */}
          <section className="text-center pt-4 border-t border-white/10">
            <p className="text-xs text-slate-500">
              当前公测阶段 · 欢迎在「公告 & 留言」反馈问题或建议
            </p>
            <p className="text-[10px] text-slate-600 mt-1">© OK English · okenglish.site</p>
          </section>
        </article>
      </div>
      <CloseBadge onClose={onClose} />
    </div>
  )
}
