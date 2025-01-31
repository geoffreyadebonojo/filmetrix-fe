import * as d3 from 'd3'

export default class LinkMap {
  constructor(links) {
    this.links = links
    // this.linkElems = links.selectAll(".link")._groups[0]

    // this.tree = this.buildTree(this.links)
    this.paths = []
  }

  // buildTree(root) {
  //   debugger
  //   root.forEach((x) => {
  //     d3.select()
  //   })


  locateEdge(node1, node2) {
    if (node1 == node2) {
      return []
    } else {
      d3.selectAll(`#${node1}--${node2}`).attr('class', (x) => {
        return 'link locked'
      })
      d3.selectAll(`#${node2}--${node1}`).attr('class', (x) => {
        return 'link locked'
      })
      // let r = d3.selectAll(`#${node2}--${node1}`).classList.add('locked')
      // let v = [l,r]

      // debugger
    }
  }
}