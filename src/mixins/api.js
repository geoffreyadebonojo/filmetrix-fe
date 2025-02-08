import { 
  panelStates,
  graphStates
} from '@/stores/store.js'
import * as d3 from 'd3'

export default {
  data () {
    return {
      base_url: import.meta.env.VITE_API_URL || `https://enigmatic-wildwood-58151.herokuapp.com`
    }
  },

  async fetchSearchData(term) {
    const API_URL = `${this.data().base_url}/graphql`
    
    d3.select("#no-results").style("display", "none")

    return await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query:
          `query {
            search(term:"${term}") {
              id
              name
              poster
              entity
              year
              popularity
              knownForDepartment
            }
          }`
        })
      }).then((response) => {
        return response.json()
      }).then((d) => {
        if (d.data.search.length < 1 || d.errors != undefined) {
          d3.select("#no-results").style("display", "block")
          return []
        } else {
          return d.data.search
        }
      })
    )
  },

  async fetchSearchNext(term) {
    const API_URL = `${this.data().base_url}/graphql`

    const api_response = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query:
          `query {
            getNextPage(term:"${term}") {
              id
              name
              poster
              entity
              year
              popularity
              knownForDepartment
            }
          }`
        })
      }).then((response) => {
        return response.json()
      })
    )

    return api_response.data.getNextPage
  },
  
  async fetchDetails(id) {
    const API_URL =`${this.data().base_url}/graphql`

    const api_response = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 
          `query {
            details(id: "${id}") {
              id
              summary
              entity
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

    panelStates.detailsData = api_response.data.details
  },

  async fetchGraphData(ids, count=50){
    const API_URL = `${this.data().base_url}/graphql`

    const resp = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: `
          query {
            graphData(ids:"${ids}",count:${count}) {
              id
              nodes {
                id
                name
                poster
                type
                entity
                popularity
                voteAverage
                voteCount
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

  ///////////////////////////////////

  async saveGraph(existing) {
    const ids = []
    const count = []

    existing.forEach((d) => {
      ids.push(d[0])
      count.push(d[1])
    })

    const API_URL =`${this.data().base_url}/graphql`
    const resp = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query:
          `query {
            saveGraph(ids:"${ids}",count:"${count}") {
              resourceId
              shareUrl
            }
          }`
        })
      }).then((response) => {
        return response.json()
      })
    )

    return resp.data.saveGraph
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
                  popularity
                  voteAverage
                  voteCount
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
  },
}
