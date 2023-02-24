
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

  function chart () {
    const links = [
      {source: "Microsoft", target: "HTC", type: "licensing"},
      {source: "Samsung", target: "Apple", type: "suit"},
      {source: "Motorola", target: "Apple", type: "suit"},
      {source: "Nokia", target: "Apple", type: "resolved"},
      {source: "HTC", target: "Apple", type: "suit"},
      {source: "Kodak", target: "Apple", type: "suit"},
      {source: "Microsoft", target: "Barnes & Noble", type: "suit"},
      {source: "Microsoft", target: "Foxconn", type: "suit"},
      {source: "Oracle", target: "Google", type: "suit"},
      {source: "Apple", target: "HTC", type: "suit"},
      {source: "Microsoft", target: "Inventec", type: "suit"},
      {source: "Samsung", target: "Kodak", type: "resolved"},
      {source: "LG", target: "Kodak", type: "resolved"},
      {source: "RIM", target: "Kodak", type: "suit"},
      {source: "Sony", target: "LG", type: "suit"},
      {source: "Kodak", target: "LG", type: "resolved"},
      {source: "Apple", target: "Nokia", type: "resolved"},
      {source: "Qualcomm", target: "Nokia", type: "resolved"},
      {source: "Apple", target: "Motorola", type: "suit"}
    ]

    const nodes = [
      {id: "Microsoft"},
      {id: "Amazon"},
      {id: "HTC"},
      {id: "Samsung"},
      {id: "Apple"},
      {id: "Motorola"},
      {id: "Nokia"},
      {id: "Kodak"},
      {id: "Barnes & Noble"},
      {id: "Foxconn"},
      {id: "Oracle"},
      {id: "Google"},
      {id: "Inventec"},
      {id: "LG"},
      {id: "RIM"},
      {id: "Sony"},
      {id: "Qualcomm"},
      {id: "Huawei"},
      {id: "ZTE"},
      {id: "Ericsson"}
    ]

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
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

    svg.append("defs").selectAll("marker")
        .data(types)
        .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 38)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", color)
        .attr("d", 'M0,-5L10,0L0,5');

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", d => color(d.type))
        .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

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
        .text(d => d.id)
        // .clone(true).lower()
        // .attr("fill", "none")
        // .attr("stroke", "white")
        // .attr("stroke-width", 3);

    node.on('dblclick', (e, d) => console.log(nodes[d.index]))

    const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`

    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // // invalidation.then(() => simulation.stop());

    return svg.node();
  }

  export default {
    data () {
      return {}
    },
    mounted () {
      chart()
    }
  }
</script>