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
       v-bind:class="store.isLocked ? 'locked' : 'unlocked'" 
       id="lock-button"
       @click="toggleLock($event)">
    <p id="lock-flash"></p>
  </div>
</template>

<script>
  export default {
    name: "LockButton",
    data () {
      return {
        attrs: {
          id: `${Math.round(Math.random()*10000000)}`,
          existing: [],
          lockButton: null,
          flash: null
        }
      }
    },

    mounted () {
      this.$data.lockButton = d3.select("#lock-button")
      this.$data.flash = d3.select("#lock-flash")
    },
    
    methods: {
      toggleLock (event) {
        const graphIsLocked = event.target.classList.contains('locked')

        if (graphIsLocked) {
          this.$data.lockButton.classed("locked", false).classed("unlocked", true)
          this.unlock()
          
        } else {
          this.$data.lockButton.classed("locked", true).classed("unlocked", false)
          this.lock()
        }
      },

      lock() {
        this.$data.attrs.existing = graphStates.existing.map(d => d[0])
        
        store.isLocked = true
        store.savedGraphs[this.$data.attrs.id] = this.$data.attrs

        localStorage.setItem("lockedGraph", JSON.stringify(graphStates.existing))

        this.$data.flash.html("locked")
          .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
          .transition().duration(1000).style("opacity", 0).style("color", "white")
        
      }, 

      unlock() {
        delete store.savedGraphs[this.$data.attrs.id]

        store.isLocked = false

        localStorage.setItem("lockedGraph", JSON.stringify([]))

        this.$data.flash.html("unlocked")
          .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
          .transition().duration(1000).style("opacity", 0).style("color", "white")
      }
    }
  }
</script>

<style scoped lang="scss">
  .unlocked {
    background-image: url("/lock-open.svg");
    background-size: contain;
    opacity: 0.65;
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

  #lock-flash {
    top: 3px;
    right: 75px;
  }
</style>