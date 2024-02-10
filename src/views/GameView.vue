<script setup>
  import GraphComponent from '@components/GraphComponent.vue'
  import PanelComponent from '@components/PanelComponent.vue'
  import { graphStates, gameStates, store } from '@/stores/store.js'
  import graph from "@mixins/graph"
  import api from "@mixins/api"
  import * as d3 from 'd3'
</script>

<template>
  <div id="viewer-body">
    <div id="guesses">
      <div class="guess-tile" v-for="i in 6" :key="i" :id="'card-' + i" :number="i">
        <p>{{ i }}</p>
        <img src=""/>
      </div>
      <div class="guess-tile" id="target-tile">
        <img src=""/>
      </div>
    </div>
    <graph-component :type="'main'"></graph-component>
    <panel-component :type="'game'"></panel-component>
  </div>
</template>

<script>
  export default {
    name: 'GameView',
    async mounted () {
      d3.select(`#card-${gameStates.turn}`).classed("active", "true")

      // const mainTargetId = "person-4724"
      // await api.fetchGraphData(mainTargetId)
      // graphStates.existing.push([mainTargetId, 0])
      // const kevinNode = graphStates.graphData[mainTargetId].nodes[0]
      // graph.draw({
      //   nodes: [kevinNode],
      //   links: [],
      //   type: "main"
      // })

      const k = "https://image.tmdb.org/t/p/w185_and_h278_bestv2/rjX2Oz3tCZMfSwOoIAyEhdtXnTE.jpg"

      d3.select("#target-tile img").attr("src", k)
    }
  }
</script>

<style scoped lang="scss">
  .active {
    color: red;
  }
  
  #viewer-body {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  #guesses {
    position: absolute;
    z-index: 5;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    left: -100px;
    
    .guess-tile {
      width: 73px;
      height: 109px;
      border-radius: 8px;
      border: 1px solid;
      margin: 0 10px;
      background: $graph-body-grey;
      position: absolute;
      left: 0px;

      p {
        font-size: 50px;
        line-height: 100px;
        text-transform: uppercase;
        font-family: $global-font;
        font-weight: bold;
        text-align: center;
        margin: auto auto;
      }   

      img {
      width: 100%;
        border-radius: 8px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      }
    }
  }
</style>