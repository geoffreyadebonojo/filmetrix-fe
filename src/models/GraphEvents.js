import { 
  graphStates 
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

  singleClickNode() {
    // if (!this.gn.node.classed('visited')) {
    //   this.gn.node.classed('visited', true)
    //   graphStates.visited.push(this.gn.id)
    // }

    // this.gn.connections.data().forEach((conn) => {
    //   let g = d3.selectAll(`#${this.gn.id}--${conn.id}`)
    //   let h = d3.selectAll(`#${conn.id}--${this.gn.id}`)

    //   g.style("classed", function() {
    //     let n = d3.select(this)
    //     if (!n.classed("active")) {
    //       n.classed("active", true)
    //       n.select(".line").style("stroke", "green")
    //       return "unlocked"
    //     } else if(n.classed("active")) {
    //       n.classed("locked", true)
    //       n.select(".line").style("stroke", "lightgreen")
    //       return "locked"
    //     }
    //   })
      
    //   h.style("classed", function(d) {
    //     let n = d3.select(this)
    //     if (!n.classed("active")) {
    //       n.classed("active", true)
    //       n.select(".line").style("stroke", "green")
    //       return "unlocked"
    //     } else if(n.classed("active")) {
    //       n.classed("locked", true)
    //       n.select(".line").style("stroke", "lightgreen")
    //       return "locked"
    //     }
    //   })

    // })
    // this.gatherNodes()

    var stack = []
    
    this.dfs(this.gn, stack)

    console.log(this.results)
  }
  
  dfs(node, stack) {
    if (this.visited[node.id]) { return }
    this.visited[node.id] = true

    stack.push(node.node.data()[0].name)

    if (node.id == 'person-500') {
      // debugger
    }

    var temp = []
    // setTimeout(() => {  
    node.connectionIds.forEach((nid) => {
      this.dfs(new GraphNode(nid), stack)
    })
    
    if (graphStates.graphData[node.id] != undefined) {
      node.elem.circle.style("stroke", "lightgreen")
    } else { // leaf
      // node.shrinkNodeScale(0.2)
      temp.push(stack.join("-> "))
      stack.pop()
    }
    // },200)
    
    this.results.push(temp)
  }
}

