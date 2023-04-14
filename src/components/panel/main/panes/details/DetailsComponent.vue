<script setup>
  import DetailsPosterTile from './DetailsPosterTile.vue'
  import BookmarkButton from './BookmarkButton.vue'
  import ExternalLinks from './ExternalLinks.vue'
  import {
    appStates,
    graphStates,
    panelStates,
    userStates, 
    store 
  } from '@/stores/store.js'
  import { setFocus } from '@mixins/helpers'
  import api from "@mixins/api"
  import * as d3 from 'd3'
</script>

<template>
  <div v-if="panelStates.detailsData.id != null" v-bind:id="panelStates.detailsData.id + '-details'">
    <details-poster-tile></details-poster-tile>
    <div id="name">
      {{ panelStates.detailsData.name }}
    </div>
    <bookmark-button v-if="userStates.loggedIn"></bookmark-button>
    <div id="birthday">
      {{ panelStates.detailsData.year }}
    </div>
    <external-links></external-links>
    
    <div v-if="panelStates.detailsData.summary != ''" id="description">
      {{  panelStates.detailsData.summary }}
    </div>
    <div v-else id="no-summary-available">
      <p style="letter-spacing:0.2em; margin-bottom:5vh">¯\_(ツ)_/¯</p>
      no summary available
    </div>
    <div id="fade-top"></div>
    <div id="fade-bottom"></div>
  </div>
  <div v-else></div>
</template>

<script>
  export default {
    name: "DetailsComponent",
    async mounted () {
      setFocus('details')
      d3.selectAll(".details-component").transition().delay(100).duration(500).style("left", "0%")
    }
  }
</script>

<style scoped lang="scss">
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
  
  #description, #no-summary-available {
    grid-area: desc;
    font-family: $global-font;
    margin-top: 0px;
    height: 100%;
    width: 100%;
    color: white;
    text-shadow: 1px 0px black;
    overflow-y: auto;
  }

  #description {
    padding-top: 5px;
    padding-bottom: 20px;
    font-size: 16px;
    font-weight: 300;
    line-height: 26px;
    letter-spacing: 0.002em;
  }

  #no-summary-available {
    margin-top: 5vh;
    font-size: 30px;
    font-weight: 300;
    letter-spacing: 0.002em;
    text-transform: uppercase;
  }

  .details-component {
    height: 83vh;
    width: 100%;
    display: grid;
    grid-template-columns: 79px 10px 55px 1fr 36px;
    grid-template-rows: 95px 21px 10px 30px 17fr;
    padding: 10px;
    grid-template-areas:
      "poster . name name bookmark ."
      "poster . birthday links . ."
      ". . . . . ."
      "ft ft ft ft ft ft"
      "desc desc desc desc desc desc"
      "fb fb fb fb fb fb";
    overflow: hidden;

    left: 0%;
  }

  #name {
    grid-area: name;
    font-family: $global-font;
    height: 100%;
    width: 100%;
    overflow: scroll;
    line-height: 1em;
    margin-top: 0px;
    font-size: 18px;
    line-height: 22px;
    // letter-spacing: 3px;
    font-weight: 900;
    text-transform: uppercase;
    color: white;
    text-shadow: 1px 0px black;
  }
  
  #birthday {
    grid-area: birthday;
    font-family: $global-font;
    line-height: 1em;
    font-weight: 900;
    font-size: 24px;
    color: white;
    text-shadow: 1px 0px black;
    position: absolute;
    bottom: 0px;
    left: 0px;
  }
</style>
