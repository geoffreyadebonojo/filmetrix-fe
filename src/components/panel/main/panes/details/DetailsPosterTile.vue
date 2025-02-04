<script setup>
  import GraphNode from '@models/GraphNode'
  import graph from "@mixins/graph"
  import api from "@mixins/api"
  import {
    graphStates,
    panelStates
  } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
    <img class="poster"
         v-bind:id="$data.detailId + '-detail-poster'"
         v-bind:src="panelStates.detailsData.poster"
         @pointerdown="flashNode()"
         @pointerup="unflashNode()">
</template>

<script>
  export default {
    name: 'DetailsPosterTile',
    data () {
      return {
        detailId: panelStates.detailsData.id,
        graphNode: new GraphNode(panelStates.detailsData.id),
        applyHighlight: {
          scale: 1.05,
          stroke: "aliceblue",
          textStroke: "white"
        },
        removeHighlight: {
          scale: 1,
          stroke: "#7A797",
          textStroke: "none"
        }

      }
    },
    
    methods: {
      flashNode() {
        const cn = new GraphNode(panelStates.detailsData.id)
        cn.node.classed("poster-highlight", true)

        // STRUGGLING
        // const zoom = d3.zoom().on('zoom', (e) => {
        //   d3.select("#main-outer-wrapper").attr("transform", e.transform)
        // })
        // .on('end', (e) => {
        //   localStorage.setItem('currentZoom', e.transform)
        // })
        
        // let zoomLevel = 2.5
        // let node = d3.select(`#${panelStates.detailsData.id}`)
        // let d = node.data()[0]
        // let centering = { x: window.innerWidth *  0.5, 
        //                   y: window.innerHeight * 0.4 }

        // node.classed("poster-highlight", true)
        // d3.select("#viewer-body").transition().ease(d3.easeQuadOut).duration(500).call(
        //   zoom.transform, 
        //   d3.zoomIdentity.translate(centering.x, centering.y)
        //                   .scale(zoomLevel)
        //                   .translate(-d.x, -d.y))
      },
      
      unflashNode() {
        const cn = new GraphNode(panelStates.detailsData.id)
        cn.node.classed("poster-highlight", false)
      }
    }
  }
</script>

<style scope lang="scss">
  .poster {
    grid-area: poster;
    width: 79px;
    border-radius: 8px;
  }
</style>