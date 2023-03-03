<script setup>
  import { store } from '@/stores/store.js'
  import apiService from "../mixins/apiService"
  import focusHelper from "../mixins/focusHelper"
  import * as d3 from 'd3'

</script>

<style scoped>
  .nav-button-container {
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

  #search-text:focus {
    outline: none;
  }
    
  .nav-button-container, #search-text{
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  #highlight {
    position: absolute;
    height: 100%;
    width: 27px;
    background: white;
    border-radius: 50%;
    right: 58px;
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

  #person-icon, #tv-icon {
    left: 8px;
  }

  #movie-icon {
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
    @keyup.enter="this.submitSearch($event.target.value)"
  >
  
  <div class="nav-button-container">
    <div id="highlight"></div>
 
    <div class="" id="search-button" @click="this.toggleOrSubmitOnClick()">
      <img src="../assets/search-icon.png" class="icon" id="search-icon">
    </div>

    <div 
      class="nav-button"  id="person-button" v-if="this.displayResultIcon('person') === true" >
      <div @click="this.setCurrentFocus('person')">
        <img src="../assets/person-icon.svg" class="icon" id="person-icon" >
      </div>
    </div>
    <div v-else></div>

    <div class="nav-button"  id="movie-button" v-if="this.displayResultIcon('movie') === true">
      <div @click="this.setCurrentFocus('movie')">
        <img src="../assets/movie-icon.svg" class="icon" id="movie-icon">
      </div>
    </div>
    <div v-else></div>

    <div class="nav-button" id="tv-button" v-if="this.displayResultIcon('tv') === true">
      <div @click="this.setCurrentFocus('tv')">
        <img src="../assets/tv-icon.svg" class="icon" id="tv-icon">
      </div>
    </div>

    <div class="nav-button" id="details-button" v-if="store.currentDetailId !== false" @click="this.setCurrentFocus('details')">
      <img src="../assets/details-icon.svg" class="icon" id="details-icon">
    </div>
    <div v-else></div>

    <div class="nav-button" id="commands-button" @click="this.setCurrentFocus('commands')">
      <img src="../assets/command-icon.svg" class="icon" id="commands-icon">
    </div>

    <div class="nav-button" id="about-button" @click="this.setCurrentFocus('about')">
      <img src="../assets/about-us-icon.svg" class="icon" id="about-us-icon">
    </div>
  </div>
</template>

<script>
  export default {
    name: "NavBar",

    data () {
      return {
        searchOpen: true
      }
    },
    methods: {
      displayResultIcon(resultType) {
        const list = store.searchResults.map(r => r['id'].split("-")[0])
        return list.includes(resultType)
      },

      toggleOrSubmitOnClick() {
        const d = d3.select("#search-text") 
        this.openField(d)
        store.currentFocus = "search"
        this.submitSearch(d.node().value)
      },
        
      async submitSearch(value) {
        const val = value.toUpperCase()
        if (val == '' || val == null) { 
          // maybe a helpful tip?
          return false
        }
        
        await apiService.methods.fetchSearchData(val)
        
        const tab = store.searchResults[0].id.split("-")[0]
        this.setCurrentFocus(tab)

        document.querySelector("#search-text").value = ''
      },

      setCurrentFocus(focus) {
        focusHelper.methods.set(focus)
      },

      openField(d) {
        d.transition().duration(0).delay(100)
        .style("width", "100%")
        .style("left", "7%")

        d3.select("#highlight").transition().duration(100)
        .style("left", "-1px")
      }
    }
  }
</script>