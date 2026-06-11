/**
 * micGate.js —— 全局麦克风权限「闸门」
 *
 * 解耦设计：任意组件录音前 `await ensureMic('用途')`，由全局挂载的
 * <MicPermissionSheet/> 统一处理「解释 → 唤起原生授权 → 被拒/不支持引导」。
 *
 * 关键约定（向后兼容）：
 *   - 若没有任何 UI 订阅者（Sheet 未挂载），ensureMic 直接放行 {ok:true}，
 *     退回到原有「直接 getUserMedia / SpeechRecognition 触发原生弹窗」的行为，
 *     绝不阻塞既有功能。
 *
 * resolve 结果：{ ok, reason }
 *   ok:true                    → 已授权，可录音
 *   ok:false reason:'denied'   → 用户拒绝 / 已被浏览器阻止
 *   ok:false reason:'unsupported' → 设备/浏览器不支持（iOS·Firefox 等）
 *   ok:false reason:'insecure' → 非 HTTPS
 *   ok:false reason:'dismissed'→ 用户关闭引导
 */

let handler = null
let guideHandler = null

export function setMicGateHandler(fn) {
  handler = fn
  return () => {
    if (handler === fn) handler = null
  }
}

/** 主动弹出麦克风/浏览器设置引导（不阻塞录音流程） */
export function setMicGuideShowHandler(fn) {
  guideHandler = fn
  return () => {
    if (guideHandler === fn) guideHandler = null
  }
}

export function showMicGuide({ purpose = '跟读练习', mode } = {}) {
  if (typeof guideHandler !== 'function') return false
  guideHandler({ purpose, mode })
  return true
}

export function ensureMic(purpose = '录音') {
  if (typeof handler !== 'function') {
    // 没有引导 UI：保持旧行为，放行让调用方自行触发原生授权
    return Promise.resolve({ ok: true, reason: 'no-ui' })
  }
  return new Promise((resolve) => {
    let done = false
    const once = (r) => { if (!done) { done = true; resolve(r) } }
    handler({ purpose, resolve: once })
  })
}
