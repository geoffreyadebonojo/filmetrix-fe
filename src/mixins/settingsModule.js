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
  defaults: {
    node: {
      collide: 50,
      charge: -2000,
      circle: {
        r: 50
      }
    },
    link: {
      length: 200,
    },
    image: {
      offset: {
        x: -35,
        y: -35
      },
      position: {
        x: 70,
        y: 70
      },
      clipPath: '0% 12px round 5px',
    }
  }
}