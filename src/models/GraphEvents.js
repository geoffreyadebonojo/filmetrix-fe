import { 
  graphStates 
} from '@/stores/store.js'
import GraphNode from '@models/GraphNode'

import * as d3 from 'd3'


export default class GraphEvents {
  constructor(id) {
    this.gn = new GraphNode(id)
    this.seen = []
    this.current = []
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


  navigate(node) {
    if (node == undefined || node == null) { return }
    if (graphStates.visited.length < 1) { return }

    let gn = new GraphNode(node.id)
    let d = gn.connections.data()

    gn.elem.circle.style("stroke", "lightgreen")
    this.current.push(node.id)

    setTimeout(() => {
    for (let i=-1; i<d.length-1; i++) {
      let x = d[i+1]
        if (!this.seen.includes(x.id)) {
          this.seen.push(x.id)

          if (x.id != node.id) {
            this.current.push(x.id)
          }

          if (x.id == 'person-1150')  {
            new GraphNode(x.id).elem.circle.style("stroke", "red")
            return
          } else {
            this.navigate(x)
          }
          
          let t = d3.selectAll(`#${node.id}--${x.id}`)
          let o = d3.selectAll(`#${x.id}--${node.id}`)
          
          t.selectAll(".line").style("stroke", "lightgreen")
          o.selectAll(".line").style("stroke", "lightgreen")

        }
      }      
      this.current = []
      return
    }, 700);
    

    this.current.pop()
  }

  singleClickNode() {
    if (!this.gn.node.classed('visited')) {
      this.gn.node.classed('visited', true)
      graphStates.visited.push(this.gn.id)
    }

    this.gn.connections.data().forEach((conn) => {
      let g = d3.selectAll(`#${this.gn.id}--${conn.id}`)
      let h = d3.selectAll(`#${conn.id}--${this.gn.id}`)

      g.style("classed", function() {
        let n = d3.select(this)

        if (!n.classed("active")) {
          n.classed("active", true)
          n.select(".line").style("stroke", "green")
          return "unlocked"
        } else if(n.classed("active")) {
          n.classed("locked", true)
          n.select(".line").style("stroke", "lightgreen")
          return "locked"
        }
      })
      
      h.style("classed", function(d) {
        let n = d3.select(this)
        
        if (!n.classed("active")) {
          n.classed("active", true)
          n.select(".line").style("stroke", "green")
          return "unlocked"
        } else if(n.classed("active")) {
          n.classed("locked", true)
          n.select(".line").style("stroke", "lightgreen")
          return "locked"
        }
      })

      this.navigate(this.gn)
    })

    console.log(this.results)
  }
}