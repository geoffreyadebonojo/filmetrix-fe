const v=  Object.assign(d3.select("#inner-wrapper").node(), {
  update({nodes, links}) {
    const old = new Map(node.data().map(d => [d.id, d]));
    nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
    links = links.map(d => {
      return Object.assign({}, d)
    });

    simulation.nodes(nodes)
    simulation.force("link", d3.forceLink(links).id(d => d.id).distance((d) => {
      return settingsModule.defaults.link.length
    }))
    simulation.force("charge", d3.forceManyBody().strength(() => {
      return settingsModule.defaults.node.charge
    }))
    .force('collide', d3.forceCollide((d) => {
      return settingsModule.defaults.node.collide
    }))
    .force("center", d3.forceCenter(0, 0))
    .force('x', d3.forceX().x(width * 0.3))
    .force('y', d3.forceY().y(height * 0.5))
    
    simulation
    .alpha(1)
    .alphaMin(0.2)
    .alphaTarget(0.01)
    .restart()

    // link = helpers.createLinks(innerWrapper, links)
    // node = helpers.createNodes(innerWrapper, nodes)
  }
})

/////// within click action on filter button //////////
// v.update({
//   links: links,
//   nodes: nodes
// })