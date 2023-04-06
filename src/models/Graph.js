import graphBuilder from '@mixins/graphBuilder.js'
import * as d3 from 'd3'

export default class Graph {
  constructor(args) {
    this.args = args

    this.graphControlButtons = d3.selectAll(".graph-control-buttons")
    this.viewerBody = d3.select(`#${args.containerId}`)
  }

  build() {
    const link = graphBuilder.createLinks(
      this.args.innerWrapper, 
      this.args.links
    )

    const node = graphBuilder.createNodes(
      this.args.innerWrapper, 
      this.args.nodes
    )

    this.createViewerBody()

    return [link, node]
  }

  createViewerBody() {
    let zoom = d3.zoom().on('zoom', (e) => {
      this.args.outerWrapper
      .attr("transform", e.transform)
    })
    // out of place here...
    if (this.graphControlButtons) {
      this.graphControlButtons.style("display", "block")
      .transition().duration(30).style("left", "-30px")
      
      d3.select("#centering-button").on("click", (e) => {
        const duration = 1000
        
        d3.select(e.target).style("opacity", "1")
        var transform = d3.zoomIdentity
          .translate(0,0)
          .scale(1)
        
        d3.select(e.target).transition().duration(duration).style("opacity", "0.5")
        this.viewerBody.transition().duration(duration)
          .call(zoom.transform, transform);
        return this.viewerBody
      })
    }
    
    this.viewerBody.call(zoom)
                   .call(zoom).on("dblclick.zoom", null)
    
    return this.viewerBody
  } 
}