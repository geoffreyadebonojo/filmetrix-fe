import { angle360 } from '@mixins/helpers'
import { appStates, graphStates } from '@/stores/store.js'
import * as d3 from 'd3'

export default class GraphNode {
  constructor(nodeId) {
    this.id = nodeId

    this.node = d3.select(`#${this.id}`)
    this.circle =     this.node.select('circle'),
    this.label =      this.node.select('.node-label'),
    this.pageSearch = this.node.select('.node-label').select('.text-container'),
    this.poster =     this.node.select('.poster'),
    
    this.sources =  d3.selectAll(`.link[source='${this.id}']`),
    this.targets =  d3.selectAll(`.link[target='${this.id}']`)
    this.allLinks = d3.selectAll(`.link[target='${this.id}'], .link[source='${this.id}']`)

    const x = this.sources.nodes().map((d)=> d.attributes.target.value)
    const z = this.targets.nodes().map((d)=> d.attributes.source.value)

    this.connections = d3.selectAll('.node').filter((d) => { return x.includes(d.id) || z.includes(d.id) })
    this.connectionIds = this.connections._groups[0].map((n) => n.id)
  }

  shrinkNodeScale(scale) {
    this.poster.transition().duration(1000).style("transform", `scale(${scale})`)
    this.circle.transition().duration(1000).style("transform", `scale(${scale})`)
    this.label.transition().duration(1000).style("transform", `scale(${scale})`)
  }

  setNodeScale(scale) {
    this.poster.style("transform", `scale(${scale})`)
    this.circle.style("transform", `scale(${scale})`)
    this.label.style("transform", `scale(${scale})`)
  }

  hover() {
    if (appStates.shiftKeyIsPressed) { 
      this.node.classed('shift-hover', true)
    } else if (appStates.metaKeyIsPressed) {
      this.node.classed('alt-hover', true)
    } else { 
      this.node.classed('hover', true) 
    }
  }

  unHover() {
    this.node.classed('hover', false)
    this.node.classed('shift-hover', false)
    this.node.classed('alt-hover', false)
  }

  linkUnhighlighter() {
    let d = d3.selectAll(".link:not(.locked)")
    d.selectAll(".character-label").remove()
  }

  async linkHighlighter(hoveredId) {
    if (graphStates.inMotion) { return }

    let merged = this.allLinks
    let linkholder = merged.append("g").attr("class", "character-label")
    let fs = 10
    let nodeType = hoveredId.split("-")[0]

    linkholder.append("rect")
    .attr('fill', "#222")
    .attr("x", (d) => {
      let textLength = d.roles.join("").length
      if (nodeType == "person") {
        return (d.target.x < d.source.x) ? -50 - (textLength*3.75) : 50

      } else {
        let x = Math.abs( (d.source.x - d.target.x) )
        let y = Math.abs( (d.source.y - d.target.y) )
        let h = Math.sqrt( (x*x) + (y*y) )
        return (d.target.x < d.source.x) ? -h + 50 : h - 50 -(textLength*3.75)
      }
    })
    .attr("y", -4)
    .attr("height", 8)
    .attr("width", (d) => {
      let c = d.roles.join().split("").length
      return c*3.5
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

    ////

    linkholder.append("text")
    .text(d => d.roles.join(", "))
    .attr("x", (d) => {
      if (nodeType == "person") {
        return (d.target.x < d.source.x) ? -50 : 50

      } else {
        let x = Math.abs( (d.source.x - d.target.x) )
        let y = Math.abs( (d.source.y - d.target.y) )
        let h = Math.sqrt( (x*x) + (y*y) )
        return (d.target.x < d.source.x) ? -h + 50 : h - 50
      }
    })
    .attr("text-anchor", (link) => {
      if (nodeType == "person") {
        return (link.target.x < link.source.x) ? "end" : "start"
      } else {
        return (link.target.x < link.source.x) ? "start" : "end"
      }
    })
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