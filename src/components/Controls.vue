<script setup>
  import { store } from '@/stores/store.js'
  import helpers from '../mixins/helpers.js'
  import graph from '../mixins/graph.js'
  import * as d3 from 'd3'
</script>

<template>
    <!-- <div class="slidecontainer">
      <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
    </div> -->

  <div class="checkbox"
    v-if="store.graphTypes.length > 0"
    v-for="genre in store.graphTypes">
      <div class='sel on' v-bind:id="genre">{{ genre }}</div>
  </div>
  <div v-else></div>
  <div class='sel' id="clear">clear</div>
</template>

<style>
  #controls {
    grid-area: controls;
    border: 3px dashed black;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    transform: scaleY(0);
    position: relative;
    bottom: -100%;
  }
  .sel {
    font-family: 'Dosis', sans-serif;
  }
  .sel, .off {
    border: solid 1px aliceblue;
    background: none;
    color: aliceblue;
  }
  .sel:hover, .on {
    cursor: pointer;
    border: solid 1px  none;
    background: aliceblue;
    color: #222;
  }
</style>

<script>
  export default {
    name: "Controls",
    props: {}
  }
</script>