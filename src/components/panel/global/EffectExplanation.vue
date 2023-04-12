<script setup>
  import * as d3 from 'd3'
</script>

<template>
  <div v-bind:class="'item ' + this.$attrs.section">
    <div @click="elaborateOn()" style="display:flex">
      <p>
        {{ this.$attrs.main }}
      </p>
      <img class="chevron" src="/chevron.svg"/>
    </div>
    <p class="elaboration" style="display:none">
      {{ this.$attrs.secondary }}
    </p>
  </div>
</template>

<script>
  export default {
    name: 'Explanation',
    data () {
      return {}
    },
    methods: {
      async elaborateOn() {
        const si = d3.selectAll(`.${this.$attrs.section}`)
        const el = d3.select(`#effects .${this.$attrs.section} .elaboration`)
        const chev = d3.select(`#effects .${this.$attrs.section} .chevron`)
  
        el.style("display", () => {
          if (el.style("display") == "none"){
            si.transition().duration(200).style("height", this.$attrs.expandedHeight)
            chev.transition().duration(200).style("transform", "rotate(270deg)")
            el.transition().delay(100).style("display", "block")
          } else {
            si.transition().duration(200).style("height", "3em")
            chev.transition().duration(200).style("transform", "rotate(90deg)")
            el.transition().delay(100).style("display", "none")
          }
        })
      }
    }
  }
</script>

<style scope lang="scss">
  .chevron {
    height: 10px;
    margin: auto -7px auto auto;
    transform: rotate(90deg);
    opacity: 0.5;
  }

  .item {
    &:hover {
      cursor: $cursor;

      p {
        &:hover {
          color: white
        }
      }
      .chevron {
        opacity: 1;
        height: 13px;
      }
    }
  }

  .elaboration {
    display: none;
    font-style: italic;
    font-size: 13px;
    margin: 7px auto auto auto;
  }

  p {
    margin: auto auto auto 0
  }
</style>