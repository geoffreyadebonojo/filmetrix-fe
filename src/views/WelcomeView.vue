<script setup>
  import * as d3 from 'd3'
</script>

<template>
  <div class="graph-wrapper">
    <svg></svg>
    <div id="start-button">
      <router-link id="start-link" to="/graph">
        START
      </router-link>
    </div>
  </div>
</template>

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
          links2: [
            { source: 0, target: 1, distance: 200 },
            { source: 1, target: 2, distance: 200 },
            { source: 2, target: 3, distance: 200 },
            { source: 3, target: 4, distance: 200 },
            { source: 4, target: 5, distance: 200 },
            { source: 5, target: 6, distance: 200 },
            { source: 6, target: 7, distance: 200 },
            { source: 7, target: 8, distance: 200 },
            { source: 8, target: 0, distance: 200 }
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
      let links = this.data.links
      let nodes = this.data.nodes
      let simulation = d3.forceSimulation(nodes, links)
  
      const width = 1600
      const height = 1600

      simulation
        .force("link", d3.forceLink(links).id(d => d.id))
        .distance(0)
        .force("charge", d3.forceManyBody().strength(-2000))
        .force('collide', d3.forceCollide(100))
        .force("center", d3.forceCenter(0, 0))
        .alpha(0.7)
        .alphaMin(0.3)
        .alphaTarget(0.4) 
  
      d3.select("svg").html("")
      const svg = d3.select("svg")
      .attr("viewBox", [-8000, -8000, 16000, 16000])

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

      const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
  
      let sc = 1

      let vbx = (-width/2)/ sc
      let vby = (-height/2)/ sc
      let vbxs = width/ sc
      let vbys = width/ sc

      d3.select("svg")
      .transition().duration(2000)
      .attr("viewBox", [vbx, vby, vbxs, vbys])

      simulation.on("tick", () => {
          link.attr("d", linkArc);
          node.attr("transform", d => `translate(${d.x},${d.y})`);
      });
    }
  }
</script>

<style lang="scss">
  .graph-wrapper {
    color: $graph-body-grey;
    width: 100vw;
    height: 100vh;
    display: grid;
  }
  svg {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  #start-button {
    height: 250px;
    margin: auto;
    
    #start-link {      
      color: white;
      font-family: $global-font;
      line-height: 1em;
      font-weight: 900;
      font-size: 50px;
      color: white;
      text-shadow: 1px 0px black;
      text-decoration: none;
    }
  }
</style>