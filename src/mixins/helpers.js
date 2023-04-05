export default {
  getTypes(nodes) {
    let types = []
    nodes.forEach((node) => {
      if (node.entity === "person") {
        // node.type.forEach((type) => {
        //   types.pushUnique(type)
        // })
      } else if (["movie", "tv"].includes(node.entity)) {
        node.type.forEach((type) => {
          types.pushUnique(type)
        })
      }
    })

    return types
  },

  settings(type) {
    return {
      graphType: type,
      containerId: `${type}-graph-container`,
      outerWrapperId: `${type}-outer-wrapper`,
      innerWrapperId: `${type}-inner-wrapper`
    }
  }
}