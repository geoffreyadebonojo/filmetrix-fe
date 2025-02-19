import { 
  angle360,
  distance
} from '@mixins/helpers'
import { 
  graphStates
} from '@/stores/store.js'
import * as d3 from 'd3'

export default class GraphLink {
  constructor(nodeId) {
    this.nodeId = nodeId
    this.links = d3.selectAll(`.link[target='${nodeId}'], .link[source='${nodeId}']`)
    this.lines = this.links.select("line")
    this.labels = this.links.select(".character-label")
  }

  highlightLines(i) {
    this.lines.transition().delay(i).duration(i).style("stroke", "white").transition().style("stroke-width", "1.5")
  }

  appendLineText(scale=1, textAnchor) {
    if (graphStates.inMotion) return false

    let nodeType = this.nodeId.split("-")[0]

    function appendToLink(l, appendRect, appendText, textAnchor) {
      let link = d3.select(`#${l.id}`)
      let linkholder = link.append("g").attr("class", "character-label")
      appendRect(linkholder, nodeType, scale, textAnchor)
      appendText(linkholder, nodeType, scale, textAnchor)
    }

    this.links.each(l => appendToLink(l, this.appendRect, this.appendText, textAnchor))
  }
  
  appendRect(linkholder, nodeType, scale, textAnchor) {
    function applyRectX(d, nodeType, textAnchor) {
      const textLength = d.roles.join("").length
      const adjustXMiddle = textLength*3
      const extraSpace = 10
      const nodeRadius = 40
      const distFromEnd = nodeRadius + extraSpace
      
      const endJustified = {
        leftSideAdjust: 0-(adjustXMiddle*2)-distFromEnd ,
        rightSideAdjust: distFromEnd
      }
      
      const dist = distance(d.target, d.source)
      const middleJustified = {
        leftSideAdjust: -(dist/2) - adjustXMiddle, 
        rightSideAdjust: (dist/2) - adjustXMiddle
      }

      let rectX;

      if (textAnchor == 'end') {
        rectX = d.target.x < d.source.x ? endJustified.leftSideAdjust : endJustified.rightSideAdjust
      } else if (textAnchor == 'middle') {
        rectX = d.target.x < d.source.x ? middleJustified.leftSideAdjust : middleJustified.rightSideAdjust
      }
      return rectX
    }

    linkholder.append("rect")
    .attr("transform", (d) => {
      let theta = angle360(
        d.source.x,
        d.source.y,
        d.target.x,
        d.target.y
      )

      if (d.target.x < d.source.x) {
        return `translate(${d.source.x},${d.source.y})rotate(${theta+180})`
      } else {
        return `translate(${d.source.x},${d.source.y})rotate(${theta})`
      }
    })
    .attr('fill', "#222")
    .attr("x", d => applyRectX(d, nodeType, textAnchor))
    .attr("y", -2)
    .attr("height", 4)
    .attr("width", (d) => {
      let c = d.roles.join().split("").length
      return c*6
    })
  }

  
  appendText(linkholder, nodeType, scale, textAnchor) {
    
    function applyTextAnchor(link, nodeType, textAnchor) {
      if (textAnchor == "middle") {
        return "middle"
      } else if (textAnchor == 'end') {
        return (link.target.x < link.source.x) ? "end" : "start"
      }
    }

    function applyTextX(d, nodeType, textAnchor) {
      const extraSpace = 10
      const nodeRadius = 40
      const distFromEnd = nodeRadius + extraSpace
      const dist = distance(d.target, d.source)

      if (textAnchor == 'middle') {
        return (d.target.x < d.source.x) ? -dist/2 : dist/2
      } else if (textAnchor == 'end') {
        return (d.target.x < d.source.x) ? -distFromEnd : distFromEnd
      }
    }

    const s = scale
    linkholder.append("text")
    .attr("transform", (d) => {
      let theta = angle360(d.source.x, d.source.y,
                           d.target.x, d.target.y)
      if (d.target.x < d.source.x) {
        return `translate(${d.source.x},${d.source.y})rotate(${theta+180})`
      } else {
        return `translate(${d.source.x},${d.source.y})rotate(${theta})`
      }
    })
    .text(d => d.roles.join(", "))
    .attr("x", d => applyTextX(d, nodeType, textAnchor))
    .attr("text-anchor", link => applyTextAnchor(link, nodeType, textAnchor))
    .attr("y", 2)
    .attr("stroke", "#FFF")
    .style("font-family", "Dosis, sans-serif")
    .style("font-size", (d) => {
      return `${30/2}px`
    })

  }
}