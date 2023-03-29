<script setup>
  import { store } from '@/stores/store.js'
  import api from "@mixins/api"
  import graph from "@mixins/graph"
  import helpers from "@mixins/helpers"
  import * as d3 from 'd3'
</script>

<template>
  <svg id="graph-container">
    <g id="outer-wrapper"></g>
  </svg>
</template>

<style lang="scss">
  #graph-container {
    background: $graph-body-grey;
    width: 100%;
    height: 100vh;
    display: flex;
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
    mounted () {
      d3.select("#graph-container")
      .attr("viewBox", `-${window.innerWidth*2/3} -${window.innerHeight} ${window.innerWidth*2} ${window.innerHeight*2}`)
    }
  }
</script>
