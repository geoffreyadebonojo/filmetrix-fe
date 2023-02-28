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
    }
  }
}