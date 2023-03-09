<script setup>
  import { store } from '@/stores/store.js'
  import helpers from '../mixins/helpers.js'
  import * as d3 from 'd3'
</script>

<template>
    <div class="slidecontainer">
      <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
    </div>

  <div class="checkbox"
    v-if="store.graphTypes.length > 0"
    v-for="genre in store.graphTypes">
    <label v-bind:for="genre">
        <input type="checkbox" v-bind:id="genre" @click="this.applyFilter(genre)">
        <span>{{ genre }}</span>
    </label>
  </div>

  <div v-else></div>

</template>

<style>
  #controls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
</style>

<script>
  export default {
    name: "Controls",
    props: {},
    data() {
      return {
        applied: []
      }
    },
    methods: {
      applyFilter(g) {
        this.applied.togglePresence(g)
        console.log(this.applied)
      }
    }
  }
</script>