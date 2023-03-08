import { reactive } from 'vue'

export const store = reactive({
  // these two clash
  currentFocus: 'empty',
  currentResultTab: '',
  // prev: '',
  panelWidth: '350',
  ///
  searchResults: [],
  currentDetailId: false,
  existing: [],
  graphData: {},
  detailsData: {},
  graphSettings: {
    a: 50,
    b: 50
  }
})
