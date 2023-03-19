<script setup>
  import * as d3 from 'd3'
  import { store } from '@/stores/store.js'
  import PanelComponent from './PanelComponent.vue'
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
  /* @keyframes rotateLabel {
    0% {
      transform: rotate(0deg) scale(1);
    }
    10% {
      transform: rotate(36deg) scale(1.1);
    }
    20% {
      transform: rotate(72deg) scale(1);
    }
    30% {
      transform: rotate(108deg) scale(1.1);
    }
    40% {
      transform: rotate(144deg) scale(1);
    }
    50% {
      transform: rotate(180deg) scale(1.1);
    }
    60% {
      transform: rotate(216deg) scale(1);
    }
    70% {
      transform: rotate(252deg) scale(1.1);
    }
    80% {
      transform: rotate(288deg) scale(1);
    }
    90% {
      transform: rotate(324deg) scale(1.1);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  } */

</style>

<script>
  export default {
    mounted () {
      d3.select("#graph-container")
      .attr("viewBox", `-${window.innerWidth*2/3} -${window.innerHeight} ${window.innerWidth*2} ${window.innerHeight*2}`)
    }
  }
</script>
