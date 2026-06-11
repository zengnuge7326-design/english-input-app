/**
 * MicPermissionSheet —— 全局挂载一次的「麦克风权限/兼容性」引导浮层
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { setMicGateHandler, setMicGuideShowHandler } from '../utils/micGate'
import { probeMic, micGuideSteps } from '../utils/mediaCapabilities'
import { unlockAudio } from '../utils/audioUnlock'

function pickGuideMode(probe, forcedMode) {
  if (forcedMode) return forcedMode
  if (probe.reason === 'insecure') return 'insecure'
  if (probe.reason === 'denied' || probe.permission === 'denied') return 'denied'
  if (probe.reason === 'sr-unusable' || probe.reason === 'no-getusermedia') return 'unsupported'
  return 'prompt'
}

function settleReason(probe, mode) {
  if (mode === 'insecure') return 'insecure'
  if (mode === 'denied') return 'denied'
  if (mode === 'unsupported') return 'unsupported'
  return 'dismissed'
}

export default function MicPermissionSheet({ elevated = false, preferLight = false }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('prompt')
  const [purpose, setPurpose] = useState('录音')
  const [busy, setBusy] = useState(false)
  const resolveRef = useRef(null)

  const settle = useCallback((result) => {
    const r = resolveRef.current
    resolveRef.current = null
    if (r) r(result)
  }, [])

  const close = useCallback((dismissReason = 'dismissed') => {
    setOpen(false)
    setBusy(false)
    settle({ ok: false, reason: dismissReason })
  }, [settle])

  const openGuide = useCallback(async ({ purpose: p, mode: forcedMode, resolve } = {}) => {
    setPurpose(p || '跟读练习')
    setBusy(false)
    if (resolve) resolveRef.current = resolve

    if (forcedMode) {
      setMode(forcedMode)
      setOpen(true)
      return
    }

    const probe = await probeMic({ requireSpeech: false })
    const nextMode = pickGuideMode(probe, null)
    setMode(nextMode)
    setOpen(true)

    if (resolve) {
      settle({ ok: false, reason: settleReason(probe, nextMode) })
    }
  }, [settle])

  useEffect(() => {
    const handler = async ({ purpose: p, resolve }) => {
      setPurpose(p || '录音')
      const probe = await probeMic()

      if (probe.ok && probe.permission === 'granted') {
        resolve({ ok: true, reason: 'granted' })
        return
      }

      resolveRef.current = resolve
      const nextMode = pickGuideMode(probe, null)
      setMode(nextMode)
      setOpen(true)
      settle({ ok: false, reason: settleReason(probe, nextMode) })
    }

    const offGate = setMicGateHandler(handler)
    const offGuide = setMicGuideShowHandler((opts) => { void openGuide(opts) })
    return () => {
      offGate()
      offGuide()
    }
  }, [openGuide, settle])

  const handleAllow = useCallback(async () => {
    setBusy(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop())
      try { unlockAudio() } catch { /* ignore */ }
      setOpen(false)
      setBusy(false)
      settle({ ok: true, reason: 'granted' })
    } catch {
      setBusy(false)
      setMode('denied')
      settle({ ok: false, reason: 'denied' })
    }
  }, [settle])

  if (!open) return null

  const guide = (mode === 'denied' || mode === 'unsupported') ? micGuideSteps() : null
  const light = preferLight
  const z = elevated ? 'z-[1000]' : 'z-[300]'

  const panelClass = light
    ? 'w-full sm:max-w-md bg-white border-t sm:border border-gray-200 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-[slideUp_.25s_ease]'
    : 'w-full sm:max-w-md bg-gray-900 border-t sm:border border-gray-700 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-[slideUp_.25s_ease]'

  const titleClass = light ? 'text-lg font-bold text-gray-900 text-center mb-1' : 'text-lg font-bold text-white text-center mb-1'
  const bodyClass = light ? 'text-sm text-gray-600 text-center mb-5 leading-relaxed' : 'text-sm text-gray-400 text-center mb-5 leading-relaxed'
  const stepTextClass = light ? 'text-sm text-gray-700' : 'text-sm text-gray-300'
  const stepBadgeClass = light
    ? 'shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center'
    : 'shrink-0 w-6 h-6 rounded-full bg-blue-600/30 text-blue-300 text-xs font-bold flex items-center justify-center'
  const subtitleClass = light ? 'text-xs text-gray-500 text-center mb-4' : 'text-xs text-gray-500 text-center mb-4'
  const noteClass = light
    ? 'text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 leading-relaxed'
    : 'text-xs text-amber-400/80 bg-amber-950/30 border border-amber-900/40 rounded-xl px-3 py-2 mb-4 leading-relaxed'
  const dismissBtnClass = light
    ? 'w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-colors'
    : 'w-full py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors'

  const guideTitle = mode === 'denied'
    ? '麦克风未开启'
    : (guide?.title?.includes('Safari') ? '请开启麦克风权限' : '当前浏览器不支持跟读')

  return (
    <div
      className={`fixed inset-0 ${z} flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm`}
      onClick={() => close('dismissed')}
    >
      <div className={panelClass} onClick={(e) => e.stopPropagation()}>
        {mode === 'prompt' && (
          <>
            <div className="text-4xl text-center mb-3">🎤</div>
            <h3 className={titleClass}>开启麦克风</h3>
            <p className={bodyClass}>
              用麦克风{purpose}。点击下方按钮后，浏览器会弹出授权框，选择「允许」即可。
              <br />我们只在你跟读时使用麦克风，不会录制或上传你的声音。
            </p>
            <button
              onClick={handleAllow}
              disabled={busy}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold transition-colors"
            >
              {busy ? '请在弹框中选择「允许」…' : '允许麦克风'}
            </button>
            <button
              onClick={() => close('dismissed')}
              className={`w-full mt-2 py-2 text-sm transition-colors ${light ? 'text-gray-500 hover:text-gray-700' : 'text-gray-500 hover:text-gray-300'}`}
            >
              暂不开启
            </button>
          </>
        )}

        {mode === 'insecure' && (
          <>
            <div className="text-4xl text-center mb-3">🔒</div>
            <h3 className={titleClass}>需要安全连接</h3>
            <p className={bodyClass}>
              麦克风仅在 HTTPS 安全连接下可用，请通过 https:// 访问本站后重试。
            </p>
            <button type="button" onClick={() => close('dismissed')} className={dismissBtnClass}>
              我知道了
            </button>
          </>
        )}

        {guide && (
          <>
            <div className="text-4xl text-center mb-3">{mode === 'unsupported' ? '🌐' : '🎤'}</div>
            <h3 className={titleClass}>{guideTitle}</h3>
            <p className={subtitleClass}>{guide.title}</p>
            <ol className="space-y-2 mb-4">
              {guide.steps.map((s, i) => (
                <li key={i} className={`flex items-start gap-3 ${stepTextClass}`}>
                  <span className={stepBadgeClass}>{i + 1}</span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
            {guide.note && (
              <p className={noteClass}>💡 {guide.note}</p>
            )}
            {mode === 'unsupported' && (
              <button
                type="button"
                onClick={handleAllow}
                disabled={busy}
                className="w-full mb-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold transition-colors"
              >
                {busy ? '请在弹框中选择「允许」…' : '尝试允许麦克风'}
              </button>
            )}
            <button type="button" onClick={() => close('dismissed')} className={dismissBtnClass}>
              我知道了
            </button>
          </>
        )}
      </div>
    </div>
  )
}
