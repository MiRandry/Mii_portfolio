import { useEffect, useState } from 'react'
import useReducedMotion from '../hooks/useReducedMotion.js'

const STORAGE_KEY = 'mnr-intro-seen'
const SPLASH_DURATION = 750

function shouldShowSplash() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== 'true'
  } catch {
    return true
  }
}

export default function IntroSplash() {
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(shouldShowSplash)

  useEffect(() => {
    if (reducedMotion) return undefined
    if (!visible) return undefined

    try {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // Storage can be unavailable in private or restricted contexts.
    }
    const timeoutId = window.setTimeout(() => setVisible(false), SPLASH_DURATION)
    return () => window.clearTimeout(timeoutId)
  }, [reducedMotion, visible])

  if (!visible || reducedMotion) return null
  return (
    <div className="intro-splash" data-testid="intro-splash" aria-hidden="true">
      <span className="intro-mark">MNR</span>
      <span className="intro-progress" />
    </div>
  )
}
