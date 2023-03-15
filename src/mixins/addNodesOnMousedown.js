let int = false
let j = 0
let mouseDownTarget

zoom 
.on('end', (e) => {
  if (!int || j < 4 || !dbl) { return false }
  clearInterval(int)
  int = false
  let d = mouseDownTarget
  // const c = store.existing.filter((y) => {
  //   return y[0] === d.id
  // })
  // const t = c[0][1]
  // const n = t + j
  // c[0][1] = n
  //call for method
  let vals
  let nodes = []
  let links = []
  store.existing.forEach(function(key) {
    vals = store.graphData[key[0]]
    vals.nodes.slice(0,key[1]+1+j).forEach((node) => {
      if (nodes.map(d => d.id).excludes(node.id)){
        nodes.push(node)
      }
    })
    links = vals.links.slice(0,key[1]+j)
  })
  this.draw({
    nodes: nodes,
    links: links
  })
  j = 0
  mouseDownTarget = null
  // d3.select('#person-500 circle').transition().duration(500).attr("r", 50)
  // method for mouseup here
})

node
.on("mousedown", (e, d) => {
  mouseDownTarget = d
  int = setInterval(() => {
    j+=1
    console.log(j)
  }, 200);
})