<script setup>
  import * as d3 from 'd3'
  import { useRouter, useRoute } from 'vue-router'

</script>

<template>
  <svg id="about-graph-container">
    <g id="about-outer-wrapper"></g>
  </svg>
</template>

<style>
  #about-graph-container {
    background: #222222;
    width: 100%;
    height: 100vh;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1
  }
</style>

<script>
  export default {
    mounted () {
      d3.select("#about-graph-container").attr("viewBox", `-${window.innerWidth*2/3} -${window.innerHeight} ${window.innerWidth*2} ${window.innerHeight*2}`)

      const nodes = [
        {
          id: 'geoff',
          name: "Geoff",
          poster: "src/assets/geoff-pixel.png",
          type: []
        },
        {
          id: 'pierce',
          name: "Pierce",
          poster: "src/assets/pierce-pixel.png",
          type: []
        },
        {
          id: "filmetrix",
          name: "Filmetrix",
          poster: "",
          type: []
        }
      ]
      const links = [
        {
          source: "filmetrix",
          target: 'geoff',
          roles: ['Software Engineer']
        },
        {
          source: "filmetrix",
          target: "pierce",
          roles: ['Product Designer']
        }
      ]

      var simulation = d3.forceSimulation(nodes, links)
      simulation
        .force("link", d3.forceLink(links).id(d => d.id).distance(300))
        .force("charge", d3.forceManyBody().strength(-1500))
        .force('collide', d3.forceCollide(50))
        .force("center", d3.forceCenter(window.innerWidth/2, window.innerHeight/5))
        .alpha(1)
        .alphaMin(0.2)
        .alphaTarget(0.01)

      const outerWrapper = d3.select("#about-outer-wrapper")
      const viewerBody = d3.select("#about-graph-container")
      const innerWrapper = d3.select("#about-outer-wrapper").append("g").attr("id", "about-inner-wrapper")

      const link = innerWrapper.append("g")
          .attr("class", "links")
          .selectAll("path")
          .data(links)
          .join("path")
          .attr("class", "link")
          .attr("source", (d => d.source.id))
          .attr("target", (d => d.target.id))
          .attr("stroke", "#7A7978")
          .attr("stroke-width", "1px")
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
          .attr("stroke-width", 1.5)
          .attr("r", 50)
          .attr('fill', '#222222')
          .attr("vector-effect", "non-scaling-stroke")
  
      node.append("svg:image")
          .attr('x', -35.5)
          .attr('y', -35.5)
          .attr('width', 70)
          .attr('height', 70)
          .attr("xlink:href", d => d.poster)
          .attr("clip-path", (d) => {
            return `inset(0% 12px round 8px)`
          })

      simulation.on("tick", () => {
        link.attr("d", (d) => {
          return `M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
        })
        node.attr("transform", d => `translate(${d.x},${d.y})`); //scale(${(i/20)})`);
      })
      .on("end", () => {
        node.transition().duration(500).delay(100).ease(d3.easeBounceOut).attr("transform", (d) => {
          return `translate(${d.x},${d.y})`//scale(0.9)`
        })
      })
    }
  }
</script>
