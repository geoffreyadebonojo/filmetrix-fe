<script setup>
  import ResultPosterTile from './ResultPosterTile.vue'
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
  <div v-if="panelStates.currentFocus !== 'noResult'"
       v-bind:id="panelStates.currentFocus + '-results'"
       class="result-container">
    <result-poster-tile v-for="result in filteredSearchResults" :result="result"></result-poster-tile>
  </div>

  <div v-else>
    <p>No result found.</p>
    <p style="margin-top:30px">Did you get the spelling right?</p>
  </div>
</template>

<script>
  export default {
    name: "SearchResultsComponent",
    data () {
      return {}
    },
    mounted () {
      d3.select(".result-component").transition().delay(0).duration(200).style("right", "0%")
    },
    computed: {
      filteredSearchResults: () => {
        return store.searchResults.filter(r => r['id'].includes(panelStates.currentFocus))
      }
    }
  }
</script>

<style scoped lang="scss">
  .result-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 50px 20px;
    justify-content: center;
    padding: 20px;
  }
  
  #no-result {
    text-transform: uppercase;
    font-family: $global-font;
    font-weight: bold;
    font-size: 40px;
    text-align: center;
  }
</style>
