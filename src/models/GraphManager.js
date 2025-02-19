import { 
  graphStates,
  graphData,
  store
 } from "@/stores/store.js"
import api from "@mixins/api"
import graph from "@/mixins/graph"
import GraphNode from '@models/GraphNode'


export default class GraphManager {
  constructor(graphType="main") {
    this.data
    this.nodes = []
    this.links = []
    this.graphType = graphType
  }

  async generateFiltered(incoming={links:false, nodes:false}) {
    if (graphStates.existing == null) { return }
    if (graphStates.existing.length < 1) { return }

    store.isLocked = true
    
    let outgoingNodes = incoming.nodes
    // .filter((d) => {
    //   let connections = new GraphNode(d.id).connections
    //   return connections.data().any()
    // })
    let outgoingLinks = incoming.links
    
    graph.draw({
      nodes: outgoingNodes,
      links: outgoingLinks,
      type: 'main'
    })
  }

  async generate() {
    let outgoingLinks = []
    let outgoingNodes = []
    // if (filteredData.nodes && filteredData.links) {
    //   let outgoingLinks = filteredData.links
    //   let outgoingNodes = filteredData.nodes  
    // } else {
    if (graphStates.existing == null) { return }
    if (graphStates.existing.length < 1) { return }

    store.isLocked = true
  
    await api.fetchGraphData(graphStates.existing.map(d => d[0]))
    await api.fetchDetails(graphStates.existing[0][0])

    let data
    
    graphStates.existing.forEach((d, i) => {
      data = graphStates.graphData[d[0]]
      outgoingNodes.push( data.nodes.splitAt(d[1]+1)[0] )
      outgoingLinks.push( data.links.splitAt(d[1])[0] )
    })
    // }

    graph.draw({
      nodes: outgoingNodes.flatten().uniqueById(),
      links: outgoingLinks.flatten(),
      type: this.graphType
    })
  }
}