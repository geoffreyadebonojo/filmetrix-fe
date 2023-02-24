<!--
This example fetches latest Vue.js commits data from GitHub’s API and displays them as a list.
You can switch between the two branches.
-->

<script lang="ts">
const API_URL = `http://localhost:3000/graphql`
// const API_URL = `https://api.github.com/repos/vuejs/core/commits?per_page=3&sha=`

export default {
  data: () => ({
    branches: ['main', 'v2-compat'],
    currentBranch: 'main',
    response: null
  }),

  created() {
    // this.fetchData()
  },

  watch: {
    // re-fetch whenever currentBranch changes
    // currentBranch: 'fetchData'
  },

  methods: {
    async fetchData() {
      this.response = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // body: JSON.stringify({ query: `query {
          //   nodes {
          //     id
          //     name
          //     poster
          //   }
          //   links {
          //     source
          //     target
          //     roles
          //   }
          // }`})
          body: JSON.stringify({ query: `query {
            network_map(movieId: [74]) {
              source
              target
              roles
            }
          }`})
        }).then((response) => {
          return response.json()
        })
      )
    }
  }
}
</script>

<template>
  <h1>HEAD</h1>

</template>

<style>
a {
  text-decoration: none;
  color: #42b883;
}
li {
  line-height: 1.5em;
  margin-bottom: 20px;
}
.author,
.date {
  font-weight: bold;
}
</style>