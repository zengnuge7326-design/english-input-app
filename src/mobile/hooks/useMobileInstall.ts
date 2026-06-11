import { useCallback, useEffect, useState } from 'react'
import { detectMobilePlatform, type MobilePlatform } from './useMobilePlatform'
import { useIsStandalone } from './useIsStandalone'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useMobileInstall() {
  const isStandalone = useIsStandalone()
  const [platform] = useState<MobilePlatform>(() => detectMobilePlatform())
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    if (isStandalone) return

    function onBeforeInstall(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [isStandalone])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false
    setInstalling(true)
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        return true
      }
      return false
    } finally {
      setInstalling(false)
    }
  }, [deferredPrompt])

  return {
    platform,
    isStandalone,
    canPromptInstall: !!deferredPrompt,
    installing,
    promptInstall,
  }
}
