import homeIcon from '../assets/icons/home.svg?raw'
import bookOpenIcon from '../assets/icons/book-open.svg?raw'
import languagesIcon from '../assets/icons/languages.svg?raw'
import menuIcon from '../assets/icons/menu.svg?raw'
import bellIcon from '../assets/icons/bell.svg?raw'
import settingsIcon from '../assets/icons/settings.svg?raw'
import trash2Icon from '../assets/icons/trash-2.svg?raw'
import logOutIcon from '../assets/icons/log-out.svg?raw'
import starIcon from '../assets/icons/star.svg?raw'
import flameIcon from '../assets/icons/flame.svg?raw'
import zapIcon from '../assets/icons/zap.svg?raw'
import volume2Icon from '../assets/icons/volume-2.svg?raw'
import turtleIcon from '../assets/icons/turtle.svg?raw'
import checkIcon from '../assets/icons/check.svg?raw'
import globeIcon from '../assets/icons/globe.svg?raw'
import userRoundIcon from '../assets/icons/user-round.svg?raw'

export type MobileIconName =
  | 'home'
  | 'book-open'
  | 'languages'
  | 'menu'
  | 'bell'
  | 'settings'
  | 'trash-2'
  | 'log-out'
  | 'star'
  | 'flame'
  | 'zap'
  | 'volume-2'
  | 'turtle'
  | 'check'
  | 'globe'
  | 'user-round'

const ICONS: Record<MobileIconName, string> = {
  home: homeIcon,
  'book-open': bookOpenIcon,
  languages: languagesIcon,
  menu: menuIcon,
  bell: bellIcon,
  settings: settingsIcon,
  'trash-2': trash2Icon,
  'log-out': logOutIcon,
  star: starIcon,
  flame: flameIcon,
  zap: zapIcon,
  'volume-2': volume2Icon,
  turtle: turtleIcon,
  check: checkIcon,
  globe: globeIcon,
  'user-round': userRoundIcon,
}

interface Props {
  name: MobileIconName
  size?: number
  className?: string
  label?: string
}

function renderSvg(raw: string, size: number) {
  return raw
    .replace(/width="[^"]*"/, `width="${size}"`)
    .replace(/height="[^"]*"/, `height="${size}"`)
    .replace(/stroke-width="[^"]*"/, 'stroke-width="2"')
}

export default function MobileIcon({ name, size = 20, className, label }: Props) {
  const svg = renderSvg(ICONS[name], size)
  return (
    <span
      className={['mobile-icon', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
