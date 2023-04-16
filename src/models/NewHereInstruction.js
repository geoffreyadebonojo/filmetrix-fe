import { 
  appStates,
  graphStates 
} from '@/stores/store.js'
import * as d3 from 'd3'
import { drawArc } from '@mixins/helpers'

export default class NewHereInstruction {
  constructor(node) {
    this.node = node;
    this.letters = "Double click me  double click me  double click me  "
    this.bodyGrey= appStates.theme == 'dark' ? "#222222" : "#AAAAAA"
  }
  
  addInstructionHover() {
    this.node.on("mouseenter", (_e, d) => {
      const label = d3.select(`#${d.id}`).select(".node-label")
      label.attr("class", "node-label inst")
      label.select("path").style("display", "none")
      label.select(".text-container").style("display", "none")
      this.appendInstructionText(label)
    })
    .on("mouseleave", (_e, d) => {
      this.removeInstructionText(d)
    })
  }

  appendInstructionText(label) {
    label.append("path")
    .attr("class", "instruction")
    .attr("d", f => this.tempArc(f))
    .attr("fill", this.bodyGrey)

    label.selectAll("text")
    .exit()
    .data(this.letters.split(""))
    .enter()
    .append("text")
    .attr("class", "instruction")
    .text((d) => {
      return d
    })
    .style("font-size", "12px")
    .style("font-family", "Dosis, sans-serif")
    .style("font-weight", "900")
    .style("text-transform", "uppercase")
    .style("transform", (_d, i, a) => {
      const r = -50
      let theta = (i- (a.length/2))* 7.1
      return `rotate(${theta}deg)translateY(${r+2}px)`
    })
  }

  removeInstructionText(d) {
    d3.selectAll(".instruction").remove()
    let n = d3.select(`#${d.id}`).select('.node-label')
    n.classed("inst", false)
    n.select("path").style("display", "block")
    n.select(".text-container").style("display", "block")
  }

  tempArc() {
    const arc = d3.arc()
    .innerRadius(44)
    .outerRadius(64)
    .startAngle(0) //converting from degs to radians
    .endAngle(Math.PI * 2) //just radians
    return arc()
  }
}