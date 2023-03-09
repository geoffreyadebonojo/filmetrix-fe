<script setup>
  import * as d3 from 'd3'
  import { store } from '@/stores/store.js'

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

</style>

<script>
  export default {
    mounted () {
      d3.select("#graph-container").attr("viewBox", `-${window.innerWidth*2/3} -${window.innerHeight} ${window.innerWidth*2} ${window.innerHeight*2}`)
    }
  }
</script>
