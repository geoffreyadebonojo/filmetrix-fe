import api from './api.js'
import * as d3 from 'd3'
import helpers from './helpers.js'
import graphBuilder from './graphBuilder.js'
import Simulation from './Simulation.js'
import { store } from '@/stores/store.js'

let timer;
let alreadyClicked = false
// IGNORE THE LINTER
let i = 0
      
export default {
  methods: {
    draw (responseData) {
      store.inMotion = true
      
      d3.select("#inner-wrapper").remove()
      var links = responseData.links
      var nodes = responseData.nodes
      const width = window.innerWidth
      const height = window.innerHeight
      const outerWrapper = d3.select("#outer-wrapper")
      const innerWrapper = outerWrapper.append("g").attr("id", "inner-wrapper")
      const graphControlButtons = d3.selectAll(".graph-control-buttons")
      
      const simulation = new Simulation({nodes, 
                                         links, 
                                         width, 
                                         height}).body

      let link = graphBuilder.createLinks(innerWrapper, links)
      let node = graphBuilder.createNodes(innerWrapper, nodes)

      graphBuilder.createViewerBody({
        graphControlButtons,
        outerWrapper
      })
      
      d3.select("#save-button").classed("locked", false).classed("unlocked", true)

      node.on('click', async (e, d) => {
        const doubleClickDelay = 300
        if (alreadyClicked) { 
          localStorage.setItem("newHere", false)

          if (store.existing.map(x => x[0]).includes(d.id)){
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
            store.existing.forEach(function(key) {
              vals = store.graphData[key[0]]
              vals.nodes.slice(0,key[1]+1).forEach((node) => {
                if (nodes.map(d => d.id).excludes(node.id)){
                  nodes.push(node)
                }
              })
              links = links.concat(vals.links.slice(0,key[1]))
            })
            // double-click existing node to
            // add new nodes
            this.draw({
              nodes: nodes,
              links: links
            })
          } else {
            // double-click on new node
            localStorage.setItem("newHere", false)
            await this.callForNodes(d.id)
            return
          }

          await api.fetchDetails(d.id)
          store.currentDetailId = d.id

          alreadyClicked = false;
          clearTimeout(timer);
        } else {
          timer = setTimeout(async function () {
            alreadyClicked = false;
            // single click
            // if (store.currentDetailId !== d.id) {
            //   await api.fetchDetails(d.id)
            //   store.currentDetailId = d.id
            // }
          }, doubleClickDelay);
          alreadyClicked = true;
        }

        // on every click
        await api.fetchDetails(d.id)
        store.currentDetailId = d.id
      })

      simulation
      .on("tick", () => {
        i += 1

        link
          .attr("x1", d => d.source.x)
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
        links: links
      })
    }
  }
}
