<script setup>
  import MobilePanelComponent from '../components/MobilePanelComponent.vue'
  import * as d3 from 'd3'
</script>

<template>
  <mobile-panel-component></mobile-panel-component>
  <div id="zoom-buttons">
    <img src="/square-plus.svg" @click="incrementZoom(1)">
    <img src="/square-minus.svg" @click="incrementZoom(-1)">
  </div>
</template>

<script>
  export default {
    name: 'MobileView',
    components: {
      MobilePanelComponent
    },
    data () {
      return {
        charge: -1000,
        count: 5,
        currentZoom: 100,
        increment: 0,
        isMobile: /Android|iPhone/i.test(navigator.userAgent)
      }
    },
    mounted () {
      if (this.isMobile) {
        d3.select('#zoom-buttons').style('display', 'grid')
      }
    },
    methods: {
      incrementZoom (i) {
        if (this.increment+i > 5 || this.increment+i < -2) {
          this.increment = this.increment
        } else {
          this.increment += i
          document.querySelector("#panel-center").style.zoom = `${this.currentZoom+(this.increment*10)}%`;
        }
      }
    },
  }
</script>

<style lang="scss">
  #navbar {
    grid-area: navbar;
    background: #333333;
    display: flex;
    margin: auto 0 auto auto;
    height: 26px;
    width: 100%;
  }

  #panel-center {
    grid-area: panel-center;
    /* background: #444; */
    overflow-y: auto;
  }

  .nav-button-container {
    grid-area: nav-button-container;
    height: 100%;
    width: max-content;
    display: flex;
    justify-content: space-between;
    right: 0px;
    background: #6e6e6e;
    border-radius: 15px 0 0 15px;
  }

  #search-text {
    width: 100%;
    padding: 0px;
    position: relative;
    left: 20px;
    height: 26px;
    border-radius: 15px 0 0 15px;
    border: 7px solid white;
    text-align: center;
    font-size: 15px;
    letter-spacing: 0.05em;
    box-sizing: border-box;
    text-transform: uppercase;
    font-family: 'Dosis', sans-serif;
  }
  
  #zoom-buttons {
    display: none;
    position: absolute;
    bottom: 40px;
    right: 10px;
    z-index: 5;
    height: 80px;
    justify-content: space-between;
  }

  #zoom-buttons > img {
    width: 30px;
    height: 30px;
    background: white;
    border-radius: 21%;
  }

  #instructions {
    position : absolute;
    top: 40%;
    right: 0%;
    z-index: 2
  }
</style>