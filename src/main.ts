import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')


Array.prototype.pushUnique = function(elem) {
  if (!this.includes(elem)) {
    this.push(elem)
  }
  return this
}

Array.prototype.unique = function() {
  let uniq = []
  this.forEach((d) => {
    if (uniq.excludes(d)){
      uniq.push(d)
    }
  })
  return uniq
}

Array.prototype.remove = function(elem) {
  const index = this.indexOf(elem);
  if (index > -1) { // only splice array when item is found
    this.splice(index, 1); // 2nd parameter means remove one item only
  }
  return this
}

Array.prototype.togglePresence = function(elem) {
  if (this.includes(elem)) {
    this.remove(elem)
  } else {
    this.pushUnique(elem)
  }
  return this
}

Array.prototype.excludes = function(elem) {
  return !this.includes(elem)
}

Array.prototype.flatten = function() {
  const flattened = []

  this.forEach((sub) => {
    sub.forEach((d) => {
      flattened.push(d)
    })
  })

  return flattened
}

Array.prototype.overlapsWith = function(otherArray) {
  const x = []
  
  this.forEach((c) => {
    otherArray.forEach((d) => {
      if (c == d) {
        x.push(d) 
      }
    })
  })

  return x
}