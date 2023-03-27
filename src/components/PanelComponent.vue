<script setup>
  import GraphButtonsComponent from '@panel/GraphButtonsComponent.vue'
  import NavBarComponent from '@panel/NavBarComponent.vue'
  import PanelCenter from '@panel/PanelCenter.vue'
  import ResizeBarComponent from '@panel/ResizeBarComponent.vue'
  import * as d3 from 'd3'

  // import ControlsComponent from './ControlsComponent.vue'
</script>

<template>
  <div id="panel-body">
    <graph-buttons-component></graph-buttons-component>
    <resize-bar-component></resize-bar-component>
    <nav-bar-component></nav-bar-component>
    <panel-center></panel-center>
    <!-- <controls-component></controls-component> -->
  </div>
</template>

<script>
  export default {
    name: "PanelComponent",
    components: {
      GraphButtonsComponent,
      ResizeBarComponent,
      NavBarComponent,
      PanelCenter,
      // ControlsComponent
    },
    data () {
      return {
        transitionTimer: 500
      }
    },
    mounted () {
      d3.select("#panel-body").transition().duration(200).ease(d3.easeLinear).style("width", "350px").style("min-width", "270px")
    }
  }
</script>

<style scoped lang="scss">
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

  @media screen and (max-width: 400px) {
    #panel-body {
      grid-template-columns: 10px 1fr 10px;
      grid-template-rows: 2vh 1.8em 0vh 10fr 1vh 4fr 1vh;
    }
  }
</style>
