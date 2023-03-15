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
    viewerBody.transition().duration(1000).call(zoom.transform, transform);
    // simulation
    // .alpha(1)
    // .alphaMin(0.3)
    // .restart()
    // .on("tick", () => {
    //   link.attr("d", linkArc);
    //   node.attr("transform", d => `translate(${d.x},${d.y})`);
    // })
    // .on("end", () => {
    //   node.transition().duration(500).delay(100).ease(d3.easeBounceOut).attr("transform", (d) => {
    //     return `translate(${d.x},${d.y})scale(0.9)`
    //   })
    // })

    return viewerBody
  })

  viewerBody.call(zoom)
            .call(zoom).on("dblclick.zoom", null)
  
}
