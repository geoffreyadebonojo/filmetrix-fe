import apiService from './apiService.js'
import { store } from '@/stores/store.js'
import * as d3 from 'd3'

export default {
  methods: {
    chart (responseData, settings={charge: -1000}) {
      debugger
      const links = responseData.links
      const nodes = responseData.nodes
      var simulation = d3.forceSimulation(nodes, links)
  
      const width = 800
      const height = 800
  
      const charge = settings.charge
  
      simulation
        .force("link", d3.forceLink(links).id(d => d.id).distance(200))
        .force("charge", d3.forceManyBody().strength(charge))
        .force('collide', d3.forceCollide(d => 30))
        .force("center", d3.forceCenter(0, 0))
        // .force("x", d3.forceX(100))
        // .force("y", d3.forceY())
        .force('x', d3.forceX().x(width * 0.5))
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
          .attr("r", 25)
          .attr('fill', d => '#6baed6');
  
      node.append("svg:image")
          .attr('x', -20)
          .attr('y', -22)
          .attr('width', 40)
          .attr('height', 44)
          .attr("xlink:href", d => d.poster)
          .attr("clip-path", "inset(5% round 20px)")
  
      node.on('dblclick', async (e, d) => {
        await apiService.methods.fetchDetails(d.id)
        
        const entity = d.id.split("-")[0]
        const id = d.id.split("-")[1]

        if (entity === 'person') {
          store.existingGraphAnchors.person.push(id)
        } else {
          store.existingGraphAnchors.movies.push(id)
        }
        
        const pids = store.existingGraphAnchors.person
        const mids = store.existingGraphAnchors.movies

        await apiService.methods.fetchGraphData(pids, mids, 5)

        this.restart()
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
    }
  }
}