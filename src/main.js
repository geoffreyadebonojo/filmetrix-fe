import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import * as d3 from "d3"

import '/public/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')

Array.prototype.random = function(size=1) {
  var shuffled = this.slice(0), i = this.length, temp, index;
  while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}

Array.prototype.last = function() {
  if (this.length > 0) {
    return this[this.length- 1]
  } else {
    return []
  }
}

Array.prototype.ids = function() {
  return this.map(d => d.id)
}

Array.prototype.uniqueById = function() {
  let uniq = []
  this.forEach((d) => {
    if (uniq.map(d => d.id).excludes(d.id)){
      uniq.push(d)
    }
  })
  return uniq
}
Array.prototype.pushUniqueById = function(elem) {
  if (!this.map(d => d.id).excludes(elem.id)) {
    this.push(elem)
  }
  return this
}

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

Array.prototype.moveToEnd = function(elem) {
  this.remove(elem)
  this.push(elem)

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

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function() {
  return this.each(function() {
      var firstChild = this.parentNode.firstChild;
      if (firstChild) {
          this.parentNode.insertBefore(this, firstChild);
      }
  });
};