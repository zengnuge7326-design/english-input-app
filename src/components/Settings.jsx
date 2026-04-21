import { useState } from 'react'

export default function Settings({ settings, onChange, onReset, onClose }) {
  const s = settings
  const set = (patch) => onChange({ ...s, ...patch })

  // 记住上次打开的 tab
  const [activeTab, setActiveTab] = useState(() => {
    try { return localStorage.getItem('settings_tab') || 'voice' } catch { return 'voice' }
  })
  const handleTabChange = (id) => {
    setActiveTab(id)
    try { localStorage.setItem('settings_tab', id) } catch {}
  }

  // 一键设置：保存 / 还原默认配置
  const [savedPreset, setSavedPreset] = useState(() => {
    try { const p = localStorage.getItem('settings_preset'); return p ? JSON.parse(p) : null } catch { return null }
  })
  function savePreset() {
    try { localStorage.setItem('settings_preset', JSON.stringify(s)); setSavedPreset({ ...s }) } catch {}
  }
  function restorePreset() {
    if (savedPreset) onChange({ ...savedPreset })
  }

  const Seg = ({ label, options, value, onSelect }) => (
    <div className="flex flex-col gap-2">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="flex gap-2">
        {options.map(([val, lbl]) => (
          <button key={val} onClick={() => onSelect(val)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors
              ${value === val ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  )

  const Grid = ({ label, options, value, onSelect, cols = 4 }) => (
    <div className="flex flex-col gap-2">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {options.map(([val, lbl]) => (
          <button key={val} onClick={() => onSelect(val)}
            className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors
              ${value === val ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  )

  const Toggle = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between gap-3 cursor-pointer py-2">
      <span className="text-gray-300 text-sm">{label}</span>
      <div onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${checked ? 'bg-blue-600' : 'bg-gray-700'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-6' : 'left-1'}`} />
      </div>
    </label>
  )

  const soundOptions = [['chime','风铃'],['coin','金币'],['pop','气泡'],['retro','复古'],['fart','放屁'],['drum','打鼓'],['none','关闭']]
  const errorOptions = [['buzz','蜂鸣'],['chime','风铃'],['coin','金币'],['pop','气泡'],['retro','复古'],['fart','放屁'],['drum','打鼓'],['none','关闭']]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-20 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-3xl mx-auto" onClick={e => e.stopPropagation()}>
        <div className="bg-slate-800 border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-2xl">设置</h3>
            <div className="flex items-center gap-2">
              {savedPreset && (
                <button onClick={restorePreset}
                  className="text-xs px-3 py-1.5 bg-blue-900/50 hover:bg-blue-800/60 text-blue-400 rounded-lg border border-blue-800/50 transition-colors">
                  ⚡ 一键还原
                </button>
              )}
              <button onClick={savePreset}
                className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg border border-gray-700 transition-colors">
                📌 {savedPreset ? '更新默认' : '一键设置'}
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition-colors ml-1">✕</button>
            </div>
          </div>

          <div className="flex gap-2 mb-8 border-b border-slate-700">
            {[['voice', '发音'],['sound', '音效'],['hint', '提示']].map(([id, label]) => (
              <button key={id} onClick={() => handleTabChange(id)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === id ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-gray-300'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {activeTab === 'voice' && (
              <>
                <Seg label="发音口音" value={s.lang}
                  options={[['en-US','🇺🇸 美式'],['en-GB','🇬🇧 英式']]}
                  onSelect={v => set({ lang: v })} />

                <Seg label="朗读速度" value={s.rate}
                  options={[[0.5,'0.5x 慢速'], [0.7,'0.7x 正常'], [1.0,'1x 标准']]}
                  onSelect={v => set({ rate: v })} />

                <div className="flex flex-col gap-2">
                  <div className="text-gray-400 text-sm">音量 <span className="text-white font-bold">{Math.round((s.volume ?? 1) * 100)}%</span></div>
                  <input type="range" min="0" max="1" step="0.1" value={s.volume ?? 1}
                    onChange={e => set({ volume: parseFloat(e.target.value) })}
                    className="accent-blue-500 w-full" />
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>静音</span><span>适中</span><span>最大</span>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <Toggle label="输入前朗读整句" checked={!!s.sentenceSpeak}
                    onChange={v => set({ sentenceSpeak: v })} />
                  <Toggle label="输入前朗读当前词" checked={s.wordSpeak !== false}
                    onChange={v => set({ wordSpeak: v })} />
                  <Toggle label="完成后朗读整句" checked={!!s.autoSpeak}
                    onChange={v => set({ autoSpeak: v })} />
                </div>
              </>
            )}

            {activeTab === 'sound' && (
              <>
                <Grid label="按键音" cols={5}
                  value={s.keypressSound ?? 'black-pbt'}
                  options={[['black-pbt','⌨️PBT'],['clicky','🔵响键'],['typewriter','🖨️打字机'],['soft','🤫静音'],['none','🔇关闭']]}
                  onSelect={v => set({ keypressSound: v })} />

                <Grid label="✅ 答对单词" cols={4}
                  value={s.correctSound ?? 'chime'}
                  options={soundOptions}
                  onSelect={v => set({ correctSound: v })} />

                <Grid label="🎉 完成整句" cols={4}
                  value={s.victorySound ?? 'chime'}
                  options={soundOptions}
                  onSelect={v => set({ victorySound: v })} />

                <Grid label="❌ 答错提示" cols={4}
                  value={s.errorSound ?? 'buzz'}
                  options={errorOptions}
                  onSelect={v => set({ errorSound: v })} />

                <div className="border-t border-slate-700 pt-4">
                  <Toggle label="音效总开关" checked={s.soundEnabled !== false}
                    onChange={v => set({ soundEnabled: v })} />
                  <Toggle label="烟花声效" checked={s.fireworksSound !== false}
                    onChange={v => set({ fireworksSound: v })} />
                </div>
              </>
            )}

            {activeTab === 'hint' && (
              <>
                <div className="border-b border-slate-700 pb-4">
                  <Toggle label="🎤 强制跟读（隐藏跳过按钮）" checked={!!s.requireSpeak}
                    onChange={v => set({ requireSpeak: v })} />
                  <div className="text-xs text-gray-500 mt-1">开启后，朗读环节的跳过按钮被隐藏；连续失败 5 次自动通过</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-gray-400 text-sm">学习模式等级</div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      [1, '引导', '显示全词'],
                      [2, '提示', '显示首字母'],
                      [3, '半隐藏', '隐藏元音'],
                      [4, '反向', '隐藏辅音'],
                      [5, '默写', '全部隐藏']
                    ].map(([level, name, desc]) => (
                      <button key={level} onClick={() => set({ learningLevel: level })}
                        className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-sm font-medium transition-colors
                          ${(s.learningLevel || 2) === level ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                        <div className="text-2xl font-bold">{level}</div>
                        <div className="text-xs">{name}</div>
                        <div className="text-xs opacity-60">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <Seg label="输错后需重复次数" value={s.errorRetryCount || 2}
                    options={[[2,'2次'],[3,'3次'],[4,'4次'],[5,'5次']]}
                    onSelect={v => set({ errorRetryCount: v })} />
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <Toggle label="错误后显示答案" checked={s.showHintOnError !== false}
                    onChange={v => set({ showHintOnError: v })} />

                  {s.showHintOnError !== false && (
                    <div className="mt-3 ml-4">
                      <Seg label="触发次数" value={s.hintTriggerCount || 1}
                        options={[[1,'1次'],[2,'2次'],[3,'3次'],[4,'4次']]}
                        onSelect={v => set({ hintTriggerCount: v })} />
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <Toggle label="🚫 隐藏跳过和下一个按钮" checked={s.hideSplitSkip !== false}
                    onChange={v => set({ hideSplitSkip: v })} />
                  <div className="text-xs text-gray-600 mb-2">全局生效：隐藏所有跳过/下一题按钮（键盘快捷键仍可用）</div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <div className="text-gray-500 text-xs mb-2 uppercase tracking-wider">防作弊</div>
                  <Toggle label="录音时禁用领读按钮" checked={s.blockTTSDuringRec !== false}
                    onChange={v => set({ blockTTSDuringRec: v })} />
                  <div className="text-xs text-gray-600 mb-2">防止用领读声音欺骗录音；录不上时可关闭</div>
                </div>

                <div className="border-t border-slate-700 pt-4 mt-4">
                  <button onClick={onReset}
                    className="w-full py-3 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-400 text-sm font-medium border border-red-800/60 transition-colors">
                    重置进度
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
