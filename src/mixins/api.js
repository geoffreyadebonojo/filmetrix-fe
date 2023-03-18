import { store } from '@/stores/store.js'

export default {
  data() {
    store
    return {
      currentUrl: "http://localhost:3000",
      prodUrl: "https://enigmatic-wildwood-58151.herokuapp.com",
      localUrl: "http://localhost:3000",
      key: "6GzCesnexrzgnDv3FfxbHBrb",
    }
  },
  async fetchSearchData(term) {
    const API_URL =`${this.data().currentUrl}/graphql`

    const api_respsonse = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query:
          `query {
            search(term:"${term}", key:"${this.data().key}") {
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
    const API_URL =`${this.data().currentUrl}/graphql`

    const api_response = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 
          `query {
            details(id: "${id}", key:"${this.data().key}") {
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

  async fetchGraphData(ids){
    const API_URL = `${this.data().currentUrl}/graphql`

    const resp = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `
          query {
            graphData(ids:"${ids}", key:"${this.data().key}") {
              id
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

    resp.data.graphData.forEach((d) => {
      store.graphData[d.id] = {
        links: d.links,
        nodes: d.nodes
      }
    })
  },

  async cacheRequest(id, count){
    const API_URL = `${this.data().currentUrl}/graphql`
    
    const resp = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `
          query {
            cacheRequest(id:"${id}",count:${count},graphId:"${store.gid}",key:"${this.data().key}") {
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
