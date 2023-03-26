<script setup>
  import { store } from '@/stores/store.js'
  import helpers from '../mixins/helpers.js'
  import graph from '../mixins/graph.js'
</script>

<template>
  <div v-if="store.graphTypes.length > 0">
    <div class="checkbox"
      v-for="genre in store.graphTypes"
      :key="genre">
      <div class='sel off' v-bind:id="genre">{{ genre }}</div>
    </div>
  </div>
  <div v-else></div>
  <div class='sel' id="clear">clear</div>
</template>

<script>
  export default {
    name: "ControlsComponent",
    mixins: [helpers, graph]
  }
</script>

<style>
  #controls {
    grid-area: controls;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    transform: scaleY(0);
    position: relative;
    bottom: 0%;
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