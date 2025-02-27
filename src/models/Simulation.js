import { 
  graphStates,
  graphData
} from "@/stores/store.js"
import GraphNode from '@models/GraphNode.js'

import * as d3 from 'd3'

export default class Simulation {
  constructor({nodes, links, graphType}, options={}) {
    this.options = options
    this.nodes = nodes
    this.links = links

    this.sim = d3.forceSimulation(this.nodes)

    this.body = this.generateGraph(
      this.fetchGraphAttrs(graphType)
    )
  }

  generateGraph(args) { 
    this.sim.force("link", d3.forceLink(this.links).id(d => d.id).distance((d) => {
              // seems like a helpful change
              // let data = graphStates.graphData[d.source.id] || graphStates.graphData[d.target.id]
              // let dist = data.links.filter(l => l.index).any() ? data.links.filter(l => l.index).length * 6 : 6
              // return dist+100
              // return d.roles.join(" ").length*10
              return 200
            }))
            .force("charge", d3.forceManyBody().strength((d) => {
              return -1000
            }))
            .force('collide', d3.forceCollide((d) => {
              let c = 50
              // if (d.hidden) {
              //   c = 50
              // }
              return c
            }).strength(0.8))
            .force("center", d3.forceCenter(
              ...args.forceCenter
            ).strength(0.2))
            .force("radial", d3.forceRadial((d) => {
              return 0, 0, 0
            }))
    
    this.sim.alpha(args.alpha.g)
            .alphaTarget(args.alpha.target)
    
    if (args.alpha.min != null) {
      this.sim.alphaMin(args.alpha.min)
    }

    return this.sim
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
        forceCenter: [width * 0.6, height * 0.5],
        alpha: {
          g:      1,
          min:    0.4, 
          target: 0.1
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