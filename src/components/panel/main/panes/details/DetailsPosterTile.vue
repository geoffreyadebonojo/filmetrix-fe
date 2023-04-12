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
         v-bind:class="graphStates.lockedHighlights.includes(this.$data.detailId) ? 'poster-locked' : 'poster-unlocked'"
         v-bind:id="this.$data.detailId + 'detail-poster'"
         v-bind:src="panelStates.detailsData.poster"
         @click="toggleHighlightLock()"
         @mouseenter="highlightNodes()"
         @mouseleave="unhighlightNodes()"/>
</template>

<script>
  export default {
    name: 'DetailsPosterTile',
    data () {
      return {
        detailId: panelStates.detailsData.id,
        graphNode: new GraphNode(panelStates.detailsData.id),
        applyHighlight: ["scale(1.05)", "aliceblue", "white"],
        removeHighlight: ["scale(1)", "#7A7978", "none"],
      }
    },

    mounted () {
      this.$data.target = d3.select(`#${this.$data.detailId}`)
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

        this.$data.graphNode.nodeTransformer(...this.$data.applyHighlight)
        this.$data.graphNode.linkHighlighter()
      },

      unhighlightNodes() {
        if (this.$data.target.node() == undefined) { return }
        if (this.$data.target.classed("poster-locked")) { return }
        if (graphStates.lockedHighlights.includes(this.$data.detailId)) { return }

        this.$data.graphNode.nodeTransformer(...this.$data.removeHighlight)
        this.$data.graphNode.linkUnhighlighter()
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
  
  .poster-unlocked {
    &:hover {
      box-shadow: 0em 0em 5px 5px rgb(240 248 255 / 5%);
      cursor: $cursor;
    }
  }  
  
  .poster-locked {
    box-shadow: 0em 0em 5px 5px rgba(240, 248, 255, 0.35);
    &:hover {
      cursor: $cursor;
    }
  }
</style>