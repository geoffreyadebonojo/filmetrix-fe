<script setup>
  import PanelComponent from '../components/PanelComponent.vue'
  import Graph from '../components/Graph.vue'
  // import AboutGraph from '../components/about/AboutGraph.vue'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="viewer-body">
    <!-- <div id="instructions">Instruction</div> -->
    <Graph />
    <!-- <PanelComponent /> -->
    <!-- <AboutGraph v-if="store.aboutUs"></AboutGraph> -->
  </div>
</template>

<style scoped>
  #viewer-body {
    height: 100vh;
    overflow: hidden;
  }
  #instructions {
    position : absolute;
    top: 40%;
    right: 0%;
    z-index: 2
  }
</style>

<script>
  export default {
    components: {
      Graph,
      PanelComponent//,
      // AboutGraph
    },
    data () {
      return {
        charge: -1000,
        count: 5
      }
    }
    // mounted () {
    //   d3.select("#viewer-body").on("click", (d) => {
    //     let sb = d3.select("#search-text")
    //     sb
    //     .style("background", "lightblue")
    //     .transition().duration(200)
    //     .style("background", "white")
    //     .ease(d3.easeCircleIn)
    //     .node().focus()
    //   })
    // }
  }
</script>
