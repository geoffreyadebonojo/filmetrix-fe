<script setup>
  import graph from "@mixins/graph"
  import api from "@mixins/api"
  import {
    graphStates,
    panelStates,
    store
  } from '@/stores/store.js'
  import * as d3 from 'd3'
  import { global } from '@/mixins/global.js'
  import GraphManager from '@models/GraphManager.js'

</script>

<template>
  <div class="poster-tile"
       v-bind:id="$attrs.result.id"
       tabindex="0"
       :key="$data.resultId"
       @click="fetchNodesAndDetails($attrs.result, 8)"
       @keypress="fetchNodesAndDetails($attrs.result, 8)">  
    <img v-bind:src="$attrs.result.poster" class="tile-img"/>
    <div>
      {{ $attrs.result.name }}
    </div>
    <div v-if="$attrs.result.poster == ''">
      <br>
      <div v-if="$attrs.result.entity == 'person'">
        [ {{ $attrs.result.knownForDepartment }} ]
      </div>
      <div v-else-if="$attrs.result.entity == 'movie' && $attrs.result.year != null">
        [ {{ $attrs.result.year }} ]
      </div>
      <div v-else></div>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
  export default {
    name: 'ResultPosterTile',
    data () {
      return {
        onGraph: false,
        posterElem: null,
        resultId: this.$attrs.result.id,
        refresh: true,
        clicked: false
      }
    },
    methods: {
      async fetchNodesAndDetails(result, graphLoadedNodeCount) {
        // TODO: do something to prevent doubleclick error
        if (this.$data.clicked) { return }

        if (event.shiftKey) {
          await api.fetchDetails(result.id)
          await graph.callForNodes(result, graphLoadedNodeCount)

          const firstOrder = graphStates.graphData[result.id].nodes.slice(1, graphLoadedNodeCount+1)  
          firstOrder.forEach((node) => {
            graphStates.existing.push([node.id, 4])
          })

          // NODE MULTISEND
          await api.fetchGraphData(graphStates.existing.map(d => d[0]))
  
          new GraphManager().generate()
        } else {

          await api.fetchDetails(result.id)
          await graph.callForNodes(result, graphLoadedNodeCount)

        }
      }
    }
  }
</script>

<style scope lang="scss">
  .fixed {
    position: fixed;
    background: $panel-body-grey;
    z-index: 1000;
  }
  
  .no-poster {
    &-movie {
      background-image: url("/movie-icon.svg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 40px;
      background-color: $panel-body-grey;
    }

    &-person {
      background-image: url("/person-icon.svg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 40px;
      background-color: $panel-body-grey;
    }

    &-tv {
      background-image: url("/tv-icon.svg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 40px;
      background-color: $panel-body-grey;
    }
  }

  .poster-tile {
    @include poster-tile;
    height: 154px;
    width: 170px;
    display: flow-root;
    border: 1px solid transparent;
      
    div:first-of-type {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 15px;
      text-align: center;
    }

    &:hover {
      box-shadow: none;
      
      .tile-img {
        box-shadow: 0 9px 13px 0 rgba(0, 0, 0, 0.2), 0 6px 15px 0 rgba(0, 0, 0, 0.19)
      }
    }

    img {
      transform-origin: 35px 12px;
      width: 100px;
      margin: 0px 34px;
    }
  }

</style>