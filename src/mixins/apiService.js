export default {
  methods: {
    querySearch(term) {
      return `query {
        search(term:"${term}") {
          id
          name
          poster
        }
      }`
    },
    
    async fetchSearchData(term) {
      const API_URL = `http://localhost:3000/graphql`
      debugger
      this.response = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: this.querySearch(term) })
        }).then((response) => {
          const x = response.json()
          return x
        })
      )
    },

    async fetchDetails(id) {
      const API_URL = `http://localhost:3000/graphql`

      this.detailsData = await (
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: this.queryDetails(id) })
        }).then((response) => {
          return response.json()
        })
      )
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
    },
  }
}