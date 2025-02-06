export const graphSets = {
  default: {
    velocityDecay: 0.5,
    link: {
      distance: 2000
    },
    charge: {
      strength: -2000
    },
    collide: 80,
    center: {
      x: window.innerWidth,
      y: window.innerHeight
    },
    radial: [600, 0, 0],
    alpha: {
      g: 1,
      min: 0.4,
      target: 0.1
    }
  }
} 