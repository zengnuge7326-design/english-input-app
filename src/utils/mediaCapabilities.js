/**
 * mediaCapabilities.js —— 音频/麦克风 能力 · 平台 · 权限 统一探测
 *
 * 纯函数、无副作用。一处判断，各处复用：
 *   - 是否安全上下文（HTTPS / localhost）
 *   - 是否支持 getUserMedia / SpeechRecognition
 *   - 平台识别（iOS / Android / Safari / Firefox / Chrome / Edge）
 *   - 麦克风权限状态（Permissions API，只读）
 *   - 语音识别是否「真的可用」（iOS WebKit、Firefox 实际不支持）
 *   - 被拒/不支持时的「按设备分步引导」文案
 */

export function isSecure() {
  if (typeof window === 'undefined') return false
  return (
    window.isSecureContext ||
    location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1'
  )
}

export function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

export function hasSpeechRecognition() {
  if (typeof window === 'undefined') return false
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export function detectPlatform() {
  const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || ''
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (typeof navigator !== 'undefined' &&
      navigator.platform === 'MacIntel' &&
      navigator.maxTouchPoints > 1) // iPadOS 13+ 伪装成 Mac
  const android = /Android/.test(ua)
  const firefox = /Firefox\//.test(ua) || /FxiOS/.test(ua)
  const edge = /Edg\//.test(ua)
  const criOS = /CriOS/.test(ua) // iOS 上的 Chrome（内核仍是 WebKit）
  const chrome = (/Chrome\//.test(ua) && !edge) || criOS
  const safari = /Safari\//.test(ua) && !/Chrome\//.test(ua) && !edge && !criOS && !/FxiOS/.test(ua)
  const mobile = iOS || android || /Mobi/.test(ua)
  return { iOS, android, firefox, edge, chrome, criOS, safari, mobile, ua }
}

/**
 * 语音识别是否真实可用（不只是 API 存在）。
 * iOS 的 WebKit（含 iOS Chrome/CriOS）与 Firefox 的 SpeechRecognition 不可靠 → 视为不可用。
 */
export function speechRecognitionUsable() {
  if (!hasSpeechRecognition()) return false
  const p = detectPlatform()
  if (p.iOS) return false
  if (p.firefox) return false
  return true
}

/** 只读查询麦克风权限：'granted' | 'denied' | 'prompt' | 'unknown' */
export async function queryMicPermission() {
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const st = await navigator.permissions.query({ name: 'microphone' })
      return st.state || 'unknown'
    }
  } catch {
    /* Safari 等可能不支持 microphone 名称，忽略 */
  }
  return 'unknown'
}

/**
 * 综合体检：返回录音功能能否走通，以及拦路原因。
 *   reason: 'ok' | 'insecure' | 'no-getusermedia' | 'sr-unusable'
 */
export async function probeMic(options = {}) {
  const { requireSpeech = true } = options
  const platform = detectPlatform()
  if (!isSecure()) return { ok: false, reason: 'insecure', permission: 'unknown', platform }
  if (!hasGetUserMedia()) return { ok: false, reason: 'no-getusermedia', permission: 'unknown', platform }
  const permission = await queryMicPermission()
  const speechOk = speechRecognitionUsable()
  if (requireSpeech && !speechOk) {
    return { ok: false, reason: 'sr-unusable', permission, platform, speechOk: false }
  }
  if (permission === 'denied') {
    return { ok: false, reason: 'denied', permission, platform, speechOk }
  }
  return { ok: true, reason: 'ok', permission, platform, speechOk }
}

/** 被拒 / 不支持时，针对当前设备的「照着做」步骤 */
export function micGuideSteps() {
  const p = detectPlatform()
  if (p.iOS) {
    if (p.safari) {
      return {
        title: 'iPhone / iPad · Safari',
        steps: [
          '点地址栏左侧的「aA」按钮',
          '选择「网站设置」',
          '把「麦克风」改为「允许」，刷新页面',
        ],
        note: '若仍无法跟读：iOS 的 Safari 对网页语音识别支持有限，建议改用电脑版 Chrome。',
      }
    }
    return {
      title: 'iPhone / iPad 浏览器',
      steps: [
        '打开 系统「设置」→ 找到当前浏览器',
        '开启「麦克风」开关',
        '回到本页刷新',
      ],
      note: 'iOS 浏览器对网页语音识别支持有限，跟读功能建议在电脑版 Chrome 使用。',
    }
  }
  if (p.android) {
    return {
      title: 'Android · Chrome',
      steps: [
        '点地址栏左侧的 🔒 锁形图标',
        '选择「权限 / 网站设置」',
        '把「麦克风」设为「允许」，刷新页面',
      ],
      note: '如未弹出授权，请确认系统已允许该浏览器使用麦克风。',
    }
  }
  if (p.firefox) {
    return {
      title: 'Firefox',
      steps: ['Firefox 暂不支持网页语音识别', '请改用 Chrome 或 Edge 打开本站'],
      note: '',
    }
  }
  // 桌面 Chrome / Edge
  return {
    title: '电脑浏览器（Chrome / Edge）',
    steps: [
      '点地址栏左侧的 🔒 锁形图标',
      '找到「麦克风」并设为「允许」',
      '刷新页面后重试',
    ],
    note: '若地址栏没有提示，可在 设置 → 隐私与安全 → 网站设置 → 麦克风 中放行本站。',
  }
}
