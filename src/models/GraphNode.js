import { angle360 } from '@mixins/helpers'
import { appStates, graphStates } from '@/stores/store.js'
import * as d3 from 'd3'

export default class GraphNode {
  constructor(nodeId) {
    this.id = nodeId
    this.node = d3.select(`#${nodeId}`)

    this.elem = {
      circle: this.node.select('circle'),
      label: this.node.select('.node-label'),
      poster: this.node.select('.poster'),
      sources: d3.selectAll(`.link[source='${nodeId}']`),
      targets: d3.selectAll(`.link[target='${nodeId}']`)
    }

    const x = this.elem.sources.nodes().map((d)=>d.__data__.target.id)
    const z = this.elem.targets.nodes().map((d)=>d.__data__.source.id)
    
    this.connections = d3.selectAll('.node').filter((d) => {
      return x.includes(d.id) || z.includes(d.id)
    })

    this.connectionIds = this.connections._groups[0].map((n) => n.id)

    this.currentColor = ''
  }

  restoreDefaultCircle() {
    this.node.moveToFront()
    const grey = "#7A7978"

    this.elem.label.selectAll("text") .style("stroke", grey)
    this.elem.circle.style("stroke", grey)
  }
  
  restoreDefaultConnections() {
    this.connections.select('circle') .style("stroke", "white")
    this.connections.selectAll("text").style("stroke", "white")
  }

  restoreDefaultLinks() {
    const grey = "#7A7978"

    this.elem.sources.select("line").attr("stroke", grey)
    this.elem.targets.select("line").attr("stroke", grey)
  }

  applyHighlight() {
    let grey = '#7A7978'
    let white = 'white'

    this.elem.label.selectAll("text") .style("stroke", white)
    this.elem.circle                  .style("stroke", white)
    this.connections.select('circle') .style("stroke", "white")
    this.connections.selectAll("text").style("stroke", "white")
    this.elem.sources.select("line").attr("stroke", white)
    this.elem.targets.select("line").attr("stroke", white)
  }

  applyGreen() {
    this.elem.label.selectAll("text") .style("stroke", 'white').transition().duration(500).style("stroke", "lightgreen")
    this.elem.circle                  .style("stroke", 'white').transition().duration(500).style("stroke", "lightgreen")

    this.elem.sources.select("line").attr("stroke", 'lightgreen')
    this.elem.targets.select("line").attr("stroke", 'lightgreen')
  }

  // flashElement(initial, target, duration) {
  //   this.fadeElement(initial, target, duration)
  //   this.unfadeElement(target, initial, duration)
  // }

  hover() {
    if (appStates.shiftKeyIsPressed) {
      this.node.classed('shift-hover', true)
    } else {
      this.node.classed('hover', true)
    }
  }

  unHover() {
    this.node.classed('hover', false)
    this.node.classed('shift-hover', false)
  }

  clickOnElement(duration) {
    let grey = '#7A7978'
    const colorSettings = {
      base: {
        label: 'white',
        circle: 'lightblue',
        sources: grey,
        targets: grey
      },
      target: {
        label: 'lightgreen',
        circle: 'lightgreen',
        sources: 'lightgreen',
        targets: 'lightgreen'
      }
    }
    
    this.elem.label.selectAll("text") .style("stroke", colorSettings.base.label).transition().duration(duration).style("stroke", colorSettings.target.label)
    this.elem.circle.style("stroke", colorSettings.base.circle).transition().duration(duration).style("stroke", colorSettings.target.circle)
    this.elem.sources.select("line").attr("stroke", colorSettings.base.sources).transition().duration(duration).style("stroke", colorSettings.target.sources)
    this.elem.targets.select("line").attr("stroke", colorSettings.base.targets).transition().duration(duration).style("stroke", colorSettings.target.targets)
  }
  
