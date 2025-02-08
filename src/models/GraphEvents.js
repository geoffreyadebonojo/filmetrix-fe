import { 
  graphStates,
  panelStates,
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
    let hoveredId = d3.select(".hover").data()[0].id
    this.gn.linkHighlighter(hoveredId)
    this.gn.node.moveToFront()
  }
  
  mouseLeaveNode() {
    if (graphStates.inMotion) { return }
    this.gn.node.classed('added', false)
    this.gn.unHover()
    this.gn.linkUnhighlighter()
  }

  // setRoot() {
  //   if (appStates.metaKeyIsPressed) {
  //     let cn = this.gn.node
  //     d3.selectAll(".root").classed("root", false)
  //     cn.classed("root", true)
  //   }
  // }
  
  async singleClickNode() {
    if (appStates.metaKeyIsPressed) {
      // kevin bacon
      let root = d3.select("#person-4724")
      
      d3.selectAll(".node").select("circle").style("stroke", "#7A7879")
      d3.selectAll(".link").select("line").style("stroke", "#7A7879")
      
      let x = this.bfs(this.gn, root)    
      
      for (let i=1; i<x.length; i++) {
        d3.select(`#${x[i]}`).select("circle").style("stroke", "yellow")
        let link = d3.selectAll(`#${x[i-1]}--${x[i]},#${x[i]}--${x[i-1]}`)
        link.selectAll(".line").style("stroke", "yellow")
      }

      d3.select("#degrees-kevin").node().innerHTML = `${x.length-1} degrees`
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

        let links = []
        for (let i=1; i<stack.length; i++) {
          let t = stack[i-1]
          let s = stack[i]

          temp = [t,s]

          d3.select(`#${s}`).select("circle").style("stroke", "lightgreen")
          d3.select(`#${s}`).select(".text-container").style("stroke", "lightgreen")

          let tar = d3.selectAll(`.link[source='${s}'][target='${t}']`)
          if (tar.empty()) { 
            tar =   d3.selectAll(`.link[source='${t}'][target='${s}']`)
          }

          tar.selectAll(".line").style("stroke", "lightgreen")
          links.push(tar) 
        }
      }
      this.results.push(temp)
    }

    stack.pop()
  }
  // remember to initialize the stack:
  // var stack = []
  // this.dfs(rootNode, stack)
}

