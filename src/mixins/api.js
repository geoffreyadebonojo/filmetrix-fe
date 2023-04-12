import { 
  panelStates,
  graphStates, 
  store 
} from '@/stores/store.js'

export default {
  data () {
    graphStates
    return {
      key: "6GzCesnexrzgnDv3FfxbHBrb",
      base_url: import.meta.env.VITE_API_URL
    }
  },

  async signupUser(args) {
    const API_URL =`${this.data().base_url}/signup`

    const api_response = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "user": {
            "email": `${args.email}`,
            "password": `${args.password}`
          }
        })
      }).then((response) => {
        return response.json()
      })
    )
  },

  async loginUser(args) {
    const API_URL =`${this.data().base_url}/login`

    const api_response = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          "user": {
            "email": `${args.email}`,
            "password": `${args.password}`
          }
        })
      }).then((response) => {
        for(let entry of response.headers.entries()) {
          localStorage.setItem(entry[0], entry[1]);
        }

        return response.json()
      })
    )

    return api_response
  },

  async logoutUser() {
    const API_URL =`${this.data().base_url}/logout`

    const api_response = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('authorization')
      }
    }).then((response) => {
      return response.json()
    })

    return api_response
  },

  async currentUser() {
    const API_URL =`${this.data().base_url}/current_user`

    const api_response = await (
      fetch(API_URL, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authorization')
        }
      }).then((response) => {
        if (response.status !== 200) {
          return {}
        } else {
          return response.json()
        }
      }).catch((error) => {
        console.log(error)
      })
    )

    return api_response
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

    panelStates.detailsData = api_response.data.details
    panelStates.detailsData.entity = api_response.data.details.id.split("-")[0]
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
  },

  async fetchMovieList(userId) {    
    const API_URL =`${this.data().base_url}/graphql`
    const api_response = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query:
          `query {
            fetchMovieList(userId:"${userId}")
          }`
        })
      }).then((response) => {
        return response.json()
      })
    )

    return api_response.data.fetchMovieList
  },

  async removeFromMovieList(args) {    
    const API_URL =`${this.data().base_url}/graphql`
    
    const api_response = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query:
          `query {
            removeFromMovieList(userId:"${args.userId}", movieId:"${args.movieId}")
          }`
        })
      }).then((response) => {
        return response.json()
      })
    )

    return api_response.data.removeFromMovieList
  },

  async addToMovieList(args) {    
    const API_URL =`${this.data().base_url}/graphql`
    
    const api_response = await (
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query:
          `query {
            addToMovieList(userId:"${args.userId}", movieId:"${args.movieId}")
          }`
        })
      }).then((response) => {
        return response.json()
      })
    )

    return api_response.data.addToMovieList
  },
}
