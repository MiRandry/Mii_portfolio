import { useEffect, useRef } from 'react'
import useFinePointer from '../hooks/useFinePointer.js'
import useReducedMotion from '../hooks/useReducedMotion.js'

function resetTransform(element) {
  if (element) element.style.transform = ''
}

export default function PointerEffects() {
  const ringRef = useRef(null)
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const ring = ringRef.current
    if (!ring || !finePointer || reducedMotion) return undefined

    document.documentElement.classList.add('has-pointer-effects')
    const pointer = { x: -100, y: -100 }
    const smooth = { x: -100, y: -100 }
    let magneticElement = null
    let tiltElement = null
    let frameId = 0

    const animate = () => {
      smooth.x += (pointer.x - smooth.x) * 0.2
      smooth.y += (pointer.y - smooth.y) * 0.2
      ring.style.transform = `translate3d(${smooth.x}px, ${smooth.y}px, 0)`
      frameId = window.requestAnimationFrame(animate)
    }

    const onPointerMove = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      ring.classList.remove('is-hidden')
      ring.classList.toggle('is-active', Boolean(event.target.closest?.('a, button, [data-cursor]')))

      const spotlight = event.target.closest?.('[data-spotlight]')
      if (spotlight) {
        const rect = spotlight.getBoundingClientRect()
        spotlight.style.setProperty('--mx', `${event.clientX - rect.left}px`)
        spotlight.style.setProperty('--my', `${event.clientY - rect.top}px`)
      }

      const nextMagnetic = event.target.closest?.('[data-magnetic]') ?? null
      if (magneticElement !== nextMagnetic) resetTransform(magneticElement)
      magneticElement = nextMagnetic
      if (magneticElement) {
        const rect = magneticElement.getBoundingClientRect()
        const x = Math.max(-8, Math.min(8, (event.clientX - rect.left - rect.width / 2) * 0.25))
        const y = Math.max(-8, Math.min(8, (event.clientY - rect.top - rect.height / 2) * 0.25))
        magneticElement.style.transform = `translate(${x}px, ${y}px)`
      }

      const nextTilt = event.target.closest?.('[data-tilt]') ?? null
      if (tiltElement !== nextTilt) resetTransform(tiltElement)
      tiltElement = nextTilt
      if (tiltElement) {
        const rect = tiltElement.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        tiltElement.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`
      }
    }
    const onPointerDown = () => ring.classList.add('is-pressed')
    const onPointerUp = () => ring.classList.remove('is-pressed')
    const onPointerLeave = () => {
      ring.classList.add('is-hidden')
      resetTransform(magneticElement)
      resetTransform(tiltElement)
      magneticElement = null
      tiltElement = null
    }

    frameId = window.requestAnimationFrame(animate)
    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('pointerup', onPointerUp)
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.cancelAnimationFrame(frameId)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerup', onPointerUp)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      document.documentElement.classList.remove('has-pointer-effects')
      resetTransform(magneticElement)
      resetTransform(tiltElement)
    }
  }, [finePointer, reducedMotion])

  return <div ref={ringRef} className="pointer-ring is-hidden" data-testid="pointer-ring" aria-hidden="true" />
}
