import api from './api.js'
import * as d3 from 'd3'
import helpers from './helpers.js'
import Simulation from './Simulation.js'
import graphBuilder from './graphBuilder.js'
import { store } from '@/stores/store.js'
// import Vue from 'vue'
// import VueCookies from 'vue-cookies'

let timer;
let alreadyClicked = false
// IGNORE THE LINTER
let i = 0
      

export default {
  created() {
    let x = localStorage.getItem("newHere")
    if (x === undefined || x === null || x === '') {
      localStorage.setItem("newHere", true)
    }
  },

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

      let link = graphBuilder.createLinks(innerWrapper, links)
      let node = graphBuilder.createNodes(innerWrapper, nodes)

      graphBuilder.createViewerBody({
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
          } else {
            // double-click on new node
            localStorage.setItem("newHere", false)
            await this.callForNodes(d.id)
            return
          }
          alreadyClicked = false;
          clearTimeout(timer);
        } else {
          timer = setTimeout(async function () {
            alreadyClicked = false;
            // single click
            if (store.currentDetailId !== d.id) {
              await api.fetchDetails(d.id)
              store.currentDetailId = d.id
            }
          }, doubleClickDelay);
          alreadyClicked = true;
        }
      })

      const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
      
      let elem;

      simulation
      .on("tick", () => {
        i += 1
        link.attr("d", linkArc)
        node.attr("transform", d => `translate(${d.x},${d.y})`); //scale(${(i/20)})`);
      })
      .on("end", () => {
        node
        // .transition().duration(500).delay(100).ease(d3.easeBounceOut)
        .attr("transform", (d) => {
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

          // this.draw({
          //   nodes: nodes,
          //   links: links.unique()
          // })
        })
        .on("mouseenter", (e) => {
          d3.selectAll(`.${e.target.id}`).nodes().forEach((d) => {
            helpers.nodeTransformer(`#${d.id}`, "scale(1.05)", "aliceblue", "white")
          })
        }).on("mouseout", (e) => {
          d3.selectAll(`.${e.target.id}`).nodes().forEach((d) => {
            helpers.nodeTransformer(`#${d.id}`, "scale(1)", helpers.props().strokeColor, "none")
          })
        })
      })
      
      return innerWrapper.node();
    },

    async callForNodes(id) {
      // await api.fetchDetails(id)

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
