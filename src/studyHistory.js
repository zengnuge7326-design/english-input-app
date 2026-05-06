/**
 * 课程类页面的统一 history：每条 pushState 自带完整「目标界面」描述，
 * popstate 落到哪条就只还原那条，避免推断栈层导致的穿透。
 */
export const STUDY_KIND = 'study'

/** @param {Record<string, unknown>} payload tab + 可选字段，勿包含 kind */
export function pushStudy(payload) {
  window.history.pushState({ kind: STUDY_KIND, ...payload }, '')
}
