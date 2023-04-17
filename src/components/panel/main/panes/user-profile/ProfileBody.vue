<script setup> 
  import MovieList from "./MovieList.vue"
  import ProfileNavBar from "./ProfileNavBar.vue"
  import GraphStacks from "./GraphStacks.vue"
  import { 
    appStates,
    graphStates,
    userStates
  } from '@/stores/store.js'
  import api from "@mixins/api"
  import graph from "@mixins/graph"
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

    <profile-nav-bar @change-focus="changeFocus"></profile-nav-bar>

    <movie-list class="profile-inner-panel"  v-if="this.$data.profileFocus == 'movies'"></movie-list>
    <graph-stacks class="profile-inner-panel" v-else-if="this.$data.profileFocus == 'graphs'"></graph-stacks>
    <div style="grid-area:lower-field" v-else-if="this.$data.profileFocus == 'friends'">friends</div>
    <div style="grid-area:lower-field" v-else-if="this.$data.profileFocus == 'settings'">settings</div>
    <div v-else></div>

    <!-- <div style="grid-area:lower-field; padding-top:30px; display:flex">
      <p style="margin:auto 0">pack</p>
      <label class="switch">
        <input type="checkbox" checked @click="toggleLinks($event)">
        <span class="slider round"></span>
      </label>
      <p style="margin:auto 0">tree</p>
      <div class="slidecontainer">
        <input type="range" min="1" max="100" value="50" class="slider" id="myRange" @input="change($event)" style="width:100%">
      </div>
    </div> -->
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
        loggedIn: this.$attrs.loggedIn,
        profileFocus: 'movies'
      }
    },
    methods: {
      changeFocus(f) {
        this.$data.profileFocus = f
      },

      
      
      // toggleLinks(e) {
      //   graphStates.graphType = e.currentTarget.checked ? "tree" : "pack"
        
      //   let data
      //   let nodes = []
      //   let links = []
        
      //   graphStates.existing.forEach((d) => {
      //     data = graphStates.graphData[d[0]]
      //     nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
      //     links = links.concat(data.links.slice(0,d[1]))
      //   })
        
      //   graph.draw({
      //     nodes: nodes.uniqueById(),
      //     links: links,
      //     type: "main"
      //   })

      //   d3.select(".links").style("display", e.currentTarget.checked ? "block" : "none")
      //   d3.selectAll(".node-label").style("display", e.currentTarget.checked ? "block" : "none")
      // },

      async submitLogout() {
        const resp = await api.logoutUser()
  
        if (resp.status == 200) {
          this.$data.loggedIn = false
          userStates.loggedIn = false
          userStates.currentUser = {}
          userStates.userMovieList = {}
          userStates.userGraphList = {}
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
  .profile-inner-panel {
    grid-area: lower-field;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    
    input { 
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .slider {
        background-color: #2196F3;
      }

      &:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
      }

      &:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;

    &:before{
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
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
        ". . . . profile-nav"
        ". . profile-container logout profile-nav"
        ". . user-name pencil ."
        "lower-field lower-field lower-field lower-field lower-field ";
    grid-template-rows: 27px 120px 27px 1fr;
    grid-template-columns: 1fr 30px 150px 30px 27px;

    #user-name {
      grid-area: user-name;
      margin: auto;
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