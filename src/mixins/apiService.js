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

    async fetchDetails(fullId) {
      const entity = fullId.split("-")[0]
      const id = fullId.split("-")[1]

      const API_URL =`http://localhost:3000/graphql`

      const api_response = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: this.queryDetails(entity, id) })
        }).then((response) => {
          return response.json()
        })
      )

      store.detailsData = api_response.data.details
    },

    async fetchGraphData(pids, mids, count) {
      const API_URL = `http://localhost:3000/graphql`


      debugger
      pids.forEach(elem => {
        store.existingGraphAnchors.person.push(elem)
      });

      mids.forEach(elem => {
        store.existingGraphAnchors.movies.push(elem)
      })

      store.graphData = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            { query: this.queryAll(
              store.existingGraphAnchors.person, 
              store.existingGraphAnchors.movies, 
              count)
          })
        }).then((response) => {
          return response.json()
        })
      )
    },

    queryAll(pids, mids, count) {
      return `query {
        nodes(personIds: ${JSON.stringify(pids)}, movieIds: ${JSON.stringify(mids)}, count: ${count}) {
          id
          name
          poster
        }
        links(personIds: ${JSON.stringify(pids)}, movieIds: ${JSON.stringify(mids)}, count: ${count}) {
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

    queryDetails(entity, id) {
      // add conditions for entity
      return `query {
        details(id: ${id}, entity: "${entity}") {
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
