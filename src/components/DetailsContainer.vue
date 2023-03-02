<script setup>
  import apiService from "../mixins/apiService"
  import { store } from '@/stores/store.js'
</script>

<template>
  <div class="details-container" v-bind:id="store.detailsData.id + '-details'">
      <img id="poster" v-bind:src="store.detailsData.poster">

        <div id="name">{{ store.detailsData.name }}</div>
        <div id="birthday">{{ store.detailsData.year }}</div>
        <div id="links">
          <a id="imdb" v-bind:href="store.detailsData.imdbId">
            <img src="../assets/imdb-icon.png">
          </a>
          <a id="youtube">
            <img src="../assets/youtube-icon.png">
          </a>
        </div>
        <div id="description">
          {{  store.detailsData.summary }}
        </div>
        <div id="fade-top"></div>
        <div id="fade-bottom"></div>
  </div>

</template>

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
    bottom: 0px;
    height: 20px;
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
    grid-template-columns: 79px 10px 50px 50px 1fr;
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

<script>
  export default {
    name: "DetailsContainer",
    props: {},
    async created () {
      await apiService.methods.fetchDetails(store.currentDetailId.split("-")[1])
      store.currentFocus = "details"
    }
  }
</script>