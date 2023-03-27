

<template>
  <div class="icon" id="back-button" @click="back()">
    <img src="/back-icon.svg" id="back-icon">
  </div>
</template>


<script>
  export default {
    methods: {
    // back () {
    //   const nav = d3.select("#navbar")
    //   store.aboutUs = false

    //   d3.select('#panel-body')
    //   .transition()
    //   .duration(50).delay(200)
    //   .ease(d3.easeBounceOut)
    //   .style("left", null)
    //   .style("right", "0px")
    //   .style("width", `${store.panelWidth}px`)
      
    //   d3.select("#graph-container")
    //   .transition().duration(100).delay(120)
    //   .style("width", "100%")

    //   d3.select("#back-button")
    //   .transition().delay(0).duration(200)
    //   .style("transform", "rotate(180deg)")
    //   .transition().delay(100)
    //   .style("display", "none")

    //   d3.selectAll('.main-panel-component')
    //   .transition().delay(300)
    //   .style("display", "block")

    //   store.focus = "search"
    //   d3.select("#highlight")
    //   .transition()
    //   .duration(100)
    //   .style("display", "block")

    //   d3.select("#settings-icon").transition().delay(300).style('display', 'block')

    //   nav.transition()
    //   .delay(300)
    //   .duration(100)
    //   .style("bottom", null)
    //   .style("top", "0px")

    //   d3.select("#about-outer-wrapper").remove()
    // }
    }
  }
</script>


// transitionToAbout() {
  //   this.setCurrentFocus('about')
  //   store.aboutUs = true
  //   const nav = d3.select("#navbar")
    
  //   d3.selectAll('.main-panel-component')
  //   .style("display", "none")

  //   d3.select("#settings-icon").style('display', 'none')
    
  //   d3.select('#panel-body')
  //   .transition()
  //   .duration(50).delay(200)
  //   .ease(d3.easeBounceOut)
  //   .style("left", "0px")
  //   .style("width", "350px")
  //   // .style("width", "350px")
    
  //   d3.select("#graph-container")
  //   .transition().duration(100).delay(120)
  //   .style("width", "0%")

  //   d3.select("#about-graph-container")
  //   .transition().duration(100).delay(0)
  //   .style("width", "100%")

  //   d3.select("#highlight")
  //   .transition()
  //   .duration(100)
  //   .style("display", "none")

  //   d3.select("#back-button")
  //   .transition().delay(0)
  //   .style("display", "flex")
  //   .style("right", "15px")
  //   .transition().delay(50).duration(100)
  //   .style("transform", "rotate(180deg)")

  //   nav.transition()
  //   .duration(0)
  //   .style("bottom", "50px")
  // },