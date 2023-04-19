<script setup>
  import {
    appStates,
    graphStates,
    panelStates,
    store 
  } from "@/stores/store.js"
  import { setFocus, openField } from '@mixins/helpers'
  import api from "@/mixins/api.js"
  import AboutButtonComponent from '@about/AboutButtonComponent.vue'
  import * as d3 from "d3"
</script>

<template>
  <div id="navbar">
    <input class="primary-nav"
           type="text" 
           placeholder="Search" 
           id="search-text"
           tabindex="-1"
           @keyup.enter="submitSearch($event.target.value)">
    
    <div class="nav-button-container">
      <div id="highlight"></div>
      <router-link class="primary-nav" 
                   id="search-button" 
                   to="#search" 
                   @click="toggleOrSubmitOnClick()">
        <img src="/search-icon.svg" class="icon" id="search-icon">
      </router-link>

      <router-link v-for="focus in resultIconList"
                   class="nav-button primary-nav"
                   v-bind:id="focus+ '-button'"
                   v-bind:to="'#' +focus"
                   v-bind:key="focus">
        <div @click="setFocus(focus)">
          <img v-bind:src="'/' +focus+ '-icon.svg'" class="icon" v-bind:id="focus + '-icon'" >
        </div>
      </router-link>

      <router-link v-if="panelStates.detailsData.id != null
                          && appStates.displayingAbout === false
                          && $attrs.type == 'main'" 
                   class="nav-button primary-nav" 
                   id="details-button" 
                   @click="setFocus('details')" to="#details">
        <img src="/details-icon.svg" class="icon" id="details-icon">
      </router-link>
      <div v-else></div>

      <router-link v-if="this.$attrs.type == 'main'"
                   class="nav-button primary-nav" 
                   id="commands-button" 
                   to="#commands"
                   @click="setFocus('commands')">
        <img src="/command-icon.svg" class="icon" id="commands-icon">
      </router-link>

      <!--router-link class="nav-button primary-nav"
                   id="profile-button"
                   to="#profile"
                   @click="setFocus('profile')">
        <img src="/settings-gear.svg" v-bind:class="panelStates.currentFocus === 'profile' ? 'gear active' : 'gear'"/>
      </router-link-->

      <router-link v-if="$attrs.type == 'main'"
                   class="nav-button" 
                   id="about-us-transition-button" 
                   to="#about">
        <about-button-component></about-button-component>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBarComponent",
  data () {
    return {
      searchOpen: true
    }
  },
  mounted () {
    d3.select("#navbar").transition().delay(300).duration(200).style("width", "100%")
  },
  computed: {
    resultIconList: () => {
      return store.searchResults.map(r => r['id'].split("-")[0]).unique()
    }
  },
  methods: {
    async submitSearch(value) {
      const val = value.toUpperCase()
      if (val == '' || val == null) { return false }
      
      await api.fetchSearchData(val).then((response) => {
        store.searchResults = response
        const tab = store.searchResults[0].id.split("-")[0]
        setFocus(tab)
        document.querySelector("#search-text").value = ''
      })
    },
    
    toggleOrSubmitOnClick() {
      const d = d3.select("#search-text") 
      openField(d)
      const val = d.node().value
      if (val == '' || val == null) { 
        panelStates.currentFocus = "empty"
        return false
      }
      panelStates.currentFocus = "search"
      this.submitSearch(val)
    }
  }
}
</script>

<style scoped lang="scss">
  $nav-content-height: 27px;

  .gear {
    height: 17px;
    width: 25px;
    margin: 5px 0px 5px 2px;
    opacity: 0.9;

    &:hover {
      animation-name: rotateLabel;
      animation-duration: 10s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      }
  }

  .gear.active {
    animation-name: rotateLabel;
    animation-duration: 10s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  @keyframes rotateLabel {
    0% {
      transform: rotate(0deg);
    } 
    100% {
      transform: rotate(360deg);
    }
  }

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
    // width: max-content;
    // if you remove this, then the icons
    // become conveniently vertical
    // requires router-link display vertical, height 27px
    // display: inline-table;
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
    border-radius: 15px 0 0 15px;
    border: 7px solid white;
    text-align: center;
    font-size: 15px;
    letter-spacing: 0.05em;
    box-sizing: border-box;
    text-transform: uppercase;
    font-family: $global-font;
    left: 20px;
    top: 0px
  }

  #search-text:focus {
    outline: none;
  }
    
  .nav-button-container, #search-text{
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    height: $nav-content-height;
  }

  #highlight {
    position: absolute;
    height: $nav-content-height;
    width: $nav-content-height;
    background: white;
    border-radius: 50%;
  }

  #search-icon {
    height: 16px;
    margin: 4.5px 5.5px;
  }

  #details-icon {
    height: 27px;
    left: 1.5px;
  }

  #commands-icon {
    height: 24px;
    top: 0.5px;
    left: 2px;
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
    width: $nav-content-height + 1;

    // &:hover {
    //   cursor: $cursor;
    // }
  }
</style>
