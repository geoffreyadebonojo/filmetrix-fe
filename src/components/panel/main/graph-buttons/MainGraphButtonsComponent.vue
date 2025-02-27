<script setup>
  import GenerateLinkButton from './GenerateLinkButton.vue'
  import ClearGraphButton from './ClearGraphButton.vue'
  import SaveGraphButton from './SaveGraphButton.vue'
  import api from "@mixins/api"
  import * as d3 from 'd3'
</script>

<template>
  <generate-link-button></generate-link-button>
  <clear-graph-button></clear-graph-button>
  <save-graph-button v-if="this.slug"></save-graph-button>

  <div class="graph-control-buttons" id="centering-button"></div>
  <div class="graph-control-buttons" id="nav-lock-button"></div>
</template>

<script>
  export default {
    name: "MainGraphButtonsComponent",
    data () {
      return {
        slug: this.$route.query.gid
      }
    },
    mounted() {
      d3.select("#nav-lock-button").style("opacity", (d) => {
        const isSticky = JSON.parse(localStorage.getItem("sticky"))
        let opacity =     isSticky ? "1" : "0.5"
        return opacity 
      }).style("background-image", (d) => {
        const isSticky = JSON.parse(localStorage.getItem("sticky"))
        let lockSetting = isSticky ? "url('/lock-closed.svg')" : "url('/lock-open.svg')"
        return lockSetting
      })

      if (this.slug) {

      }
    }
  }
</script>

<style lang="scss">
  .graph-control-buttons {
    background: none;
    display: none;
    width: 20px;
    position: absolute;
    z-index: 1;
    opacity: 0.5;
    cursor: $cursor;

    &:hover {
      opacity: 1;
      transition-property: opacity;
      transition-duration: 0.25s;
    }
    transition-property: opacity;
    transition-duration: 0.25s;

    p {
      right: 80px;
      width: 75px;
      opacity: 1;
      text-transform: uppercase;
      font-family: $global-font;
      font-weight: bold;
      text-align: center;
      color: white;
    }
  }

  #nav-lock-button {
    background-image: url("/lock-open.svg");
    // opacity: 0.5;
    background-size: contain;
    bottom: 60px;
    width: 20px;
    height: 20px;
  }

  #centering-button {
    background-image: url("/center-graph-icon.svg");
    background-size: contain;
    bottom: 20px;
    width: 20px;
    height: 20px;
  }
</style>