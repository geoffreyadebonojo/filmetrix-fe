<script setup>
  import { appStates } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from "d3"
</script>

<template>
  <div id="user-settings-body">

    <div id="not-logged-in" v-if="this.$data.loggedIn !== true">
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

    <div id="logged-in" v-else>
      <div id="logout" @click="api.logoutUser()">
        <img src="/exit.svg"/>
      </div>

      <div id="user-name"></div>

      <div id="profile-image-container" v-if="this.$data.currentUser.profileImage == null">
        <img id="awesome" src="/face-awesome.svg" />
      </div>

      <div id="profile-image-container" v-else>
        <img v-bind:src="this.$data.currentUser.profileImage" />
      </div>

      <img id="pencil" src="/pencil.svg" />
    </div>

    <div id="theme-mode">
      <p>
        dark
      </p>
      <label class="switch">
        <input type="checkbox" @click="toggleTheme($event)">
        <span class="slider round"></span>
      </label>
      <p>
        light
      </p>
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

#theme-mode {
  display: flex;

  label {
    margin: auto;

    &:hover {
      cursor: $cursor;
    }
  }

  p {
    margin: auto;
    font-family: $global-font;
  }
}

#logged-in {
  display: grid;
  grid-template-areas: 
    ". profile-container logout"
    ". user-name pencil";
  grid-template-rows: 160px 25px;
  grid-template-columns: 23px 1fr 30px;
  margin-bottom: 30px;

  #user-name {
    grid-area: user-name;
    margin: auto auto 0 auto;
    font-family: $global-font;
    font-size: 20px;
  }

  #logout {
    grid-area: logout;
    margin: 0 auto auto auto;
    &:hover {
      cursor: $cursor;
    }
    img {
      height: 20px;
    }
  }

  #pencil {
    grid-area: pencil;
    height: 22px;
    margin: auto auto 0 auto;
    &:hover {
      cursor: $cursor;
    }
  }

  #profile-image-container {
    grid-area: profile-container;
    height: 100%;
    width: 100%;
    display: flex;
    padding: 0 35px 20px 35px;

    #awesome {
      grid-area: awesome;
      height: 100%;
      margin: auto;
    }
  }

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

// .slider.round {
//   border-radius: 34px;
// }

// .slider.round:before {
//   border-radius: 50%;
// }

</style>