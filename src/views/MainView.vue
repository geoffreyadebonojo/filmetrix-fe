<template>
  <button @click="tu()">Add 1</button>
  <p>Count is: {{ count }}</p>

  <div class="graph-wrapper">
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
  const API_URL = `http://localhost:3000/graphql`

  function chart (responseData) {
    const links = responseData.links
    const nodes = responseData.nodes
    const simulation = d3.forceSimulation(nodes, links)

    const width = 800
    const height = 800

    simulation
      .force("link", d3.forceLink(links).id(d => d.id).distance(140))
      .force("charge", d3.forceManyBody().strength(-500))
      .force('collide', d3.forceCollide(d => 30))
      .force("center", d3.forceCenter(0, 0))
      // .force("x", d3.forceX(100))
      // .force("y", d3.forceY())
      .force('x', d3.forceX().x(width * 0.5))
      .force('y', d3.forceY().y(height * 0.5));
      // .alpha(0.95)
      // .alphaMin(0.82)
      // .alphaTarget(0.78)


    const svg = d3.select("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])

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

    // node.append("text")
    //     .attr("x", 30 + 4)
    //     .attr("y", "0.31em")
    //     .text(d => d.name)

    node.on('dblclick', (e, d) => console.log(nodes[d.index]))

    const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`

    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return svg.node();
  }

  export default {
    data () {
      response: null
      return {count: 0}
    },
    tu() {


      // .strength(1))
      // .alpha(1)
      // .restart()
    },
    async created () {
      await this.fetchData([287], [74], 4)
      chart(this.response.data)
    },
    methods: {
       tu() {

         d3.select("svg").html('')

        const pids =[500, 287, 192]
        const mids =[74, 628, 33]
        
        this.fetchData(pids, mids, this.count)
        
        this.count += 1
        d3.select("svg").html('')

        this.count += 1
        
        chart(this.response.data)

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