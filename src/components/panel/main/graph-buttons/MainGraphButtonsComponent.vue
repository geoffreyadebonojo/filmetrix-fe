<script setup>
  import LockButton from './LockButton.vue'
  import GenerateLinkButton from './GenerateLinkButton.vue'
  import SaveButton from './SaveButton.vue'
  import { 
    graphStates,
    store 
  } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from 'd3'
</script>

<template>
  <lock-button></lock-button>
  <generate-link-button></generate-link-button>
  <save-button></save-button>
  <div class="graph-control-buttons" id="centering-button"></div>
</template>

<script>
  export default {
    name: "MainGraphButtonsComponent",
    data () {
      return {}
    }
  }
</script>

<style lang="scss">
  .graph-control-buttons {
    background: none;
    display: none;
    width: 20px;
    position: absolute;
    z-index: 1;
    opacity: 0.5;
    cursor: $cursor;

    &:hover {
      opacity: 1;
      transition-property: opacity;
      transition-duration: 0.25s;
    }
    transition-property: opacity;
    transition-duration: 0.25s;

    p {
      right: 80px;
      width: 75px;
      opacity: 1;
      text-transform: uppercase;
      font-family: $global-font;
      font-weight: bold;
      text-align: center;
      color: white;
    }
  }

  #centering-button {
    background-image: url("/center-graph-icon.svg");
    background-size: contain;
    bottom: 10px;
    width: 20px;
    height: 20px;
  }
</style>