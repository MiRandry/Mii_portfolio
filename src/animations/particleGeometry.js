export const PARTICLE_COUNT = 4200

function fillPositions(count, callback) {
  const positions = new Float32Array(count * 3)
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = callback(index)
    const offset = index * 3
    positions[offset] = x
    positions[offset + 1] = y
    positions[offset + 2] = z
  }
  return positions
}

function createSphere(count) {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  return fillPositions(count, (index) => {
    const y = 1 - (index / (count - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const angle = goldenAngle * index
    return [Math.cos(angle) * radius, y, Math.sin(angle) * radius]
  })
}

function createTorus(count) {
  return fillPositions(count, (index) => {
    const u = ((index % 70) / 70) * Math.PI * 2
    const v = (Math.floor(index / 70) / 60) * Math.PI * 2
    const radius = 0.75 + 0.25 * Math.cos(v)
    return [radius * Math.cos(u), 0.25 * Math.sin(v), radius * Math.sin(u)]
  })
}

function createGrid(count) {
  return fillPositions(count, (index) => [
    ((index % 20) / 19 - 0.5) * 1.5,
    ((Math.floor(index / 20) % 21) / 20 - 0.5) * 1.5,
    (Math.floor(index / 420) / 9 - 0.5) * 0.9,
  ])
}

function helixPoint(progress, phase) {
  const angle = progress * Math.PI * 5 + phase
  return [0.4 * Math.cos(angle), (progress - 0.5) * 2, 0.4 * Math.sin(angle)]
}

function createHelix(count) {
  return fillPositions(count, (index) => {
    if (index < 3000) {
      const progress = (index % 1500) / 1499
      return helixPoint(progress, index < 1500 ? 0 : Math.PI)
    }

    const connector = Math.floor((index - 3000) / 30)
    const interpolation = ((index - 3000) % 30) / 29
    const start = helixPoint(connector / 39, 0)
    const end = helixPoint(connector / 39, Math.PI)
    return [
      start[0] + (end[0] - start[0]) * interpolation,
      start[1],
      start[2] + (end[2] - start[2]) * interpolation,
    ]
  })
}

function createWave(count) {
  return fillPositions(count, (index) => {
    const row = Math.floor(index / 70)
    const x = ((index % 70) / 69 - 0.5) * 2
    const y = (row / 59 - 0.5) * 1.1
    return [x, Math.sin(x * 2.8 + y * 2.2) * 0.16, y]
  })
}

function createWideSphere(sphere) {
  const positions = new Float32Array(sphere.length)
  for (let index = 0; index < sphere.length; index += 3) {
    positions[index] = sphere[index] * 1.45
    positions[index + 1] = sphere[index + 1] * 0.82
    positions[index + 2] = sphere[index + 2]
  }
  return positions
}

export function createParticleShapes(count = PARTICLE_COUNT) {
  const sphere = createSphere(count)
  return [sphere, createTorus(count), createGrid(count), createHelix(count), createWave(count), createWideSphere(sphere)]
}

export function createSeeds(count = PARTICLE_COUNT) {
  const seeds = new Float32Array(count)
  let state = 0x6d2b79f5
  for (let index = 0; index < count; index += 1) {
    state = Math.imul(state ^ (state >>> 15), 1 | state)
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state)
    seeds[index] = ((state ^ (state >>> 14)) >>> 0) / 4294967296
  }
  return seeds
}
