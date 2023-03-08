import { store } from '@/stores/store.js'
import { proxyRefs } from 'vue'

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

    async xxfetchGraphData(ids, count) {
      const API_URL = `http://localhost:3000/graphql`

      const resp = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: this.graphDataQuery(ids, 20) })
        }).then((response) => {
          return response.json()
        })
      )

      store.graphData.links.push(resp.data.graphData.links)
      store.graphData.nodes.push(resp.data.graphData.nodes)
    },

    async fetchSingle(id){
      const API_URL = `http://localhost:3000/graphql`
      
      const resp = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `
            query {
              querySingle(ids:["${id}"]) {
                nodes {
                  id
                  name
                  poster
                  type
                  entity
                }
                links { 
                  source
                  target
                  roles
                }
              }    
            }`
          })
        }).then((response) => {
          return response.json()
        })
      )

      store.graphData[id] = resp.data.querySingle
    },

    graphDataQuery(ids, count) {
      return `query {
        graphData(ids: "${ids}", count: ${count}){
          nodes {
            id
            name
            poster
          }
          links {
            source
            target
            roles
          }
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
