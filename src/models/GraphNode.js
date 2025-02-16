import { 
  setFocus
} from '@mixins/helpers'
import { 
  appStates, 
  graphStates,
  panelStates
} from '@/stores/store.js'
import GraphLinks from '@models/GraphLinks.js'
import api from '@mixins/api.js'
import * as d3 from 'd3'

export default class GraphNode {
  constructor(nodeId) {
    this.id =   nodeId
    this.node = d3.select(`#${this.id}`)

    this.circle = this.node.select('circle')
    this.label =  this.node.select('.node-label')
    this.text =   this.node.select('.node-label').select('.text-container')
    this.poster = this.node.select('.poster')
     
    const x = d3.selectAll(`.link[source='${this.id}']`).nodes().map((d)=> d.attributes.target.value)
    const z = d3.selectAll(`.link[target='${this.id}']`).nodes().map((d)=> d.attributes.source.value)
    
    this.connections = d3.selectAll('.node').filter((d) => { return x.includes(d.id) || z.includes(d.id) })
    this.connectionIds = this.connections.data().map((n) => n.id)
    
    this.links = new GraphLinks(nodeId)

    this.highlightDelay = 200
  }

  async singleClickNode() {
    d3.selectAll(".node").classed("poster-highlight", false)
    if (appStates.metaKeyIsPressed) {
      this.metaClick()

    } else {
      this.node.classed("poster-highlight", true)
      this.circle.style("stroke", "white")
      // this.connectionLines.style("stroke", "white")
      this.allLinks.classed("active", true)
      this.appendLineText(this.id)
    }
  }

  mouseEnter(event) {
    if (!graphStates.inMotion) {
      this.applyHoverClass()
      this.clearHighlightedAttributes()

      if (!event.shiftKey) {
        this.circle.transition().duration(this.highlightDelay).style("stroke", "white").transition().style("stroke-width", "2")
        // setTimeout(() => {
          this.links.appendLineText()
        // }, i)
        this.links.highlightLines(this.highlightDelay)
        this.connections.selectAll("circle").transition().delay(this.highlightDelay*1.5).duration(this.highlightDelay).style("stroke", "white")
        this.node.moveToFront()
      }
    }
  }

  mouseLeave() {
    if (!graphStates.inMotion) { 
      this.node.classed('added', false)
      this.removeHoverClass()
      this.removeLineText()
      this.clearHighlightedAttributes()
    }
  }
  
  clearHighlightedAttributes() {
    d3.selectAll("circle").style("stroke", "#7A7879")
                          .style("stroke-width", "1")
    d3.selectAll("line").style("stroke", "#7A7879")
                        .style("stroke-width", "1")
  }

  async getDetails() {
    if (panelStates.detailsData.id) {
      setFocus('details')
      panelStates.detailsData.id = this.id
      this.singleClickNode()
      await api.fetchDetails(this.id)
    }
  }

  resetStyles() {
    this.circle.style("#7A7879")
  }

  applyHoverClass() {
    if (appStates.shiftKeyIsPressed) { 
      this.node.classed('shift-hover', true)
    } else if (appStates.metaKeyIsPressed) {
      this.node.classed('alt-hover', true)
    } else { 
      this.node.classed('hover', true) 
    }
  }

  removeHoverClass() {
    this.node.classed('hover', false)
    this.node.classed('shift-hover', false)
    this.node.classed('alt-hover', false)
  }

  removeLineText() {
    d3.selectAll(".character-label").remove()
  }

  async appendLineText(hoveredId) {
    if (graphStates.inMotion) { return }


  }

  // async appendLineText(hoveredId) {
  //   if (graphStates.inMotion) { return }

  //   let linkholder = this.allLinks.append("g").attr("class", "character-label")
  //   let nodeType = hoveredId.split("-")[0]

  //   this.appendRect(linkholder, nodeType)
  //   this.appendText(linkholder, nodeType)
  // }
  
  // appendRect(linkholder, nodeType) {
  //   linkholder.append("rect")
  //   .attr('fill', "#222")
  //   .attr("x", (d) => {
  //     let textLength = d.roles.join("").length
  //     if (nodeType == "person") {
  //       return (d.target.x < d.source.x) ? -50 - (textLength*3.75) : 50

  //     } else {
  //       let x = Math.abs( (d.source.x - d.target.x) )
  //       let y = Math.abs( (d.source.y - d.target.y) )
  //       let h = Math.sqrt( (x*x) + (y*y) )
  //       return (d.target.x < d.source.x) ? -h + 50 : h - 50 -(textLength*3.75)
  //     }
  //   })
  //   .attr("y", -4)
  //   .attr("height", 8)
  //   .attr("width", (d) => {
  //     let c = d.roles.join().split("").length
  //     return c*3.5
  //   })
  //   .attr("transform", (d) => {
  //     let theta = angle360(
  //       d.source.x,
  //       d.source.y,
  //       d.target.x,
  //       d.target.y
  //     )

  //     if (d.target.x < d.source.x) {
  //       return `translate(${d.source.x},${d.source.y})rotate(${theta+180})`
  //     } else {
  //       return `translate(${d.source.x},${d.source.y})rotate(${theta})`
  //     }
  //   })
  // }

  // appendText(linkholder, nodeType) {
  //   linkholder.append("text")
  //   .text(d => d.roles.join(", "))
  //   .attr("x", (d) => {
  //     if (nodeType == "person") {
  //       return (d.target.x < d.source.x) ? -50 : 50

  //     } else {
  //       let x = Math.abs( (d.source.x - d.target.x) )
  //       let y = Math.abs( (d.source.y - d.target.y) )
  //       let h = Math.sqrt( (x*x) + (y*y) )
  //       return (d.target.x < d.source.x) ? -h + 50 : h - 50
  //     }
  //   })
  //   .attr("text-anchor", (link) => {
  //     if (nodeType == "person") {
  //       return (link.target.x < link.source.x) ? "end" : "start"
  //     } else {
  //       return (link.target.x < link.source.x) ? "start" : "end"
  //     }
  //   })
  //   .attr("y", 2)
  //   .attr("stroke", "#FFF")
  //   .style("font-family", "Dosis, sans-serif")
  //   .style("font-size", () => {
  //     return `${10}px`
  //   })
  //   .attr("transform", (d) => {
  //     let theta = angle360(
  //       d.source.x,
  //       d.source.y,
  //       d.target.x,
  //       d.target.y
  //     )

  //     if (d.target.x < d.source.x) {
  //       return `translate(${d.source.x},${d.source.y})rotate(${theta+180})`
  //     } else {
  //       return `translate(${d.source.x},${d.source.y})rotate(${theta})`
  //     }
  //   })
  // }
}