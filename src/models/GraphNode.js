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

    this.circle =   this.node.select('circle')
    this.label =    this.node.select('.node-label')
    this.text =     this.node.select('.node-label').select('.text-container')
    this.poster =   this.node.select('.poster')
    this.initials = this.node.select('.initials')
     
    let targets = d3.selectAll(`.link[source='${this.id}']`)
    let sources = d3.selectAll(`.link[target='${this.id}']`)

    const x = targets.nodes().map((d)=> d.attributes.target.value)
    const z = sources.nodes().map((d)=> d.attributes.source.value)
    
    this.connections = d3.selectAll('.node').filter((d) => { return x.includes(d.id) || z.includes(d.id) })
    this.connectionIds = this.connections.data().map((n) => n.id)
    this.GraphLinks = new GraphLinks(nodeId)
    
    this.isLeaf = targets.empty()
    this.highlightDelay = 150
  }
  
  neighbors() {
    return this.connectionIds.map(n => new GraphNode(n))
  }

  async singleClickNode() {
    d3.selectAll(".node").classed("poster-highlight", false)
    if (appStates.metaKeyIsPressed) {
      this.metaClick()

    } else {
      this.node.classed("poster-highlight", true)
      this.circle.style("stroke", "white")
      this.GraphLinks.links.classed("active", true)
      this.GraphLinks.appendLineText(this.id)
    }
  }

  scaleTo(circleScale, labelScale, posterScale) {
    this.circle.style("transform", `scale(${circleScale})`)
    this.label.style("transform", `scale(${labelScale})`)
    this.poster.style("transform", `scale(${posterScale})`)
    this.initials.style("transform", `scale(${posterScale})`)
  }

  mouseEnter(event, textAnchor="middle") {
    if (graphStates.inMotion) return false
      
    d3.selectAll(".character-label").remove()

    let ids = this.connectionIds
    ids.push(this.id)
   
    // d3.select(".nodes").style("opacity", 0.2)
    // console.log(`.node #${ids.join(", #")}`)
    // d3.selectAll(`#${ids.join(",#")}`).style("opacity", 1)

    this.node.moveToFront()
    this.applyHoverClass()
    this.clearHighlightedAttributes()
    // this.scaleTo(1.5, 1.5, 1.5)

    if (event.shiftKey) return

    this.circle.transition().duration(this.highlightDelay)
      .style("stroke", "white")
      .style("stroke-width", "1.44")

    this.GraphLinks.highlightLines(this.highlightDelay)
    setTimeout(() => { this.GraphLinks.appendLineText(3, textAnchor) }, this.highlightDelay)

    this.connections.selectAll(".outline")//.transition().duration(this.highlightDelay/2).delay(this.highlightDelay*1.5)
      // .transition()
      .style("transform", "scale(1.1)")
      // .transition()
      .style("stroke", "white")
    this.connections.selectAll(".node-label")//.transition().duration(this.highlightDelay/2).delay(this.highlightDelay*1.5)
      // .transition()
      .style("transform", "scale(1.1)")
    this.connections.selectAll(".poster")//.transition().duration(this.highlightDelay/2).delay(this.highlightDelay*1.5)
      // .transition()
      .style("transform", "scale(1.1)")
  }

  mouseLeave() {
    if (graphStates.inMotion) return false
    
    this.node.classed('added', false)
    // this.scaleTo(1, 1, 1)
    this.removeHoverClass()
    this.clearHighlightedAttributes()
    
    d3.selectAll('.node').style("opacity", 1)

    d3.selectAll(".character-label").remove()
    d3.selectAll(".outline").style("transform", "scale(1)")
    d3.selectAll(".node-label").style("transform", "scale(1)")
    d3.selectAll(".poster").style("transform", "scale(1)")
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
}