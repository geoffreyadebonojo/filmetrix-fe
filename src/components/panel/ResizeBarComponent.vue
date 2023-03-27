<script setup>
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="resize-bar" class="main-panel-component">
    <div id="left-line"></div>
    <div id="right-line"></div>
  </div>
</template>

<script>
  export default {
    name: "ResizeBarComponent",
    mounted () {
      const resizeBar = d3.select("#resize-bar")
      
      resizeBar.call(
      d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
      )
      
      let isMobile = /Android|iPhone/i.test(navigator.userAgent)
      if (isMobile) {
      resizeBar.on("click", () => {
      let panel = d3.select("#panel-body")
      let zoomButtons = d3.select("#zoom-buttons")
      let centeringButton = d3.select(".centering-button")
      
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
        .style("width", "350px")
        .style("min-width", "270px")
        zoomButtons.style("display", "flex")
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
    }
  }
</script>

<style>
  #resize-bar {
    grid-area: resize-bar;
    width: 12px;
  }

  #left-line, #right-line {
    position: relative;
    border-left: 2px solid grey;
    top: 300px;
    left: 3px;
    height: 50px;
  }

  #right-line {
    left: 8px;
    top: 250px;
  }
</style>