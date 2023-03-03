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
        .force("link", d3.forceLink(links).id(d => d.id).distance(200))
        .force("charge", d3.forceManyBody().strength(charge))
        .force('collide', d3.forceCollide((d) => {
          d.r = 30
          return d.r
        }))
        .force("center", d3.forceCenter(0, 0))
        // .force("x", d3.forceX(100))
        // .force("y", d3.forceY())
        .force('x', d3.forceX().x(width * 0.3))
        .force('y', d3.forceY().y(height * 0.5))
        // .alpha(1)
        // .alphaMin(0.82)
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
  
      node.append("circle")
          .attr("stroke", "white")
          .attr("stroke-width", 1.5)
          .attr("r", (d) => {
            return d.r
          })
          .attr('fill', d => '#6baed6');
  
      node.append("svg:image")
          .attr('x', -20)
          .attr('y', -22)
          .attr('width', 40)
          .attr('height', 44)
          .attr("xlink:href", d => d.poster)
          .attr("clip-path", "inset(5% round 20px)")
  
      node.on('click', async (e, d) => {
        const doubleClickDelay = 300
        if (alreadyClicked) { 

          await this.callForNodes(d)

          alreadyClicked = false;
          clearTimeout(timer);
        } else {
          timer = setTimeout(function () {
            alreadyClicked = false;
            
            apiService.methods.fetchDetails(d.id)
          
          }, doubleClickDelay);
          alreadyClicked = true;
        }
      })

      const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
  
      simulation.on("tick", () => {
          link.attr("d", linkArc);
          node.attr("transform", d => `translate(${d.x},${d.y})`);
      });
  
      return svg.node();
    },

    restart() {
      this.chart(store.graphData.data)
    },

    async callForNodes(d) {
      await apiService.methods.fetchDetails(d.id)

      const id = d

      if (!store.existingGraphAnchors.includes(id)) {
        store.existingGraphAnchors.push(id)
      }

      await apiService.methods.fetchGraphData(
        store.existingGraphAnchors, 5
      )
      // already fetching details in the api,
      // maybe package that up into a big
      // credit_list object, so I don't have to
      // do it twice?
      await apiService.methods.fetchDetails(id)

      store.currentDetailId = id

      this.chart(
        store.graphData.data 
      )
      
      store.currentFocus = 'details'
    }
  }
}
