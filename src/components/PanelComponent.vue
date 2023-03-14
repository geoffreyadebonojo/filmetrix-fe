<script setup>
  import NavBar from './NavBar.vue'
  import PanelCenter from './PanelCenter.vue'
  import Controls from './Controls.vue'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'

</script>

<template>
  <div id="panel-body">
    <img src="../assets/center-graph-icon.svg" id="centering-button" alt="centering button">
    <div id="resize-bar" class="main-panel-component">
      <div class="vll"></div>
      <div class="vlr"></div>
    </div>

    <div id="navbar">
      <NavBar />
    </div>

    <div id="panel-center">
      <PanelCenter />
    </div>

    <div id="controls" class="main-panel-component">
      <Controls />
    </div>
  </div>
</template>

<style scoped>
  .vll, .vlr {
    position: relative;
    border-left: 2px solid black;
    top: 300px;
    left: 3px;
    height: 50px;
  }

  .vlr {
    left: 8px;
    top: 250px;
  }

  #centering-button {
    background: none;
    display: none;
    color: white;
    bottom: 10px;
    width: 20px;
    position: absolute;
    z-index: 1;
    cursor: pointer;
  }

  #panel-body {
    height: 100vh;
    width: 0px;
    display: grid;
    grid-template-columns: 30px 1fr 30px;
    grid-template-rows: 2vh 1.8em 4vh 66vh 1vh 9em 4vh;
    grid-template-areas:
      "resize-bar . ."
      "resize-bar navbar navbar"
      "resize-bar . ."
      "resize-bar panel-center ."
      "resize-bar . ."
      "resize-bar controls ."
      "resize-bar . .";
    background: #333333;
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 2;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  #navbar {
    grid-area: navbar;
    background: #333333;
    display: flex;
    margin: auto 0 auto auto;
    height: 26px;
    width: 100%;  
  }

  #resize-bar {
    grid-area: resize-bar;
    /* background: #444; */
    width: 12px;
  }

  #panel-center {
    grid-area: panel-center;
    /* a cool effect */
    /* background: #444; */
    /* height: 100%; */
    overflow-y: auto;
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
      const panel = d3.select("#panel-body")

      panel.transition()
      .duration(80)
      .ease(d3.easeBounceOut)
      .style("width", "350px")
      .style("min-width", "270px")

      const resizeBar = d3.select("#resize-bar")

      resizeBar.call(
        d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      )

      function dragstarted() {
        d3.select(this).style("cursor", "col-resize")
      }
      
      function dragged() {
        d3.select(this).style("cursor", "col-resize")
        let panel = this.parentElement
        panel.style.width = `${window.innerWidth - event.x}px`
      }

      function dragended() {
        store.panelWidth = window.innerWidth - event.x
      }
    }
  }
</script>