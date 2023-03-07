<script setup>
  import * as d3 from 'd3'
</script>

<template>
  <svg id="graph-container">
    <g id="outer-wrapper"></g>
  </svg>
</template>

<style>

</style>

<script>
  export default {
    mounted () {
      d3.select("#graph-container").attr("viewBox", `-${window.innerWidth*2/3} -${window.innerHeight} ${window.innerWidth*2} ${window.innerHeight*2}`)
    }
  }
</script>
