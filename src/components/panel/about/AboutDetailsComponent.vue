<template>
  <div class="about-details">
    <a id="linked-in" href="" target="_blank">
      <img src="/linkedin-icon.png" style="display:none">  
    </a>
    <img id="poster" src=""/>
    <div id="name-container">
      <div id="name"></div>
      <div id="job"></div>
    </div>
    <div id="description-container">
      <div id="description"></div>
    </div>

    <a id="tmdb-attribution" href="https://www.themoviedb.org/?language=en-US" target="_blank" style="display:none">
      powered by
      <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"/>
    </a>
  </div>
</template>

<style scoped lang="scss">
  #filmetrix {
    #poster {
      border-top-left-radius: 50px;
      border-bottom-right-radius: 50px;
      height: 245px;
      width: 170px;
    }
    #name-container {
      justify-content: center;
      div {
        font-weight: 900;
      }
    }
  }
  .about-details {
    font-family: $global-font;
    display: grid;
    grid-template-rows: 25px 0fr 25px 2fr 0fr;
    height: 100%;
    
    #linked-in { 
      height: 100%;
      &:hover {
        cursor: alias;
      }
      img {
        height: 100%;
      }
    }

    #poster {
      width: 100%;
      margin: auto auto 2em auto;
    }

    #name-container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      div {
        font-weight: 900;
      }
    }

    #description-container {
      #description {
        margin: 2em auto auto auto;
        line-height: 1.3em;
      }
    }

    #tmdb-attribution {
      padding: 20px;
      &:hover {
        cursor: alias;
      }
    }
  }
</style>