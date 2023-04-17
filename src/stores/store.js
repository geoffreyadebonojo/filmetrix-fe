import { reactive } from 'vue'

export const graphStates = reactive({
  existing: [],
  graphData: {},
  inMotion: false,
  lockedHighlights: [],
  graphType: 'tree'
})

export const gameStates = reactive({
  turn: 1
})

export const panelStates = reactive({
  width: '350',
  isOpen: true,
  currentFocus: 'empty',
  profileTab: 'movies',
  detailsData: {}
})

export const appStates = reactive({
  displayingAbout: false,
  playingGame: false,
  theme: 'dark'
})

export const userStates = reactive({
  currentUser: {},
  loggedIn: false,
  userMovieList: [],
  userGraphList: []
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