<script setup>
  import { store } from '@/stores/store.js'
  import api from '@/mixins/api'
  import * as d3 from 'd3'
</script>

<template>
  <div id="nav-arrows" v-if="showNavArrows">
    <div id="left-arrow">
      <img v-if="showLeftArrow"
      src="/angle-double-small-left.svg" 
      @click="adjustId(-1)">
    </div> 
    <div id="right-arrow">
      <img v-if="showRightArrow"
      src="/angle-double-small-right.svg" 
      @click="adjustId(1)">
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      showNavArrows: () => {
        return store.currentFocus === 'details' && store.currentDetailId !== false && store.displayingAbout == false
      },
      showLeftArrow: () => {
        return store.existing.length > 1 && store.existing[0][0] !== store.currentDetailId
      },
      showRightArrow: () => {
        return store.existing.length > 1 && store.existing.last()[0] !== store.currentDetailId
      }
    },
    methods: {
      async adjustId(i) {
        const dc = d3.selectAll(".details-component")
        
        dc.style("left", () => {
          return `${i*100}%`
        })
        
        let ids = store.existing.map(d => d[0])
        let currentIndex = ids.indexOf(store.currentDetailId)
        let changeId
        
        changeId = ids[currentIndex + i]
        
        await api.fetchDetails(changeId)
        
        dc.transition()
        .duration(500)
        .style("left", "0%")
      }
    }
  }
</script>

<style lang="scss">
  #nav-arrows {
    grid-area: arrows;
    display: flex;
    justify-content: space-between;
    z-index: 7;

    img {
      height: 25px;
    }
    
    #left-arrow, #right-arrow {
      opacity: 0.5;
      
      &:hover {
        cursor: $cursor;
        opacity: 1;
      }
    } 
  }
</style>