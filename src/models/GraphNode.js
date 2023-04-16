import { angle360 } from '@mixins/helpers'
import { graphStates } from '@/stores/store.js'
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
  }

  nodeTransformer(args) {
    // if (target.classList.contains('locked')) { return }
    this.node.moveToFront()

    this.elem.circle.style("transform", `scale(${args.scale})`) 
    this.elem.label.style("transform", `scale(${args.scale})`)
    this.elem.poster.style("transform", `scale(${args.scale})`)
    this.elem.label.selectAll("text").style("stroke", args.textStroke)
    this.elem.circle.style("stroke", args.stroke)

    this.connections.select('circle').style("stroke", args.stroke)
    this.connections.selectAll("text").style("stroke", args.textStroke)
    // this.connections.select(".poster").style("transform", `scale(${args.scale})`)

    this.elem.sources.select("line").attr("stroke", args.stroke)
    this.elem.targets.select("line").attr("stroke", args.stroke)
  }

  linkUnhighlighter() {
    let merged = d3.selectAll(`.link[target='${this.id}'], .link[source='${this.id}']`)
    merged.selectAll(".character-label").remove()
  }

  linkHighlighter() {
    let merged = d3.selectAll(`.link[target='${this.id}'], .link[source='${this.id}']`)
    let linkholder = merged.append("g").attr("class", "character-label")
    let start = 65
    let fs = 10

    linkholder.append("rect")
    .attr('fill', "#222222")
    .attr("x", -2)
    .attr("y", start)
    .attr("width", 4)
    .attr("height", (d) => {
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
      return `translate(${d.source.x},${d.source.y})rotate(${theta-90})`
    })

    linkholder.append("text")
    .text(d => d.roles.join(", "))
    .attr("x", start)
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
      return `translate(${d.source.x},${d.source.y})rotate(${theta})`
    })
  }
}