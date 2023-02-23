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
    commits: null,
    greeting: null
  }),

  created() {
    // fetch on init
    this.fetchData()
  },

  watch: {
    // re-fetch whenever currentBranch changes
    // currentBranch: 'fetchData'
  },

  methods: {
    async fetchData() {
      const url = `${API_URL}`
      // this.commits = await (await fetch(url)).json()
      this.greeting = await (
        // await fetch(url)
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `
          query { test }
          ` })
        }).then((response) => {
          return response.json()
        })
      )
      // debugger
    }

    // ,
    // truncate(v) {
    //   const newline = v.indexOf('\n')
    //   return newline > 0 ? v.slice(0, newline) : v
    // },
    // formatDate(v) {
    //   return v.replace(/T|Z/g, ' ')
    // }
  }
}
</script>

<template>
  <h1>{{greeting.data.test}}</h1>

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