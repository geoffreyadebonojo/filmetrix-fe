import { reactive } from 'vue'

export const graphData = reactive({
  active: {
    links: [],
    nodes: []
  },
  inactive: {
    links: [],
    nodes: []
  }
})

export const graphStates = reactive({
  existing: [],
  graphData: {},
  inMotion: false,
  graphType: 'main',
  currentGraphId: '',
  pageSearchActive: false,
  genreSearchActive: false,
  matching: [],
  visited: [],
  dragLocked: false,
  movieGenreCounts : {},
  genres: [ 'acting', 'adventure', 'thriller', 
            'scifi', 'action', 'mystery', 'drama', 
            'war', 'crime', 'romance', 'fantasy', 
            'history', 'horror', 'production', 
            'sound', 'camera', 'writing', 'directing', 
            'comedy', 'costume & make-up', 'crew', 
            'visual', 'effects', 'editing', 'animation', 
            'art', 'lighting', 'family', 'western', 
            'tvmovie']
  // simulation: null
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