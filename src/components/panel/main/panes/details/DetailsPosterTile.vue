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
         v-bind:src="panelStates.detailsData.poster">
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
      toggleHighlightLock() {
        graphStates.lockedHighlights.togglePresence(this.$data.detailId)

        if (this.$data.graphNode.connections.classed("locked")) {
          this.$data.graphNode.connections.classed("locked", false)
        } else {
          this.$data.graphNode.connections.classed("locked", true)
        }
      },

      highlightNodes() {
        if (this.$data.target.node() == undefined) { return }
        this.$data.graphNode.nodeTransformer(this.$data.applyHighlight)
      },

      unhighlightNodes() {
        if (this.$data.target.node() == undefined) { return }
        if (this.$data.target.classed("poster-locked")) { return }
        if (graphStates.lockedHighlights.includes(this.$data.detailId)) { return }

        this.$data.graphNode.nodeTransformer(this.$data.removeHighlight)
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