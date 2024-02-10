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
      v-if="$data.loggedIn == true" 
      :loggedIn="$data.loggedIn"
      @update-parent="updateComponent">
    </profile-body>

    <auth-fields 
      v-if="$data.loggedIn == false" 
      :loggedIn="$data.loggedIn"
      @update-parent="updateComponent">
    </auth-fields>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loggedIn: false,
      }
    },

    created () {
      this.$data.loggedIn = userStates.loggedIn
    },

    methods: {
      async updateComponent (loginStatus) {
        this.$data.loggedIn = loginStatus
        userStates.loggedIn = loginStatus

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