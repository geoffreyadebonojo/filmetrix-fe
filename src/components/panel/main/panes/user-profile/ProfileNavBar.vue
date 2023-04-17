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
        opacity: 0.85;
        margin: 6px;
        height: 15px;
        cursor: $cursor;
      }
    }
  }
</style>