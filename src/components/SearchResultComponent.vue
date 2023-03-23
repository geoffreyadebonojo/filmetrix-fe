<script setup>
  import graph from "../mixins/graph"
  import api from "../mixins/api"
  import { store } from '@/stores/store.js'
</script>

<template>
  <div class="result-container" 
    v-bind:id="store.currentFocus + '-results'"
    v-if="store.currentFocus !== 'noResult'">
      <div class="result-tile"
        tabindex="0"
        v-bind:id="result.id"
        v-for="result in store.searchResults.filter(r => r['id'].includes(store.currentFocus))" 
        :key="result.id"
        @click="this.fetchNodesAndDetails(result.id)"
        @keypress="this.fetchNodesAndDetails(result.id)">

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
    mixins: [graph, api],
    data () {
      return {}
    },
    methods: {
      async fetchNodesAndDetails(result_id) {
        await api.fetchDetails(result_id)
        await graph.methods.callForNodes(result_id, 7)
      }
    }
  }
</script>

<style>
  #no-result {
    text-transform: uppercase;
    font-family: 'Dosis', sans-serif;
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
    cursor: pointer;
    box-shadow: 0 14px 18px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    transform: scale(1.03)
  }

  .result-tile > div {
    font-size: 10px;
    text-transform: uppercase;
    font-family: 'Dosis', sans-serif;
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
