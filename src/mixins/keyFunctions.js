import { 
  graphStates,
  panelStates
} from '@/stores/store.js'
import GraphNode from '@models/GraphNode'

import api from '@mixins/api.js'

import * as d3 from 'd3'


export default {
  attachNavKeyFunctions(vb, z) {
    let d;
    let zoom = z
    let zoomLevel = 2.5
    let currentAnchor = null
    let prevAnchor = null
    let prevLinks = null
    let prevTargs = null
    let centering = { x: window.innerWidth *  0.5, 
                      y: window.innerHeight * 0.4 }
    let anchors = graphStates.existing.map((n) => n[0])
    let currentIndex = anchors.indexOf(panelStates.detailsData.id)

    d3.select("body").on("keydown.nav", async function(event) {
      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        if (event.key == "ArrowUp") {
          if (zoomLevel > 5) {return}
          zoomLevel += 0.5
        } else if (event.key == "ArrowDown") {
          if (zoomLevel < 1) {return}
          zoomLevel -= 0.5
        }

        currentAnchor = anchors[ currentIndex % anchors.length ]
        let node = d3.select(`#${currentAnchor}`)
        d = node.data()[0]
        vb.transition().duration(100).call(
          zoom.transform, 
          d3.zoomIdentity.translate(centering.x, centering.y)
                         .scale(zoomLevel)
                         .translate(-d.x, -d.y))

      } else if (["ArrowRight", "ArrowLeft"].includes(event.key)) {
        if (event.key == "ArrowRight") {
          currentIndex += 1
        } else if (event.key == "ArrowLeft") {
          currentIndex -= 1
        }

        if (currentIndex < 0) {
          currentIndex = anchors.length-1
        } else if (currentIndex > anchors.length-1) {
          currentIndex = 0
        }

        if (graphStates.pageSearchActive) {
          anchors = graphStates.matching
        } else {
          anchors = graphStates.existing.map((n) => n[0])
        }

        currentAnchor = anchors[currentIndex]

        d3.selectAll(".node").classed("poster-highlight", false)
        let gn = new GraphNode(currentAnchor)

        if (prevAnchor) { 
          prevAnchor.circle.style("stroke", "#7A7879").style("stroke-width", "1")
          prevAnchor.linkUnhighlighter()
        }
        if (prevLinks) {  prevLinks.selectAll(".line").style("stroke", "#7A7879").style("stroke-width", "1")}
        if (prevTargs) {  prevTargs.select("circle").style("stroke", "#7A7879").style("stroke-width", "1")}
        
        gn.circle.style("stroke", "white").style("stroke-width", "1.2")
        gn.allLinks.selectAll(".line").style("stroke", "white")

        gn.node.moveToFront()

        d = gn.node.data()[0]

        vb.transition().duration(500).call(
          zoom.transform, 
          d3.zoomIdentity.translate(centering.x, centering.y)
                         .scale(zoomLevel)
                         .translate(-d.x, -d.y))

        gn.node.classed("poster-highlight", true)
        gn.linkHighlighter(gn.id)

        const dc = d3.selectAll(".details-component")
        dc.style("left", () => { return `${currentIndex*100}%`})
        dc.transition().duration(500).style("left", "0%")

        prevAnchor = gn
        prevLinks = gn.allLinks
        prevTargs = gn.connections

        await api.fetchDetails(currentAnchor) 
      }
    })
  }
}
