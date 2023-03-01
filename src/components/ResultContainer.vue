<script setup>
  import createChart from "../mixins/createChart"
  import apiService from "../mixins/apiService"
  import { store } from '@/stores/store.js'
</script>

<style>

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
    justify-content: flex-start;
    padding: 20px;
    overflow-y: auto
  }

</style>

<template>
  <div class="result-container" v-bind:id="store.currentFocus + '-results'">
    <div class="result-tile" 
        v-bind:id="result.id"
        v-if="store.currentFocus !== 'noResult'"
        v-for="result in store.searchResults.filter(r => r['id'].includes(store.currentFocus))" 
        @click="$event => callForNodes()"
      >

        <img v-bind:src="result.poster"/>
        <div>{{result.name}}</div>
    </div>

    <div v-else="store.currentFocus === 'noResult'">
      No result found. Spelling?
    </div>
  </div>
</template>

<script>
  export default {
    name: "ResultContainer",
    mixins: [createChart],
    data () {
      return {}
    },
    methods: {
      async callForNodes() {
        const fullId = event.currentTarget.id
        
        const id = fullId.split("-")[1]

        await apiService.methods.fetchGraphData([id],[],5)

        store.currentFocus = 'details'
        
        this.currentDetailId = fullId
        
        // this.chart(this.graphData.data)
      }
    }
  }
</script>