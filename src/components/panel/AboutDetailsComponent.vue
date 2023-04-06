<script setup>
  import { store } from '@/stores/store.js'
</script>

<template>
  <div>
    <img id="poster" src=""/>
    <div id="name-container">
      <div id="name"></div>
      <div id="job"></div>
    </div>
    <div id="links">
      <a id="linked-in" href="" target="_blank">
      </a>
    </div>
    <div id="description"></div>
  </div>
</template>

<style scoped lang="scss">
  #filmetrix {
    #poster {
      width: 108px;
      left: -3px;
      bottom: 8px;
    }
    #name {
      margin: 100px 0px 0px -14px;
    }
  }

  #geoff, #pierce {
    #poster {
      width: 168px;
      right: 37px;
      bottom: 7px;
    }

    #job {
      font-size: 12px;
      line-height: 12px;
      margin-top: 12px;
    }

    #name {
      left: 20px;
      top: 25px;
    }
  }

  .about-details {
    font-family: $global-font;
    
    #links {
      right: 30px;
      top: 10px;

      #linked-in > img {
        width: 20px;
      }
    }
  }
</style>