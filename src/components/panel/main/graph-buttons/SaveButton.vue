<script setup>
  import { 
    appStates,
    graphStates,
    store 
  } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from 'd3'
</script>

<template>
  <div v-if="appStates.loggedIn"
       class="graph-control-buttons"
       id="save-button"
       @click="save()"> 
    <p id="save-flash"></p>
  </div>
</template>

<script>
  export default {
    name: "SaveButton",
    methods: {
      async save() {
        // await api.loginUser({
        //   email: "geezy@mail.com",
        //   password: "password"
        // })
        // const resp = await api.currentUser()
        // const response = await api.saveGraph(graphStates.existing)

        d3.select("#save-flash").html('saved')
          .transition().duration(200).style("opacity", 1).style("color", "#72bcd4")
          .transition().duration(1000).style("opacity", 0).style("color", "white")
      }
    }
  }
</script>

<style lang="scss">
  #save-button {
    background-image: url("/disk-empty-white.svg");
    background-size: contain;

    top: 12.3vh;
    left: -28px !important;
    width: 20px;
    height: 20px;
    opacity: 0.5;
    
    &:hover {
      opacity: 1;
    }

    #save-flash {
      right: 66px;
    }
  }
</style>