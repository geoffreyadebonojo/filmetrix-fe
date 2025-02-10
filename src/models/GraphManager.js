import graph from "@/mixins/graph"
import { graphStates } from "@/stores/store.js"

export default class GraphManager {
  constructor(graphType="main") {
    this.data
    this.nodes = []
    this.links = []
    this.graphType = graphType
  }
  
  generate() {
    graphStates.existing.forEach((d) => {
      let id = d[0]
      this.data = graphStates.graphData[id]

      let nodesFilteredByGenres = this.data.nodes.filter((n) => {
        let x
        let activeGenres = JSON.parse(localStorage.getItem('genres'))
        if (n.entity == "movie") {
          x = activeGenres.overlapsWith(n.type).any()
        } else {
          x = true
        }
        return x
      })

      this.nodes = this.nodes.concat(
        nodesFilteredByGenres.slice(0,d[1]+1)
      )
      
      function xfunc(nodeIds, link) {
        return nodeIds.includes(link.target.id) || nodeIds.includes(link.target)
      }
      
      let linksFilteredByGenres = this.data.links.filter((link) => {
        return xfunc(this.nodes.map((n) => n.id), link)
      })

      console.log(linksFilteredByGenres)

      this.links = this.links.concat(
        linksFilteredByGenres.slice(0,d[1])
      )
    })

    graph.draw({
      nodes: this.nodes.uniqueById(),
      links: this.links, //uniqueById()
      type: this.graphType
    })
  }
}