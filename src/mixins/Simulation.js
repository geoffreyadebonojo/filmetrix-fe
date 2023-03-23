import { settingsModule } from './settingsModule.js'
import * as d3 from 'd3'

export default class Simulation {
  constructor({nodes, links, width, height}) {
    this.nodes = nodes
    this.links = links
    this.width = width
    this.height = height
    
    this.body
    this.init()
  }

  init() { 
    this.body = d3.forceSimulation(this.nodes, this.links)
    .force("link", d3.forceLink(this.links).id(d => d.id).distance(() => {
      // by popularity?
      return settingsModule.defaults.link.length
    }))
    .force("charge", d3.forceManyBody().strength(() => {
      return settingsModule.defaults.node.charge
    }))
    .force('collide', d3.forceCollide(() => {
      return settingsModule.defaults.node.collide
    }))
    .force("center", d3.forceCenter(0, 0))
    .force('x', d3.forceX().x(this.width * 0.3))
    .force('y', d3.forceY().y(this.height * 0.5))
    .alpha(1)
    .alphaMin(0.2)
    .alphaTarget(0.01)
  }
}