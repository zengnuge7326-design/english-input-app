export type MobilePlatform = 'ios' | 'android' | 'wechat' | 'other'

export function detectMobilePlatform(): MobilePlatform {
  const ua = navigator.userAgent
  if (/MicroMessenger/i.test(ua)) return 'wechat'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'other'
}
