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

    created () {
      this.$data.loggedIn = userStates.loggedIn
    },

    methods: {
      updateComponent () {
        this.$data.loggedIn = true

        debugger
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