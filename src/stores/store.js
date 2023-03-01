import { reactive } from 'vue'

export const store = reactive({
  focus: 'empty',
  mostRecentSearchId: '',
  searchResults: []
})
