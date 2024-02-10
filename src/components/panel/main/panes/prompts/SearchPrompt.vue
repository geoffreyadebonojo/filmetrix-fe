<script setup>
  import { global } from '@/mixins/global.js'
  import * as d3 from 'd3'
</script>

<template>
  <div class="prompt" id="search-prompt" @click="focusSearchBar()">
    <p class="apply-effect">search for a movie or actor</p>
  </div>
</template>

<script>
  export default {
    name: "SearchPrompt",
    data () {
      return {
        searchHighlightColor: global.nav.searchText.color
      }
    },
    mounted () {
      d3.select("#search-prompt").transition().delay(200).duration(200).style("opacity", 1)
    },
    methods: {
      focusSearchBar() {
        document.querySelector('#search-text').focus()

        this.flashHighlight(d3.select("#search-text"))
        this.flashHighlight(d3.select("#highlight"))
      },
      
      flashHighlight (field) {
        field
        .style("background", this.$data.searchHighlightColor.emphatic)
        .style("border", this.$data.searchHighlightColor.emphatic)
        .transition().duration(250)
        .style("background", this.$data.searchHighlightColor.primary)
        .style("border", this.$data.searchHighlightColor.primary)
      }
    }
  }
</script>