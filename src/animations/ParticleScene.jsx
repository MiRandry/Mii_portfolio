import { useEffect, useRef } from 'react'
import { particleSections } from '../data/animations.js'
import useFinePointer from '../hooks/useFinePointer.js'
import useMediaQuery from '../hooks/useMediaQuery.js'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { createParticleShapes, createSeeds, PARTICLE_COUNT } from './particleGeometry.js'
import { particleFragmentShader, particleVertexShader } from './particleShaders.js'

const CAMERA_DISTANCE = 6
const CAMERA_FOV = 40

function scheduleIdle(callback) {
  if (typeof window.requestIdleCallback === 'function') {
    return { id: window.requestIdleCallback(callback, { timeout: 1000 }), native: true }
  }
  return { id: window.setTimeout(callback, 200), native: false }
}

function cancelIdle(task) {
  if (!task) return
  if (task.native && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(task.id)
  else window.clearTimeout(task.id)
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value))
}

function interpolate(start, end, progress) {
  return start + (end - start) * progress
}

function resolveTarget(config, element) {
  const anchor = config.anchor ? element?.querySelector(config.anchor) : null
  if (anchor) {
    const rect = anchor.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      size: Math.max(rect.width, rect.height) * 1.55,
      opacity: config.opacity,
    }
  }

  return {
    x: window.innerWidth * config.x,
    y: window.innerHeight * config.y,
    size: Math.min(window.innerWidth, window.innerHeight) * config.size,
    opacity: config.opacity,
  }
}

function getScrollMorph(elements, fallbackIndex) {
  const center = window.innerHeight * 0.5
  const tops = elements.map((element) => element?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY)
  let index = 0
  tops.forEach((top, candidate) => {
    if (top <= center) index = candidate
  })

  if (!Number.isFinite(tops[index])) return fallbackIndex
  if (index >= tops.length - 1 || !Number.isFinite(tops[index + 1])) return index
  const distance = tops[index + 1] - tops[index]
  if (distance <= 0) return index
  return index + clamp((center - tops[index]) / distance, 0, 1)
}

function getInterpolatedTarget(morph, elements) {
  const startIndex = Math.min(Math.floor(morph), particleSections.length - 1)
  const endIndex = Math.min(startIndex + 1, particleSections.length - 1)
  const progress = morph - startIndex
  const start = resolveTarget(particleSections[startIndex], elements[startIndex])
  const end = resolveTarget(particleSections[endIndex], elements[endIndex])
  return {
    x: interpolate(start.x, end.x, progress),
    y: interpolate(start.y, end.y, progress),
    size: interpolate(start.size, end.size, progress),
    opacity: interpolate(start.opacity, end.opacity, progress),
  }
}

