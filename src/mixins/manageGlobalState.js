import { 
  graphStates,
  panelStates,
  store 
} from '@/stores/store.js'
import { setFocus, openField } from './helpers.js'


export default {
  clearGraph() {
    localStorage.setItem("lockedGraph", JSON.stringify([]))
    graphStates.existing =     []
    graphStates.graphData =    {}
    panelStates.detailsData =  {}
    store.searchResults =      []
    setFocus('empty')
    openField()
  }
}