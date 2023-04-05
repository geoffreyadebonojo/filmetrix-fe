import api from './api.js'
import * as d3 from 'd3'
import helpers from './helpers.js'
import Graph from '@models/Graph.js'
import Simulation from '@models/Simulation.js'
import { store } from '@/stores/store.js'
import focusHelper from '@mixins/focusHelper'
// import graphBuilder from '@mixins/graphBuilder.js'


let timer;
let alreadyClicked = false
// IGNORE THE LINTER
// let i = 0

export default {
  name: "graph",
  draw (responseData) {
    store.inMotion = true
    var links = responseData.links
    var nodes = responseData.nodes

    const settings = helpers.settings(responseData.type)

    const graphType =      settings.graphType
    const containerId =    settings.containerId
    const outerWrapperId = settings.outerWrapperId
    const innerWrapperId = settings.innerWrapperId

    d3.select(`#${innerWrapperId}`).remove()
    
    const outerWrapper = d3.select(`#${outerWrapperId}`)
    const innerWrapper = outerWrapper.append("g").attr("id", innerWrapperId)

    const simulation = new Simulation({ nodes, 
                                        links,
                                        graphType }).body

    const [link, node] = new Graph({ links, 
                                      nodes,
                                      containerId,
                                      innerWrapper,
                                      outerWrapper }).build()
    
    d3.select("#save-button").classed("locked", false).classed("unlocked", true)

    this.attachNodeClickActions(node, responseData)

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    })
    .on("end", () => {
      store.inMotion = false
    })
    
    return innerWrapper.node();
  },

  attachNodeClickActions(node, responseData) {
    node.on('click', async (_e, d) => {
      const doubleClickDelay = 300
      
      await api.fetchDetails(d.id)
      store.currentDetailId = d.id
      focusHelper.methods.set('details')

      if (alreadyClicked) { 
        localStorage.setItem("newHere", false)

        if (store.existing.map(x => x[0]).includes(d.id)){
          this.addToExistingNodes(d, responseData)
        } else {
          localStorage.setItem("newHere", false)
          return await this.callForNodes(d.id)
        }

        await api.fetchDetails(d.id)
        store.currentDetailId = d.id
        alreadyClicked = false;
        clearTimeout(timer);

      } else {
        timer = setTimeout(async function () {
          alreadyClicked = false;
        }, doubleClickDelay);
        alreadyClicked = true;
      }
    })
  },

  async addToExistingNodes (d, responseData) {
    const c = store.existing.filter((y) => {
      return y[0] === d.id
    })
    const t = c[0][1]
    if (t > 28) { return }
    const n = t + 3
    c[0][1] = n
    let vals
    let nodes = []
    let links = []
    // move to end of existing
    store.existing.forEach(function(key) {
      vals = store.graphData[key[0]]
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
  },

  async callForNodes(id) {
    if (store.existing.map((d) => d[0]).excludes(id) ) {
      store.existing.push([id, 8])
      const ext = store.existing.unique().map((d) => d[0])
      await api.fetchGraphData(ext)
    }

    store.currentDetailId = id
    let data
    let nodes = []
    let links = []

    store.existing.forEach((d) => {
      data = store.graphData[d[0]]
      nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
      links = links.concat(data.links.slice(0,d[1]))
    })

    store.graphTypes =  helpers.getTypes(nodes)
    store.currentFocus = 'details'

    this.draw({
      nodes: nodes.uniqueById(),
      links: links,
      type: "main"
    })
  }
}
