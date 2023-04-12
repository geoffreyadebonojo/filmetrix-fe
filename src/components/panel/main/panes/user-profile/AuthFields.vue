<script setup>
  import api from "@mixins/api"
  import { 
    appStates,
    userStates
  } from '@/stores/store.js'
  import * as d3 from "d3"
</script>

<template>
  <div id="auth-fields-container" v-if="this.$data.loggedIn == false">
    <input 
      class="login-fields" 
      id="email-field"
      type="text"
      placeholder="email">

    <input 
      class="login-fields" 
      id="password-field"
      type="text"
      placeholder="password">

    <div class="entry-buttons" 
        id="signup" 
        @click="signupUser()">
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
  </div>

  <div v-else>
    Logged In
  </div>
</template>

<script>
  export default {
    name: "AuthFields",
    data () {
      return {
        loggedIn: this.$attrs.loggedIn
      }
    },
    methods: {
      async signupUser () {
        await api.signupUser()
      },
      async submitLogin () {
        const email = d3.select("#email-field").node().value
        const password = d3.select("#password-field").node().value.toLowerCase()

        const resp = await api.loginUser({
          email: email, 
          password: password
        })

        if (resp.status.code == 200) {
          userStates.loggedIn = true
          this.$data.loggedIn = true
          userStates.currentUser = resp.data
          
          const movieList = await api.fetchMovieList(resp.data.id)
          appStates.userMovieList = movieList.map(d => d[0])

          this.$emit('updateParent')
        } else {
          throw new Error("login failed")
        }
      }
    }
  }
</script>

<style scoped lang="scss">

#auth-fields-container {
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
</style>