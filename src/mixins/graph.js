import { 
  graphStates, 
  panelStates,
  graphData,
  appStates
} from '@/stores/store.js'
import { settings, setFocus } from '@mixins/helpers.js'
import api from './api.js'
import * as d3 from 'd3'
import GraphBuilder from '@models/GraphBuilder.js'
import GraphManager from '@models/GraphManager.js'
import GraphNode from '@models/GraphNode'
import GraphEvents from '@models/GraphEvents'
import Simulation from '@models/Simulation.js'

let timer;
let alreadyClicked = false

export default {
  name: "graph",
  data () {
    return {
      nodes: [],
      links: []
    }
  },

  linkFormatter(l) {
    if (l.source.id) {
      l.id = `${l.source.id}--${l.target.id}`
    } else {
      l.id = `${l.source}--${l.target}`
    }
    return l
  },

  nodeFormatter(n, s, t) {
    n.r = 40
    // n.r =     n.poster == "" ? 10 : 40
    n.genre = n.type ? n.type.join(" ") : ''
    n.name =  n.name ? n.name.toLowerCase() : ''
    return n
  },

  draw (responseData, options={}) {
    let start = Date.now()
    // console.group("graph.draw()")
    // console.log("start")

    localStorage.setItem("lockedGraph", JSON.stringify(graphStates.existing))
    graphStates.inMotion = true

    var links = responseData.links.map((l) => { return this.linkFormatter(l) })
    var nodes = responseData.nodes.map((n) => { return this.nodeFormatter(n) })

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
                                        graphType }, options).body


    const [link, node] = new GraphBuilder({ links, 
                                            nodes,
                                            containerId,
                                            innerWrapper,
                                            outerWrapper }).build()
    
    this.attachNodeClickActions(node)

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    }).on("end", () => {
      graphStates.inMotion = false
    })
    
    // console.log(`duration: ${Date.now() - start}`)
    // console.log("end")
    // console.groupEnd()

    return innerWrapper.node();
  },

  attachNodeClickActions(node) {
    node.on('click', async (_e, d) => {
      const doubleClickDelay = 300
      const ge = new GraphEvents(d.id)
      
      if (alreadyClicked) { 
        localStorage.setItem("newHere", false)

        if (graphStates.existing.map(x => x[0]).includes(d.id)){
          await this.addToExistingNodes(d)
        } else {
          localStorage.setItem("newHere", false)
          return await this.callForNodes(d)
        }
        panelStates.detailsData.id = d.id
        await api.fetchDetails(d.id)

        alreadyClicked = false;
        clearTimeout(timer);
        
      } else {
        timer = setTimeout(async function () {          
          alreadyClicked = false;
          
          if (panelStates.detailsData.id) {
            setFocus('details')
            panelStates.detailsData.id = d.id
            ge.singleClickNode()
            await api.fetchDetails(d.id)
          }

        }, doubleClickDelay);
        alreadyClicked = true;
      }
    })
  },

  async addToExistingNodes (d) {
    let currentNode = graphStates.existing.filter((y) => {
      return y[0] === d.id
    })[0]

    const currentNodeId =    currentNode[0]
    const currentNodeCount = currentNode[1]
    
    let addCount = appStates.shiftKeyIsPressed ? 10 : 3
    let newNodeCount = currentNodeCount + addCount

    if (graphStates.graphData[currentNodeId] == undefined) {
      debugger
    }

    if (newNodeCount > graphStates.graphData[currentNodeId].nodes.length) {
      newNodeCount = graphStates.graphData[currentNodeId].nodes.length-1
    }

    currentNode[1] = newNodeCount

    let vals
    let nodes = []
    let links = []

    graphStates.existing.forEach(function(key) {
      vals = graphStates.graphData[key[0]]
      vals.nodes.slice(0,key[1]+1).forEach((node) => {
        if (nodes.ids().excludes(node.id)){
          nodes.push(node)
        }
      })
      links = links.concat(vals.links.slice(0,key[1]))
    })

    new GraphManager().generate()
  },

  async callForNodes(d, count=10) {
    panelStates.detailsData.id = d.id
    panelStates.currentFocus = 'details'
    
    if (graphStates.existing.map((f) => f[0]).excludes(d.id)) { 
      graphStates.existing.push([d.id, count])
      const ext = graphStates.existing.unique().map((d) => d[0])
      await api.fetchGraphData(ext)
      
      new GraphManager().generate()
    }
  }
}
