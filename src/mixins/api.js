import { store } from '@/stores/store.js'

export default {
  data() {
    store
    return {
      prodUrl: "https://enigmatic-wildwood-58151.herokuapp.com",
      localUrl: "http://localhost:3000",
      key: "6GzCesnexrzgnDv3FfxbHBrb",
    }
  },

  async fetchSearchData(term) {
    const API_URL =`${this.data().localUrl}/graphql`

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
    const API_URL =`${this.data().localUrl}/graphql`

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
    store.currentDetailId = api_response.data.details.id
  },

  async fetchGraphData(ids){
    const API_URL = `${this.data().localUrl}/graphql`

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

  async saveGraph(existing) {
    const ids = []
    const count = []
    
    existing.forEach((d) => {
      ids.push(d[0])
      count.push(d[1])
    })
    
    const API_URL =`${this.data().localUrl}/graphql`
    return await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query:
          `query {
            saveGraph(ids:"${ids}",counts:"${count}") {
              status
              msg
              resourceId
              shareUrl
            }
          }`
        })
      }).then((response) => {
        return response.json()
      })
    )
  },

  async findBySlug(slug){
    const API_URL = `${this.data().localUrl}/graphql`

    const resp = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `
          query {
            findBySlug(slug:"${slug}") {
              existing
              data {
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
            }    
          }`
        })
      }).then((response) => {
        return response.json()
      })
    )

    if (resp.data.findBySlug == false) { return }
    
    const d = resp.data.findBySlug
    
    store.existing = d.existing.map(d => [d[0], +d[1]])
    d.data.forEach((d, i) => {
      let key = store.existing[i][0]
      store.graphData[key] = {
        links: d.links,
        nodes: d.nodes
      }
    })
  }
}
