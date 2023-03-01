<script setup>
  import createChart from "../mixins/createChart"
  import apiService from "../mixins/apiService"

  const props = defineProps({
    focus:String,
    searchResults:Array,
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
        const id = event.currentTarget.id.split("-")[1]

        await this.fetchGraphData([id],[],5)

        this.chart(this.graphData.data)
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

      async fetchGraphData(pids, mids, count) {
        const API_URL = `http://localhost:3000/graphql`

        this.graphData = await (
          fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: this.queryAll(pids, mids, count) })
          }).then((response) => {
            // return response.json()
            const data = {
              nodes: [
              {
                id: 1,
                name: "",
                poster: ""
              },
              {
                id: 2,
                name: "",
                poster: ""
              },
              {
                id: 3,
                name: "",
                poster: ""
              },
              {
                id: 4,
                name: "",
                poster: ""
              }
              ]
              ,
              links: [
              {
                source: 1,
                target: 2
              },
              {
                source: 2,
                target: 3
              },
              {
                source: 3,
                target: 4
              },
              {
                source: 4,
                target: 1
              }
              ]
            }

            return data
          })
        )
      }
    }
  }
</script>