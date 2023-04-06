import { settingsModule } from './settingsModule.js'
import { store } from '@/stores/store.js'
import * as d3 from 'd3'
import NodeElem from '@models/NodeElem'
import { drawArc } from '@mixins/helpers'

export default {
  data () {
    return {
      settings: settingsModule,
      doubleClickInterval: 300,
      strokeColor: "#7A7978",
      bodyGrey: "#222222",
      first: false
    }
  },

  createLinks(parent, links) {
    const link = this.buildLinks(parent, links)
    return link
  },

  createNodes(parent, nodes) {
    const node = this.buildNode(parent, nodes)
    this.appendCircle(node)
    this.appendImage(node)
    this.appendActorLabel(node)
    this.attachMouseEvents(node)
    return node
  },

  /////////////////////////////

  buildLinks(parent, links) {
    let link = parent.append("g")
      .attr("class", "links")
      .selectAll("g")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "link")
      .attr("source", (d => d.source.id))
      .attr("target", (d => d.target.id))
      .append("line")
      .attr("class", "line")
      .attr("stroke", this.data().strokeColor)
      .attr("stroke-width", "1px")
      .attr("vector-effect", "non-scaling-stroke")
    return link
  },

  buildNode(parent, nodes) {
    let node = parent.append("g")
      .attr("class", "nodes")
      .attr("fill", "currentColor")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", (d) => {
        return 'node ' + d.type.join(" ")
      })
      .attr("id", d => d.id)
      // .attr("r", (d) => {
      //   if (store.existing.map(d => {d[0]).includes(node.id)) {
      //     return this.data().settings.defaults.node.circle.r
      //   }
      // })

    return node
  },

  appendCircle(node) {
    node.append("circle")
      .attr("class", "outline")
      .attr("stroke", this.data().strokeColor)
      .attr("stroke-width", 1)
      .attr("r", () => {
        return this.data().settings.defaults.node.circle.r
      })
      .attr('fill', this.data().bodyGrey)
      .attr("vector-effect", "non-scaling-stroke")
    return node
  },

  appendActorLabel(node){
    const r = -this.data().settings.defaults.node.circle.r

    const actorLabel = node.append("g")
    .attr("class", "node-label")
    .attr("fill", "white")
    .attr("text-anchor", "middle")

    actorLabel.append("path")
    .attr("d", (f) => {
     return drawArc(f)
    })
    .attr("fill", this.data().bodyGrey)

    actorLabel.append("g").attr("class", "text-container").selectAll("text")
    .data((d) => {
      return d.name.split("").slice(0,50)
    })
    .enter()
    .append("text")
    .text(d => d)
    .style("font-size", "12px")
    .style("font-family", "Dosis, sans-serif")
    .style("text-transform", "uppercase")
    .style("transform", (d, i, a) => {
      let theta = (i- (a.length/2))* 7
      return `rotate(${theta}deg)translateY(${r+2}px)`
    })
  },

  appendImage(node) {
    node.append("svg:image")
      .attr("class", "poster")
      .attr('x', () => {
        return this.data().settings.defaults.image.offset.x
      })
      .attr('y', () => {
        return this.data().settings.defaults.image.offset.y
      })
      .attr('width', () => {
        return this.data().settings.defaults.image.position.x
      })
      .attr('height', () => {
        return this.data().settings.defaults.image.position.y
      })
      .attr("xlink:href", d => d.poster)
      .attr("clip-path", () => {
        return `inset(${this.data().settings.defaults.image.clipPath})`
      })
    return node
  },

  instructionLabel(node) {
    node.on("mouseenter", (e, d) => {
      let letters = "Double click me  double click me  double click me  "
      let r = -50

      let label = d3.select(`#${d.id}`).select(".node-label")
  
      label.attr("class", "node-label inst")
      label.select("path").style("display", "none")
      label.select(".text-container").style("display", "none")

      function tempArc() {
        const arc = d3.arc()
        .innerRadius(44)
        .outerRadius(64)
        .startAngle(0) //converting from degs to radians
        .endAngle(Math.PI * 2) //just radians

        return arc()
      }
      label.append("path")
      .attr("class", "instruction")
      .attr("d", f => tempArc(f))
      .attr("fill", this.data().bodyGrey)

      label.selectAll("text")
      .exit()
      .data(letters.split(""))
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
      .style("transform", (d, i, a) => {
        let theta = (i- (a.length/2))* 7.1
        return `rotate(${theta}deg)translateY(${r+2}px)`
      })

    })
    .on("mouseleave", (e, d) => {
      d3.selectAll(".instruction").remove()
      let n = d3.select(`#${d.id}`).select('.node-label').classed("inst", false)
      n.select("path").style("display", "block")
      n.select(".text-container").style("display", "block")
      this.nodeTransformer(e.target, "scale(1)", this.data().strokeColor, "none")
    })
  },

  attachMouseEvents(node) {
    if (localStorage.getItem("newHere") === "true" || localStorage.getItem("newHere") === undefined) {
      this.instructionLabel(node)
    } else {
      node.on("mouseenter", (e, d) => {
        node.moveToFront()
        
        const nodeElem = new NodeElem(d.id)
        nodeElem.nodeTransformer("scale(1.03)", "aliceblue", "white")

        if (!store.inMotion) {
          nodeElem.linkHighlighter()
        }
      })
      .on("mouseleave", (e, d) => {
        
        const nodeElem = new NodeElem(d.id)
        nodeElem.nodeTransformer("scale(1)", this.data().strokeColor, "none")

        if (!store.inMotion) {
          d3.selectAll(".character-label").remove()
        }
      })
    }
  }
}