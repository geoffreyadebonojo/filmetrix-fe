import { store } from '@/stores/store.js'

export const settingsModule = {
  anchorNodeSettings: {
    collide: 0,
    linkLength: 0,
    charge: 0
  },
  neutralSettings: {
    collide: 0,
    linkLength: 0,
    charge: 0
  },
  defaultSettings: {
    r: 50,
    imageOffset: {
      x: 70,
      y: 70,
    },
    clipPath: '0% 12px round 5px',
    collide: 100,
    linkLength: 100,
    charge: -200
  }
}