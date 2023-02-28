<script setup>
  import { RouterView } from 'vue-router'
  import PanelComponent from './components/PanelComponent.vue'
  import GraphView from './views/GraphView.vue'
</script>

<template>
  <GraphView />
  <PanelComponent 
    :focus="focus"
    :searchOpen="searchOpen"
    :searchResults="searchResults"
    :setFocus="setFocus"
    :toggleOrSubmit="toggleOrSubmit"
    :submitSearch="submitSearch"
   />
</template>

<script>
  import * as d3 from 'd3'

  const API_URL = `http://localhost:3000/graphql`

  function chart (responseData, settings={charge: -1000}) {
    const links = responseData.links
    const nodes = responseData.nodes
    const simulation = d3.forceSimulation(nodes, links)

    const width = 800
    const height = 800

    const charge = settings.charge

    simulation
      .force("link", d3.forceLink(links).id(d => d.id).distance(200))
      .force("charge", d3.forceManyBody().strength(charge))
      .force('collide', d3.forceCollide(d => 30))
      .force("center", d3.forceCenter(0, 0))
      // .force("x", d3.forceX(100))
      // .force("y", d3.forceY())
      .force('x', d3.forceX().x(width * 0.5))
      .force('y', d3.forceY().y(height * 0.5))
      // .alpha(1)
      // .alphaMin(0.82)
      // .alphaTarget(0.81)

    d3.select("svg").html("")

    const svg = d3.select("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])

    const color = "#FFF"

    const link = svg.append("g")
        .attr("class", "links")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", color)

    const node = svg.append("g")
        .attr("class", "nodes")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")

    node.append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("r", 25)
        .attr('fill', d => '#6baed6');

    node.append("svg:image")
        .attr('x', -20)
        .attr('y', -22)
        .attr('width', 40)
        .attr('height', 44)
        .attr("xlink:href", d => d.poster)
        .attr("clip-path", "inset(5% round 20px)")

    node.on('dblclick', (e, d) => console.log(d.id))

    const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`

    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return svg.node();
  }

  export default {
    components: {
      PanelComponent,
      GraphView
    },

    data () {
      response: null
      return {
        focus: 'empty',
        searchOpen: true,
        pids: [],
        mids: [],
        charge: -1000,
        count: 5,
        searchResults: []
      }
    },
    
    methods: {
      moveHighlightCircle(x) {
        d3.select("#highlight").transition()
        .duration(0)
        .style("left", null)
        .duration(100)
        .style("right", x)
      },

      closeField(d) {
        d.transition().duration(0)
        .style("width", "0px")
        .style("left", "62%")
      },

      openField(d) {
        d.transition().duration(0).delay(100)
          .style("width", "60%")
          .style("left", "7%")

        d3.select("#highlight").transition().duration(100)
          .style("left", "-1px")
      },

      toggleOrSubmit() {
        this.focus = 'search'
        const d = d3.select("#search-text") 

        if (this.searchOpen) {
          const val = d.node().value
          this.submitSearch(val)
          //transition to details

        } else {
          this.searchOpen = true
          this.openField(d)
        }
      },

      setFocus(focus) {
        const d = d3.select("#search-text") 
        //fix later
        const xCord = {
          person: '112px',
          movie: '85px',
          details: '56px',
          commands: '27px',
          about: '0px'
        }

        this.closeField(d)
        
        this.moveHighlightCircle(xCord[focus])
        this.focus = focus

        this.searchOpen = false
      },

      async submitSearch(value) {
        const val = value.toUpperCase()

        if (val == '' || val == null) { 
          // maybe a helpful tip?
          return false
        }

        await this.fetchSearchData(val)

        this.searchResults = this.response.data.search
        const tab = this.searchResults[0].id.split("-")[0]
        
        this.setFocus(tab)
      },

      async created () {
        await this.fetchData(
          this.pids, 
          this.mids, 
          this.count
        )

        chart(this.response.data)
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

      async fetchSearchData(term) {
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

      async fetchData(pids, mids, count) {
        this.response = await (
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
