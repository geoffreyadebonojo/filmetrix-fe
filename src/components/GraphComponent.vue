<script setup>
  import { store } from '@/stores/store.js'
  import api from "@mixins/api"
  import graph from "@mixins/graph"
  import helpers from "@mixins/helpers"
  import * as d3 from 'd3'
</script>

<template>
  <div class="graph-container" id="graph-component">
    <svg id="main-graph-container">
      <g id="main-outer-wrapper" class="outer-wrapper"></g>
    </svg>
  </div>
</template>

<style lang="scss">
  #main-graph-container {
    background: $graph-body-grey;
    display: block;
    width: 100%;
    // height: 100vh;
    // display: flex;
  }

  .inst {
    animation-name: rotateLabel;
    animation-duration: 8s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .node:hover {
    cursor: $cursor;
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
    data () {
      return {
        settings: {
          graphType: "mainGraphType",
          containerId: "main-graph-container",
          outerWrapperId: "main-outer-wrapper",
          innerWrapperId: "main-inner-wrapper"
        }
      }
    },
    async created () {
      const gid = this.$route.query.gid

      if (gid == null) { return }
      
      await api.findBySlug(gid)

      store.currentDetailId = store.existing.last()[0]

      let data
      let nodes = []
      let links = []

      store.existing.forEach((d) => {
        data = store.graphData[d[0]]
        nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
        links = links.concat(data.links.slice(0,d[1]))
      })

      store.graphTypes =  helpers.getTypes(nodes)
      // store.currentFocus = 'details'

      graph.draw({
        nodes: nodes.uniqueById(),
        links: links,
        settings: this.$data.settings
      })
    },
    mounted () {
      // d3.select("#main-graph-container")
      // .attr("viewBox", `-${window.innerWidth*2/3} -${window.innerHeight} ${window.innerWidth*2} ${window.innerHeight*2}`)
    }
  }
</script>
