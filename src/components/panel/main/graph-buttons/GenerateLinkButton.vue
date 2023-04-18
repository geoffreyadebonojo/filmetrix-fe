<script setup>
  import { 
    graphStates,
    store 
  } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from 'd3'
</script>

<template>
  <div class="graph-control-buttons"
       id="link-to-button"
       @click="generateLinkToShare()"> 
    <p id="link-to-flash"></p>
  </div>
</template>

<script>
  export default {
    name: "GenerateLinkButton",
    methods: {
      async generateLinkToShare () {
        
        await api.saveGraph(graphStates.existing).then((response) => {
          navigator.clipboard.writeText( response.shareUrl );
          console.log('Content copied ', response.shareUrl, ' to clipboard');
        })

        
        d3.select("#link-to-flash").html('copied')
          .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
          .transition().duration(1000).style("opacity", 0).style("color", "white")
      }
    }
  }
</script>

<style scoped lang="scss">
  #link-to-button {
    background-image: url("/link-alt.svg");
    background-size: contain;
    top: 7.9vh;
    left: -28px !important;
    width: 20px;
    height: 20px;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }

    #link-to-flash {
      right: 66px;
    }
  }
</style>