<script setup>
  import {
    userStates
  } from '@/stores/store.js'
  import * as d3 from "d3"
</script>

<template>
  <div id="graph-stacks">
    <div class="stack collapsed" v-for="posterStack in userStates.userGraphList" @click="toggleExpand($event)">
      <div v-for="(poster, i) in posterStack" :style="{ 'z-index': i, 'right': i*this.$data.posterOffset+'px' }" class="poster">
        <img v-bind:src="poster"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GraphStacks",
    data () {
      return {
        posterOffset: 50
      }
    },
    methods: {
      toggleExpand(e) {
        const stack = d3.select(e.currentTarget)
        if (stack.classed("collapsed")) {
          stack.selectAll('div').transition().duration(200).style("right", "0px")
          stack.style("overflow-x", "scroll")
          stack.classed("collapsed", false)
        } else {
          stack.selectAll('div').transition().duration(200).style("right", (_d, i, l) => {
           return `${i*this.$data.posterOffset}px`
          })
          stack.style("overflow-x", "hidden")
          stack.classed("collapsed", true)
        }
      },
    }
  }
</script>

<style scoped lang="scss">

  #graph-stacks {

    .stack {
      display: flex; 
      margin: 10px 0;
      width: 100%;
      height: 100px;
      overflow-x: scroll;
      cursor: $cursor;

      .poster {
        position: relative;
        // height: 100px;
        // width: 74px;
        height: 81.75px;
        width: 54.75px;

        border-radius: 5px;
        box-shadow: 0 0px 11px 0 rgba(0, 0, 0, 0.2), 0px 0px 0px 0 rgba(0, 0, 0, 0.19);
        
        img {
          border-radius: 5px;
          height: 100%
        }
      }
    }
  }
</style>