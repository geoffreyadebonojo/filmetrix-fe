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
    width: 73px;
    height: 109px;
    border-radius: 8px;
    border: 1px solid;

    img {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
  
    div {
      font-size: 10px;
      text-transform: uppercase;
      font-family: $global-font;
      font-weight: bold;
      text-align: center;
    }

    &:hover {
      cursor: $cursor;
      box-shadow: 0 14px 18px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      transform: scale(1.03)
    }
  }
</style>