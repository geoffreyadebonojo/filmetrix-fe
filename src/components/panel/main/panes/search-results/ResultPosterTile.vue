<script setup>
  import graph from "@mixins/graph"
  import api from "@mixins/api"
  import {
    panelStates,
    store
  } from '@/stores/store.js'
  import * as d3 from 'd3'
  import { global } from '@/mixins/global.js'
</script>

<template>
  <div class="poster-tile"
       v-bind:id="this.$attrs.result.id"
       tabindex="0"
       :key="this.$data.resultId"
       @dblclick="fetchNodesAndDetails(this.$attrs.result)"
       @keypress="fetchNodesAndDetails(this.$attrs.result)">  
    <img v-bind:src="this.$attrs.result.poster"/>
    <div>
      {{ this.$attrs.result.name }}
    </div>
    <div v-if="this.$attrs.result.poster == ''">
      <br>
      <div v-if="this.$attrs.result.entity == 'person'">
        [ {{ this.$attrs.result.knownForDepartment }} ]
      </div>
      <div v-else-if="this.$attrs.result.entity == 'movie' && this.$attrs.result.year != null">
        [ {{ this.$attrs.result.year }} ]
      </div>
      <div v-else></div>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
  export default {
    name: 'ResultPosterTile',
    data () {
      return {
        onGraph: false,
        posterElem: null,
        resultId: this.$attrs.result.id
      }
    },
    
    mounted () {
      d3.select(`#${this.$attrs.result.id}`).call(
        d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      )
      const ent = this.$attrs.result.entity
      console.log(this.$attrs.result.id)

      function dragstarted(e) {
        const z = d3.select(this)
        
        z.select("img")
        .transition().duration(0)
        .style("transform", "scale(0.6)")
        
        z.transition().duration(50)
        .style("width", "100px")
        .style("height", "100px")
        .style("border-radius", "50%")
        .style("border", "1.5px solid")
        .style("padding", "16px")

        z.transition().duration(50).delay(50)
        .style("transform", "scale(0.6)")
        
        z.selectAll("div").style("display", "none")
        
        if (z.node().__vnode.props.result.poster == ""){
          z.classed(`no-poster-${ent}`, true)
        }
      }

      function dragged(e) {
        const z = d3.select(this)
        
        z.classed("fixed", true)
        const x = e.sourceEvent.clientX - z.node().clientWidth/2
        const y = e.sourceEvent.clientY - z.node().clientHeight/2
        z.style("top", `${y-10}px`).style("left", `${x-6}px`)
      }
      
      async function dragended(e) {
        const z = d3.select(this)
        
        z.select("img")
        .transition().duration(0)
        .style("transform", "scale(1)")
        .style("border-radius", "8px")
        
        z.transition().duration(50)
        .style("width", "73px")
        .style("height", "109px")
        .style("border-radius", "8px")
        .style("border", "1px solid")
        .style("padding", "unset")
        .transition().duration(50).style("transform", "scale(1)")
        
        const cx = e.sourceEvent.clientX - z.node().clientWidth/2
        const gw = window.innerWidth-panelStates.width

        if (cx < gw) {
          z.transition().duration(200)
          .style("transform", "scale(0)")
          z.style("display", "none")

          store.searchResults.remove(result)
          addNodes()
        } else {
          z.classed("fixed", false)
          z.style("left", "0px")
          .style("top", "0px")
          z.selectAll("div").style("display", "block")
          z.classed(`no-poster-${ent}`, false)
        }
      }

      const result = this.$attrs.result
      const fetchNodes = this.fetchNodesAndDetails
      function addNodes() {
        fetchNodes(result)
      }
    },
    methods: {
      async fetchNodesAndDetails(result) {
        // panelStates.isOpen = false
        await api.fetchDetails(result.id)
        // const graph = new Graph()
        // const graph.draw()
        // ???
        await graph.callForNodes(result, "main")
      }
    }
  }
</script>

<style scope lang="scss">
  .fixed {
    position: fixed;
    background: $panel-body-grey;
    z-index: 1000;
  }
  
  .no-poster {
    &-movie {
      background-image: url("/movie-icon.svg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 40px;
      background-color: $panel-body-grey;
    }

    &-person {
      background-image: url("/person-icon.svg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 40px;
      background-color: $panel-body-grey;
    }

    &-tv {
      background-image: url("/tv-icon.svg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 40px;
      background-color: $panel-body-grey;
    }
  }

  .poster-tile {
    @include poster-tile;

    img {
      transform-origin: 35px 12px;
    }

    // div:first-of-type {
    //   background: $panel-body-grey;
    // }

    &:hover {
      z-index: 10;
    }
  }

</style>