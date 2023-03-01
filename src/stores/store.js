import { reactive } from 'vue'

export const store = reactive({
  // these two clash
  currentFocus: 'empty',
  currentResultTab: '',
  ///
  searchResults: [],
  currentDetailId: false,
  graphData: [],
  detailsData: {}
})
