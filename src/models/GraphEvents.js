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
    // let nodes = d3.selectAll(".node").data().map((n) => n.id)
    this.nodes = graphStates.existing.map((s) => s[0])

    // graphStates.existing.map((n) => {
    //   return graphStates.graphData[n[0]].links.filter((l) => {
    //     return l.index != undefined
    //   }).map((l) => {
    //     return [l.source.id, l.target.id]
    //   })
    // })
    // .forEach((list) => {
    //   list.forEach((entry) => {
    //     if (!this.exists.includes(entry)) {
    //       this.exists.push(entry)
    //     }
    //   })
    // })

    this.numNodes = this.nodes.length
    // this.visited = Array(this.numNodes).fill(false)
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


  navigate(node) {
    if (node == undefined || node == null) { return }
    if (graphStates.visited.length < 1) { return }


    let d = gn.connections.data()

    this.currentStack.push(node.id)

    // setTimeout(() => {
    // for (let i=-1; i<d.length-1; i++) {
    //   let x = d[i+1]
    //     if (!this.seen.includes(x.id)) {
    //       this.seen.push(x.id)

    //       if (x.id != node.id) {
    //         this.currentStack.push(x.id)
    //       }
          
    //       let t = d3.selectAll(`#${node.id}--${x.id}`)
    //       let o = d3.selectAll(`#${x.id}--${node.id}`)
    //       t.selectAll(".line").style("stroke", "lightgreen")
    //       o.selectAll(".line").style("stroke", "lightgreen")

    //       let w = t || o
    //       this.results.push(w)

    //       if (x.id == 'person-1150')  {
    //         new GraphNode(x.id).elem.circle.style("stroke", "red")
    //         break
    //       } else {
    //         this.navigate(x)
    //       }
    //     }
    //   }      

    //   return
    // }, 100);

    // this.currentStack.pop()

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
    this.gatherNodes()
    // this.navigate(this.gn)
    this.dfs(this.gn)

    console.log(this.results)
  }
  
  dfs(node) {
    if (this.visited[node.id]) { return }
    this.visited[node.id] = true
    
    setTimeout(() => {  
      if (graphStates.graphData[node.id] != undefined) {
        node.elem.circle.style("stroke", "lightgreen")
        let neighbors = node.connectionIds
        
        neighbors.forEach((nid) => {
          this.results.push([node.id, nid])
          node = new GraphNode(nid)
          this.dfs(node)
        })
      } else {
        // leaf
        node.elem.poster.style("opacity", 0.4)
        node.elem.circle.style("stroke", "green")
        node.elem.label.style("opacity", 0)
      }
    },200)
  }
}

