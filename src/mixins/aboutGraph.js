import api from '@mixins/api.js'
import * as d3 from 'd3'
import { aboutUsData } from "@mixins/aboutUsData.js"
import Graph from '@models/Graph.js'
import Simulation from '@models/Simulation.js'
import { store } from '@/stores/store.js'
import focusHelper from "@/mixins/focusHelper"

export default {
  name: "aboutGraph",
  draw () {
    store.detailsData = {}
    const links = aboutUsData.links
    const nodes = aboutUsData.nodes
    const graphType = "aboutGraphType"
    const containerId = "about-graph-container"
    const outerWrapperId = "about-outer-wrapper"
    const innerWrapperId = "about-inner-wrapper"

    d3.select(`#${innerWrapperId}`).remove()
    
    const outerWrapper = d3.select(`#${outerWrapperId}`)
    const innerWrapper = outerWrapper.append("g").attr("id", innerWrapperId)

    const simulation = new Simulation({nodes, 
                                        links,
                                        graphType}).body

    const [link, node] = new Graph({links, 
                                    nodes,
                                    containerId,
                                    innerWrapper,
                                    outerWrapper}).build()
    
    d3.select("#save-button").classed("locked", false).classed("unlocked", true)

    this.attachNodeClickActions(node)

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    })
    
    return innerWrapper.node();
  },

  attachNodeClickActions(node) {
    node.on('click', async (_e, d) => {
      focusHelper.methods.set('details')
      await api.fetchDetails(d.id)
      // store.currentDetailId = d.id
    })
  }
}
