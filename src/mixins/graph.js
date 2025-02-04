import { 
  graphStates, 
  panelStates,
  appStates
} from '@/stores/store.js'
import { settings, setFocus } from '@mixins/helpers.js'
import api from './api.js'
import * as d3 from 'd3'
import GraphBuilder from '@models/GraphBuilder.js'
import GraphManager from '@models/GraphManager.js'
import GraphNode from '@models/GraphNode'
import GraphEvents from '@models/GraphEvents'
import LinkMap from '@models/LinkMap'
import Simulation from '@models/Simulation.js'

let timer;
let alreadyClicked = false
let lm

// IGNORE THE LINTER

export default {
  name: "graph",
  data () {
    return {
      nodes: [],
      links: []
    }
  },
  draw (responseData, options={}) {
    localStorage.setItem("lockedGraph", JSON.stringify(graphStates.existing))

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
    
    this.attachNodeClickActions(node)

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    })
    .on("end", () => {
      graphStates.inMotion = false
      
      // STRUGGLING
      // const zoom = d3.zoom().on('zoom', (e) => {
      //   d3.select("#main-outer-wrapper").attr("transform", e.transform)
      // })
      // .on('end', (e) => {
      //   localStorage.setItem('currentZoom', e.transform)
      // })
      
      // let zoomLevel = 2.5
      // let node = d3.select(`#${panelStates.detailsData.id}`)
      // let d = node.data()[0]
      // let centering = { x: window.innerWidth *  0.5, 
      //                   y: window.innerHeight * 0.4 }

      // node.classed("poster-highlight", true)
      // d3.select("#viewer-body").transition().ease(d3.easeQuadOut).duration(500).call(
      //   zoom.transform, 
      //   d3.zoomIdentity.translate(centering.x, centering.y)
      //                   .scale(zoomLevel)
      //                   .translate(-d.x, -d.y))
    })
    
    return innerWrapper.node();
  },

  attachNodeClickActions(node) {
    node.on('click', async (_e, d) => {
      const doubleClickDelay = 300
      const ge = new GraphEvents(d.id)
      
      if (alreadyClicked) { 
        localStorage.setItem("newHere", false)

        if (graphStates.existing.map(x => x[0]).includes(d.id)){
          this.addToExistingNodes(d)
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
          setFocus('details')
          panelStates.detailsData.id = d.id
         
          ge.singleClickNode()
          await api.fetchDetails(d.id)

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
    let addCount

    if (appStates.shiftKeyIsPressed) {
      addCount = 7
    } else {
      addCount = 3
    }

    let newNodeCount = currentNodeCount + addCount

    if (newNodeCount > graphStates.graphData[currentNodeId].nodes.length) {
      newNodeCount = graphStates.graphData[currentNodeId].nodes.length
    }

    currentNode[1] = newNodeCount

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
      type: "main"
    }) 

    let gn
    let connectionIds = new GraphNode(currentNodeId).connectionIds

    connectionIds.slice(connectionIds.length-addCount).forEach((nodeId) => {
      let n = document.querySelector(`#${nodeId}`)
      n.classList.add('newest')
    })

  },
  
  async callForNodes(d, count=5) {
    panelStates.detailsData.id = d.id
    panelStates.currentFocus = 'details'
    
    if (graphStates.existing.map((f) => f[0]).excludes(d.id) ) { 
      graphStates.existing.push([d.id, count])
      const ext = graphStates.existing.unique().map((d) => d[0])
      await api.fetchGraphData(ext)
      
      new GraphManager().generate()
    }

    let gn
    let connectionIds = new GraphNode(d.id).connectionIds

    connectionIds.slice(connectionIds.length-count).forEach((nodeId) => {
      let n = document.querySelector(`#${nodeId}`)
      n.classList.add('newest')
    })

  }
}
