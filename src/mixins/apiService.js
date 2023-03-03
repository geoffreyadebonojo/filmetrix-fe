import { store } from '@/stores/store.js'

export default {
  data() {
    store
    return {}
  },
  
  methods: {
    async fetchSearchData(term) {
      const API_URL =`http://localhost:3000/graphql`

      const api_respsonse = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: this.querySearch(term) })
        }).then((response) => {
          return response.json()
        })
      )

      store.searchResults = api_respsonse.data.search
      // store.currentResultTab = store.searchResults[0].id.split("-")[0]
    },

    async fetchDetails(id) {
      const API_URL =`http://localhost:3000/graphql`

      const api_response = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: this.queryDetails(id) })
        }).then((response) => {
          return response.json()
        })
      )

      store.detailsData = api_response.data.details
    },

    async fetchGraphData(ids, count) {
      const API_URL = `http://localhost:3000/graphql`

      store.graphData = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: this.queryAll(ids, count) })
        }).then((response) => {
          return response.json()
        })
      )
    },

    queryAll(ids, count) {
      return `query {
        nodes(ids: ["${ids}"], count: ${count}) {
          id
          name
          poster
        }
        links(ids: ["${ids}"], count: ${count}) {
          source
          target
          roles
        }
      }`
    },

    querySearch(term) {
      return `query {
        search(term:"${term}") {
          id
          name
          poster
        }
      }`
    },

    queryDetails(id) {
      return `query {
        details(id: "${id}") {
          id
          summary
          year
          imdbId
          name
          popularity
          poster
        }    
      }`
    }
  }
}
