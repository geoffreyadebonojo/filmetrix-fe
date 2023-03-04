<script setup>
  import NavBar from './NavBar.vue'
  import PanelCenter from './PanelCenter.vue'
  import * as d3 from 'd3'

</script>

<template>
  <div id="panel-body">
    <div id="navbar">
      <NavBar />
    </div>

    <div id="panel-center">
      <PanelCenter />
    </div>

    <div id="controls">
      <!-- <Controls /> -->
    </div>
  </div>
</template>

<style scoped>
  #panel-body {
    height: 100vh;
    width: 0px;
    display: grid;
    grid-template-columns: 30px 1fr 30px;
    grid-template-rows: 2vh 1.8em 4vh 60vh 4vh 9em 4vh;
    grid-template-areas:
      ". . ."
      ". navbar navbar"
      ". . ."
      ". panel-center ."
      ". . ."
      ". controls ."
      ". . .";
    background: #333333;
    position: absolute;
    top: 0px;
    right: 0px;
  }


  #navbar {
    grid-area: navbar;
    background: #333333;
    display: flex;
    margin: auto 0 auto auto;
    height: 26px;
    width: 100%;  
  }

  #panel-center {
    grid-area: panel-center;
    /* a cool effect */
    /* background: #444; */
    height: 100%;
    overflow-y: auto;
  }

  #controls {
    grid-area: controls;
    border: 3px dashed black;
  }
</style>

<script>
  export default {
    name: "PanelComponent",
    components: {
      NavBar,
      PanelCenter
    },
    mounted () {
      d3.select("#panel-body")
      .transition()
      .duration(100)
      .style("width", "35%")
    }
  }
</script>