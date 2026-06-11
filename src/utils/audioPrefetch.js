/**
 * audioPrefetch.js — 静态音频预热
 *
 * 思路：用浏览器原生 HTTP 缓存做预取。空闲时段以「低优先级」fetch 把音频
 * 拉进磁盘缓存，真正点击播放时 `new Audio(url)` 直接命中缓存，省去网络往返。
 * 相比持有大量 Audio 对象，几乎零内存驻留，且幂等、可取消、失败可重试。
 */

/** 已成功预热的 URL，避免重复请求（跨组件、跨挂载共享） */
const warmed = new Set()

/** 空闲调度：优先 requestIdleCallback，回退到微任务级 setTimeout */
const scheduleIdle =
  typeof requestIdleCallback === 'function'
    ? (cb) => requestIdleCallback(cb, { timeout: 1500 })
    : (cb) => setTimeout(cb, 0)

/**
 * 预热一批音频 URL（幂等 · 空闲调度 · 低优先级 · 可取消）。
 * @param {string[]} urls 待预热的音频地址
 * @returns {() => void} 取消函数（组件卸载时调用即可中断在途请求）
 */
export function warmAudio(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return () => {}

  const controller = new AbortController()

  scheduleIdle(() => {
    if (controller.signal.aborted) return
    for (const url of urls) {
      if (!url || warmed.has(url)) continue
      warmed.add(url)
      fetch(url, { signal: controller.signal, priority: 'low', credentials: 'omit' })
        .then((res) => (res.ok ? res.blob() : Promise.reject(res.status)))
        .catch(() => {
          // 失败（404 / 网络抖动 / 主动取消）时移出集合，允许后续重试
          warmed.delete(url)
        })
    }
  })

  return () => controller.abort()
}
