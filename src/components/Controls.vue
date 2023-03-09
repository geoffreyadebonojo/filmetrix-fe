<script setup>
  import { store } from '@/stores/store.js'
  import helpers from '../mixins/helpers.js'
  import * as d3 from 'd3'
</script>

<template>
    <!-- <div class="slidecontainer">
      <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
    </div> -->

  <div class="checkbox"
    v-if="store.graphTypes.length > 0"
    v-for="genre in store.graphTypes">
    <!-- <label v-bind:for="genre"> -->
        <!-- <input type="checkbox" checked="true" v-bind:id="genre" @click="this.applyFilter(genre)"> -->
        <div class='sel' v-bind:id="genre" @click="this.applyFilter(genre)">{{ genre }}</div>
    <!-- </label> -->
  </div>
  <div v-else></div>
  <div class='sel' id="clear" @click="this.clearAll()">clear</div>


</template>

<style>
  #controls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .sel {
    font-family: 'Dosis', sans-serif;
  }
  .sel, .off {
    border: solid 1px aliceblue;
    background: none;
    color: aliceblue;
  }
  .sel:hover, .on {
    cursor: pointer;
    border: solid 1px  none;
    background: aliceblue;
    color: #222;
  }
</style>

<script>
  export default {
    name: "Controls",
    props: {},
    methods: {
      clearAll() {
        store.appliedFilters = []
        // let m = d3.selectAll(".node")
        // m.select("circle").transition().duration(300).style("transform", "scale(1)")
        // m.select("image").transition().duration(300).style("transform", "scale(1)")

        // d3.selectAll(".link").transition().duration(300).style("opacity", "1")
      },

      applyFilter(g) {
        let x = []

        store.appliedFilters.togglePresence(g)
        // .forEach((f) => {
        //   let m = d3.selectAll(`.${f}`)
        //   m.select("circle").transition().duration(2000).style("transform", "scale(0)")
        //   m.select("image").transition().duration(300).style("transform", "scale(0)")
        //   m.each((n) => {
        //     x.pushUnique(n)
        //   })
        //   const y = x.forEach((c) => {
        //     d3.selectAll(`.link[target='${c.id}']`).transition().duration(2000).style("opacity", "0")
        //     d3.selectAll(`.link[source='${c.id}']`).transition().duration(2000).style("opacity", "0")
        //   })
        // })

        console.log(store.appliedFilters);
      }
    }
  }
</script>