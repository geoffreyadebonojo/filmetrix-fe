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
      this.data = graphStates.graphData[d[0]]
      this.nodes = this.nodes.concat(
        this.data.nodes.slice(0,d[1]+1)
      )
      this.links = this.links.concat(
        this.data.links.slice(0,d[1])
      )
    })

    graph.draw({
      nodes: this.nodes.uniqueById(),
      links: this.links,
      type: this.graphType
    })
  }
}