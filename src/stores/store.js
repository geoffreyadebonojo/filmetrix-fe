import { reactive } from 'vue'

export const store = reactive({
  inMotion: false,
  currentFocus: 'empty',
  currentResultTab: '',
  aboutUs: false,
  panelWidth: '350',
  searchResults: [],
  currentDetailId: false,
  existing: [],
  graphData: {},
  graphTypes: [],
  appliedFilters: [], 
  detailsData: {},
  highlighted: [],
  showControls: false,
  panelOpen: true,
  savedGraphs: {}
})
