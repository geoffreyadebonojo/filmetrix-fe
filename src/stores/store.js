import { reactive } from 'vue'

export const graphStates = reactive({
  currentDetailId: false,
  detailsData: {},
  existing: [],
  graphData: {},
  inMotion: false,
  lockedHighlights: [],
})

export const gameStates = reactive({
  turn: 1
})

export const panelStates = reactive({
  width: '350',
  isOpen: true,
  currentFocus: 'empty',
})

export const appStates = reactive({
  displayingAbout: false,
  playingGame: false,
})

export const store = reactive({
  searchResults: [],
  savedGraphs: {},
  // graphTypes: [],
})