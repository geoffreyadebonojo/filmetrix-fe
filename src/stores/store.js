import { reactive } from 'vue'

export const store = reactive({
  // these two clash
  currentFocus: 'empty',
  currentResultTab: '',
  ///
  searchResults: [],
  currentDetailId: false,
  existingGraphAnchors: {
    person: [],
    movies: [],
    tv: []
  },
  graphData: [],
  detailsData: {}
})
