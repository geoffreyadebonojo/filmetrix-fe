import { reactive } from 'vue'

export const store = reactive({
  // graph data states
  detailsData: {},
  existing: [],
  graphData: {},
  currentDetailId: false,

  // graph states
  inMotion: false,
  
  // nav states
  currentFocus: 'empty',
  currentResultTab: '',

  // app states
  aboutUs: false,
  displayingAbout: false,

  // panel states
  panelWidth: '350',
  panelOpen: true,

  // search states
  searchResults: [],

  // node management states
  lockedHighlights: [],
  highlighted: [],

  // saved states
  isSaved: false,
  savedGraphs: {},
  
  // control states
  appliedFilters: [], 
  showControls: false,
  graphTypes: [],
  
  // game states
  turn: 1,
})

// export const store = reactive({
//   graphStates: {
//     detailsData: {},
//     existing: [],
//     graphData: {},
//     currentDetailId: false,
//   },
//   graphStates: {
//     inMotion: false,
//   },
//   navStates: {
//     currentFocus: 'empty',
//     // ??
//     currentResultTab: '',
//   },
//   displayStates: {
//     aboutUs: false,
//     displayingAbout: false,
//   },
//   panelStates: {
//     width: '350',
//     open: true,
//   },
//   searchStates: {
//     results: []
//   },
//   nodeStates: {
//     lockedHighlights: [],
//     highlighted: [],
//   },
//   savedStates: {
//     isSaved: false,
//     savedGraphs: {},
//   },
//   controlStates: {
//     appliedFilters: [], 
//     showControls: false,
//     graphTypes: [],
//   },
//   gameStates: {
//     turn: 1
//   }
// })