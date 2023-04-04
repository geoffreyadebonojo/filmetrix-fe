import { store } from '@/stores/store.js'
import * as d3 from 'd3'

export default {
  data() {
    store
    return {}
  },
  
  methods: {
    set(focus) {
      const navButtons = d3.selectAll(".nav-button").nodes().reverse()
      navButtons.unshift()
      this.closeField()

      const buttonMap = navButtons.map(x => x.id.split("-")[0]);
      const displacement = [
        1,
        27,
        56,
        85,
        112,
        141
      ]
      // can be adjusted to be vertical
      const index = buttonMap.indexOf(focus)
      this.moveHighlightCircle(displacement[index], "right")

      store.currentFocus = focus
    },

    moveHighlightCircle(x, direction) {
      let d = direction == "bottom" ? x-113 : x
      const circle = d3.select("#highlight")
      .style("left", null)
      .transition()
      .duration(100)
      .style(direction, `${d}px`)
    },

    closeField() {
      d3.select("#search-text").transition().duration(0).style("left", "100%")
    },

    openField() {
      d3.select("#search-text").transition().duration(0).delay(100).style("width", "100%").style("left", "15px")
      d3.select("#highlight").transition().duration(100).style("left", "-1px")
    }
  }
}