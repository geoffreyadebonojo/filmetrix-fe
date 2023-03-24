<script setup>
  import NavBarComponent from './NavBarComponent.vue'
  import PanelCenter from './PanelCenter.vue'
  import ControlsComponent from './ControlsComponent.vue'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="panel-body">
    <!-- <div id="zoom-controls"> -->
      <!-- <img src="assets/square-plus.svg" class="zoom-button" id="plus-button" alt="minus button"> -->
      <img src="/center-graph-icon.svg" class="zoom-button" id="centering-button" alt="centering button">
      <!-- <img src="assets/square-minus.svg" class="zoom-button" id="minus-button" alt="centering button"> -->
    <!-- </div> -->

    <div id="resize-bar" class="main-panel-component">
      <div id="left-line"></div>
      <div id="right-line"></div>
    </div>

    <div id="navbar">
      <nav-bar-component></nav-bar-component>
    </div>

    <div id="panel-center" style="height:142%">
      <panel-center></panel-center>
    </div>

    <div id="controls" class="main-panel-component" style="transform: scale(1, 0); bottom: -50%;">
      <controls-component></controls-component>
    </div>

    <!-- <img src="/settings-white.svg" class="icon" id="settings-icon" @click="this.toggleControls()"> -->
    <!-- img v-else src="assets/settings-black.svg" class="icon" id="settings-icon" @click="this.toggleControls()"-->

  </div>
</template>

<script>
  export default {
    name: "PanelComponent",
    data () {
      return {
        transitionTimer: 500
      }
    },
    components: {
      NavBarComponent,
      PanelCenter,
      ControlsComponent
    },
    methods: {
      toggleControls () {
        if (store.showControls) {
          //close
          store.showControls = false

          d3.select("#controls")
          .transition().duration(this.transitionTimer)
          .style("transform", "scaleY(0)")
          .style("bottom", "-50%")

          d3.select("#panel-center")
          .transition().duration(this.transitionTimer)
          .style("height", "142%")
          
        } else {
          //open
          store.showControls = true

          d3.select("#controls")
          .transition().duration(this.transitionTimer)
          .style("transform", "scaleY(1)")
          .style("bottom", "-0%")

          d3.select("#panel-center")
          .transition().duration(this.transitionTimer)
          .style("height", "100%")
        }
      }
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

      resizeBar.on("click", () => {
        let panel = d3.select("#panel-body")

        if (store.panelOpen) {
          panel.transition().duration(100)
          .style("width", "20px")
          .style("min-width", "0px")
          store.panelOpen = false
        } else {
          panel.transition()
          .duration(80)
          .ease(d3.easeBounceOut)
          .style("width", "350px")
          .style("min-width", "270px")
          store.panelOpen = true
        }
      })

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

<style scoped>
  #settings-icon {
    grid-area: setting;
    height: 20px;
    position: absolute;
    top: 7vh;
    right: -1px;
  }

  #settings-icon:hover {
    cursor: pointer;
  }

  #left-line, #right-line {
    position: relative;
    border-left: 2px solid black;
    top: 300px;
    left: 3px;
    height: 50px;
  }

  #right-line {
    left: 8px;
    top: 250px;
  }

  .zoom-button {
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
    grid-template-rows: 2vh 1.8em 4vh 10fr 1vh 4fr 4vh;
    grid-template-areas:
      "resize-bar . ."
      "resize-bar navbar navbar"
      "resize-bar . settings"
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
    /* background: #444; */
    overflow-y: auto;
  }
</style>
