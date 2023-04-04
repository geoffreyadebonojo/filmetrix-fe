<script setup>
  import { store } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from 'd3'
</script>

<template>
  <div v-bind:class="store.isLocked ? 'graph-control-buttons locked' : 'graph-control-buttons unlocked'" 
       id="lock-button"
       @click="lockGraph()">
    <p id="lock-flash"></p>
  </div>

  <div class="graph-control-buttons"
       id="save-button"
       @click="save()"> 
    <p id="save-flash"></p>
  </div>

  <div class="graph-control-buttons" id="centering-button"></div>
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
      lockGraph () {
        const id = this.$data.attrs.id  
        const lockButton = d3.select("#lock-button")
        const flash = d3.select("#lock-flash")

        if (lockButton.classed("locked")) {
          lockButton.classed("locked", false).classed("unlocked", true)
          store.isLocked = false
          delete store.savedGraphs[id]
          flash.html("unlocked")
            .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
            .transition().duration(1000).style("opacity", 0).style("color", "white")
          localStorage.setItem("lockedGraph", JSON.stringify([]))
          
        } else {
          lockButton.classed("unlocked", false).classed("locked", true)
          store.isLocked = true
          this.$data.attrs.existing = store.existing.map(d => d[0])
          store.savedGraphs[id] = this.$data.attrs
          flash.html("locked")
            .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
            .transition().duration(1000).style("opacity", 0).style("color", "white")
          localStorage.setItem("lockedGraph", JSON.stringify(store.existing))
        }
      },
      
      async save () {
        const saveButton = d3.select("#save-button")
        const flash = d3.select("#save-flash")

        const response = await api.saveGraph(store.existing)
        navigator.clipboard.writeText( response.data.saveGraph.shareUrl );
        console.log('Content copied ', response.data.saveGraph.shareUrl, ' to clipboard');
        
        flash.html('copied!')
          .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
          .transition().duration(1000).style("opacity", 0).style("color", "white")
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
  
  #lock-button {
    top: 2.9vh;
    width: 25px;
    height: 24px;
  }
  
  #save-button {
    background-image: url("/disk-empty-white.svg");
    top: 7.9vh;
    left: -28px !important;
    width: 20px;
    height: 20px;
    opacity: 0.5;
    
    &:hover {
      opacity: 1;
      background-image: url("/disk-empty-blue.svg");
    }
  }

  #lock-flash, #save-flash {
    opacity: 1;
    text-transform: uppercase;
    font-family: $global-font;
    font-weight: bold;
    text-align: center;
    position: absolute;
    right: 30px;
    color: white;
  }

  #lock-flash {
    top: 3px;
  }

  #centering-button {
    background-image: url("/center-graph-icon.svg");
    background-size: contain;
    bottom: 10px;
    width: 20px;
    height: 20px;
  }
</style>