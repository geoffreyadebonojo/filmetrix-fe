<script setup>
  import graph from "@mixins/graph"
  import api from "@mixins/api"
  import {
    panelStates,
    store
  } from '@/stores/store.js'
  import * as d3 from 'd3'
  import { global } from '@/mixins/global.js'
</script>

<template>
  <div class="poster-tile"
       v-bind:id="this.$attrs.result.id"
       tabindex="0"
       :key="this.$data.resultId"
       @click="fetchNodesAndDetails(this.$attrs.result)"
       @keypress="fetchNodesAndDetails(this.$attrs.result)">  
    <img v-bind:src="this.$attrs.result.poster"/>
    <div>
      {{ this.$attrs.result.name }}
    </div>
    <div v-if="this.$attrs.result.poster == ''">
      <br>
      <div v-if="this.$attrs.result.entity == 'person'">
        [ {{ this.$attrs.result.knownForDepartment }} ]
      </div>
      <div v-else-if="this.$attrs.result.entity == 'movie' && this.$attrs.result.year != null">
        [ {{ this.$attrs.result.year }} ]
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
        refresh: true
      }
    },
    
    methods: {
      async fetchNodesAndDetails(result) {
        // panelStates.isOpen = false
        await api.fetchDetails(result.id)
        await graph.callForNodes(result)
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

    img {
      transform-origin: 35px 12px;
    }

    &:hover {
      z-index: 10;
    }
  }

</style>