const SHELL_KEY = 'mobile_shell_mode_v1'

/** Capacitor 原生壳或 URL 参数触发纯手机全屏模式 */
export function isCapacitorNative(): boolean {
  try {
    const cap = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
    return !!cap?.isNativePlatform?.()
  } catch {
    return false
  }
}

export function isMobileShellUrl(): boolean {
  if (typeof window === 'undefined') return false
  const q = new URLSearchParams(window.location.search)
  return q.get('mobile') === '1' || window.location.hash === '#mobile-learn'
}

export function isMobileShellEnabled(): boolean {
  try {
    return localStorage.getItem(SHELL_KEY) === '1'
  } catch {
    return false
  }
}

export function setMobileShellEnabled(on: boolean) {
  try {
    if (on) localStorage.setItem(SHELL_KEY, '1')
    else localStorage.removeItem(SHELL_KEY)
  } catch { /* ignore */ }
}

/** 原生 App 首次启动或用户开启壳模式时自动进入 */
export function shouldAutoLaunchMobileShell(): boolean {
  return isMobileShellUrl() || (isCapacitorNative() && isMobileShellEnabled())
}

export function shouldHideMainChrome(): boolean {
  return isCapacitorNative() || isMobileShellUrl()
}
