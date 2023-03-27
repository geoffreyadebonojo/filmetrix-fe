<script setup>
  // import PanelComponent from '../components/PanelComponent.vue'
  // import * as d3 from 'd3'
  import NavBarComponent from '../components/NavBarComponent.vue'
  import PanelContentsComponent from '../components/PanelContentsComponent.vue'
  import ControlsComponent from '../components/ControlsComponent.vue'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div v-bind:id="'panel-body__' + store.agent">

    <img src="/center-graph-icon.svg" class="centering-button" id="centering-button" alt="centering button">

    <div id="resize-bar" class="main-panel-component">
      <div id="left-line"></div>
      <div id="right-line"></div>
    </div>

    <div id="navbar">
      <nav-bar-component></nav-bar-component>
    </div>

    <div id="panel-center" style="height:142%;zoom:100%">
      <panel-contents-component></panel-contents-component>
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
    name: "MainView",
    components: {
      NavBarComponent,
      PanelContentsComponent,
      ControlsComponent
    },
    data () {
      return {
        transitionTimer: 500
      }
    },
    mounted () {
      const panel = d3.select("#panel-body__desktop")
      let isMobile = /Android|iPhone/i.test(navigator.userAgent)

      panel.transition()
      .duration(80)
      .ease(d3.easeBounceOut)
      .style("width", () => {
        if (isMobile) {
          return "290px"
        } else {
          return "350px"
        }
      })
      .style("min-width", "270px")

      const resizeBar = d3.select("#resize-bar")

      resizeBar.call(
        d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      )

      if (isMobile) {
        resizeBar.on("click", () => {
          let panel = d3.select("#panel-body__desktop")
          let zoomButtons = d3.select("#zoom-buttons")
          let centeringButton = d3.select("#centering-button")
          
          if (store.panelOpen) {
            panel.transition().duration(100)
            .style("width", "20px")
            .style("min-width", "0px")
            zoomButtons.style("display", "none")
            centeringButton.style("display", "block")
            store.panelOpen = false
            
          } else {
            panel.transition()
            .duration(80)
            .ease(d3.easeBounceOut)
            .style("width", "290px")
            .style("min-width", "270px")
            zoomButtons.style("display", "grid")
            centeringButton.style("display", "none")
            store.panelOpen = true
          }
        })
      }

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
    }
  }
</script>

<style lang="scss">
  #panel-body {
    &__desktop {
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

      .centering-button {
        background: none;
        display: none;
        color: white;
        bottom: 10px;
        width: 20px;
        position: absolute;
        z-index: 1;
        cursor: pointer;
      }

      #resize-bar {
        grid-area: resize-bar;
        /* background: #444; */
        width: 12px;

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
      }

      #panel-center {
        grid-area: panel-center;
        overflow-y: auto;
      }
    }

    &__mobile {
      height: 30vh;
      width: 100vw;
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



      .centering-button, #resize-bar, #controls {
        display: none;
      }
    }
  }

  #zoom-buttons {
    display: none;
    position: absolute;
    bottom: 40px;
    right: 10px;
    z-index: 5;
    height: 80px;
    justify-content: space-between;

    img {
      width: 30px;
      height: 30px;
      background: white;
      border-radius: 21%;
    }
  }

  #instructions {
    position : absolute;
    top: 40%;
    right: 0%;
    z-index: 2
  }

  #settings-icon {
    grid-area: setting;
    height: 20px;
    position: absolute;
    top: 7vh;
    right: -1px;
    
    &:hover {
      cursor: pointer;
    }
  }
</style>