<script setup>
  import * as d3 from "d3"
</script>

<template>
  <div class="graph-wrapper">
    <svg></svg>
  </div>
</template>

<style scoped>
  .graph-wrapper {
    color: #222222;
    width: 100vw;
    height: 100vh;
  }
  svg {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>

<script>
  export default {
    data () {
      return {
        data: {
          nodes: [
            { id: 0, letter: "F", charge: -2000, collide: 40, r: 50 },
            { id: 1, letter: "I", charge: -2000, collide: 40, r: 50 },
            { id: 2, letter: "L", charge: -2000, collide: 40, r: 50 },
            { id: 3, letter: "M", charge: -2000, collide: 40, r: 50 },
            { id: 4, letter: "E", charge: -2000, collide: 40, r: 50 },
            { id: 5, letter: "T", charge: -2000, collide: 40, r: 50 },
            { id: 6, letter: "R", charge: -2000, collide: 40, r: 50 },
            { id: 7, letter: "I", charge: -2000, collide: 40, r: 50 },
            { id: 8, letter: "X", charge: -2000, collide: 40, r: 50 },
          ]
          ,
          links: [
            { source: 0, target: 1, distance: 100 },
            { source: 0, target: 2, distance: 100 },
            { source: 0, target: 3, distance: 100 },
            { source: 0, target: 4, distance: 100 },
            { source: 0, target: 5, distance: 100 },
            { source: 0, target: 6, distance: 100 },
            { source: 0, target: 7, distance: 100 },
            { source: 0, target: 8, distance: 100 }
          ],
          forces: {
            charge: -3000,
            distance: 400,
            collide: 60,
            x: 0,
            y: 100
          }
        }
      }
    },
    mounted () {
      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      let links = this.data.links
      let nodes = this.data.nodes
      let simulation = d3.forceSimulation(nodes, links)
  
      const width = 800
      const height = 800

      const forces = this.data.forces
  
      simulation
        .force("link", d3.forceLink(links).id(d => d.id)
        .distance((l) => {
          return l.distance
        }))
        .force("charge", d3.forceManyBody().strength((d) => {
          return d.charge
        }))
        .force('collide', d3.forceCollide((d) => {
          return d.collide
        }))
        .force("center", d3.forceCenter(0, 0))
        .force('x', d3.forceX().x(width * 0.5))
        .force('y', d3.forceY().y(height * 0.5))
        // .force('x', d3.forceX().x(forces.x))
        // .force('y', d3.forceY().y(forces.y))
        .alpha(2)
        .alphaMin(0.2)
        .alphaTarget(0.0)
  
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
          .attr("source", (d) => {
            return `${d.source.letter}-${d.source.id}`
          })
          .attr("target", (d) => {
            return `${d.target.letter}-${d.target.id}`
          })
  
      const node = svg.append("g")
          .attr("class", "nodes")
          .attr("fill", "currentColor")
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .selectAll("g")
          .data(nodes)
          .join("g")
          .attr("id", (d) => {
            return d.letter + "-" + (d.id-1)
          })
  
      node.append("circle")
          .attr("stroke", "white")
          .attr("stroke-width", 1.5)
          .attr("r", (d) => {
            return d.r
          })
  
      node.append("text")
          .text(function(d){return d.letter})
          .attr("fill", "#FFF")
          .attr("stroke", "#FFF")
          .attr('y', (d)=>{
            return d.r/2
          })
          .attr("text-anchor", "middle")
          .style("font-family", "Dosis, sans-serif")
          .style("font-size", (d) => {
            return `${d.r * 3/2}px`
          })
  
      node.on('dblclick', (e, d) => {

        let id = `${d.letter}-${d.id}`
        let ids = nodes.map((d) => {return `${d.letter}-${d.id}`})
        let index = ids.indexOf(id)
  
        let n = nodes.splice(index,1)

        d3.select(`#${`${n[0].letter}-${n[0].id-1}`}`).remove()
        d3.select(`path[source=${n[0].letter}-${n[0].id}]`).remove()
        d3.select(`path[target=${n[0].letter}-${n[0].id}]`).remove()

        console.log(nodes)

        simulation.nodes(nodes)
        simulation.force("link", d3.forceLink(links).id(d => d.id)
        .distance((l) => {
          return 200
        }))
        .force("charge", d3.forceManyBody().strength((d) => {
          return -2000
        }))
        .force('collide', d3.forceCollide((d) => {
          return d.r + 10
        }))
        .force("center", d3.forceCenter(0, 0))
        .force('x', d3.forceX().x(width * 1))
        .force('y', d3.forceY().y(height * 0.1))
        // .force('x', d3.forceX().x(forces.x))
        // .force('y', d3.forceY().y(forces.y))
        .alpha(2)
        .alphaMin(0.2)
        .alphaTarget(0.0)
        .restart()
      })
  
      const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
  
      simulation.on("tick", () => {
          link.attr("d", linkArc);
          node.attr("transform", d => `translate(${d.x},${d.y})`);
      });
    }
  }

</script>

<style scoped>
</style>