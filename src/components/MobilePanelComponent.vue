<script setup>
  import NavBar from './NavBar.vue'
  import PanelCenter from './PanelCenter.vue'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>


<template>
  <div id="mobile-panel-body">
    <div id="navbar">
      <NavBar />
    </div>
    <PanelCenter id="mobile-variant"/>
  </div>
</template>

<style>
  #mobile-panel-body {
    width: 100vw;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 20px 25px 20px;
    grid-template-areas:
      ". . ."
      ". nav nav"
      ". . .";
    background: #333333;
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 2;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  #search-text {
    position: absolute;
    left: 0px;
    width: 75% !important;
  }

  #navbar {
    grid-area: nav;
    height: 25px;
  }

  .nav-button-container {
    position: absolute;
    top: 0px;
    height: 103%
  }

  .details-component{
    height: 44vh;
    width: 100vw;

  }
  
  #mobile-variant > .details-container {
    height: 48%;
    width: 50%;
    display: grid;
    grid-template-columns: 79px 10px 55px;
    grid-template-rows: 34px 0px 10px;
    padding: 10px;
    /* gap: 10px; */
    grid-template-areas:
        "poster . name name name"
        "poster . birthday links ."
        ". . . . ."
        "ft ft ft ft ft"
        "desc desc desc desc desc";
    overflow: hidden;
  }
</style>