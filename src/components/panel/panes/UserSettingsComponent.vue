<script setup>
  import { appStates } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from "d3"
</script>

<!-- Light Theme? <br>
  <label class="switch">
    <input type="checkbox" @click="toggleTheme($event)">
    <span class="slider round"></span>
  </label> -->

<template>
  <div id="user-settings-body">

    <div id="logged-in"  v-if="this.$data.loggedIn === true">

      <div id="user-name"></div>
      <div @click="api.logoutUser()">
        [logout]
      </div>
      <div @click="api.currentUser()">
        [current]
      </div>
    </div>

    <div id="not-logged-in" v-else>
      <div @click="api.signupUser({})">
        [sign-up]
      </div>     
      <div @click="api.loginUser({
        email: 'test@test.com', 
        password: 'password'
      })">
        [login]
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loggedIn: false,
        currentUser: {}
      }
    },

    async created () {
      const response = await api.currentUser()
      this.$data.loggedIn = response.id != null
      this.$data.currentUser = response
    },
    
    updated () {
      d3.select("#user-name").text(this.$data.currentUser.email)
    },
    
    methods: {
      toggleTheme (e) {
        const isChecked = e.currentTarget.checked

        if (isChecked) {
          localStorage.setItem('theme', 'light')
          appStates.theme = 'light'
        } else {
          localStorage.setItem('theme', 'dark')
          appStates.theme = 'dark'
        }
      }
    }
  }
</script>

<style scoped lang="scss">

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

// .slider.round {
//   border-radius: 34px;
// }

// .slider.round:before {
//   border-radius: 50%;
// }

</style>