const crazyTree= {
  nodes: [
    { id: 1, letter: "F"},
    { id: 2, letter: "I"},
    { id: 3, letter: "L"},
    { id: 4, letter: "M"},
    { id: 5, letter: "E"},
    { id: 6, letter: "T"},
    { id: 7, letter: "R"},
    { id: 8, letter: "I"},
    { id: 9, letter: "X"}
  ]
  ,
  links: [
    { source: 4, target: 2 },
    { source: 4, target: 3 },
    { source: 4, target: 5 },
    { source: 5, target: 6 },
    { source: 4, target: 1 },
    { source: 5, target: 7 },
    { source: 5, target: 8 },
    { source: 5, target: 9 }
  ],
  forces: {
    x: 10,
    y: 0,
  }
}

const scrambler= {
  nodes: [
    { id: 1, letter: "F"},
    { id: 2, letter: "I"},
    { id: 3, letter: "L"},
    { id: 4, letter: "M"},
    { id: 5, letter: "E"},
    { id: 6, letter: "T"},
    { id: 7, letter: "R"},
    { id: 8, letter: "I"},
    { id: 9, letter: "X"}
  ]
  ,
  links: [
    { source: 4, target: 2 },
    { source: 4, target: 3 },
    { source: 4, target: 5 },
    { source: 5, target: 6 },
    { source: 4, target: 1 },
    { source: 5, target: 7 },
    { source: 5, target: 8 },
    { source: 5, target: 9 },
    // { source: 9, target: 1 }
    // { source: Math.floor(Math.random()*4), target: 3 }
  ],
  forces: {
    charge: 200,
    distance: 120,
    collide: 90,
    x: 0,
    y: 10
  }
}

const shortString =  {
  nodes: [
    { id: 1, letter: "F"},
    { id: 2, letter: "I"},
    { id: 3, letter: "L"},
    { id: 4, letter: "M"},
    { id: 5, letter: "E"},
    { id: 6, letter: "T"},
    { id: 7, letter: "R"},
    { id: 8, letter: "I"},
    { id: 9, letter: "X"}
  ]
  ,
  links: [
    { source: 9, target: 8 },
    { source: 8, target: 7 },
    { source: 7, target: 6 },
    { source: 6, target: 5 },
    { source: 5, target: 4 },
    { source: 4, target: 3 },
    { source: 3, target: 2 },
    { source: 2, target: 1 },
    // { source: 9, target: 1 }
    // { source: Math.floor(Math.random()*4), target: 3 }
  ],
  forces: {
    charge: 200,
    distance: 120,
    collide: 90,
    x: 0,
    y: 10
  }
  // forces: {
  //   charge: 200,
  //   distance: 50,
  //   collide: 90,
  //   x: 0,
  //   y: 10
  // }

  // cool snake
  // forces: {
  //   charge: -2000,
  //   distance: 100,
  //   collide: 50,
  //   x: 0,
  //   y: 10
  // }
}