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

    this.visited = {}
    this.prev = {}
  }
  
  gatherNodes() {
    let nodeIds = d3.selectAll(".node").data().map((n) => n.id)

    nodeIds.forEach((n) => {
      this.visited[n] = false
      this.prev[n] = null
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
    if (appStates.metaKeyIsPressed) {
      let cn = this.gn.node
      cn.classed("root", !cn.classed("root"))
    }
  }

  singleClickNode() {
    this.setRoot()
    // var stack = []
    // this.dfs(this.gn, stack)

  
    this.bfs(this.gn)
    


    // let root = d3.select(".root")
    // let paths = this.results.filter((r) => {
    //   return r.split("->").last() == root.data()[0].name
    // })

    // console.log(this.results)
  }
  
  dfs(node, stack) {
    if (this.visited[node.id]) { return }
    this.visited[node.id] = true

    stack.push(node.node.data()[0].name)

    var temp = ''

    node.connectionIds.forEach((nid) => {
      this.dfs(new GraphNode(nid), stack)
    })

    temp = stack.join("->")
    this.results.push(temp)

    stack.pop()
  }

  bfs(root) {
    this.gatherNodes()
    
    var queue = [root]
    this.visited[root.id] = true

    while (queue.length > 0) {
      let node = queue.shift()

      node.connectionIds.forEach((neighborId) => {
        if (this.visited[neighborId] == false) {

          let gn = new GraphNode(neighborId)
          queue.push(gn)

          this.visited[neighborId] = true
          this.prev[neighborId] = node
        }
      })

      // console.log(queue.map((n) => n.node.data()[0].name))
    }

    debugger
  }
}

