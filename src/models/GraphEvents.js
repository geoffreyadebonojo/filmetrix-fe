import { 
  graphStates 
} from '@/stores/store.js'
import GraphNode from '@models/GraphNode'

export default class GraphEvents {
  constructor(id) {
    this.gn = new GraphNode(id)
  }

  mouseEnterNode() {
    if (graphStates.inMotion) { return }
    this.gn.hover()
    this.gn.linkHighlighter()
  }
  
  mouseLeaveNode() {
    if (graphStates.inMotion) { return }
    this.gn.node.classed('added', false)
    this.gn.unHover()
    this.gn.linkUnhighlighter()
  }
}