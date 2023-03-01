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
      store.currentResultTab = store.searchResults[0].id.split("-")[0]
    },

    async fetchDetails(id) {
      const API_URL =`http://localhost:3000/graphql`
      
      store.currentDetailId = id
      
      const api_response = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: this.queryDetails(id) })
        }).then((response) => {
          return response.json()
        })
      )
      store.detailsData = api_response.data
    },

    async fetchGraphData(pids, mids, count) {
      const API_URL = `http://localhost:3000/graphql`
      // store.most reent graph id
      store.graphData = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: this.queryAll(pids, mids, count) })
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

    queryDetails(id) {
      // add conditions for entity
      return `query {
        details(id: ${id}) {
          id
          alsoKnownAs
          biography
          birthday
          deathday
          homepage
          imdbId
          name
          knownForDepartment
          placeOfBirth
          popularity
          poster
        }    
      }`
    }
  }
}
