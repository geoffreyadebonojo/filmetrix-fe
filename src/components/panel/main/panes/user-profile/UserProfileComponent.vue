<script setup>
  import AuthFields from './AuthFields.vue'
  import ProfileBody from './ProfileBody.vue'
  import { 
    appStates,
    userStates
  } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from "d3"
</script>

<template>
  <div id="user-profile">
    <profile-body 
      v-if="this.$data.loggedIn == true" 
      :loggedIn="this.$data.loggedIn">
    </profile-body>

    <auth-fields 
      v-if="this.$data.loggedIn == false" 
      :loggedIn="this.$data.loggedIn"
      @update-parent="updateComponent">
    </auth-fields>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loggedIn: null,
      }
    },
    async created () {
      const response = await api.currentUser()

      this.$data.loggedIn = response.id != null
      userStates.loggedIn = this.$data.loggedIn

      if (this.$data.loggedIn == null) { return }

      userStates.currentUser = response
    },
    
    async updated () {
      d3.select("#user-name").text(userStates.currentUser.email)
      userStates.userMovieList = await api.fetchMovieList(userStates.currentUser.id)
    },

    methods: {
      updateComponent () {
        this.$data.loggedIn = true
        this.$forceUpdate()
      }
    }
  }
</script>

<style>
  #user-profile {
    display: flex;
  }
</style>