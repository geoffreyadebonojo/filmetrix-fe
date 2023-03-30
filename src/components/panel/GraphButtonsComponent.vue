<script setup>
  import { store } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from 'd3'
</script>

<template>
  <p id="save-flash"></p>
  <div v-bind:class="store.isSaved ? 'graph-control-buttons locked' : 'graph-control-buttons unlocked'" 
       id="save-button"
       @click="this.saveGraph()"></div>
  <img src="/center-graph-icon.svg" 
       class="graph-control-buttons" 
       id="centering-button" >
</template>

<script>
  export default {
    name: "GraphButtonsComponent",
    data () {
      return {
        attrs: {
          id: `${Math.round(Math.random()*10000000)}`,
          existing: []
        }
      }
    },
    methods: {
      saveGraph () {
        const id = this.$data.attrs.id  
        const saveButton = d3.select("#save-button")
        const flash = d3.select("#save-flash")

        if (saveButton.classed("locked")) {
          saveButton.classed("locked", false).classed("unlocked", true)

          store.isSaved = false
          
          delete store.savedGraphs[id]

          flash.html("unlocked")
          .style("transform", "translateX(-20px)")
          .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
          .transition().duration(1000).style("color", "white").style("opacity", 0)
          localStorage.setItem("savedGraph", JSON.stringify([]))
          
        } else {
          saveButton.classed("unlocked", false).classed("locked", true)
          
          store.isSaved = true

          this.$data.attrs.existing = store.existing.map(d => d[0])
          store.savedGraphs[id] = this.$data.attrs
          
          flash.html("locked")
          .style("transform", "translateX(0px)")
          .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
          .transition().duration(1000).style("color", "white").style("opacity", 0)
          localStorage.setItem("savedGraph", JSON.stringify(store.existing))
        }
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
    cursor: $cursor;

    &:hover {
      opacity: 1;
      transition-property: opacity;
      transition-duration: 0.25s;
    }
    transition-property: opacity;
    transition-duration: 0.25s;
  }

  .unlocked {
    background-image: url("/lock-open.svg");
    background-size: contain;
  }

  .locked {
    background-image: url("/lock-closed.svg");
    background-size: contain;
    opacity: 1;
  }
  
  #centering-button {
    bottom: 10px;
  }
  
  #save-button {
    top: 2.9vh;
    width: 25px;
    height: 24px;
  }

  #save-flash {
    grid-area: flash;
    opacity: 0;
    text-transform: uppercase;
    font-family: $global-font;
    font-weight: bold;
    // font-size: 40px;
    text-align: center;
    position: absolute;
    left: -112px;
    top: 3.3vh;
    color: white;
  }
</style>