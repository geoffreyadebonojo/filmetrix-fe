<script setup>
  import { appStates } from '@/stores/store.js'
  import api from "@mixins/api"
  import * as d3 from "d3"
</script>

<template>
  <div id="user-profile-body">

    <div id="not-logged-in" v-if="this.$data.loggedIn !== true">
      <input class="login-fields" id="email-field"
           type="text"
           placeholder="email">

      <input class="login-fields" id="password-field"
             type="text"
             placeholder="password">

      <!-- <div id="entry-button-container"> -->
        <div class="entry-buttons" 
             id="signup" 
             @click="api.signupUser()">
          <p>
            sign-up
          </p>
        </div>     
        <div class="entry-buttons" 
             id="login" 
             tabindex="0" 
             @click="submitLogin()"
             @keyup.enter="submitLogin()">
          <p>
            login
          </p>
        </div>
      <!-- </div> -->
    </div>

    <div id="logged-in" v-else>
      <div id="logout" @click="submitLogout()">
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

    <div id="my-movie-list">
      <div v-for="movie in this.$data.movieList"
          class="my-movie-item">
        <img v-bind:src="'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + movie[2]"/>
        <p>
          {{  movie[1] }}
        </p>
      </div>
    </div>

    <!-- <div id="theme-mode">
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
    </div> -->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loggedIn: false,
        currentUser: {},
        movieList: []
      }
    },

    async created () {
      const response = await api.currentUser()
      this.$data.loggedIn = response.id != null
      this.$data.currentUser = response
    },
    
    async updated () {
      d3.select("#user-name").text(this.$data.currentUser.email)
      
      this.$data.movieList = await api.fetchMovieList(this.$data.currentUser.id)
    },
    
    methods: {
      async submitLogin() {
        const email = d3.select("#email-field").node().value
        const password = d3.select("#password-field").node().value.toLowerCase()

        const resp = await api.loginUser({
          email: email, 
          password: password
        })

        if (resp.status.code == 200) {
          this.$data.loggedIn = true
          this.$data.currentUser = resp.data
        } else {
          throw new Error("login failed")
        }
      },

      async submitLogout() {
        const resp = await api.logoutUser()

        if (resp.status == 200) {
          this.$data.loggedIn = false
          this.$data.currentUser = {}
        } else {
          throw new Error("logout failed")
        }
      }

      // toggleTheme (e) {
      //   const isChecked = e.currentTarget.checked

      //   if (isChecked) {
      //     localStorage.setItem('theme', 'light')
      //     appStates.theme = 'light'
      //   } else {
      //     localStorage.setItem('theme', 'dark')
      //     appStates.theme = 'dark'
      //   }
      // }
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

#not-logged-in {
  display: grid;
  width: 100%;
  justify-content: space-around;
  margin: auto;
  padding-top: 70px;
  grid-template-rows: 30px 30px 20px 50px;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 
  "email email"
  "password password"
  ". ."
  "signup login";

  .login-fields {
    text-align: center;
    font-size: 15px;
    letter-spacing: 0.05em;
    box-sizing: border-box;
    // text-transform: uppercase;
    font-family: $global-font;
    background: #DDDDDD;
    border: none;

    &:focus {
      outline: none;
      background: white;
    }
  }

  #email-field {
    grid-area: email;
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;
    border-bottom: solid 1px black;
  }

  #password-field {
    grid-area: password;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
  }

  #signup {
    grid-area: signup;
    margin: auto 0 auto auto;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    outline: none;
  }
  
  #login {
    grid-area: login;
    margin: auto auto auto 0;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    outline: none;

    &:focus {
      color: $panel-body-grey;
      background: grey;
    }
  }
  
  .entry-buttons {
    font-family: $global-font;
    background: none;
    border: 1px solid grey;
    // padding: 25px;
    // margin: auto; 
    
    // width: 75%;
    // height: 35px;

    width: 100%;
    height: 100%;
    
    display: flex;
    // border-radius: 20px;
  
    &:hover {
      cursor: $cursor;
      color: $panel-body-grey;
      background: grey;
    }
  
    p {
      margin: auto;
    }
  }
}

#logged-in {
  display: grid;
  grid-template-areas: 
    ". profile-container logout"
    ". user-name pencil";
  grid-template-rows: 160px 25px;
  grid-template-columns: 0px 1fr 30px;
  margin-bottom: 30px;

  #user-name {
    grid-area: user-name;
    margin: auto auto 0 auto;
    font-family: $global-font;
    font-size: 20px;
  }

  #logout {
    grid-area: logout;
    margin: 5px auto auto auto;
    opacity: 0.65;

    &:hover {
      cursor: $cursor;
      opacity: 1;
    }
    img {
      height: 20px;
    }
  }

  #pencil {
    grid-area: pencil;
    height: 22px;
    margin: auto auto 0 auto;
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
    padding: 0 35px 20px 35px;

    #awesome {
      grid-area: awesome;
      height: 100%;
      margin: auto;
    }
  }
}

#my-movie-list {
  display: flex;
  .my-movie-item {
    width: 100px;
    display: grid;
  
    img {
      width: 100%;
      border-radius: 15px;
    }
  
    p {
      font-family: $global-font;
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