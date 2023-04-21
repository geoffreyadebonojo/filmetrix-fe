import { 
  graphStates, 
  panelStates,
  store 
} from '@/stores/store.js'
import { settings, getTypes, setFocus } from './helpers.js'
import api from './api.js'
import * as d3 from 'd3'
import GraphBuilder from '@models/GraphBuilder.js'
import GraphManager from '@models/GraphManager.js'
import Simulation from '@models/Simulation.js'

let timer;
let alreadyClicked = false
// IGNORE THE LINTER
// let i = 0

export default {
  name: "graph",
  data () {
    return {}
  },
  draw (responseData, options={}) {
    graphStates.inMotion = true
    var links = responseData.links
    var nodes = responseData.nodes

    const s = settings(responseData.type)

    const graphType =      s.graphType
    const containerId =    s.containerId
    const outerWrapperId = s.outerWrapperId
    const innerWrapperId = s.innerWrapperId

    d3.select(`#${innerWrapperId}`).remove()
    
    const outerWrapper = d3.select(`#${outerWrapperId}`)
    const innerWrapper = outerWrapper.append("g").attr("id", innerWrapperId)

    const simulation = new Simulation({ nodes, 
                                        links,
                                        graphType}, options).body

    const [link, node] = new GraphBuilder({ links, 
                                     nodes,
                                     containerId,
                                     innerWrapper,
                                     outerWrapper }).build()
    
    this.attachNodeClickActions(node, graphType)

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    })
    .on("end", () => {
      graphStates.inMotion = false
    })
    
    return innerWrapper.node();
  },

  attachNodeClickActions(node, graphType) {
    node.on('click', async (_e, d) => {
      const doubleClickDelay = 300
      
      if (alreadyClicked) { 
        localStorage.setItem("newHere", false)

        if (graphStates.existing.map(x => x[0]).includes(d.id)){
          this.addToExistingNodes(d, graphType)
        } else {
          localStorage.setItem("newHere", false)
          return await this.callForNodes(d, graphType)
        }

        await api.fetchDetails(d.id)
        panelStates.detailsData.id = d.id

        alreadyClicked = false;
        clearTimeout(timer);

      } else {
        timer = setTimeout(async function () {
          alreadyClicked = false;

          await api.fetchDetails(d.id)
          panelStates.detailsData.id = d.id
          setFocus('details')
    
        }, doubleClickDelay);
        alreadyClicked = true;
      }
    })
  },

  async addToExistingNodes (d, graphType) {
    const c = graphStates.existing.filter((y) => {
      return y[0] === d.id
    })
    const t = c[0][1]
    if (t > this.data().nodeCount) { return }
    const n = t + 3
    c[0][1] = n

    let vals
    let nodes = []
    let links = []

    graphStates.existing.forEach(function(key) {
      vals = graphStates.graphData[key[0]]
      vals.nodes.slice(0,key[1]+1).forEach((node) => {
        if (nodes.map(d => d.id).excludes(node.id)){
          nodes.push(node)
        }
      })
      links = links.concat(vals.links.slice(0,key[1]))
    })

    this.draw({
      nodes: nodes,
      links: links,
      type: graphType
    })
  },

  async callForNodes(d) {
    panelStates.detailsData.id = d.id
    panelStates.currentFocus = 'details'

    if (graphStates.existing.map((f) => f[0]).excludes(d.id) ) {
      graphStates.existing.push([d.id, 8])
      const ext = graphStates.existing.unique().map((d) => d[0])
      await api.fetchGraphData(ext)
      new GraphManager().generate()
    }
  }
}
