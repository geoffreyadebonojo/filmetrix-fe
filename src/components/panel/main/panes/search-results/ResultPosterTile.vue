<script setup>
  import graph from "@mixins/graph"
  import api from "@mixins/api"
  import {
    panelStates
  } from '@/stores/store.js'
</script>

<template>
  <div class="poster-tile"
       tabindex="0"
       v-bind:id="this.$attrs.result.id"
       :key="this.$attrs.result.id"
       @click="fetchNodesAndDetails(this.$attrs.result)"
       @keypress="fetchNodesAndDetails(this.$attrs.result)">  

    <img v-bind:src="this.$attrs.result.poster"/>
    <div>{{this.$attrs.result.name}}</div>
  </div>
</template>

<script>
  export default {
    name: 'ResultPosterTile',
    data () {
      return {}
    },
    methods: {
      async fetchNodesAndDetails(result) {
        panelStates.isOpen = false

        await api.fetchDetails(result.id)
        await graph.callForNodes(result, "main")
      }
    }
  }
</script>

<style scope lang="scss">
  .poster-tile {
    @include poster-tile
  }
</style>