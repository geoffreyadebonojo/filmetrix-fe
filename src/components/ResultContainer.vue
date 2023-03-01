<script setup>
  import createChart from "../mixins/createChart"
  import apiService from "../mixins/apiService"

  const props = defineProps({
    focus:String,
    searchResults:Array,
    currentDetailSubjectId:String,
    setFocus: Function,
    default() {
      return {}
    }
  })
</script>

<style>

  .result-tile{
    width: 73px;
    height: 109px;
    border-radius: 8px;
    border: 1px solid;
  }
  
  .result-tile > img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .result-tile:hover{
    cursor: pointer;
    box-shadow: 0 14px 18px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    transform: scale(1.03)
  }

  .result-tile > div {
    font-size: 10px;
    text-transform: uppercase;
    font-family: 'Dosis', sans-serif;
    font-weight: bold;
    text-align: center;
  }

  .result-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 50px 20px;
    justify-content: flex-start;
    padding: 20px;
    overflow-y: auto
  }

</style>

<template>
  <div class="result-container" v-bind:id="this.focus + '-results'">
    <div class="result-tile" 
        v-bind:id="result.id"
        v-if="focus !== 'noResult'"
        v-for="result in this.searchResults.filter(r => r['id'].includes(focus))" 
        @click="$event => callForNodes()"
      >

        <img v-bind:src="result.poster"/>
        <div>{{result.name}}</div>
    </div>

    <div v-else="focus === 'noResult'">
      No result found. Spelling?
    </div>
  </div>
</template>

<script>
  export default {
    name: "ResultContainer",
    mixins: [createChart],
    data () {
      return {
        graphData: []
      }
    },
    methods: {
      async callForNodes() {
        const fullId = event.currentTarget.id
        
        const id = fullId.split("-")[1]

        await this.fetchGraphData([id],[],5)

        this.setFocus('details')
        debugger
        this.currentDetailSubjectId = fullId

        // this.chart(this.graphData.data)
      },

      //DUPE
      // async fetchDetails(id) {
      //   const API_URL = `http://localhost:3000/graphql`

      //   this.detailsData = await (
      //     fetch(API_URL, {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify({ query: this.queryDetails(id) })
      //     }).then((response) => {
      //       return response.json()
      //     })
      //   )
      // },
      // queryDetails(id) {
      //   // add conditions for entity
      //   return `query {
      //     details(id: ${id}) {
      //       id
      //       alsoKnownAs
      //       biography
      //       birthday
      //       deathday
      //       homepage
      //       imdbId
      //       name
      //       knownForDepartment
      //       placeOfBirth
      //       popularity
      //       poster
      //     }    
      //   }`
      // },
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
      async fetchGraphData(pids, mids, count) {
        const API_URL = `http://localhost:3000/graphql`

        this.graphData = await (
          fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: this.queryAll(pids, mids, count) })
          }).then((response) => {
            return response.json()
          })
        )
      }
    }
  }
</script>