  // hoverElement(target, initial, duration) {
  //   let grey = '#7A7978'
  //   const colorSettings = {
  //     base: {
  //       label: 'white',
  //       circle: grey,
  //       sources: grey,
  //       targets: grey
  //     },
  //     target: {
  //       label: 'white',
  //       circle: 'lightblue',
  //       sources: grey,
  //       targets: grey
  //     }
  //   }
  //   this.elem.label.selectAll("text") .style("stroke", colorSettings.base.label).transition().duration(duration).style("stroke", colorSettings.target.label)
  //   this.elem.circle                  .style("stroke", colorSettings.base.circle).transition().duration(duration).style("stroke", colorSettings.target.circle)
  //   this.elem.sources.select("line").attr("stroke", colorSettings.base.targets).transition().duration(duration).style("stroke", colorSettings.target.targets)
  //   this.elem.targets.select("line").attr("stroke", colorSettings.base.sources).transition().duration(duration).style("stroke", colorSettings.target.sources)
  // }

  enterElement() {
    // let ani = this.node.append("g").attr("class", "add-nodes-increment").attr("width", "10px").attr("height", "10px")
    // .style("transform", "translate(10px,-20px)")
    // ani.append("text").text("+3").style("font-size", "30px").style("fill", "lightgreen")

    this.elem.sources.select("line").style("stroke", 'lightgreen')
    this.elem.targets.select("line").style("stroke", 'lightgreen')
    this.connections.select('circle') .style("stroke", "lightgreen")

    // this.connections.selectAll("text").attr("fill", "lightgreen")
    
  }

  exitElement() {
    this.elem.sources.select("line").style("stroke", '#7A7978')
    this.elem.targets.select("line").style("stroke", '#7A7978')

    this.connections.selectAll("text").attr("fill", "white")
    this.connections.select('circle').style("stroke", function(d) {
      if (graphStates.visited.includes(d.id)) {
        return "lightgreen"
      } else {
        return "#7A7978"
      }
    })

    this.node.select(".add-nodes-increment").remove()
  }

  resetBaseElement(duration) {
    let grey = '#7A7978'

    const colorSettings = {
      base: {
      label: 'white',
      circle: 'lightblue',
      sources: grey,
      targets: grey
      },
      target: {
        label: grey,
        circle: grey,
        sources: grey,
        targets: grey
      }
    }

    this.elem.label.selectAll("text") .style("stroke", colorSettings.base.label).transition().duration(duration).style("stroke", colorSettings.target.label)
    this.elem.circle                  .style("stroke", colorSettings.base.circle).transition().duration(duration).style("stroke", colorSettings.target.circle)
    this.elem.sources.select("line").attr("stroke", colorSettings.base.targets).transition().duration(duration).style("stroke", colorSettings.target.targets)
    this.elem.targets.select("line").attr("stroke", colorSettings.base.sources).transition().duration(duration).style("stroke", colorSettings.target.sources)
  }

  linkUnhighlighter() {
    let merged = d3.selectAll(`.link[target='${this.id}'], .link[source='${this.id}']`)
    merged.selectAll(".character-label").remove()
  }

  linkHighlighter() {
    let merged = d3.selectAll(`.link[target='${this.id}'], .link[source='${this.id}']`)
    let linkholder = merged.append("g").attr("class", "character-label")
    let start = 65
    let fs = 10

    linkholder.append("rect")
    .attr('fill', "#222222")
    .attr("x", (d) => {
      if (d.target.x < d.source.x) { 
        return start-200 -(d.roles.join("").length)
      } else {
        return start
      }
    })
    .attr("y", -4)
    .attr("height", 8)
    .attr("width", (d) => {
      let c = d.roles.join().split("").length
      return c*4
    })
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


    linkholder.append("text")
    .text(d => d.roles.join(", "))
    .attr("x", (d) => {
      if (d.target.x < d.source.x) { 
        return start-200 -(d.roles.join("").length)
      } else {
        return start
      }
    })
    .attr("text-anchor", "start")
    .attr("y", 2)
    .attr("stroke", "#FFF")
    .style("font-family", "Dosis, sans-serif")
    .style("font-size", () => {
      return `${fs}px`
    })
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
  }
}