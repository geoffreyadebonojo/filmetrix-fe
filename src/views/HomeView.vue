<script lang="ts">
import gql from 'graphql-tag'

const API_URL = `http://localhost:3000/graphql`

export default {
  data: () => ({
    branches: ['main', 'v2-compat'],
    currentBranch: 'main',
    commits: null,
    greeting: "HOY!"
  }),

  apollo: {
    greeting: gql`query {
      test
    }`
  },

  created() {
    // fetch on init
    // this.fetchData()
  },

  watch: {
    // re-fetch whenever currentBranch changes
    currentBranch: 'fetchData'
  },

  methods: {
    async fetchData() {
      const url = `${API_URL}` //{this.currentBranch}`
      this.commits = await (await fetch(url)).json()
    }
  }
}
</script>

<template>
  <h1>Latest Vue Core Commits</h1>

  <h2>{{greeting}}</h2>
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