import api from './api.js'
import Simulation from './Simulation.js'
import Matcher from './Matcher.js'
import createViewerBody from './addCenterGraphAction.js'
import { store } from '@/stores/store.js'
import helpers from './helpers.js'
import * as d3 from 'd3'

let timer;
let alreadyClicked = false

export default {
  methods: {
    draw (responseData) {
      d3.select("#inner-wrapper").remove()
      // var slider = document.getElementById("myRange");
      var links = responseData.links
      var nodes = responseData.nodes
      const width = window.innerWidth
      const height = window.innerHeight

      const outerWrapper = d3.select("#outer-wrapper")
      const innerWrapper = outerWrapper.append("g").attr("id", "inner-wrapper")
      const centeringButton = d3.select("#centering-button") 

      const simulation = new Simulation({nodes, 
                                         links, 
                                         width, 
                                         height}).body

      let link = helpers.createLinks(innerWrapper, links)
      let node = helpers.createNodes(innerWrapper, nodes)

      createViewerBody({
        centeringButton,
        outerWrapper
      })

      node.on('click', async (e, d) => {
        const doubleClickDelay = 300
        if (alreadyClicked) { 
          if (store.existing.map(x => x[0]).includes(d.id)){
            const c = store.existing.filter((y) => {
              return y[0] === d.id
            })
            const t = c[0][1]
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
            console.log("double click on existing node")
          } else {

            // double-click on new node
            console.log("double click to call new node")
            await this.callForNodes(d.id)
          }
          alreadyClicked = false;
          clearTimeout(timer);
        } else {
          timer = setTimeout(async function () {
            alreadyClicked = false;

            // single click
            if (store.currentDetailId !== d.id) {
              await api.methods.fetchDetails(d.id)
              store.currentDetailId = d.id
            }
            console.log("single click to fetch details ", d.id)
          }, doubleClickDelay);
          alreadyClicked = true;
        }
      })

      const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
      let i = 0
      let elem;

      simulation
      .on("tick", () => {
        i += 1
        link.attr("d", linkArc)
        node.attr("transform", d => `translate(${d.x},${d.y})`); //scale(${(i/20)})`);
      })
      .on("end", (t) => {
        node.transition().duration(500).delay(100).ease(d3.easeBounceOut).attr("transform", (d) => {
          return `translate(${d.x},${d.y})`//scale(0.9)`
        })
        
        // this is where the control filters are
        d3.selectAll(".sel").on("click", (e) => {
          let data
          let nodes =[]
          let links =[]

          elem = d3.select(`#${e.target.id}`)
          if (elem.classed("on")) {
            elem.classed("off", true)
            elem.classed("on", false)
          } else {
            elem.classed("off", false)
            elem.classed("on", true)
          }


          store.existing.forEach((d) => {
            data = store.graphData[d[0]]
            nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
            links = links.concat(data.links.slice(0,d[1]+1))
          })
          
          store.graphTypes = helpers.getTypes(nodes)

          if (e.target.id == "clear") {
            store.appliedFilters = []
            d3.selectAll(".sel").classed("off", true)
            d3.selectAll(".sel").classed("on", false)
          } else {
            store.appliedFilters.togglePresence(e.target.id)
          }
          
          console.log(store.appliedFilters)
          nodes = nodes.uniqueById().filter((d) => {
            if (d.type.overlapsWith(store.appliedFilters).length === 0) {
              return d.type.excludes(e.target.id) 
            } else {
              return false
            }
          })
          
          links = links.filter((d) => {
            let x = nodes.map((n) => {
              return n.id == d.target.id
            })
            return x.includes(true)
          })

          this.draw({
            nodes: nodes,
            links: links.unique()
          })
        })
      })

      return innerWrapper.node();
    },

    async callForNodes(id) {
      await api.methods.fetchDetails(id)

      if (store.existing.map((d) => d[0]).excludes(id) ) {
        store.existing.push([id, 8])
        const ext = store.existing.unique().map((d) => d[0])
        await api.methods.fetchGraphData(ext)
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
