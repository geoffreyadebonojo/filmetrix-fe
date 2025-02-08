import { reactive } from 'vue'

export const graphStates = reactive({
  existing: [],
  graphData: {},
  inMotion: false,
  graphType: 'main',
  currentGraphId: '',
  pageSearchActive: false,
  matching: [],
  visited: []
})

export const panelStates = reactive({
  width: '351',
  isOpen: true,
  currentFocus: 'empty',
  profileTab: 'movies',
  detailsData: {},
})

export const appStates = reactive({
  displayingAbout: false,
  playingGame: false,
  shiftKeyIsPressed: false,
  metaKeyIsPressed: false,
})

export const userStates = reactive({
  currentUser: {},
  loggedIn: false,
  userMovieList: [],
  userGraphList: []
})

export const store = reactive({
  searchTerm: '',
  searchResults: [],
  savedGraphs: {},
  bookmarks: []
})

// export const keyStates = reactive({
//   shiftKeyIsPressed: false
// })