<script setup>
  import api from '@mixins/api.js'
  import graph from "@/mixins/graph.js"
  import { store } from "@/stores/store.js"
  import * as d3 from "d3"
  import aboutGraph from "@/mixins/aboutGraph"
</script>

<template>
  <div class="graph-container" id="about-graph-component">
    <svg v-if="store.displayingAbout" id="about-graph-container" viewBox="190 120 400 400">
      <g id="about-outer-wrapper" class="outer-wrapper"></g>
    </svg>
  </div>
</template>

<script>
  export default {
    name: "AboutComponent",
    data () {
      return {}
    },
    updated () {
      aboutGraph.draw()
    }
  }
</script>

<style scoped lang="scss">
  #about-graph-container {
    width: 0px;
    // width:100%;
    height: 100vh;
    position: absolute;
    top: 0px;
    right: 0px;
    background: $graph-body-grey;
  }
</style>