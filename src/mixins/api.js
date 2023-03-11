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
          body: JSON.stringify({ query:
            `query {
              search(term:"${term}") {
                id
                name
                poster
              }
            }`
          })
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
          body: JSON.stringify({ query: 
            `query {
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
          })
        }).then((response) => {
          return response.json()
        })
      )

      store.detailsData = api_response.data.details
    },

    async fetchSingle(id, existing){
      const API_URL = `http://localhost:3000/graphql`

      const resp = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `
            query {
              querySingle(id:"${id}",existing:"${existing}") {
                matches
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

      store.graphData["matches"] = resp.data.querySingle.matches

      store.graphData[id] = {
        links: resp.data.querySingle.links,
        nodes: resp.data.querySingle.nodes
      }
    },

    async cacheRequest(id, count){
      const API_URL = `http://localhost:3000/graphql`
      
      const resp = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `
            query {
              cacheRequest(id:"${id}",count:${count},graphId:"${store.gid}") {
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

      store.graphData = resp.data.cacheRequest
    }
  }
}
