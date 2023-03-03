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
      const d = d3.select("#search-text") 
      this.closeField(d)
      const buttonMap = navButtons.map(x => x.id.split("-")[0]);
      const displaceRight = [
        1,
        27,
        56,
        85,
        112,
        141
      ]
  
      const index = buttonMap.indexOf(focus)
      this.moveHighlightCircle(displaceRight[index])
      store.currentFocus = focus
    },
    moveHighlightCircle(x) {
      d3.select("#highlight")
      .style("left", null)
      .transition()
      .duration(100)
      .style("right", `${x}px`)
    },
    closeField(d) {
      d.transition().duration(0)
      // .style("width", "0%")
      .style("left", "100%")
    },
  }
}