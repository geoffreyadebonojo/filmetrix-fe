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

  attachNavLockEffect(targetBody) {
    targetBody.on("click", (e) => {
      graphStates.navLocked = !graphStates.navLocked
      let lockSetting = graphStates.navLocked ? "url('/lock-closed.svg')" : "url('/lock-open.svg')"
      let opacity =     graphStates.navLocked ? "1" : "0.5"

      targetBody.style("background-image", lockSetting).style("opacity", opacity)
    })
  }
}