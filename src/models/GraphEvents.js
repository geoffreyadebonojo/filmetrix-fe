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
    this.nodes = []
    this.visited = {}
    this.results = []
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
    if (appStates.metaKeyIsPressed) {
      let cn = this.gn.node
      cn.classed("root", !cn.classed("root"))
    }
  }

  singleClickNode() {
    this.setRoot()
    // var stack = []
    // this.dfs(this.gn, stack)
    let root = d3.select("#person-4762")
    let x = this.bfs(this.gn, root)    
    console.log(x)

    for (let i=1; i<x.length; i++) {
      let link = d3.selectAll(`#${x[i-1]}--${x[i]},#${x[i]}--${x[i-1]}`)
      link.selectAll(".line").style("stroke", "red")
    }
  }

  bfs(startNode, endNode) {
    return this.reconstructPath(
      startNode, 
      new GraphNode(endNode.data()[0].id), 
      this.solve(startNode)
    )
  }
  
  reconstructPath(startNode, endNode, prev) {
    let path = []

    for (let at = endNode.id; at != null; at = prev[at]) {
      path.push(at)
    }

    path.reverse()
    
    return path
  }

  solve(root) {
    // this.gatherNodes()
    let nodeIds = d3.selectAll(".node").data().map((n) => n.id)
    let visited = []
    let prev = []

    nodeIds.forEach((n) => {
      visited[n] = false
      prev[n] = null
    })

    var queue = [root]
    visited[root.id] = true
    
    while (queue.length > 0) {
      let node = queue.shift()
      node.connectionIds.forEach((neighborId) => {
        if (visited[neighborId] == false) {
          let gn = new GraphNode(neighborId)
          queue.push(gn)
          visited[neighborId] = true
          prev[neighborId] = node.id
        }
      })
      // console.log(queue.map((n) => n.node.data()[0].name))
    }

    return prev
  }

  dfs(node, stack) {
    if (this.visited[node.id]) { return }
    this.visited[node.id] = true

    stack.push(node.node.data()[0].name)

    var temp = ''

    node.connectionIds.forEach((nid) => {
      this.dfs(new GraphNode(nid), stack)
    })
    
    let root = d3.select(".root")
    if (root.empty()) {
    } else {
      var temp = []
      if (stack.last() == root.data()[0].id) {
        ///////////
        let links = []
        for (let i=1; i<stack.length; i++) {
          let t = stack[i-1]
          let s = stack[i]

          temp = [t,s]

          d3.select(`#${s}`).select(".outline").style("stroke", "lightgreen")
          d3.select(`#${s}`).select(".text-container").style("stroke", "lightgreen")

          let tar = d3.selectAll(`.link[source='${s}'][target='${t}']`)
          if (tar.empty()) { 
            tar =   d3.selectAll(`.link[source='${t}'][target='${s}']`)
          }

          tar.selectAll(".line").style("stroke", "lightgreen")
          links.push(tar) 
        }
        //////////
      }
      this.results.push(temp)
    }

    stack.pop()
  }
}

