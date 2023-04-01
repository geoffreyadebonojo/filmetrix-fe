<script setup>
  import PanelComponent from '@components/PanelComponent.vue'
  import GraphComponent from '@components/GraphComponent.vue'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="viewer-body">
    <graph-component></graph-component>
    <panel-component></panel-component>
    <div id="about-graph-container"></div>
  </div>
</template>

<script>
  export default {
    name: 'GraphView',
    components: {
      GraphComponent,
      PanelComponent
    },
    data () {
      return {
        charge: -1000,
        count: 5,
        currentZoom: 100,
        increment: 0
      }
    },
    mounted () {
      let isMobile = /Android|iPhone/i.test(navigator.userAgent)
      if (isMobile) {
        d3.select('#zoom-buttons').style('display', 'flex')
      } 
    }
  }
</script>

<style scoped lang="scss">
  #about-graph-container {
    width: 0px;
    height: 100vh;
    position: absolute;
    top: 0px;
    right: 0px;
    background: $graph-body-grey;
  }

  /* #zoom-buttons {
    display: none;
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 5;
    width: 70px;
    justify-content: space-between;
  } */

  #zoom-buttons > img {
    width: 30px;
    height: 30px;
    background: white;
    border-radius: 21%;
  }
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