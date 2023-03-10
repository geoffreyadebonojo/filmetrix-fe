<script setup>
  import PanelComponent from '../components/PanelComponent.vue'
  import Graph from '../components/Graph.vue'
  // import AboutGraph from '../components/about/AboutGraph.vue'

  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="viewer-body">
    <Graph />
    <!-- <PanelComponent /> -->
    <!-- <AboutGraph v-if="store.aboutUs"></AboutGraph> -->
  </div>
</template>

<style scoped>
  #viewer-body {
    height: 100vh;
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
  }
</script>
