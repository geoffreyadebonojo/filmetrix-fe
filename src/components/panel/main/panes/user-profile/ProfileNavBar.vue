<script setup>
  import {
    panelStates
  } from '@/stores/store.js'
  import * as d3 from "d3"
</script>

<template>
  <div id="profile-nav-wrapper">
    <div id="profile-nav">
      <div class="profile-nav-buttons" id="movies" @click="changeArea('movies')">
        <img src="/saved-movies.svg"/>
      </div>
      <div class="profile-nav-buttons" id="graphs" @click="changeArea('graphs')">
        <img src="/chart-network.svg"/>
      </div>
      <div class="profile-nav-buttons" id="friends" @click="changeArea('friends')">
        <img src="/friends.svg"/>
      </div>
      <div class="profile-nav-buttons" id="settings" @click="changeArea('settings')">
        <img src="/settings-bars-black.svg"/>
      </div>
    </div>
    <div id="logout-button" class="tooltip" @click="submitLogout()">
      <span class="tooltiptext">Log out</span>
      <img src="/exit.svg"/>
    </div>
  </div>
    
</template>

<script>
  export default {
    data() {
      return {
        profileFocus: 'movies'
      }
    },
    mounted () {
      const f = panelStates.profileTab
      d3.select(`#${f}`).classed("focused", true)
      this.$emit('changeFocus', f)
    },
    methods: {
      changeArea(f) {
        this.$data.profileFocus = f
        d3.selectAll(".profile-nav-buttons").classed("focused", false)
        d3.select(`#${f}`).classed("focused", true)
        panelStates.profileTab = f
        this.$emit('changeFocus', f)
      }
    }
  }
</script>

<style scoped lang="scss">

#logout-button {
  grid-area: logout;
  margin: 5px auto auto auto;
  opacity: 0.65;
  top: 10px;
  left: 7px;
  
  &:hover {
    cursor: $cursor;
    opacity: 1;
  }
  img {
    height: 15px;
  }
}

  .focused {
    background: white;
    height: 25px;
    width: 25px;
    border-radius: 50%;
  }
  
  #profile-nav-wrapper {
    grid-area: profile-nav;
    background: none;
    position: sticky;
    top: 0px;
    z-index: 1000;
  }

  #profile-nav {
    margin: auto 0 auto auto;
    z-index: 1000;
    background: #6e6e6e; //$nav-background-grey;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;

    div {
      height: 27px;
      width: 27px;

      img {
        opacity: 0.75;
        margin: 6px;
        height: 15px;
        cursor: $cursor;
      }
    }
  }



  .tooltiptext {
    animation-name: tooltip-pulse;
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    @keyframes tooltip-pulse {
    0% { transform: translate(0px, 0px) scale(1); opacity: 0.8}
    50% { transform: translate(-1.5px, 0px) scale(1.08); opacity: 1}
    100% { transform: translate(0px, 0px) scale(1); opacity: 0.8}
  }

    font-family: $global-font;
    visibility: hidden;
    font-size: 15px;
    width: 71px;
    color: #FFFFFF;
    text-align: right;
    position: absolute;
    font-weight: 900;
    z-index: 10;
    top: -2px;
    right: 35px;
  }
 
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }

  #logout-msg {
    margin: 30vh auto auto auto;
    font-family: $global-font;
    font-size: 50px;
  }
</style>