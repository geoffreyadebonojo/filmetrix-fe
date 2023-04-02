<script setup>
  import graph from "@/mixins/graph.js"
  import { store } from "@/stores/store.js"
  import * as d3 from "d3"
</script>

<template>
  <div class="graph-container" id="about-graph-component">
    <svg id="about-graph-container">
      <g id="about-outer-wrapper" class="outer-wrapper"></g>
    </svg>
  </div>
</template>

<script>
  export default {
    name: "AboutComponent"
  }
</script>
