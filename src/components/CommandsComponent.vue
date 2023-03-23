<template>
  <div id="commands">
    <div class="item">Commands</div>
    <hr style="margin:20px 0">
    <div class="item">single click</div>
    <div class="item">double click</div>
  </div>

  <div id="centerline"></div>

  <div id="effects">
    <div class="item">Effects</div>
    <hr style="margin:20px 0">
    <div class="item">view details</div>
    <div class="item">get new nodes: if the node has nodes, it'll add more</div>
  </div>
</template>

<script>
  export default {
    name: "CommandsContainer"
  }
</script>

<style>
  #commands {
    grid-area: commands;
    text-align: right;
    margin: 10px;
  }
  #effects {
    grid-area: effects;
    text-align: left;
    margin: 10px;
  }
  #centerline {
    grid-area: centerline;
    margin: auto;
    position: relative;
    border-left: 1px solid white;
    height: 100%;
  }
  #commands-container {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 10px 1fr;
    grid-template-areas:
      "commands centerline effects"
  }
  .item {
    font-family: "Dosis", sans-serif;
    margin-bottom: 20px;
  }
</style>