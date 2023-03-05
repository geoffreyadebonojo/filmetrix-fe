import apiService from './apiService.js'
import { store } from '@/stores/store.js'
import * as d3 from 'd3'

let timer;
let alreadyClicked = false

export default {
  methods: {
    chart (responseData) {
      const links = responseData.links
      const nodes = responseData.nodes
      var simulation = d3.forceSimulation(nodes, links)
  
      const width = 800
      const height = 800
  
      const charge = store.graphSettings.charge
  
      simulation
        .force("link", d3.forceLink(links).id(d => d.id).distance((d) => {
          return 100
        }))
        .force("charge", d3.forceManyBody().strength(charge))
        .force('collide', d3.forceCollide((d) => {
          d.r = 50
          return d.r
        }))
        .force("center", d3.forceCenter(0, 0))
        // .force("x", d3.forceX(100))
        // .force("y", d3.forceY())
        .force('x', d3.forceX().x(width * 0.3))
        .force('y', d3.forceY().y(height * 0.5))
        .alpha(1.3)
        .alphaMin(0.8)
        // .alphaTarget(0.81)
  
      d3.select("svg").html("")
      const svg = d3.select("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])

      const color = "#FFF"
  
      const link = svg.append("g")
          .attr("class", "links")
          .attr("fill", "none")
          .attr("stroke-width", 1.5)
          .selectAll("path")
          .data(links)
          .join("path")
          .attr("source", (d) => {
            return d.source.id
          })
          .attr("target", (d) => {
            return d.target.id
          })
          .attr("stroke", color)
  
      const node = svg.append("g")
          .attr("class", "nodes")
          .attr("fill", "currentColor")
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .selectAll("g")
          .data(nodes)
          .join("g")
          .attr("id", d => d.id)

      ///////////////////////////////////////
  
      node.append("circle")
          .attr("stroke", "white")
          .attr("stroke-width", 1.5)
          .attr("r", (d) => {
            return d.r * 0.75
          })
          .attr('fill', d => '#6baed6');
  
      node.append("svg:image")
          .attr('x', (d) => {
            return - d.r * 0.75
          })
          .attr('y', (d) => {
            return - d.r * 0.75
          })
          .attr('width', (d) => {
            return d.r * 1.5
          })
          .attr('height', (d) => {
            return d.r * 1.5
          })
          .attr("xlink:href", d => d.poster)
          .attr("clip-path", (d) => {
            return `inset(3% round ${d.r * 0.75}px)`
          })
  
      node.on('click', async (e, d) => {
        const doubleClickDelay = 300
        if (alreadyClicked) { 

          debugger
          if (store.existingGraphAnchors.includes(d.id)){
            // await this.callForNodes(d.id)

            const data = store.graphData

            const existingLinkCount = d3.selectAll(`[source='${d.id}']`).nodes().length
            const n = existingLinkCount + 3
            const args = 
            this.chart({ 
              nodes: data.nodes.slice(0, n+1), 
              links: data.links.slice(0, n) 
            })

          } else {
            await this.callForNodes(d.id)
          }
          
          alreadyClicked = false;
          clearTimeout(timer);
        } else {
          timer = setTimeout(async function () {
            alreadyClicked = false;
            if (store.currentDetailId !== d.id) {
              await apiService.methods.fetchDetails(d.id)
              store.currentDetailId = d.id
            }
          }, doubleClickDelay);
          alreadyClicked = true;
        }
      })

      const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
  
      let i = 0

      simulation
      .on("tick", () => {
        i += 1
        console.log(i);
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})scale(${(i/20)})`);
        // node.attr("transform", d => `translate(${d.x},${d.y})scale(0.01)`);
      })
      .on("end", () => {
        node.transition().duration(500).delay(100).ease(d3.easeBounceOut).attr("transform", (d) => {
          return `translate(${d.x},${d.y})scale(0.9)`
        })
      })
  
      return svg.node();
    },

    restart() {
      this.chart(store.graphData)
    },

    async callForNodes(id) {
      await apiService.methods.fetchDetails(id)


      if (!store.existingGraphAnchors.includes(id)) {
        store.existingGraphAnchors.push(id)
      }

      
      await apiService.methods.fetchGraphData(
        store.existingGraphAnchors, "no-var"
      )

      store.currentDetailId = id

      const data = store.graphData

      // let t
      // if (store.existingGraphAnchors != []) {
      //   t = store.existingGraphAnchors.map((d) => {
      //     const y = d3.selectAll(`[source='${d}']`).nodes().length
      //     return y
      //   })
      // }

      debugger
      
      this.chart(
        store.graphData 
      )
      store.currentFocus = 'details'
    }
  }
}
