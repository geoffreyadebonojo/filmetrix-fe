import { settingsModule } from './settingsModule.js'
import * as d3 from 'd3'

export default {
  props() {
    return {
      settings: settingsModule,
      doubleClickInterval: 300,
      strokeColor: "#7A7978",
      bodyGrey: "#222222"
    }
  },

  getTypes(nodes) {
    let types = []
    nodes.forEach((node) => {
      if (node.entity === "person") {
        node.type.forEach((type) => {
          types.pushUnique(type)
        })
      } else if (["movie", "tv"].includes(node.entity)) {
        node.type.forEach((type) => {
          types.pushUnique(type)
        })
      }
    })
    return types
  },

  createLinks(parent, links) {
    const link = this.buildLinks(parent, links)

    return link
  },

  buildLinks(parent, links) {
    const link = parent.append("g")
      .attr("class", "links")
      .selectAll("g")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "link")
      .attr("source", (d => d.source.id))
      .attr("target", (d => d.target.id))
      .append("path")
      .attr("class", "line")
      .attr("stroke", this.props().strokeColor)
      .attr("stroke-width", "1px")
      .attr("vector-effect", "non-scaling-stroke")
    return link
  },

  appendPath(link) {

  },

  createNodes(parent, nodes) {
    const node = this.buildNode(parent, nodes)
    this.appendCircle(node)
    this.appendImage(node)
    this.appendActorLabel(node)
    this.attachMouseEvents(node)
    // this.attachClickListeners(node)
    return node
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
    return node
  },

  appendCircle(node) {
    node.append("circle")
      .attr("class", "outline")
      .attr("stroke", this.props().strokeColor)
      .attr("stroke-width", 1.5)
      .attr("r", (d) => {
        return this.props().settings.defaults.node.circle.r
      })
      .attr('fill', this.props().bodyGrey)
      .attr("vector-effect", "non-scaling-stroke")
    return node
  },

  appendActorLabel(node){
    const r = -this.props().settings.defaults.node.circle.r

    const actorLabel = node.append("g")
    .attr("class", "node-label")
    .attr("fill", "white")
    .attr("text-anchor", "middle")

    actorLabel.append("path")
    .attr("d", f => this.drawArc(f))
    .attr("fill", this.props().bodyGrey)

    actorLabel.selectAll("text")
    .data((d) => {
      return d.name.split("")
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

  drawArc(d){
    const degrees = d.name.length * 7

    const arc = d3.arc()
      .innerRadius(44)
      .outerRadius(64)
      .startAngle((-degrees -12 )* Math.PI/180 / 2) //converting from degs to radians
      .endAngle(degrees * Math.PI/180 / 2) //just radians

    return arc()
  },

  appendImage(node) {
    node.append("svg:image")
      .attr("class", "poster")
      .attr('x', (d) => {
        return this.props().settings.defaults.image.offset.x
      })
      .attr('y', (d) => {
        return this.props().settings.defaults.image.offset.y
      })
      .attr('width', (d) => {
        return this.props().settings.defaults.image.position.x
      })
      .attr('height', (d) => {
        return this.props().settings.defaults.image.position.y
      })
      .attr("xlink:href", d => d.poster)
      .attr("clip-path", (d) => {
        return `inset(${this.props().settings.defaults.image.clipPath})`
      })
    return node
  },

  attachMouseEvents(node) {
    node
    .on("mouseenter", (e, d) => {
      let node = d3.select(e.target)
      let circle = node.select('circle')
      let label = node.select('.node-label')
      let sources = d3.selectAll(`.link[source='${e.target.id}']`).select(".line")
      let targets = d3.selectAll(`.link[target='${e.target.id}']`).select(".line")
      
      node.moveToFront()
      circle.style("stroke", "aliceblue")
      sources.style("stroke", "aliceblue")
      targets.style("stroke", "aliceblue")
      label.selectAll("text").style("stroke", "white")
    })
    .on("mouseleave", (e, d) => {
      let node = d3.select(e.target)
      let circle = node.select('circle')
      let label = node.select('.node-label')
      let sources = d3.selectAll(`.link[source='${e.target.id}']`).select(".line")
      let targets = d3.selectAll(`.link[target='${e.target.id}']`).select(".line")
      
      circle.style("stroke", this.props().strokeColor)
      sources.style("stroke", this.props().strokeColor)
      targets.style("stroke", this.props().strokeColor)
      label.selectAll("text").style("stroke", "none")
    })
  },

  attachClickListeners(node) {
    const onSingleClick = this.onSingleClick
    let alreadyClicked = false
    let timer = null

    node.on('click', async (e, d) => {
      if (alreadyClicked) { 

        this.onDoubleClick()

        alreadyClicked = false;
        clearTimeout(timer);
      } else {
        timer = setTimeout(async function () {
          alreadyClicked = false;

          onSingleClick()

        }, 200)
        alreadyClicked = true;
      }
    })
  },

  onSingleClick () {
    console.log('single');
  },
  
  onDoubleClick () {
    console.log('double');
  }
}