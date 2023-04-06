<script setup>
  import graph from "@mixins/graph"
  import api from "@mixins/api"
  import { 
    appStates,
    panelStates,
    store
  } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div class="result-container" 
    v-bind:id="panelStates.currentFocus + '-results'"
    v-if="panelStates.currentFocus !== 'noResult'">
      <div class="result-tile"
        tabindex="0"
        v-bind:id="result.id"
        v-for="result in store.searchResults.filter(r => r['id'].includes(panelStates.currentFocus))" 
        :key="result.id"
        @click="fetchNodesAndDetails(result)"
        @keypress="fetchNodesAndDetails(result)">
      <img v-bind:src="result.poster"/>
      <div>{{result.name}}</div>
    </div>
  </div>

  <div v-else>
    <p>No result found.</p>
    <p style="margin-top:30px">Did you get the spelling right?</p>
  </div>
</template>

<script>
  export default {
    name: "SearchResultComponent",
    data () {
      return {}
    },
    mounted () {
      d3.select(".result-component").transition().delay(0).duration(200).style("right", "0%")
    },
    methods: {
      async fetchNodesAndDetails(result) {
        let isMobile = /Android|iPhone/i.test(navigator.userAgent)
        if(isMobile) {
          d3.select("#panel-body")
          .transition().duration(100)
          .style("width", "20px")
          .style("min-width", "0px")
        }
        d3.select("#zoom-buttons").style("display", "none")

        panelStates.isOpen = false

        await api.fetchDetails(result.id)
        await graph.callForNodes(result, "main")
      }
    }
  }
</script>

<style scoped lang="scss">
  #no-result {
    text-transform: uppercase;
    font-family: $global-font;
    font-weight: bold;
    font-size: 40px;
    text-align: center;
  }

  .result-tile{
    width: 73px;
    height: 109px;
    border-radius: 8px;
    border: 1px solid;
  }
  
  .result-tile > img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .result-tile:hover{
    cursor: $cursor;
    box-shadow: 0 14px 18px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    transform: scale(1.03)
  }

  .result-tile > div {
    font-size: 10px;
    text-transform: uppercase;
    font-family: $global-font;
    font-weight: bold;
    text-align: center;
  }

  .result-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 50px 20px;
    justify-content: center;
    padding: 20px;
  }
</style>
