<script setup>
  import { 
    appStates,
    graphStates,
    panelStates,
    userStates,
    store 
  } from '@/stores/store.js'
  import api from "@mixins/api"
  import manageGlobalState from "@mixins/manageGlobalState"
  import * as d3 from 'd3'
</script>

<template>
  <div v-if="userStates.loggedIn"
       class="graph-control-buttons"
       id="clear-graph-button"
       @click="clear()"> 
    <p id="clear-graph-flash"></p>
  </div>
</template>

<script>
  export default {
    name: "ClearGraphButton",
    methods: {
      async clear() {
        manageGlobalState.clearGraph()

        d3.select("#main-inner-wrapper").html("")
        d3.select("#clear-flash").html('cleared')
          .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
          .transition().duration(1000).style("opacity", 0).style("color", "white")
      }
    }
  }
</script>

<style lang="scss">
  #clear-graph-button {
    background-image: url("/clear-graph.svg");
    background-size: contain;

    top: 6.6vh;
    left: -29px !important;
    width: 20px;
    height: 20px;
    opacity: 0.5;
    
    &:hover {
      opacity: 1;
    }

    #clear-graph-flash {
      right: 71px;
    }
  }
</style>