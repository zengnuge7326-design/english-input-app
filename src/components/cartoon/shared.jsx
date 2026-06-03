/** 商店卡通图标共用样式 */
export const OUTLINE = '#3d2914'
export const OUTLINE_W = 2.2

export function CartoonSvg({ size = 48, className = '', children, viewBox = '0 0 64 64' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={`shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] ${className}`}
      aria-hidden
    >
      {children}
    </svg>
  )
}
