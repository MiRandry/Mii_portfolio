import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import IntroSplash from '../animations/IntroSplash.jsx'
import ParticleScene from '../animations/ParticleScene.jsx'
import PointerEffects from '../animations/PointerEffects.jsx'
import { createParticleShapes, createSeeds, PARTICLE_COUNT } from '../animations/particleGeometry.js'

const threeMocks = vi.hoisted(() => ({
  geometryDispose: vi.fn(),
  materialDispose: vi.fn(),
  rendererDispose: vi.fn(),
  rendererRender: vi.fn(),
}))

vi.mock('three', () => {
  class BufferGeometry {
    setAttribute() { return this }
    dispose() { threeMocks.geometryDispose() }
  }
  class ShaderMaterial {
    constructor(options) { Object.assign(this, options) }
    dispose() { threeMocks.materialDispose() }
  }
  class WebGLRenderer {
    constructor(options) { this.domElement = options.canvas }
    setClearAlpha() {}
    setPixelRatio() {}
    setSize() {}
    render() { threeMocks.rendererRender() }
    dispose() { threeMocks.rendererDispose() }
  }
  class Points {
    constructor() {
      this.position = { set: vi.fn() }
      this.scale = { setScalar: vi.fn() }
      this.rotation = { x: 0, y: 0 }
    }
  }
  class PerspectiveCamera {
    constructor() { this.position = { z: 0 }; this.aspect = 1 }
    updateProjectionMatrix() {}
  }
  return {
    BufferAttribute: class BufferAttribute {},
    BufferGeometry,
    Clock: class Clock { getElapsedTime() { return 1 } },
    Color: class Color {},
    PerspectiveCamera,
    Points,
    Scene: class Scene { add() {} },
    ShaderMaterial,
    Sphere: class Sphere {},
    Vector3: class Vector3 {},
    WebGLRenderer,
  }
})

function mediaQueryFor({ desktop = false, fine = false, reduced = false } = {}) {
  return vi.fn((query) => ({
    matches: query.includes('min-width') ? desktop : query.includes('prefers-reduced-motion') ? reduced : fine,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

beforeEach(() => {
  threeMocks.geometryDispose.mockClear()
  threeMocks.materialDispose.mockClear()
  threeMocks.rendererDispose.mockClear()
  threeMocks.rendererRender.mockClear()
  window.matchMedia = mediaQueryFor()
  window.requestAnimationFrame = vi.fn(() => 42)
  window.cancelAnimationFrame = vi.fn()
})

describe('géométrie des particules', () => {
  test('génère six formes déterministes de 4 200 points', () => {
    const first = createParticleShapes()
    const second = createParticleShapes()
    expect(first).toHaveLength(6)
    first.forEach((shape) => expect(shape).toHaveLength(PARTICLE_COUNT * 3))
    expect(Array.from(first[0].slice(0, 30))).toEqual(Array.from(second[0].slice(0, 30)))
  })

  test('génère des seeds reproductibles entre zéro et un', () => {
    const seeds = createSeeds()
    expect(seeds).toHaveLength(PARTICLE_COUNT)
    expect(Math.min(...seeds)).toBeGreaterThanOrEqual(0)
    expect(Math.max(...seeds)).toBeLessThan(1)
    expect(Array.from(seeds.slice(0, 20))).toEqual(Array.from(createSeeds().slice(0, 20)))
  })
})

describe('activation progressive', () => {
  test('ne crée pas de canvas sur mobile', () => {
    render(<ParticleScene />)
    expect(screen.getByTestId('particle-scene')).not.toHaveAttribute('data-ready')
    expect(screen.getByTestId('particle-scene').querySelector('canvas')).not.toBeInTheDocument()
  })

  test('ne crée pas de canvas avec reduced motion', () => {
    window.matchMedia = mediaQueryFor({ desktop: true, fine: true, reduced: true })
    render(<ParticleScene />)
    expect(screen.getByTestId('particle-scene').querySelector('canvas')).not.toBeInTheDocument()
  })

  test('initialise puis libère les ressources sur desktop compatible', async () => {
    window.matchMedia = mediaQueryFor({ desktop: true, fine: true })
    window.requestIdleCallback = vi.fn((callback) => { callback(); return 7 })
    window.cancelIdleCallback = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({})
    class Observer {
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', Observer)

    const { unmount } = render(<><section id="accueil"><div data-particle-anchor /></section><section id="a-propos" /><section id="competences" /><section id="parcours" /><section id="projets" /><section id="contact" /><ParticleScene /></>)
    await waitFor(() => expect(screen.getByTestId('particle-scene')).toHaveAttribute('data-ready', 'true'))
    expect(screen.getByTestId('particle-scene').querySelector('canvas')).toBeInTheDocument()

    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    fireEvent(document, new Event('visibilitychange'))
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    unmount()
    expect(threeMocks.geometryDispose).toHaveBeenCalledOnce()
    expect(threeMocks.materialDispose).toHaveBeenCalledOnce()
    expect(threeMocks.rendererDispose).toHaveBeenCalledOnce()
    vi.unstubAllGlobals()
  })
})

describe('micro-interactions', () => {
  test('affiche le splash une fois puis le masque après 750 ms', () => {
    vi.useFakeTimers()
    const first = render(<IntroSplash />)
    expect(screen.getByTestId('intro-splash')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(750))
    expect(screen.queryByTestId('intro-splash')).not.toBeInTheDocument()
    first.unmount()
    render(<IntroSplash />)
    expect(screen.queryByTestId('intro-splash')).not.toBeInTheDocument()
  })

  test('désactive splash et effets de pointeur avec reduced motion', () => {
    window.matchMedia = mediaQueryFor({ desktop: true, fine: true, reduced: true })
    render(<><IntroSplash /><PointerEffects /></>)
    expect(screen.queryByTestId('intro-splash')).not.toBeInTheDocument()
    expect(document.documentElement).not.toHaveClass('has-pointer-effects')
  })
})
