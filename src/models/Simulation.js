import * as d3 from 'd3'
import { graphStates } from '@/stores/store.js'

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
    .force("link", d3.forceLink(this.links).id(d => d.id).distance(() => {
        return args.forces.length
    }))
    .force("charge", d3.forceManyBody().strength((d) => {
        return args.forces.charge
    }))
    .force('collide', d3.forceCollide((d) => {
        return args.forces.collide
    }))
    .force("center", d3.forceCenter(
      ...args.forceCenter
    ))
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
          length:  200,
          charge: -1800,
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