import { angle360 } from '@mixins/helpers'
import { appStates, graphStates } from '@/stores/store.js'
import * as d3 from 'd3'

export default class GraphNode {
  constructor(nodeId) {
    this.id = nodeId
    this.node = d3.select(`#${nodeId}`)

    this.elem = {
      circle: this.node.select('circle'),
      label: this.node.select('.node-label'),
      poster: this.node.select('.poster'),
      sources: d3.selectAll(`.link[source='${nodeId}']`),
      targets: d3.selectAll(`.link[target='${nodeId}']`)
    }

    const x = this.elem.sources.nodes().map((d)=>d.__data__.target.id)
    const z = this.elem.targets.nodes().map((d)=>d.__data__.source.id)
    
    this.connections = d3.selectAll('.node').filter((d) => {
      return x.includes(d.id) || z.includes(d.id)
    })

    this.connectionIds = this.connections._groups[0].map((n) => n.id)
    this.currentColor = ''

    this.allLinks = d3.selectAll(`.link[target='${this.id}'], .link[source='${this.id}']`)
  }

  setLinkLock() {
    this.elem.sources.classed("locked", true)
    this.elem.targets.classed("locked", true)
  }

  checkLinks() {
    if (graphStates.visited.length < 1) {return}

    var currentNodeId = this.id
    var y = []
    let z = []

    let links = graphStates.visited.forEach((existingNodeId) => {
      if (currentNodeId == existingNodeId) { return }
      if (currentNodeId.slice(0,5) == existingNodeId.slice(0,5)) { return }

      if (d3.select(`#${currentNodeId}--${existingNodeId}`)._groups[0][0] !== null){
        z.push(`${currentNodeId}--${existingNodeId}`)
      } else if (d3.select(`#${existingNodeId}--${currentNodeId}`)._groups[0][0] !== null){
        z.push(`${existingNodeId}--${currentNodeId}`)
      }
    })

    return z
  }

  hover() {
  if (appStates.shiftKeyIsPressed) { this.node.classed('shift-hover', true)
  } else { this.node.classed('hover', true) }
    // this.allLinks.selectAll(".line").style("stroke", "lightgreen")
  }

  unHover() {
    this.node.classed('hover', false)
    this.node.classed('shift-hover', false)
    // this.allLinks.selectAll(".line").style("stroke", "#7A7879")
  }

  linkUnhighlighter() {
    let d = d3.selectAll(".link:not(.locked)")
    d.selectAll(".character-label").remove()
  }

  async linkHighlighter() {
    let merged = this.allLinks
    // let merged = this.elem.targets
    let linkholder = merged.append("g").attr("class", "character-label")

    let start = 65
    let fs = 10

    linkholder.append("rect")
    .attr('fill', "#222222")
    .attr("x", (d) => {
      if (d.target.x < d.source.x) { 
        return start-200 -(d.roles.join("").length)
      } else {
        return start
      }
    })
    .attr("y", -4)
    .attr("height", 8)
    .attr("width", (d) => {
      let c = d.roles.join().split("").length
      return c*4
    })
    .attr("transform", (d) => {
      let theta = angle360(
        d.source.x,
        d.source.y,
        d.target.x,
        d.target.y
      )

      if (d.target.x < d.source.x) {
        return `translate(${d.source.x},${d.source.y})rotate(${theta+180})`
      } else {
        return `translate(${d.source.x},${d.source.y})rotate(${theta})`
      }
    })

    linkholder.append("text")
    .text(d => d.roles.join(", "))
    .attr("x", (d) => {
      if (d.target.x < d.source.x) { 
        return start-200 -(d.roles.join("").length)
      } else {
        return start
      }
    })
    .attr("text-anchor", "start")
    .attr("y", 2)
    .attr("stroke", "#FFF")
    .style("font-family", "Dosis, sans-serif")
    .style("font-size", () => {
      return `${fs}px`
    })
    .attr("transform", (d) => {
      let theta = angle360(
        d.source.x,
        d.source.y,
        d.target.x,
        d.target.y
      )

      if (d.target.x < d.source.x) {
        return `translate(${d.source.x},${d.source.y})rotate(${theta+180})`
      } else {
        return `translate(${d.source.x},${d.source.y})rotate(${theta})`
      }
    })
  }
}