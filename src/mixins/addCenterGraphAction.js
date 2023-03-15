import * as d3 from 'd3'

export default (args) => {
  const viewerBody = d3.select("#graph-container")

  let zoom = d3.zoom().on('zoom', (e) => {
    args.outerWrapper.attr("transform", e.transform)
  })

  args.centeringButton.style("display", "block").transition().duration(30).style("left", "-30px")
  args.centeringButton.on("click", (e) => {
    var transform = d3.zoomIdentity
      .translate(0,0)
      .scale(1)
    
    viewerBody.transition().duration(1000)
      .call(zoom.transform, transform);

    return viewerBody
  })

  viewerBody.call(zoom)
            .call(zoom).on("dblclick.zoom", null)
  
}
