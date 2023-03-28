<script setup>
  import { store } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from 'd3'
</script>

<template>
  <p id="save-flash"></p>
  <img src="/disk-empty-white.svg" 
       class="graph-control-buttons unlocked" 
       id="save-button"
       @click="this.saveGraph()">
  <img src="/center-graph-icon.svg" 
        class="graph-control-buttons unlocked" 
        id="centering-button" >
</template>

<script>
  export default {
    name: "GraphButtonsComponent",
    data () {
      return {
        attrs: {
          id: `${Math.round(Math.random()*10000000)}`,
          isSaved: false,
          existing: []
        }
      }
    },
    methods: {
      saveGraph () {
        const saveButton = d3.select("#save-button")
        const id =  this.$data.attrs.id  
        const flash = d3.select("#save-flash")

        if (saveButton.classed("locked")) {
          saveButton.classed("locked", false).classed("unlocked", true)
          
          delete store.savedGraphs[id]

          flash.html("removed")
          .style("transform", "translateX(-20px)")
          .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
          .transition().duration(1000).style("color", "white").style("opacity", 0)

        } else {
          saveButton.classed("unlocked", false).classed("locked", true)
          
          this.$data.attrs.isSaved = true
          this.$data.attrs.existing = store.existing.map(d => d[0])
          store.savedGraphs[id] = this.$data.attrs

          flash.html("saved")
          .style("transform", "translateX(0px)")
          .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
          .transition().duration(1000).style("color", "white").style("opacity", 0)
        }

        // localStorage.setItem("savedGraph", store.savedGraphs[id].existing.join(","))
        localStorage.setItem("savedGraph", JSON.stringify(store.existing))
      }
    }
  }
</script>

<style scoped lang="scss">
  .graph-control-buttons {
    background: none;
    display: none;
    width: 20px;
    position: absolute;
    z-index: 1;
    opacity: 0.5;
    cursor: pointer;
  }

  .unlocked {
    &:hover {
      opacity: 1;
      transition-property: opacity;
      transition-duration: 0.25s;
    }
    transition-property: opacity;
    transition-duration: 0.25s;
  }

  .locked {
    opacity: 1;
  }

  #centering-button {
    bottom: 10px;
  }
  
  #save-button {
    top: 2.9vh;
    transform: translateX(2px)
  }

  #save-flash {
    grid-area: flash;
    opacity: 0;
    text-transform: uppercase;
    font-family: 'Dosis', sans-serif;
    font-weight: bold;
    // font-size: 40px;
    text-align: center;
    position: absolute;
    left: -105px;
    top: 2.9vh;
    color: white;
  }
</style>