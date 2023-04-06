<script setup>
  import { 
    appStates,
    graphStates,
    panelStates,
    store 
  } from '@/stores/store.js'
  import * as d3 from 'd3'
  import focusSetter from "@/mixins/focusSetter"
</script>

<template>
   <div v-if="!appStates.displayingAbout" style="height:100%" @click="transitionAbout('to')">
      <img class="icon" 
        id="about-us-icon"
        src="/about-us-icon.svg"/>
    </div>
    <div v-else style="height:100%; transform:rotate(180deg)" @click="transitionAbout('back')">
      <img class="icon" 
        id="back-icon"
        src="/chevron-black.svg"/>
    </div>
</template>

<script>
  export default {
    name: "AboutButtonComponent",
    data () {
      return {
        transition: 250
      }
    },
    methods: {
      async transitionAbout(setting) {
        
        if (setting == "to") {

          d3.select("#about-inner-wrapper").style("transform", () => {
            return `translate(-${(window.innerWidth-panelStates.width)+70}px, 0)`
          })

          d3.select("#panel-body").style("position", "unset").transition().duration(0).style("width", `${panelStates.width}`).style("min-width", "275px")
          d3.select("#main-graph-component").transition().duration(this.$data.transition).style("width", "0%")
          d3.select("#about-graph-component").transition().duration(this.$data.transition).style("width", "100%")
          d3.select("#about-inner-wrapper").transition().duration(this.$data.transition).style("transform", "translate(0, 0)")
          d3.select("#navbar").transition().duration(200).style("width", "5%").style("right", "30px")
          d3.select("#resize-bar").style("opacity", "0").style("display", "none")
          d3.selectAll(".primary-nav").style("display", "none")
          d3.select(".nav-button-container").style("background", "none")
          
          appStates.displayingAbout = true
          focusSetter.methods.set('about')

        } else {
          focusSetter.methods.set('details') 
          d3.select("#main-graph-component").transition().duration(this.$data.transition).style("width", "100%")
          d3.select("#about-graph-component").transition().duration(this.$data.transition).style("width", "0%")
          d3.select("#resize-bar").transition().delay(this.$data.transition).duration(0).style("opacity", "1").style("display", "block")
          d3.selectAll(".primary-nav").transition().delay(this.$data.transition).duration(0).style("display", "block")
          d3.select(".nav-button-container").transition().delay(this.$data.transition).duration(0).style("background", "#6e6e6e")
          d3.select("#navbar").transition().delay(this.$data.transition).duration(0).style("right", "unset").style("width", "100%")
          d3.select("#panel-body").transition().delay(this.$data.transition).duration(0).style("position", "absolute")
          d3.selectAll("#search-text").transition().delay(this.$data.transition).duration(0).style("display", "block")

          appStates.displayingAbout = false

          if (graphStates.detailsData != null || graphStates.detailsData != {}) {
            graphStates.detailsData = {}
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  #about-us-icon {
    height: 17px;
    margin: 4px 6px;
  }

  #back-icon {
    height: 13px;
    margin: 7px 10px;
  }

  #back-button {
    display: none;
    top: 50px;
    position: absolute;
    height: 16px;
    margin: 0px 10px 6px 10px;
    transform: rotate(0deg);
  }
</style>