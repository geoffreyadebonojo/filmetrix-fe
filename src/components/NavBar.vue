<script setup>
  import { store } from '@/stores/store.js'

  const props = defineProps({
    focus:String,
    searchOpen:Boolean,
    searchResults:Array,
    setFocus: Function,
    default() {
      return {}
    },
    toggleOrSubmit: Function,
    default() {
      return {}
    },
    submitSearch: Function,
    default() {
      return {}
    }
  })
</script>

<style scoped>
  .nav-button-container {
    height: 100%;
    width: max-content;
    display: flex;
    justify-content: space-between;
    position: absolute;
    right: 0px;
    background: #6e6e6e;
    border-radius: 15px 0 0 15px;
  }

  #search-text {
    width: 50%;
    padding: 0px;
    border: 0px;
    position: relative;
    /* adjust to fit length */
    left: 7%;
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

  #search-text:focus {
    outline: none;
  }

  #highlight {
    position: absolute;
    height: 100%;
    width: 27px;
    background: white;
    border-radius: 50%;
    right: 77%;
  }

  #search-icon {
    height: 17px;
    margin: 4.5px 5.5px;
    /* top: 4px;
    padding: 0 4px 0 6px; */
  }

  #about-us-icon {
    height: 17px;
    margin: 4px 6px;
    /* width: 27px;
    top: 4px;
    left: 2px; */
  }

  #details-icon {
    height: 27px;
    left: 1.5px;
  }

  #commands-icon {
    height: 24px;
    top: 0.25px;
    left: 3px
  }

  #person-icon, #movie-icon, #tv-icon {
    height: 16px;
    top: 5px;
  }

  #person-icon {
    top: 5px;
    left: 8px;
  }

  #movie-icon {
    top: 5px;
    left: 6px;
  }

  .icon:hover {
    cursor: pointer;
  }

  .nav-button, .result-button {
    width: 28px;
  }
</style>

<template>
  <input 
    type="text" 
    placeholder="Search" 
    id="search-text"
    value="tom cruise"
    @keyup.enter="submitSearch($event.target.value)"
  >
  
  <div class="nav-button-container">
    <div id="highlight"></div>
 
    <div class="nav-button" @click="toggleOrSubmit()">
      <img src="../assets/search-icon.png" class="icon" id="search-icon">
    </div>

    <div 
      class="result-button" v-if="this.displayResultIcon('person') === true" >
      <div @click="setFocus('person')">
        <img src="../assets/person-icon.svg" class="icon" id="person-icon" >
      </div>
    </div>
    <div v-else></div>

    <div class="result-button" v-if="this.displayResultIcon('movie') === true">
      <div @click="setFocus('movie')">
        <img src="../assets/movie-icon.svg" class="icon" id="movie-icon">
      </div>
    </div>
    <div v-else></div>

    <div class="result-button" v-if="this.displayResultIcon('tv') === true">
      <div @click="setFocus('tv')">
        <img src="../assets/tv-icon.svg" class="icon" id="tv-icon">
      </div>
    </div>
    <div v-else></div>


    <div class="nav-button" @click="setFocus('details')">
      <img src="../assets/details-icon.svg" class="icon" id="details-icon">
    </div>

    <div class="nav-button" @click="setFocus('commands')">
      <img src="../assets/command-icon.svg" class="icon" id="commands-icon">
    </div>

    <div class="nav-button" @click="setFocus('about')">
      <img src="../assets/about-us-icon.svg" class="icon" id="about-us-icon">
    </div>
  </div>
</template>

<script>
  export default {
    name: "NavBar",

    methods: {
      displayResultIcon(resultType) {
        const list = store.searchResults.map(r => r['id'].split("-")[0])
        return list.includes(resultType)
      }
    }
  }
</script>