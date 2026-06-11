/** 注册 PWA Service Worker（Android Chrome 安装应用需要） */
export function registerPwaServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    const swUrl = new URL('sw.js', window.location.origin + import.meta.env.BASE_URL).href
    navigator.serviceWorker.register(swUrl).catch(() => {
      /* 离线/开发环境失败可忽略 */
    })
  })
}
