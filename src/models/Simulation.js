import * as d3 from 'd3'

export default class Simulation {
  constructor({nodes, links, graphType}, options={}) {
    this.options = options
    this.nodes = nodes
    this.links = links

    this.body = this.generateGraph(
      this.fetchGraphAttrs(graphType)
    )
  }

  generateGraph(args) { 
    const sim = d3.forceSimulation(this.nodes, this.links)
    .velocityDecay(0.5)
    .force("link", d3.forceLink(this.links).id(d => d.id).distance(() => {
        // return args.forces.length
        return 200
    }))
    .force("charge", d3.forceManyBody().strength((d) => {
        // return args.forces.charge
        return -2000
    }))
    .force('collide', d3.forceCollide((d) => {
        // return args.forces.collide
        return 80
    }))
    .force("center", d3.forceCenter(
      ...args.forceCenter
    ))
    .force("radial", d3.forceRadial((d) => {
      return 600, 0, 0
    }))
    .alpha(args.alpha.g)
    .alphaTarget(args.alpha.target)
    
    if (args.alpha.min != null) {
      sim.alphaMin(args.alpha.min)
    }

    return sim
  }

  fetchGraphAttrs(type){ 
    const width = window.innerWidth
    const height = window.innerHeight 

    const attrs = {
      main: {
        forces: {
          length:  140,
          charge: -1000,
          collide: 60
        },
        forceCenter: [width * 0.5, height * 0.5],
        alpha: {
          g:      1,
          min:    0.2, 
          target: 0.01
        }
      },
      about: {
        forces: {
          length:  200,
          charge: 700,
          collide: 70
        },
        forceCenter: [width * 0.48, height * 0.57],
        alpha: {
          g:      1,
          target: 0.9999
        }
      }
    }

    return attrs[type]
  }
}