import { 
  graphStates,
  graphData,
  store
 } from "@/stores/store.js"
import api from "@mixins/api"
import graph from "@/mixins/graph"
import * as d3 from 'd3'

export default class GraphManager {
  constructor(graphType="main") {
    this.data
    this.nodes = []
    this.links = []
    this.graphType = graphType
  }

  async generate(filteredData={}) {
    // console.group("GraphManager.generate()")
    // console.log("start")
    // let methodStart = Date.now()

    let outgoingLinks
    let outgoingNodes

    if (filteredData.nodes && filteredData.links) {
      outgoingLinks = filteredData.links
      outgoingNodes = filteredData.nodes  
    } else {

      if (graphStates.existing == null) { return }
      if (graphStates.existing.length < 1) { return }

      store.isLocked = true
    
      await api.fetchGraphData(graphStates.existing.map(d => d[0]))
      await api.fetchDetails(graphStates.existing[0])

      let data, start, percent
      
      graphStates.existing.forEach((d, i) => {
        // start = Date.now()
        data = graphStates.graphData[d[0]]

        let [activeNodes, inactiveNodes] = data.nodes.splitAt(d[1])
        let [activeLinks, inactiveLinks] = data.links.splitAt(d[1]-1)

        graphData.active.nodes = graphData.active.nodes.concat(activeNodes).uniqueById()
        graphData.active.links = graphData.active.links.concat(activeLinks).unique()

        graphData.inactive.nodes = graphData.inactive.nodes.concat(inactiveNodes).uniqueById()
        graphData.inactive.links = graphData.inactive.links.concat(inactiveLinks).unique()

        this.links = graphData.active.links
        this.nodes = graphData.active.nodes

        percent = i / graphStates.existing.length-1
        // console.log(`${Date.now() - start}`)
      })

      outgoingLinks = graphData.active.links
      outgoingNodes = graphData.active.nodes
    }

    graph.draw({
      nodes: outgoingNodes,
      links: outgoingLinks,
      type: this.graphType
    })

    // console.log(`duration: ${Date.now() - methodStart}`)
    // console.log("end")
    // console.groupEnd()
  }
}