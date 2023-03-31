<script setup>
  import focusHelper from "@/mixins/focusHelper"
  import api from "@/mixins/api.js"
  import { store } from "@/stores/store.js"
  import * as d3 from "d3"
</script>

<template>
  <div id="navbar">
    <input 
      type="text" 
      placeholder="Search" 
      id="search-text"
      tabindex="-1"
      @keyup.enter="this.submitSearch($event.target.value)"
    >
    
    <div class="nav-button-container">
      <div id="highlight"></div>
  
      <router-link id="search-button" @click="this.toggleOrSubmitOnClick()" to="#search">
        <img src="/search-icon.svg" class="icon" id="search-icon">
      </router-link>

      <router-link class="nav-button" id="person-button" v-if="this.displayPersonIcon() === true" to="#people">
        <div @click="this.setCurrentFocus('person')">
          <img src="/person-icon.svg" class="icon" id="person-icon" >
        </div>
      </router-link>
      <div v-else></div>

      <router-link class="nav-button" id="movie-button" v-if="this.displayMovieIcon() === true" to="#movies">
        <div @click="this.setCurrentFocus('movie')">
          <img src="/movie-icon.svg" class="icon" id="movie-icon">
        </div>
      </router-link>
      <div v-else></div>

      <router-link class="nav-button" id="tv-button" v-if="this.displayTvIcon() === true" to="#tv-shows">
        <div @click="this.setCurrentFocus('tv')">
          <img src="/tv-icon.svg" class="icon" id="tv-icon">
        </div>
      </router-link>

      <router-link class="nav-button" id="details-button" v-if="store.currentDetailId !== false" @click="this.setCurrentFocus('details')" to="#details">
        <img src="/details-icon.svg" class="icon" id="details-icon">
      </router-link>
      <div v-else></div>

      <router-link class="nav-button" id="commands-button" @click="this.setCurrentFocus('commands')" to="#commands">
        <img src="/command-icon.svg" class="icon" id="commands-icon">
      </router-link>

      <!-- <router-link class="nav-button" id="about-button" @click="transitionToAbout()" to="/about"> -->
      <router-link class="nav-button" id="about-button" to="/about">
        <img src="/about-us-icon.svg" class="icon" id="about-us-icon">
      </router-link>

    </div>
  </div>
</template>

<script>
export default {
  name: "NavBarComponent",
  mixins: [focusHelper, api],
  data () {
    return {
      searchOpen: true
    }
  },
  mounted () {
    d3.select("#navbar").transition().delay(300).duration(200).style("width", "100%")
  },
  methods: {
    async submitSearch(value) {
      const val = value.toUpperCase()
      if (val == '' || val == null) { 
        // maybe a helpful tip?
        return false
      }
      await api.fetchSearchData(val)
      
      const tab = store.searchResults[0].id.split("-")[0]
      //handle for no id
      this.setCurrentFocus(tab)
      document.querySelector("#search-text").value = ''
    },
    
    displayPersonIcon: function() {
      const list = store.searchResults.map(r => r['id'].split("-")[0])
      return list.includes('person')
    },

    displayMovieIcon: function() {
      const list = store.searchResults.map(r => r['id'].split("-")[0])
      return list.includes('movie')
    },

    displayTvIcon: function() {
      const list = store.searchResults.map(r => r['id'].split("-")[0])
      return list.includes('tv')
    },

    toggleOrSubmitOnClick() {
      const d = d3.select("#search-text") 
      focusHelper.methods.openField(d)
      
      const val = d.node().value
      // clean up
      if (val == '' || val == null) { 
        // maybe a helpful tip?
        store.currentFocus = "empty"
        // still stuck with 'pick up where you left off' even after switching tabs
        return false
      }

      store.currentFocus = "search"
      this.submitSearch(val)
    },

    setCurrentFocus(focus) {
      focusHelper.methods.set(focus)
    }
  }
}
</script>

<style scoped lang="scss">
  #navbar {
    grid-area: navbar;
    background: $panel-body-grey;
    display: flex;
    margin: auto 0 auto auto;
    height: 26px;
    width: 0%;

    *:hover {
      cursor: $cursor;
    }
  }
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
    font-family: $global-font;
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
    height: 16px;
    margin: 4.5px 5.5px;
  }

  #about-us-icon {
    height: 17px;
    margin: 4px 6px;
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

  .nav-button, .result-button {
    width: 28px;
  }

  #back-button {
    display: none;
    top: 50px;
    position: absolute;
    height: 16px;
    margin: 0px 10px 6px 10px;
    transform: rotate(0deg);
  }
</style>
