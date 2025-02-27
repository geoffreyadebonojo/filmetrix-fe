<script setup>
  import { 
    userStates,
    graphStates
  } from '@/stores/store.js'
  import api from "@mixins/api"
  import manageGlobalState from "@mixins/manageGlobalState"
  import * as d3 from 'd3'
</script>

<template>
  <div class="graph-control-buttons"
       id="save-graph-button"
       @click="update()"> 
    <p id="save-flash"></p>
  </div>
</template>

<script>
  export default {
    name: "ClearGraphButton",
    methods: {
      async update() {
        const lockedNodes = JSON.parse(localStorage.getItem("lockedNodes"))

        await api.updateGraph(
          this.$route.query.gid,
          graphStates.existing, 
          lockedNodes
        ).then((response) => {
          if (response) {
            navigator.clipboard.writeText( response.shareUrl );
            console.log('Graph updated ', response.shareUrl, ' to clipboard'); 

            d3.select("#save-flash").html('updated')
              .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
              .transition().duration(1000).style("opacity", 0).style("color", "white")
            } else {
            console.log('Something went wrong. Probably your fault.');
            d3.select("#link-to-flash").html('error!')
              .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
              .transition().duration(1000).style("opacity", 0).style("color", "white")
          }
        })
        
      }
    }
  }
</script>

<style lang="scss">
  #save-graph-button {
    background-image: url("/disk-empty-white.svg");
    background-size: contain;

    top: 11.6vh;
    left: -29px !important;
    width: 20px;
    height: 20px;
    opacity: 0.5;
    display: block;
    
    &:hover {
      opacity: 1;
    }

    #save-graph-flash {
      right: 71px;
    }
  }
</style>