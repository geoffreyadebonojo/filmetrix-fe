
<template>
  <div class="graph-wrapper">
    <!-- <h2>Vue.js and D3 Line Chart</h2> -->
    <svg style="border:1px solid red"></svg>
  </div>
</template>

<style scoped>
  svg {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
</style>

<script>
  import * as d3 from 'd3'  

  const zoom = d3.zoom();

  const API_URL = `http://localhost:3000/graphql`

  function chart (responseData) {
    const links = responseData.links
    const nodes = responseData.nodes
    const simulation = d3.forceSimulation(nodes, links)

    simulation
      .force("link", d3.forceLink(links).id(d => d.id).distance(140))
      .force("charge", d3.forceManyBody().strength(-500))
      .force('collide', d3.forceCollide(d => 30))
      .force("center", d3.forceCenter(0, 0))
      .force("x", d3.forceX(100))
      .force("y", d3.forceY())
      // .alpha(0.95)
      // .alphaMin(0.82)
      // .alphaTarget(0.78)

    const width = 1000
    const height = 1000

    const types = [
      "licensing",
      "suit",
      "resolved"
    ]

    const svg = d3.select("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .call(zoom)
      .on("wheel.zoom", null);

    const color = "#FFF"

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", color)

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

    node.append("svg:image")
        .attr('x', -20)
        .attr('y', -22)
        .attr('width', 40)
        .attr('height', 44)
        .attr("xlink:href", d => d.poster)
        .attr("clip-path", "inset(5% round 20px)")

    node.append("text")
        .attr("x", 30 + 4)
        .attr("y", "0.31em")
        .text(d => d.name)

    node.on('dblclick', (e, d) => console.log(nodes[d.index]))

    const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`

    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // invalidation.then(() => simulation.stop());

    return svg.node();
  }

  export default {
    data () {
      response: null
    },
    async created () {
      await this.fetchData()
      chart(this.response.data)
    },
    methods: {
      queryAll (pids, mids, count) {
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
      async fetchData() {
        this.response = await (
          fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: this.queryAll([500, 287], [74], 5) })
          }).then((response) => {
            return response.json()
          })
        )
      }
    }
  }
</script>