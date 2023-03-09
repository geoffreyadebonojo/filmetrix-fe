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
  this.forEach((d) => {
    if (!this.includes(d)){
      this.push(d)
    }
  })
  return this
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