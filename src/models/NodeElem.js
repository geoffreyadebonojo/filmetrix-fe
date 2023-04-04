import * as d3 from 'd3'

export default class NodeElem {
  constructor(nodeElement) {
    this.node = d3.select(nodeElement)

    this.elems = {
      circle: this.node.select('circle'),
      label: this.node.select('.node-label'),
      poster: this.node.select('.poster'),
      sources: d3.selectAll(`.link[source='${nodeElement.id}']`),
      targets: d3.selectAll(`.link[target='${nodeElement.id}']`)
    }

    const x = this.elems.sources.nodes().map((d)=>d.__data__.target.id)
    const z = this.elems.targets.nodes().map((d)=>d.__data__.source.id)
    
    this.connections = d3.selectAll('.node').filter((d) => {
      return x.includes(d.id) || z.includes(d.id)
    })
  }

  nodeTransformer(target, scale, highlightColor, textStroke) {
    // if (target.classList.contains('locked')) { return }

    const elems  = this.elems
    const y = this.connections

    y.select('circle').style("stroke", highlightColor)
    y.selectAll("text").style("stroke", highlightColor)
    y.select(".poster").attr("transform", scale)

    let scaleElem = [elems.circle, elems.label, elems.poster]
    scaleElem.forEach((d) => {
      d.attr("transform", scale)
    })

    let highlightElems = [
      elems.circle, 
      elems.sources.select(".line"), 
      elems.targets.select(".line")
    ]
    highlightElems.forEach((d) => {
      d.style("stroke", highlightColor)
    })

    elems.label.selectAll("text").style("stroke", textStroke)
  }
}