<script setup>
  import { RouterView } from 'vue-router'
  import { 
    appStates,
    userStates
   } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from 'd3'
</script>

<template>
  <div id="app-wrapper" v-bind:class="appStates.theme + '-theme'">
    <RouterView></RouterView>
  </div>
</template>

<style lang="scss">
  .dark-theme {
    background: $graph-body-grey;
  }
  .light-theme {
    background: #AAAAAA;
  }
</style>

<script>
  export default {
    data () {
      return {
        isMobile: /Android|iPhone/i.test(navigator.userAgent)
      }
    },

    async created () {
      // userStates.theme = localStorage.getItem('theme')
      let x = localStorage.getItem("newHere")
      if (x == null) {
        localStorage.setItem("newHere", true)
      }

      await api.currentUser().then(async (response) => {
        if (response.id != null) {

          userStates.loggedIn = true
          userStates.currentUser = response
          userStates.currentUser.username = response.email
          userStates.currentUser.profileImg = response.profile_img
          userStates.userMovieList = await api.fetchMovieList(response.id)
          userStates.userGraphList = await api.fetchGraphList(response.id)

        } else {
          userStates.loggedIn = false
          userStates.currentUser = {}
          userStates.userMovieList = []
          userStates.userGraphList = []
        }
      }).catch((d) => {})
    }
  }
</script>
