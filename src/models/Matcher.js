export default class Matcher {
  constructor(links, nodes) {
    this.links = links
    this.nodes = nodes
  }

  nodesOf(link) {
    return this.nodes.filter((d) => {
      return link.target.id == d.id || link.source.id == d.id
    })
  }

  linksOf(node) {
    return this.links.filter((d) => {
      return d.target.id == node.id || d.source.id == node.id
    })
  }

  notLinksOf(node) {
    return this.links.filter((d) => {
      if (d.target.id != node.id && d.source.id != node.id) {
        return true
      } else {
        return false
      }
    })
  }
}