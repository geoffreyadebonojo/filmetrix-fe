<script setup> 
  import MovieList from "./MovieList.vue"
  import { 
    appStates,
    userStates
  } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from "d3"
</script>

<template>
  <div id="user-profile-container" v-if="this.$data.loggedIn">
    <div id="logout-button" class="tooltip" @click="submitLogout()">
      <span class="tooltiptext">Log out</span>
      <img src="/exit.svg"/>
    </div>

    <div id="user-name">{{ userStates.currentUser.username }}</div>

    <!-- last fallback -->
    <!-- <div id="profile-image-container" v-if="userStates.currentUser.profileImage == null">
      letter in circle
    </div> -->

    <!-- generated -->
    <!-- <div id="profile-image-container" v-if="userStates.currentUser.profileImage == null">
      <img id="awesome" v-bing:src="userStates.currentUser.profileImage" />
    </div> -->

    <!-- primary  -->
    <div id="profile-image-container">
      <img v-bind:src="userStates.currentUser.profileImage" />
    </div>

    <img id="pencil" src="/pencil.svg"/>

    <movie-list></movie-list>
  </div>

  <div id="logout-msg" v-else>
    Logged out
  </div>
</template>

<script>
  export default {
    name: "ProfileBody",
    data () {
      return {
        loggedIn: this.$attrs.loggedIn
      }
    },
    methods: {
      async submitLogout() {
        const resp = await api.logoutUser()
  
        if (resp.status == 200) {
          this.$data.loggedIn = false
          userStates.loggedIn = false
          userStates.currentUser = {}
        } else {
          throw new Error("logout failed")
          // manually clear headers from localstorage
          // userStates.loggedIn = false
          // userStates.currentUser = {}
        }
      }
    }
  }
</script>

<style scope lang="scss">
  .tooltiptext {
    @include pulse;
    @keyframes pulsate {
    0% { transform: translate(0px, 0px) scale(1); opacity: 0.8}
    50% { transform: translate(-1.5px, 0px) scale(1.08); opacity: 1}
    100% { transform: translate(0px, 0px) scale(1); opacity: 0.8}
  }

    font-family: $global-font;
    visibility: hidden;
    width: 71px;
    color: #fff;
    text-align: right;
    position: absolute;
    z-index: 10;
    top: -28px;
    right: -11px;
  }
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }

  #user-profile-container {
    margin: auto;
    display: grid;
    width: 100%;
    grid-template-areas:
        ". . profile-container logout ."
        ". . user-name pencil ."
        "movie-list movie-list movie-list movie-list movie-list ";
    grid-template-rows: 120px 25px 1fr;
    grid-template-columns: 1fr 30px 150px 30px 1fr;
    padding-top: 20px;

    #user-name {
      grid-area: user-name;
      margin: auto auto 0 auto;
      font-family: $global-font;
      font-size: 20px;
    }
    
    #logout-button {
      grid-area: logout;
      margin: 5px auto auto auto;
      opacity: 0.65;
      
      &:hover {
        cursor: $cursor;
        opacity: 1;
      }
      img {
        height: 15px;
      }
    }
    
    #pencil {
      grid-area: pencil;
      height: 15px;
      margin: auto;
      opacity: 0.65;
      
      &:hover {
        cursor: $cursor;
        opacity: 1;
      }
    }
    
    #profile-image-container {
      grid-area: profile-container;
      height: 100%;
      width: 100%;
      display: flex;

      img {
        grid-area: awesome;
        height: 100%;
        margin: auto;
      }
    }
  }

  #logout-msg {
    margin: 30vh auto auto auto;
    font-family: $global-font;
    font-size: 50px;
  }
</style>