import * as d3 from 'd3'

export default class Simulation {
  constructor({nodes, links, graphType}) {
    this.nodes = nodes
    this.links = links
    this.body
    
    this.width = window.innerWidth
    this.height = window.innerHeight 

    if (graphType == "about") {
      this.generateAboutGraph()
    } else if (graphType == "game") {
      this.generateGameGraph()
    } else if (graphType == "main") {
      this.generateMainGraph()
    }
  }

  generateMainGraph() { 
    const posterOffset = 25
    const settings = {
      node: {
        collide: 60,
        charge: -1000,
        circle: {
          r: 50
        }
      },
      link: {
        length: 200,
      },
      image: {
        offset: {
          x: -posterOffset,
          y: -posterOffset
        },
        position: {
          x: posterOffset*2,
          y: posterOffset*2
        },
        clipPath: '0% 12px round 5px',
      }
    }

    this.body = d3.forceSimulation(this.nodes, this.links)
    .force("link", d3.forceLink(this.links).id(d => d.id).distance(() => {
      // by popularity?
      return settings.link.length
    }))
    .force("charge", d3.forceManyBody().strength(() => {
      return settings.node.charge
    }))
    .force('collide', d3.forceCollide(() => {
      let col = settings.node.collide
      return col
      // if (graphStates.existing.map((f) => f[0]).includes(d.id)) {
      //   return col * 1.2
      // } else {
      //   return col * 0.8
      // }
    }))
    .force("center", d3.forceCenter(this.width * 0.5, this.height * 0.5))
    // .force('x', d3.forceX().x(this.width * 0.5))
    // .force('y', d3.forceY().y(this.height * 0.5))
    .alpha(1)
    .alphaMin(0.2)
    .alphaTarget(0.01)
  }

  generateAboutGraph() { 
    this.body = d3.forceSimulation(this.nodes, this.links)
    .force("link", d3.forceLink(this.links).id(d => d.id).distance(() => {
      return 200
    }))
    .force("charge", d3.forceManyBody().strength(() => {
      return 700
    }))
    .force('collide', d3.forceCollide(() => {
      return 70
    }))
    .force("center", d3.forceCenter(this.width * 0.5, this.height * 0.5))
    // .force('x', d3.forceX().x(this.width * 0.5))
    // .force('y', d3.forceY().y(this.height * 0.5))
    // .alpha(1)
    // .alphaMin(0.2)
    // .alphaTarget(0.01)
    .alpha(1)
    .alphaTarget(0.9999)
  }

  generateGameGraph() { 
    const posterOffset = 25

    const settings = {
      node: {
        collide: 60,
        charge: -1000,
        circle: {
          r: 50
        }
      },
      link: {
        length: 200,
      },
      image: {
        offset: {
          x: -posterOffset,
          y: -posterOffset
        },
        position: {
          x: posterOffset*2,
          y: posterOffset*2
        },
        clipPath: '0% 12px round 5px',
      }
    }

    this.body = d3.forceSimulation(this.nodes, this.links)
    .force("link", d3.forceLink(this.links).id(d => d.id).distance(() => {
      // by popularity?
      return settings.link.length
    }))
    .force("charge", d3.forceManyBody().strength(() => {
      return settings.node.charge
    }))
    .force('collide', d3.forceCollide(() => {
      let col = settings.node.collide
      return col
      // if (graphStates.existing.map((f) => f[0]).includes(d.id)) {
      //   return col * 1.2
      // } else {
      //   return col * 0.8
      // }
    }))
    .force("center", d3.forceCenter(this.width * 0.5, this.height * 0.5))
    // .force('x', d3.forceX().x(this.width * 0.5))
    // .force('y', d3.forceY().y(this.height * 0.5))
    .alpha(1)
    .alphaMin(0.2)
    .alphaTarget(0.01)
  }
}