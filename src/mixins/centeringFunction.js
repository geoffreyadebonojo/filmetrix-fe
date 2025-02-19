import { 
  graphStates
} from '@/stores/store.js'

import * as d3 from 'd3'

export default {
  attachCenteringEffect(targetBody, viewerBody, zoom) {
    targetBody.on("click", (e) => {
      const duration = 1000
      d3.selectAll(".node").classed("poster-highlight", false)
      d3.select(e.target).style("opacity", "1")
      d3.select(e.target).transition().duration(duration).style("opacity", "0.5")
      viewerBody.transition().duration(duration)
      .call(zoom.transform, () => {
        return d3.zoomIdentity
          .translate(0,0)
          .scale(1)
      });
    })
  },

  // doesn't belong here
  attachNavLockEffect(targetBody, simulation) {
    targetBody.on("click", (e) => {
      let stickySetting = JSON.parse(localStorage.getItem("sticky"))
      
      let lockSetting = !JSON.parse(stickySetting) ? "url('/lock-closed.svg')" : "url('/lock-open.svg')"
      let opacity =     !JSON.parse(stickySetting) ? "1" : "0.5"
      
      localStorage.setItem("sticky", JSON.stringify( !JSON.parse(stickySetting) ))
      
      if (!JSON.parse(stickySetting)) {
        // localStorage.setItem('lockedNodes', JSON.stringify([]))
        // d3.selectAll('.node').data().forEach((n) => {
          //   n.fy = null
          //   n.fx = null
          // })
          // graphStates.inMotion = true
          d3.selectAll(".character-label").remove()
          // simulation.alpha(2).restart();
          
        }

      targetBody.style("background-image", lockSetting).style("opacity", opacity)
    })
  }
}