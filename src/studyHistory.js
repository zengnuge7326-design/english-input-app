/**
 * 与 App popstate 中 `kind === STUDY_KIND` 的旧历史条目兼容（早期版本曾 push 子页状态）。
 * 新逻辑不再 push 子层级，子页面请使用界面「返回」与本地 state。
 */
export const STUDY_KIND = 'study'
