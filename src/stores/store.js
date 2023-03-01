import { reactive } from 'vue'

export const store = reactive({
  currentFocus: 'empty',
  currentResultTab: '',
  searchResults: [],
  currentDetailId: '',
  graphData: []
})
