import { reactive } from 'vue'

export const store = reactive({
  // these two clash
  currentFocus: 'empty',
  currentResultTab: '',
  // prev: '',
  aboutUs: false,
  panelWidth: '350',
  ///
  searchResults: [],
  currentDetailId: false,
  existing: [],
  graphData: {},
  graphTypes: [],
  appliedFilters: [], 
  detailsData: {},
  graphSettings: {
    a: 50,
    b: 50
  },
  highlighted: [],
  showControls: false
})
