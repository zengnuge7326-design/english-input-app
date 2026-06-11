import MobileIcon from './MobileIcon'
import { useMobileInstall } from '../hooks/useMobileInstall'

export default function MobileInstallTip() {
  const { platform, isStandalone, canPromptInstall, installing, promptInstall } = useMobileInstall()

  if (isStandalone) return null

  return (
    <div className="mobile-more-page__tip" role="note">
      <MobileIcon name="globe" size={18} />
      <div className="mobile-more-page__tip-body">
        {platform === 'wechat' ? (
          <p>
            微信内无法全屏。点右上角 <strong>···</strong> → <strong>在浏览器中打开</strong>，再用 Chrome / Safari 安装到桌面。
          </p>
        ) : platform === 'android' ? (
          <>
            <p>浏览器底栏占空间？安装到桌面后可全屏学习，和 App 一样。</p>
            {canPromptInstall ? (
              <button
                type="button"
                className="mobile-more-page__install-btn"
                disabled={installing}
                onClick={() => void promptInstall()}
              >
                {installing ? '安装中…' : '安装到桌面'}
              </button>
            ) : (
              <p className="mobile-more-page__tip-sub">
                Chrome：点右上角 <strong>⋮</strong> → <strong>安装应用</strong> 或 <strong>添加到主屏幕</strong>
              </p>
            )}
          </>
        ) : platform === 'ios' ? (
          <p>
            Safari 底栏占空间？点 <strong>分享</strong> → <strong>添加到主屏幕</strong>，从桌面图标打开即可全屏。
          </p>
        ) : (
          <p>
            浏览器底栏占空间？用 Chrome / Safari 打开本站，选择 <strong>安装应用</strong> 或 <strong>添加到主屏幕</strong> 可全屏使用。
          </p>
        )}
      </div>
    </div>
  )
}
