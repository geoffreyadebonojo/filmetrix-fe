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
    },

    async fetchDetails(id) {
      const API_URL =`http://localhost:3000/graphql`
      store.mostRecentSearchId = id
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
