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
        graphNode: new GraphNode(panelStates.detailsData.id)
      }
    },
    
    methods: {
      flashNode() {
        const cn = new GraphNode(panelStates.detailsData.id)
        cn.node.classed("poster-highlight", true)
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