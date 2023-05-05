import { 
  graphStates,
  panelStates,
  userStates,
  store 
} from '@/stores/store.js'
import { setFocus, openField } from './helpers.js'
import api from '@mixins/api'


export default {
  clearGraph() {
    localStorage.setItem("lockedGraph", JSON.stringify([]))
    graphStates.existing =       []
    graphStates.graphData =      {}
    graphStates.currentGraphId = ''
    panelStates.detailsData =    {}
    store.searchResults =        []
    setFocus('empty')
    openField()
  },

  async loadUser (response) {
    userStates.loggedIn = true
    userStates.currentUser = response
    userStates.currentUser.username = response.email
    userStates.currentUser.profileImg = response.profile_img
    userStates.userMovieList = await api.fetchMovieList(response.id)
    userStates.userGraphList = await api.fetchGraphList(response.id)
  },

  nullUser () {
    userStates.loggedIn = false
    userStates.currentUser = {}
    userStates.userMovieList = []
    userStates.userGraphList = []
  }
}