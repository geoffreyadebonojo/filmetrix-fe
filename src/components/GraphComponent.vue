<script setup>
  import { store } from '@/stores/store.js'
  import api from "@mixins/api"
  import graph from "@mixins/graph"
  import * as d3 from 'd3'
</script>

<template>
  <svg id="graph-container">
    <g id="outer-wrapper"></g>
  </svg>
</template>

<style>
  #graph-container {
    background: #222222;
    width: 100%;
    height: 100vh;
    display: flex;
  }
  .nodes:hover {
    cursor: pointer
  }

  .inst {
    animation-name: rotateLabel;
    animation-duration: 8s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  @keyframes rotateLabel {
    0% {
      transform: rotate(0deg);
    } 
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<script>
  export default {
    name: "GraphComponent",
    async mounted () {
      d3.select("#graph-container")
      .attr("viewBox", `-${window.innerWidth*2/3} -${window.innerHeight} ${window.innerWidth*2} ${window.innerHeight*2}`)

      const saved = localStorage.getItem("savedGraph")

      if (saved !== null) {
        store.existing = JSON.parse(saved)
        await api.fetchGraphData(
          store.existing.unique().map(d => d[0])
        )

        let data
        let nodes = []
        let links = []

        store.existing.forEach((d) => {
          data = store.graphData[d[0]]
          nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
          links = links.concat(data.links.slice(0,d[1]))
        })

        // store.graphTypes =  helpers.getTypes(nodes)
        // store.currentFocus = 'details'

        graph.methods.draw({
          nodes: nodes.uniqueById(),
          links: links
        })      
      }
    }
  }
</script>
