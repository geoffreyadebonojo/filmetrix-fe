
<template>
  <div class="graph-wrapper">
    <!-- <h2>Vue.js and D3 Line Chart</h2> -->
    <svg style="border:1px solid red"></svg>
  </div>
</template>

<style>
  .graph-wrapper{
    width: 80%;
    display: flex;
    margin: auto;
  }
</style>

<script>
  import * as d3 from 'd3'  
  function chart (responseData) {

    const links = responseData.links
    const nodes = responseData.nodes
    debugger

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => {
          return d.id
        }))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force('collide', d3.forceCollide(d => 65))

    const width = 2000
    const height = 2000

    const types = [
      "licensing",
      "suit",
      "resolved"
    ]

    const svg = d3.select("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])

    const color = d3.scaleOrdinal(types, d3.schemeCategory10)
    // const color = "#FFF"
    // svg.append("defs").selectAll("marker")
    //     .data(types)
    //     .join("marker")
    //     .attr("id", d => `arrow-${d}`)
    //     .attr("viewBox", "0 -5 10 10")
    //     .attr("refX", 38)
    //     .attr("refY", 0)
    //     .attr("markerWidth", 6)
    //     .attr("markerHeight", 6)
    //     .attr("orient", "auto")
    //     .append("path")
    //     .attr("fill", color)
    //     .attr("d", 'M0,-5L10,0L0,5');

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", d => color(d.type))
        // .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        // .call(handler(simulation));

    node.append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("r", 25)
        .attr('fill', d => '#6baed6');

    node.append("text")
        .attr("x", 30 + 4)
        .attr("y", "0.31em")
        .text(d => d.name)
        // .clone(true).lower()
        // .attr("fill", "none")
        // .attr("stroke", "white")
        // .attr("stroke-width", 3);

    node.on('dblclick', (e, d) => console.log(nodes[d.index]))

    const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`


      // query {
      //       link(personIds: [500, 196]) {
      //         source
      //         target
      //         roles
      //       }
      //     }`

    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    // invalidation.then(() => simulation.stop());
    return svg.node();
  }
  const API_URL = `http://localhost:3000/graphql`

  const queryAll = `query {
    links {
      source
      target
      roles
    }
    nodes {
      id
      name
    }
  }`

  export default {
    data () {
      response: null
    },
    created () {
    },
    async mounted () {
      await this.fetchData()
      chart(this.response.data)
    },
    methods: {
      async fetchData() {
        this.response = await (
          fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: queryAll})
          }).then((response) => {
            return response.json()
          })
        )
      }
    }
  }

// link(movieIds: [628], personIds: [500]) {
//   source
//   target
//   roles
// }

</script>