<script setup>
  import SearchPrompt from './SearchPrompt.vue'
  // import TutorialPrompt from './TutorialPrompt.vue'

  import api from '@/mixins/api'
  import { 
    appStates,
    graphStates, 
    panelStates,
    store 
  } from '@/stores/store.js'
  import graph from '@/mixins/graph'
  import * as d3 from 'd3'
</script>

<template>
  <!-- <search-prompt></search-prompt> -->
  <!-- hidden until we can actually build it -->
  <!-- <tutorial-prompt v-if="$data.newHere"></tutorial-prompt> -->
</template>

<script>
  export default {
    name: "MainPromptContainer"
  }
</script>

<style lang="scss">
    .prompt {
      transform: scale(1);
      
      p {
        opacity: 0.5;
        margin: 4vh 40px;
        text-transform: uppercase;
        font-family: $global-font;
        font-weight: 100;
        font-size: 2em;
        text-align: center;
        &:hover {
          cursor:default
        }
      }
      .apply-effect:hover {
        cursor: $cursor;
      }
      
      animation-name: pulsate;
      animation-duration: 2s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;      

    }

    @keyframes pulsate {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.015);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
   }
</style>