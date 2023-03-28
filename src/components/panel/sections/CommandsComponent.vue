<script setup>
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div  id="commands-container">
    <div id="commands" class="column">
      <div class="header">Commands</div>
      <hr class="line" style="margin:20px 0">
      <div class="item">double click</div>
      <div class="item">single click</div>
      <div class="item search-info" style="height:3em"><img src="/search-icon.png" style="opacity:0.5"/></div>
      <div class="item unlock" style="height:3em"><img src="/lock-open.svg" style="opacity:0.5"/></div>
      <div class="item"><img src="/lock-closed.svg"/></div>
    </div>
    <div id="centerline" class="line"></div>
    <div id="effects" class="column">
      <div class="header">Effects</div>
      <hr class="line" style="margin:20px 0">
      <div class="item">add more nodes!</div>
      <div class="item">view details</div>
      <div class="item search-info" style="height:3em">
        <div style="display:flex" @click="this.elaborateOn('search')">
          search for actors, movies, or tv shows
          <img class="chevron" src="/chevron.svg"/>
        </div>
        <p class="elaboration" style="display:none">
          you can search and add nodes to an existing graph
        </p>
      </div>
      <div class="item unlock" style="height:3em">
        <div style="display:flex" @click="this.elaborateOn('unlock')">
          unlock graph
          <img class="chevron" src="/chevron.svg"/>
        </div>
        <p class="elaboration" style="display:none">
          graph won't be saved if you navigate away
        </p>
      </div>
      <div class="item">
        lock graph
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CommandsContainer",
    mounted () {
      d3.select("#commands-container").transition().duration(200).style("left", "0%")
    },
    methods: {
      async elaborateOn(section) {
        if (section == 'search') {
          this.expandSearch()
        } else if (section == 'unlock') {
          this.expandUnlock()
        }
      },
      expandUnlock() {
        const si = d3.selectAll(".unlock")
        const el = d3.select("#effects .unlock .elaboration")
        const chev = d3.select("#effects .unlock .chevron")
  
        el.style("display", () => {
          if (el.style("display") == "none"){
            si.transition().duration(200).style("height", "7em")
            chev.transition().duration(200).style("transform", "rotate(270deg)")
            el.transition().delay(100).style("display", "block")
          } else {
            si.transition().duration(200).style("height", "3em")
            chev.transition().duration(200).style("transform", "rotate(90deg)")
            el.transition().delay(100).style("display", "none")
          }
        })
      },
      expandSearch() {
        const si = d3.selectAll(".search-info")
        const el = d3.select("#effects .search-info .elaboration")
        const chev = d3.select("#effects .search-info .chevron")
  
        el.style("display", () => {
          if (el.style("display") == "none"){
            si.transition().duration(200).style("height", "7em")
            chev.transition().duration(200).style("transform", "rotate(270deg)")
            el.transition().delay(100).style("display", "block")
          } else {
            si.transition().duration(200).style("height", "3em")
            chev.transition().duration(200).style("transform", "rotate(90deg)")
            el.transition().delay(100).style("display", "none")
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">

  .elaboration {
    display: none;
    font-style: italic;
    font-size: 13px;
    margin-top: 6px;
  }

  .chevron {
    height: 5px;
    margin: auto 0 auto auto;
    transform: rotate(90deg)
  }

  #commands-container {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 10px 1fr;
    grid-template-areas:
      "commands centerline effects";
    left: 100%;
  }

  .line {
    opacity: 0.5;
  }

  #commands {
    grid-area: commands;
    text-align: right;
    margin: 10px;

    img {
      height: 25px;
      display: flex;
      margin: auto 0 auto auto;
    }
  }

  #effects {
    grid-area: effects;
    text-align: left;
    margin: 10px;

    .search-info {
      &:hover {
        cursor: pointer;
      }
    }
  }

  .column {
    .item {
      height: 3em;
      // &:nth-child(3) {
      //   // height: 3em;
      // }
      // &:nth-child(4) {
      //   // height: 3em;
      // }
      // &:nth-child(5) {
      //   // height: 3em;
      // }
      // &:nth-child(6) {
      //   // height: 3em;
      // }
      // &:nth-child(7) {
      //   // height: 3em;
      // }
    }
  }

  #centerline {
    grid-area: centerline;
    margin: auto;
    position: relative;
    border-left: 1px solid white;
    height: 100%;
  }

  .header, .item {
    font-family: "Dosis", sans-serif;
  }
</style>