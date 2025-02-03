import { 
  graphStates,
  appStates
} from '@/stores/store.js'
import GraphNode from '@models/GraphNode'

import * as d3 from 'd3'


export default class GraphEvents {
  constructor(id) {
    this.gn = new GraphNode(id)
    this.seen = []
    this.currentStack = []
    this.results = []
    this.exists = []
    this.nodes = []
    this.visited = {}
  }
  
  gatherNodes() {
    this.nodes = graphStates.existing.map((s) => s[0])

    this.numNodes = this.nodes.length
    this.nodes.forEach((n) => {
      this.visited[n] = false
    })
  }

  mouseEnterNode() {
    if (graphStates.inMotion) { return }
    this.gn.hover()
    this.gn.linkHighlighter()
  }
  
  mouseLeaveNode() {
    if (graphStates.inMotion) { return }
    this.gn.node.classed('added', false)
    this.gn.unHover()
    this.gn.linkUnhighlighter()
  }

  async doubleClickNode() {
    localStorage.setItem("newHere", false)

        if (graphStates.existing.map(x => x[0]).includes(d.id)){
          this.addToExistingNodes(d)
        } else {
          localStorage.setItem("newHere", false)
          return await this.callForNodes(d)
        }
        
        await api.fetchDetails(d.id)
        panelStates.detailsData.id = d.id
  }

  setRoot() {
    let cn = this.gn.node
    if (appStates.metaKeyIsPressed) {
      cn.classed("root", !cn.classed("root"))
    }
  }

  singleClickNode() {
    this.setRoot()
    var stack = []
    this.dfs(this.gn, stack)
  }
  
  dfs(node, stack) {
    if (this.visited[node.id]) { return }
    this.visited[node.id] = true

    stack.push(node.id)

    node.connectionIds.forEach((nid) => {
      this.dfs(new GraphNode(nid), stack)
    })

    let root = d3.select(".root")
    if (root.empty()) {
    } else {
      if (stack.last() == root.data()[0].id) {
        ///////////
        let links = []
        for (let i=1; i<stack.length; i++) {
          let t = stack[i-1]
          let s = stack[i]

          d3.select(`#${s}`).select(".outline").style("stroke", "gold")
          d3.select(`#${s}`).select(".text-container").style("stroke", "gold")

          let tar = d3.selectAll(`.link[source='${s}'][target='${t}']`)
          if (tar.empty()) { 
            tar =   d3.selectAll(`.link[source='${t}'][target='${s}']`)
          }

          tar.selectAll(".line").style("stroke", "gold")
          links.push(tar) 
        }
        //////////
      }
    }

    stack.pop()
  }
}

