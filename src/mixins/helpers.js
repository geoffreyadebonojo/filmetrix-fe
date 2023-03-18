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
  }
}