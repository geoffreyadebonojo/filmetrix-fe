import { 
  graphStates 
} from '@/stores/store.js'
import GraphNode from '@models/GraphNode'

import * as d3 from 'd3'


export default class GraphEvents {
  constructor(id) {
    this.gn = new GraphNode(id)
    this.res = []
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
    let gn = new GraphNode(node.id)

    let d = gn.connections.data()
    // let n = []

    for (let i=0; i<d.length-1; i++) {
      let x = d[i+1]
      this.navigate(x)
      this.res.push(x)
    }

    // console.log(d)
    
    // debugger
  }

  singleClickNode() {
    if (!this.gn.node.classed('visited')) {
      this.gn.node.classed('visited', true)
      graphStates.visited.push(this.gn.id)
    }

    this.gn.connections.data().forEach((conn) => {
      let g = d3.selectAll(`#${this.gn.id}--${conn.id}`)
      let h = d3.selectAll(`#${conn.id}--${this.gn.id}`)

      g.select('.line').style("stroke", function() {
        let n = d3.select(this)

        if (!n.classed("active")) {
          n.classed("active", true)
          return "green"
        } else if(n.classed("active")) {
          return "lightgreen"
        }
    })

      
      h.select('.line').style("stroke", function(d) {
        let n = d3.select(this)

        if (!n.classed("active")) {
          n.classed("active", true)
          return "green"
        } else if(n.classed("active")) {
          return "lightgreen"
        }
      })

    })

    this.navigate(this.gn)

    console.log(this.res)

  }
}