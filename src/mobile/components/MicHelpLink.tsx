import { showMicGuide } from '../../utils/micGate'

interface Props {
  purpose?: string
  mode?: 'prompt' | 'denied' | 'unsupported' | 'insecure'
  className?: string
  label?: string
}

export default function MicHelpLink({
  purpose = '跟读练习',
  mode,
  className = '',
  label = '查看开启步骤',
}: Props) {
  return (
    <button
      type="button"
      onClick={() => showMicGuide({ purpose, mode })}
      className={`text-sm font-bold text-[#58cc02] underline underline-offset-2 active:opacity-70 ${className}`}
    >
      {label}
    </button>
  )
}
