import { reactive } from 'vue'

export const graphStates = reactive({
  existing: [],
  graphData: {},
  inMotion: false,
  lockedHighlights: []
  // graphTypes: [],
})

export const gameStates = reactive({
  turn: 1
})

export const panelStates = reactive({
  width: '350',
  isOpen: true,
  currentFocus: 'empty',
  detailsData: {}
})

export const appStates = reactive({
  displayingAbout: false,
  playingGame: false,
  theme: 'dark',
})

export const userStates = reactive({
  userMovieList: [],
  loggedIn: false,
  currentUser: {}
})

export const store = reactive({
  searchResults: [],
  savedGraphs: {},
  bookmarks: []
})



// export const appState = reactive({
//   search: {
//     focus: 'search',
//     searchResults: []
//   }
// })