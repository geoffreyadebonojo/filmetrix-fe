import { settingsModule } from './settingsModule.js'

export default {
  props() {
    return {
      settings: settingsModule
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
    const link = parent.append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("class", "link")
      .attr("source", (d => d.source.id))
      .attr("target", (d => d.target.id))
      .attr("stroke", "#7A7978")
      .attr("stroke-width", "1px")
      .attr("vector-effect", "non-scaling-stroke")
    return link
  },

  createNodes(parent, nodes) {
    const node = this.buildNode(parent, nodes)
    this.appendCircle(node)
    this.appendImage(node)
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
      .attr("stroke", "#7A7978")
      .attr("stroke-width", 1.5)
      .attr("r", (d) => {
        return this.props().settings.defaults.node.circle.r
      })
      .attr('fill', '#222222')
      .attr("vector-effect", "non-scaling-stroke")
    return node
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

  onClick(node) {

  }
}