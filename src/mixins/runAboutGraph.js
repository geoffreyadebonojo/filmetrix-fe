import * as d3 from 'd3'
import { aboutUsData } from '@/mixins/aboutUsData.js'

export default {
  methods: {
    draw() {
      const nodes = aboutUsData.nodes
      const links = aboutUsData.links

      var simulation = d3.forceSimulation(nodes, links)
      simulation
        .force("link", d3.forceLink(links).id(d => d.id).distance(220))
        .force("charge", d3.forceManyBody().strength(200))
        .force('collide', d3.forceCollide(d => d.c))
        .force("center", d3.forceCenter(window.innerWidth/2, window.innerHeight/5))
        .alpha(1)
        .alphaTarget(0.99999)

      const innerWrapper = d3.select("#about-outer-wrapper")
          .append("g")
          .attr("id", "about-inner-wrapper")

      const link = innerWrapper.append("g")
          .attr("class", "links")
          .selectAll("path")
          .data(links)
          .join("path")
          .attr("class", "link")
          .attr("source", (d => d.source.id))
          .attr("target", (d => d.target.id))
          .attr("stroke", "#7A7978")
          .attr("stroke-width", 1.5)
          .attr("vector-effect", "non-scaling-stroke")

      const node = innerWrapper.append("g")
          .attr("class", "nodes")
          .attr("fill", "currentColor")
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .selectAll("g")
          .data(nodes)
          .join("g")
          .attr("class", (d) => {
            return 'node ' + d.type.join(" ")
          })
          .attr("id", d => d.id)

      ///////////////////////////////////////

      node.append("circle")
          .attr("stroke", "#7A7978")
          .attr("stroke-width", 2)
          .attr("r", d => d.r)
          .attr('fill', '#222222')
          .attr("vector-effect", "non-scaling-stroke")

      node.append("svg:image")
          .attr('x', d => -d.i )
          .attr('y', d => -d.i )
          .attr('width', d => d.i*2)
          .attr('height', d => d.i*2)
          .attr("xlink:href", d => d.poster)

      node.on("click", (_e, d) => {
        d3.select("#about-poster").attr("src", d.poster)
        .style("width", () => {
          if (d.name == "Filmetrix") {
            return "120px"
          } else {
            return "220px"
          }
        })
        .style("margin", () => {
          if (d.name == "Filmetrix") {
            // return "0 0 95px 95px"
          // } else {
            return "40px 0 0 65px"
          }
        })

        d3.select("#about-name").html(d.name)
        // .transition().duration(300)
        .style("transform", "scale(1)")
        .style("left", "0px")
        d3.select("#about-description").html(d.description)
      })

      simulation.on("tick", () => {
        link.attr("d", (d) => {
          return `M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
        })
        node.attr("transform", d => `translate(${d.x},${d.y})`);
      })
    }
  }
}