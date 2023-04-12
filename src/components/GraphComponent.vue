<script setup>
  import { 
    appStates,
    graphStates,
    store
  } from '@/stores/store.js'
  import { getTypes } from "@mixins/helpers"
  import api from "@mixins/api"
  import graph from "@mixins/graph"
</script>

<template>
  <div class="graph-container" v-bind:id="this.$attrs.type + '-graph-component'">
    <svg class="graph-container" v-bind:id="this.$attrs.type + '-graph-container'">
      <g class="outer-wrapper" v-bind:id="this.$attrs.type + '-outer-wrapper'"></g>
    </svg>
  </div>
</template>

<style lang="scss">
  .graph-container {
    display: block;
    width: 100%;
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
      transform: rotate(-360deg);
    }
  }
</style>

<script>
  export default {
    name: "GraphComponent",
    async created () {
      const gid = this.$route.query.gid

      if (gid == null) { return }
      
      await api.findBySlug(gid)

      // panelStates.detailsData.id = graphStates.existing.last()[0]

      let data
      let nodes = []
      let links = []

      graphStates.existing.forEach((d) => {
        data = graphStates.graphData[d[0]]
        nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
        links = links.concat(data.links.slice(0,d[1]))
      })

      // store.graphTypes = getTypes(nodes)
      // panelStates.currentFocus = 'details'

      graph.draw({
        nodes: nodes.uniqueById(),
        links: links,
        type: this.$attrs.type
      })
    },
    mounted () {
      // d3.select("#main-graph-container")
      // .attr("viewBox", `-${window.innerWidth*2/3} -${window.innerHeight} ${window.innerWidth*2} ${window.innerHeight*2}`)
    }
  }
</script>
