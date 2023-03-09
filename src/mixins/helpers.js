import { settingsModule } from './settingsModule.js'

export default {
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
      .attr("stroke", "#7A7978")
      .attr("stroke-width", 1.5)
      .attr("r", (d) => {
        return settingsModule.defaultSettings.r
      })
      .attr('fill', '#222222')
      .attr("vector-effect", "non-scaling-stroke")
    return node
  },

  appendImage(node) {
    node.append("svg:image")
      .attr('x', (d) => {
        return -settingsModule.defaultSettings.imageOffset.x/2
      })
      .attr('y', (d) => {
        return -settingsModule.defaultSettings.imageOffset.x/2
      })
      .attr('width', (d) => {
        return settingsModule.defaultSettings.imageOffset.x
      })
      .attr('height', (d) => {
        return settingsModule.defaultSettings.imageOffset.x
      })
      .attr("xlink:href", d => d.poster)
      .attr("clip-path", (d) => {
        return `inset(${settingsModule.defaultSettings.clipPath})`
      })
    return node
  }
}