export default function ParticleScene() {
  const containerRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const finePointer = useFinePointer()
  const desktop = useMediaQuery('(min-width: 992px)')

  useEffect(() => {
    const container = containerRef.current
    if (!container || reducedMotion || !finePointer || !desktop) return undefined

    let disposed = false
    let teardown = () => {}
    const idleTask = scheduleIdle(async () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext?.('webgl2', { alpha: true, antialias: false })
      if (!context || disposed) return

      try {
        const THREE = await import('./threeRuntime.js')
        if (disposed) return

        const renderer = new THREE.WebGLRenderer({
          canvas,
          context,
          alpha: true,
          antialias: false,
          powerPreference: 'low-power',
        })
        renderer.setClearAlpha(0)
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
        renderer.setPixelRatio(pixelRatio)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100)
        camera.position.z = CAMERA_DISTANCE

        const shapes = createParticleShapes(PARTICLE_COUNT)
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(shapes[0], 3))
        shapes.slice(1).forEach((shape, index) => {
          geometry.setAttribute(`aShape${index + 1}`, new THREE.BufferAttribute(shape, 3))
        })
        geometry.setAttribute('aSeed', new THREE.BufferAttribute(createSeeds(PARTICLE_COUNT), 1))
        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4)

        const accent = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim() || '#2f7368'
        const material = new THREE.ShaderMaterial({
          vertexShader: particleVertexShader,
          fragmentShader: particleFragmentShader,
          transparent: true,
          depthWrite: false,
          uniforms: {
            uTime: { value: 0 },
            uMorph: { value: 0 },
            uOpacity: { value: 1 },
            uColor: { value: new THREE.Color(accent) },
            uPixelRatio: { value: pixelRatio },
            uPointScale: { value: 1 },
          },
        })
        const points = new THREE.Points(geometry, material)
        scene.add(points)
        container.appendChild(canvas)
        container.dataset.ready = 'true'

        let worldPerPixel = 1
        const resize = () => {
          const width = window.innerWidth
          const height = window.innerHeight
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          worldPerPixel = (2 * Math.tan((CAMERA_FOV * Math.PI) / 360) * CAMERA_DISTANCE) / height
          material.uniforms.uPointScale.value = clamp(height / 900, 0.8, 2.2)
        }
        resize()

        const sectionElements = particleSections.map(({ id }) => document.getElementById(id))
        let activeIndex = 0
        const observer = typeof IntersectionObserver === 'function'
          ? new IntersectionObserver((entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) activeIndex = particleSections.findIndex(({ id }) => id === entry.target.id)
              })
            }, { rootMargin: '-45% 0px -50% 0px' })
          : null
        sectionElements.forEach((element) => element && observer?.observe(element))

        const pointer = { x: 0, y: 0 }
        const onPointerMove = (event) => {
          pointer.x = (event.clientX / window.innerWidth) * 2 - 1
          pointer.y = (event.clientY / window.innerHeight) * 2 - 1
        }

        const animationStart = window.performance.now()
        let currentMorph = getScrollMorph(sectionElements, activeIndex)
        let frameId = 0
        let running = false
        const render = () => {
          const elapsed = (window.performance.now() - animationStart) / 1000
          const targetMorph = getScrollMorph(sectionElements, activeIndex)
          currentMorph += (targetMorph - currentMorph) * 0.08
          const target = getInterpolatedTarget(currentMorph, sectionElements)

          material.uniforms.uTime.value = elapsed
          material.uniforms.uMorph.value = currentMorph
          material.uniforms.uOpacity.value = target.opacity
          points.position.set(
            (target.x - window.innerWidth / 2) * worldPerPixel,
            (window.innerHeight / 2 - target.y) * worldPerPixel,
            0,
          )
          points.scale.setScalar((target.size * worldPerPixel) / 2)
          points.rotation.y = elapsed * 0.08 + pointer.x * 0.35
          points.rotation.x += (pointer.y * 0.25 - points.rotation.x) * 0.05
          renderer.render(scene, camera)
          frameId = window.requestAnimationFrame(render)
        }
        const start = () => {
          if (running) return
          running = true
          frameId = window.requestAnimationFrame(render)
        }
        const stop = () => {
          running = false
          window.cancelAnimationFrame(frameId)
        }
        const onVisibilityChange = () => {
          if (document.hidden) stop()
          else start()
        }

        window.addEventListener('resize', resize)
        window.addEventListener('pointermove', onPointerMove, { passive: true })
        document.addEventListener('visibilitychange', onVisibilityChange)
        start()

        teardown = () => {
          stop()
          observer?.disconnect()
          window.removeEventListener('resize', resize)
          window.removeEventListener('pointermove', onPointerMove)
          document.removeEventListener('visibilitychange', onVisibilityChange)
          geometry.dispose()
          material.dispose()
          renderer.dispose()
          canvas.remove()
          delete container.dataset.ready
        }
      } catch {
        canvas.remove()
      }
    })

    return () => {
      disposed = true
      cancelIdle(idleTask)
      teardown()
    }
  }, [desktop, finePointer, reducedMotion])

  return <div ref={containerRef} className="particle-scene" data-testid="particle-scene" aria-hidden="true" />
}
