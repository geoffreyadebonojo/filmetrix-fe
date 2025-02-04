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

  // setting of forces still being researched
  // ---- static or dynamic -----
  // there was also ideas for slider control
  // which would require dynamic control
  // at the moment more trouble than its worth

  generateGraph(args) { 
    const sim = d3.forceSimulation(this.nodes, this.links)
    .velocityDecay(0.5)
    .force("link", d3.forceLink(this.links).id(d => d.id).distance((link) => {
      // return (link.target.popularity + link.source.popularity)/2
      return 100
    }).strength((link) => {
      // return 1 / Math.min(count(link.source), count(link.target));
      return 0.5
    }))
    .force("charge", d3.forceManyBody().strength((node) => {
      // console.log(node.name, node.popularity)
      return -1000
    }))
    .force('collide', d3.forceCollide(80).strength(1))
    .force("center", d3.forceCenter(
      ...args.forceCenter
    ))
    .force("radial", d3.forceRadial((d) => {
      return 300, window.innerWidth/2, window.innerHeight/2
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