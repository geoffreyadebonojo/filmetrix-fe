<script setup>
  import { global } from '@/mixins/global.js'
  import * as d3 from 'd3'
</script>

<template>
  <div class="prompt" id="show-you-around-prompt">
    <p style="margin:5vh"> or </p>
    <p class="apply-effect" @click="displayTutorial()"> have a look around </p>
  </div>
</template>

<script>
  export default {
    name: "TutorialPrompt",
    methods: {
      displayTutorial () {
        console.log("TBD")
      }
    }
  }
</script>