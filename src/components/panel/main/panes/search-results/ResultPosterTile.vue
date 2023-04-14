<script setup>
  import graph from "@mixins/graph"
  import api from "@mixins/api"
  import {
    panelStates
  } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div class="poster-tile"
       tabindex="0"
       v-bind:id="this.$attrs.result.id"
       :key="this.$attrs.result.id"
       @dblclick="fetchNodesAndDetails(this.$attrs.result)"
       @keypress="fetchNodesAndDetails(this.$attrs.result)">  
    <img v-bind:src="this.$attrs.result.poster"/>
    <div>{{this.$attrs.result.name}}</div>
  </div>
</template>

<script>
  export default {
    name: 'ResultPosterTile',
    data () {
      return {
        onGraph: false,
        posterElem: null
      }
    },
    mounted () {
      const transitionTimer = 800
      d3.select(`#${this.$attrs.result.id}`).call(
        d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      )

      function dragstarted(e) {
        const z = d3.select(this)

        z.select("img")
        .transition().duration(0)
        .style("transform", "scale(0.7)")
        
        z.transition().duration(200)
        .style("width", "100px")
        .style("height", "100px")
        .style("border-radius", "50%")
        .style("border", "1px solid")
        .style("padding", "16px")
    
        z.select("div").style("display", "none") 
      }

      function dragged(e) {
        const z = d3.select(this)
        
        z.classed("fixed", true)
        const x = e.sourceEvent.clientX - z.node().clientWidth/2
        const y = e.sourceEvent.clientY - z.node().clientHeight/2
        z.style("top", `${y}px`).style("left", `${x}px`)
      }
      
      function dragended(e) {
        const z = d3.select(this)
        
        const cx = e.sourceEvent.clientX - z.node().clientWidth/2
        const gw = window.innerWidth-panelStates.width
        
        if (cx < gw) {
          console.log("drop!")
          z.transition().duration(500).style("transform", "scale(0)")
        }

        z.style("left", "0px")
        .style("top", "0px")
        .classed("fixed", false)

        z.select("img")
        .transition().duration(200)
        .style("transform", "scale(1)")
        .style("border-radius", "8px")

        z.transition().duration(200)
        .style("width", "73px")
        .style("height", "109px")
        .style("border-radius", "8px")
        .style("border", "1px solid")
        .style("padding", "unset")

        z.select("div").style("display", "block")
      }
    },
    methods: {
      async fetchNodesAndDetails(result) {
        panelStates.isOpen = false

        await api.fetchDetails(result.id)

      // const graph = new Graph()
      // const graph.draw()
      // ???
      
        await graph.callForNodes(result, "main")
      }
    }
  }
</script>

<style scope lang="scss">
  .fixed {
    position: fixed;
  }

  .poster-tile {
    @include poster-tile;

    img {
      transform-origin: 35px 0px;
    }
  }

</style>