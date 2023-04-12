<script setup>
  import ResumeGraphPrompt from '@main/ResumeGraphPrompt.vue'
  import api from '@/mixins/api'
  import { 
    appStates,
    graphStates, 
    panelStates,
    store 
  } from '@/stores/store.js'
  import graph from '@/mixins/graph'
  import { getTypes, setFocus } from '@/mixins/helpers'
  import * as d3 from 'd3'
</script>

<template>
  <div id="search-prompt" @click="focusSearchBar()">
    <p class="apply-effect">search for a movie or actor</p>
  </div>

  <div id="show-you-around-prompt" v-if="$data.newHere">
    <p style="margin:5vh"> or </p>
    <p class="apply-effect"> have a look around </p>
  </div>

  <resume-graph-prompt v-else-if="$data.hasSavedGraph"/>
  <div v-else></div>
</template>

<script>
  export default {
    name: "MainPromptComponent",
    data () {
      return {
        currentDetailSubjectId: '',
        hasSavedGraph: false,
        newHere: JSON.parse(localStorage.getItem("newHere"))
      }
    },
    mounted () {
      d3.select("#search-prompt").transition().delay(200).duration(200).style("opacity", 1)
      const saved = JSON.parse(localStorage.getItem("lockedGraph"))
      
      if (saved == null || saved.length == []) {
        this.$data.hasSavedGraph = false
      } else {
        this.$data.hasSavedGraph = true
      }
    },
    methods: {
      focusSearchBar() {
        document.querySelector('#search-text').focus()
      }
    }
  }
</script>

<style lang="scss">
    #search-prompt,
    #resume-prompt,
    #show-you-around-prompt {
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
        animation-name: pulsate;
        animation-duration: 1.4s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
    }

    @keyframes pulsate {
    0% {
      transform: scale(1);
      opacity: 0.5;

    }
    50% {
      transform: scale(1.005);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }
</style>