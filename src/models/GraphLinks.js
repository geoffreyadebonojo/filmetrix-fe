import { 
  angle360
} from '@mixins/helpers'
import { 
  graphStates
} from '@/stores/store.js'
import * as d3 from 'd3'

export default class GraphLink {
  constructor(nodeId) {
    this.nodeId = nodeId
    this.links = d3.selectAll(`.link[target='${nodeId}'], .link[source='${nodeId}']`)
    this.lines = this.links.select("line")
  }

  highlightLines(i) {
    this.lines.transition().delay(i).duration(i).style("stroke", "white").transition().style("stroke-width", "1.5")
  }

  appendLineText() {
    if (graphStates.inMotion) { return }
    let nodeType = this.nodeId.split("-")[0]

    this.links.each((l) => {
      let link = d3.select(`#${l.id}`)
      let linkholder = link.append("g").attr("class", "character-label")
      this.appendRect(linkholder, nodeType)
      this.appendText(linkholder, nodeType)
    })
  }
  
  appendRect(linkholder, nodeType) {
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
  }

  appendText(linkholder, nodeType) {
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
      return `${10}px`
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