<script setup>
  import api from "../mixins/api"
  import focusHelper from '../mixins/focusHelper'
  import helpers from '../mixins/helpers'
  import graphBuilder from '../mixins/graphBuilder'
  import { settingsModule } from '../mixins/settingsModule'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div 
    class="details-container" 
    v-bind:id="store.detailsData.id + '-details'"
  >
    <img id="poster" 
      v-bind:src="store.detailsData.poster"
      @mouseenter="this.highlightNodes(store.detailsData.id)"
      @mouseleave="this.unhighlightNodes(store.detailsData.id)"
    >
    <div id="name">{{ store.detailsData.name }}</div>
    <div id="birthday">{{ store.detailsData.year }}</div>
    <div id="links">
      <a id="imdb" 
        v-bind:href="store.detailsData.imdbId"
        target="_blank">
        <img src="assets/imdb-icon.png">
      </a>
      <a id="youtube"
        v-if="store.detailsData.id.split('-')[0] !== 'person'"
        v-bind:href="'https://www.youtube.com/results?search_query=' + store.detailsData.name.split(' ').join('+') + ' ' + store.detailsData.year"
        target="_blank">
        <img src="assets/youtube-icon.png">
      </a>
    </div>
    <div id="description">
      {{  store.detailsData.summary }}
    </div>
    <div id="fade-top"></div>
    <div id="fade-bottom"></div>
  </div>
</template>

<script>
  export default {
    name: "Details",
    mounted () {
      focusHelper.methods.set('details')
    },
    methods: {
      highlightNodes(id) {
        let target= d3.select(`#${id}`).node()

        if (target == undefined) { return }

        graphBuilder.nodeTransformer(target, "scale(1.05)", "aliceblue", "white")
      },
      unhighlightNodes(id) {
        let target= d3.select(`#${id}`).node()

        if (target == undefined) { return }

        let defaultColor = settingsModule.strokeColor
        graphBuilder.nodeTransformer(target, "scale(1)", defaultColor, "none")
      }
    }
  }
</script>

<style scoped>
  #fade-top {
    grid-area: ft;
  }
  
  #fade-top::before {
    position: absolute;
    content: '';
    background: linear-gradient(to top, transparent 50%, #333 100%);
    width: 100%;
    bottom: -25px;
    height: 25px;
  }

  #fade-bottom {
    grid-area: fb;
  }
  
  #fade-bottom::before {
    position: absolute;
    content: '';
    background: linear-gradient(to bottom, transparent 0%, #333 100%);
    width: 100%;
    top: -15px;
    height: 15px;
  }
  
  #description {
    grid-area: desc;
    font-family: 'Dosis', sans-serif;
    margin-top: 0px;
    height: 100%;
    width: 100%;

    line-height: 26px;
    letter-spacing: 0.07em;

    color: white;
    text-shadow: 1px 0px black;
    overflow-y: auto;
    font-size: 16px;
    font-weight: 300;
    line-height: 26px;
    letter-spacing: 0.002em;
  }

  .details-container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 79px 10px 55px 50px 1fr;
    grid-template-rows: 95px 21px 10px 1fr 17fr;
    padding: 10px;
    /* gap: 10px; */
    grid-template-areas:
    "poster . name name name"
    "poster . birthday links ."
    ". . . . ." 
    "ft ft ft ft ft"
    "desc desc desc desc desc"
    "fb fb fb fb fb";

    overflow: hidden;
  }

  #poster {
    grid-area: poster;
    width: 79px;
    border-radius: 8px;
  }

  #poster:hover {
    cursor: pointer;
    box-shadow: 0em 0em 5px 5px rgb(240 248 255 / 5%);
  }

  #name {
    grid-area: name;
    font-family: 'Dosis', sans-serif;
    height: 100%;
    width: 100%;
    
    line-height: 1em;
    margin-top: 0px;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 3px;
    font-weight: 900;
    text-transform: uppercase;
    color: white;
    text-shadow: 1px 0px black;
  }
  
  #birthday {
    grid-area: birthday;
    font-family: 'Dosis', sans-serif;
    line-height: 1em;
    font-weight: 900;
    font-size: 24px;
    color: white;
    text-shadow: 1px 0px black;
    position: absolute;
    bottom: 0px;
    left: 0px;
  }

  #links {
    grid-area: links;
    display: flex;
    justify-content: space-between;
    margin: auto 0 0 0;
  }

  #imdb {
    grid-area: imdb;
    height: 100%;
  }

  #imdb > img {
    height: 20px;
  }

  #youtube {
    grid-area: youtube;
    height: 100%;
  }

  #youtube > img {
    height: 20px;
  }
</style>
