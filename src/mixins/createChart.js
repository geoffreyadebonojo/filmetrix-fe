import apiService from './apiService.js'
import { settingsModule } from './settingsModule.js'
import helpers from './helpers.js'
import { store } from '@/stores/store.js'
import * as d3 from 'd3'

let timer;
let alreadyClicked = false

export default {
  updated () {
    // let panelWidth = +d3.select('#panel-body').style("width").replace("px", "")
    // let graph = d3.select('#graph-container').node()
    // graph.style.width = `${window.innerWidth - panelWidth}px`
    // debugger
  },
  methods: {
    chart (responseData) {
      d3.select("#inner-wrapper").remove()

      var slider = document.getElementById("myRange");

      const links = responseData.links
      const nodes = responseData.nodes

      var simulation = d3.forceSimulation(nodes, links)
  
      const width = window.innerWidth
      const height = window.innerHeight

      simulation
        .force("link", d3.forceLink(links).id(d => d.id).distance((d) => {
          return settingsModule.defaultSettings.linkLength
        }))
        .force("charge", d3.forceManyBody().strength(() => {
          return settingsModule.defaultSettings.charge
        }))
        .force('collide', d3.forceCollide((d) => {
          return settingsModule.defaultSettings.collide
        }))
        .force("center", d3.forceCenter(0, 0))
        .force('x', d3.forceX().x(width * 0.3))
        .force('y', d3.forceY().y(height * 0.5))
        .alpha(1)
        .alphaMin(0.2)
        .alphaTarget(0.01)


      const outerWrapper = d3.select("#outer-wrapper")
      const viewerBody = d3.select("#graph-container")
      var int
     
      let zoom = d3.zoom().on('zoom', (e) => {
        outerWrapper.attr("transform", e.transform)
      })
      .on('end', () => {
        clearInterval(int)
        // d3.select('#person-500 circle').transition().duration(500).attr("r", 50)
        // method for mouseup here
      })

      d3.select("#centering-button").style("display", "block").transition().duration(30).style("left", "-30px")
      d3.select("#centering-button").on("click", (e) => {
        var transform = d3.zoomIdentity
        .translate(0,0)
        .scale(1)
        viewerBody.transition().duration(1000).call(zoom.transform, transform);
        // simulation
        // .alpha(1)
        // .alphaMin(0.3)
        // .restart()
        // .on("tick", () => {
        //   link.attr("d", linkArc);
        //   node.attr("transform", d => `translate(${d.x},${d.y})`);
        // })
        // .on("end", () => {
        //   node.transition().duration(500).delay(100).ease(d3.easeBounceOut).attr("transform", (d) => {
        //     return `translate(${d.x},${d.y})scale(0.9)`
        //   })
        // })
      })
      
      viewerBody
        .call(zoom)
        .call(zoom).on("dblclick.zoom", null)

      const innerWrapper = d3.select("#outer-wrapper").append("g").attr("id", "inner-wrapper")

      const link = helpers.createLinks(innerWrapper, links)
      const node = helpers.createNodes(innerWrapper, nodes)
  
      node.on('click', async (e, d) => {
        const doubleClickDelay = 300
        if (alreadyClicked) { 

          if (store.existing.map(x => x[0]).includes(d.id)){
            const c = store.existing.filter((y) => {
              return y[0] === d.id
            })

            const t = c[0][1]

            const n = t + 3
            c[0][1] = n

            //call for method
            let vals
            let nodes = []
            let links = []
      
            store.existing.forEach(function(key) {
              vals = store.graphData[key[0]]
              
              vals.nodes.slice(0,key[1]+1).forEach((node) => {
                if (!nodes.map(d => d.id).includes(node.id)){
                  nodes.push(node)
                }
              })

              links = links.concat( vals.links.slice(0,key[1]) )
            })

            this.chart({
              nodes: nodes,
              links: links
            })

          } else {
            await this.callForNodes(d.id)
          }
          
          alreadyClicked = false;
          clearTimeout(timer);
        } else {
          timer = setTimeout(async function () {
            alreadyClicked = false;
            if (store.currentDetailId !== d.id) {
              await apiService.methods.fetchDetails(d.id)
              store.currentDetailId = d.id
            }
          }, doubleClickDelay);
          alreadyClicked = true;
        }
      })

      // node
      // .on("mousedown", (e, d) => {
      //   let x = d3.select(`#${d.id} circle`)
      //   int = setInterval(() => {
      //     j+=1
      //     console.log(j)
      //     x.attr("r", 50+j)
      //   }, 1000);
      // })

      let j = 0
      const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
  
      let i = 0

      simulation
      .on("tick", () => {
        i += 1
        link.attr("d", linkArc)
        node.attr("transform", d => `translate(${d.x},${d.y})`); //scale(${(i/20)})`);
      })
      .on("end", () => {
        node.transition().duration(500).delay(100).ease(d3.easeBounceOut).attr("transform", (d) => {
          return `translate(${d.x},${d.y})`//scale(0.9)`
        })
        
        let scale = 100
        let scaleA, scaleB
        const defaultSettings = settingsModule.defaultSettings
        // const neutralSettings = settingsModule.neutralSettings
        
        const groupASelector = 'scifi'
        const groupBSelector = 'drama'

        const groupA = d3.selectAll(`.${groupASelector}`)
        const groupB = d3.selectAll(`.${groupBSelector}`)
        const all = d3.selectAll(".node")

        
        slider.oninput = function() {
          store.graphSettings.a = 100 - +this.value
          store.graphSettings.b = +this.value

          scaleA = store.graphSettings.a / scale
          scaleB = store.graphSettings.b / scale
          
          let vis

          groupA.select("circle").style("transform", `scale(${(scaleA)})`)
          groupA.select("image").style("transform", `scale(${(scaleA)})`)
          groupA.style("display", (d) => {
            vis = store.graphSettings.a < 3 ? 'none' : "block"
            d3.selectAll(`.link[target='${d.id}']`).style("display", vis)

            return vis
          })
          
          groupB.select("circle").style("transform", `scale(${(scaleB)})`)
          groupB.select("image").style("transform", `scale(${(scaleB)})`)
          groupB.style("display", (d) => {
            vis = store.graphSettings.b < 3 ? 'none' : "block"
            d3.selectAll(`.link[target='${d.id}']`).style("display", vis)

            return vis
          })


          simulation
          .force('collide', d3.forceCollide((d) => {
            if (d.type.includes(groupASelector) && d.type.includes(groupBSelector)) {
              return (store.graphSettings.a + store.graphSettings.b)/2
            } else if (d.type.includes(groupASelector)) {
              return store.graphSettings.a
            } else if (d.type.includes(groupBSelector)) {
              return store.graphSettings.b 
            }
            // } else if (d.entity == 'person') {
              // return neutralSettings
            // }
            return defaultSettings.collide
          }))
          .force("link", d3.forceLink(links).id(d => d.id).distance((d) => {
            // base this on the character name length
            if (d.target.type.includes(groupASelector) && d.target.type.includes(groupBSelector)) {
              return (store.graphSettings.a + store.graphSettings.b)/2
            } else if (d.target.type.includes(groupASelector)) {
              return store.graphSettings.a
            } else if (d.target.type.includes(groupBSelector)) {
              return store.graphSettings.b
            }
            // } else if (d.entity == 'person') {
            //   return neutralSettings
            // }
            return defaultSettings.linkLength
          }))
          .force("charge", d3.forceManyBody().strength((d) => {

            if (d.type.includes(groupASelector) && d.type.includes(groupBSelector)) {
              return (store.graphSettings.a + store.graphSettings.b)/2
            } else if (d.type.includes(groupASelector)) {
              return -store.graphSettings.a 
            } else if (d.type.includes(groupBSelector)) {
              return -store.graphSettings.b 
            }
            // } else if (d.entity == 'person') {
            //   return neutralSettings
            // }
            return defaultSettings.charge
          }))
          .alpha(0.2)
          .alphaMin(0.1)
          .restart()
        }
      })
  
      return innerWrapper.node();
    },

    restart() {
      this.chart(store.graphData)
    },

    async callForNodes(id, i=5) {
      await apiService.methods.fetchDetails(id)

      if ( !store.existing.map((d) => {d[0]} ).includes(id) ) {
        store.existing.push([id, i])
        await apiService.methods.fetchSingle(id)
      }

      // await apiService.methods.fetchGraphData(
      //   store.existing.map(d => d[0]), "no-var"
      // )

      store.currentDetailId = id

      // let li = []
      // let no = []

      // const currentGraph = store.existing.map((d) => {
      //   let data = store.graphData[d[0]]
      //   let count = d[1]
      //   li = li.concat(data.links.slice(0, count))
      //   no = no.concat(data.nodes.slice(0, count+1))
      // })

      // var links = li.filter((v,i,a) => {
      //   return a.indexOf(v)==i
      // })

      // var nodes = no.filter((v,i,a)=> {
      //   return a.map(d => d.id).indexOf(v.id)==i
      // })

      let vals
      let nodes = []
      let links = []

      store.existing.forEach(function(key) {
        vals = store.graphData[key[0]]
        
        vals.nodes.slice(0,key[1]+1).forEach((node) => {
          if (nodes.map(d => d.id).excludes(node.id)){
            // node.r = store.graphSettings.a
            nodes.push(node)
          }
        })

        links = links.concat( vals.links.slice(0,key[1]) )
      })

      store.graphTypes =  helpers.getTypes(nodes)

      this.chart({
        nodes: nodes,
        links: links
      })

      store.currentFocus = 'details'
    }
  }
}
