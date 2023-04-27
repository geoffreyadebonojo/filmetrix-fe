<script setup>
  import {
    panelStates,
    store
  } from '@/stores/store.js'
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
      
      let isMobile = /Android|iPhone/i.test(navigator.userAgent)

      if (isMobile) {
        let panel = d3.select("#panel-body")
        panel.classed("mobile", true)
        
        resizeBar.on("touchmove", (e) => {
          let x = e.changedTouches[0].clientX
          let pw = window.innerWidth - x
          panel.style("width", `${(pw)}px`)
        })
        resizeBar.on("touchend", (e) => {
        })
      } else {        
        resizeBar.call(
          d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
        )
        resizeBar.on("dblclick", () => {
          let panel = d3.select("#panel-body")
          let pw
          if (panelStates.isOpen) {
            panelStates.isOpen = false
            pw = 15
          } else {
            panelStates.isOpen = true
            pw = 350
          }
          panel.transition().duration(300)
          .style("width", `${(pw)}px`)
          .style("min-width", `${(pw)}px`)
        })
      }
      
      if (isMobile) {
        resizeBar.on("click", () => {
          let panel = d3.select("#panel-body")
          let zoomButtons = d3.select("#zoom-buttons")
          let centeringButton = d3.select(".centering-button")
          
          if (panelStates.isOpen) {
            panel.transition().duration(100)
            .style("width", "20px")
            .style("min-width", "0px")
            zoomButtons.style("display", "none")
            centeringButton.style("display", "block")
            panelStates.isOpen = false
            
          } else {
            panel.transition()
            .duration(80)
            .ease(d3.easeBounceOut)
            .style("width", "350px")
            .style("min-width", "270px")
            zoomButtons.style("display", "flex")
            centeringButton.style("display", "none")
            panelStates.isOpen = true
          }
        })
      }
      
      function dragstarted() {
        d3.select(this).style("cursor", "col-resize")
      }
      
      function dragged() {
        d3.select(this).style("cursor", "col-resize")
        let panel = this.parentElement
        let pw = window.innerWidth - event.x
        panel.style.width = `${(pw)}px`
      }
      
      function dragended() {
        panelStates.width = (window.innerWidth - event.x)
      }
    }
  }
</script>

<style scoped lang="scss">
  #resize-bar {
    grid-area: resize-bar;
    width: 12px;
  }

  #left-line, #right-line {
    position: relative;
    border-left: 2px solid #555555;
    /* broken? */
    /* border-left: 2px solid $light-grey; */
    top: 300px;
    left: 3px;
    height: 50px;
  }

  #right-line {
    left: 8px;
    top: 250px;
  }
</style>