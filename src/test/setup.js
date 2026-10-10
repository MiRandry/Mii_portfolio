import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

function createMediaQuery(matches = false) {
  return {
    matches,
    media: '',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn(() => createMediaQuery(false)),
})

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  vi.useRealTimers()
  vi.restoreAllMocks()
})
