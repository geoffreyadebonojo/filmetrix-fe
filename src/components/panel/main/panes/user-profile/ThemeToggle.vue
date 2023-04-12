<template>
  <div id="theme-mode">
    <p>
      dark
    </p>
    <label class="switch">
      <input type="checkbox" @click="toggleTheme($event)">
      <span class="slider round"></span>
    </label>
    <p>
      light
    </p>
  </div>
</template>

<script>
  export default {
    name: "ThemeToggle",
    methods: {
      toggleTheme (e) {
        const isChecked = e.currentTarget.checked

        if (isChecked) {
          localStorage.setItem('theme', 'light')
          appStates.theme = 'light'
        } else {
          localStorage.setItem('theme', 'dark')
          appStates.theme = 'dark'
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  #theme-mode {
    display: flex;

    label {
      margin: auto;
      &:hover {
        cursor: $cursor;
      }
    }

    p {
      margin: auto;
      font-family: $global-font;
    }
  }

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input { 
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background-color: #2196F3;
    }

    &:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }

    &:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;

  &:before{
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }
}

// .slider.round {
//   border-radius: 34px;
// }

// .slider.round:before {
//   border-radius: 50%;
// }

</style>