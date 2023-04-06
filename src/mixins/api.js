import { graphStates, store } from '@/stores/store.js'

export default {
  data () {
    graphStates
    return {
      key: "6GzCesnexrzgnDv3FfxbHBrb",
      base_url: import.meta.env.VITE_API_URL
    }
  },

  async fetchSearchData(term) {
    const API_URL =`${this.data().base_url}/graphql`

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
  },

  async fetchDetails(id) {
    const API_URL =`${this.data().base_url}/graphql`

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

    graphStates.detailsData = api_response.data.details
    graphStates.currentDetailId = api_response.data.details.id
  },

  async fetchGraphData(ids){
    const API_URL = `${this.data().base_url}/graphql`

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
      graphStates.graphData[d.id] = {
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
    
    const API_URL =`${this.data().base_url}/graphql`
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
    const API_URL = `${this.data().base_url}/graphql`

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
    
    graphStates.existing = d.existing.map(d => [d[0], +d[1]])
    d.data.forEach((d, i) => {
      let key = graphStates.existing[i][0]
      graphStates.graphData[key] = {
        links: d.links,
        nodes: d.nodes
      }
    })
  }
}
