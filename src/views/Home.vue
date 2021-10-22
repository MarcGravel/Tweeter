<template>
  <div id="homePage">
    <div id="navBar">
      <NavBar />
    </div>
    <aside id="sideMenu">
      <AsideMenu />
    </aside>
    <div id="homePageContainer">
      <div id="userInfo">
        <UserHomePage />
      </div>
      <div id="tweetInputContainer">
        <UserTweetInput />
      </div>
    </div>
    <main id="mainFeed">
        <FeedDisplay />
    </main>
  </div>
</template>

<script>
import cookies from 'vue-cookies'
import router from '../router'
import UserHomePage from '../components/UserHomePage.vue'
import UserTweetInput from '../components/UserTweetInput.vue'
import FeedDisplay from '../components/FeedDisplay.vue'
import NavBar from '../components/NavBar.vue'
import AsideMenu from '../components/AsideMenu.vue'


  export default {
    name: 'Home',
    components: {
        UserHomePage,
        UserTweetInput,
        FeedDisplay,
        NavBar,
        AsideMenu,
    },
    computed: {
      getLoginToken() {
        return cookies.get('loginToken') 
      },
    },
    //if login token not there, this will not allow home page to load and will redirect to login
    beforeMount() {
        if (this.getLoginToken === null) {
          router.push('/');
        }
    },
  }
</script>

<style lang="scss" scoped>

  #navBar {
    position: fixed;
    z-index: 99;
    grid-row: 1;
    height: 56px;
  }

  #sideMenu {
    display: none;
  }

  #homePage {
    display: grid;
    grid-template-rows: auto auto;
    background: linear-gradient(0deg, rgb(49, 49, 49) 0%, rgb(43, 42, 42) 33%, rgb(63, 63, 63) 100%);

  #homePageContainer {
    margin-top: 56px;
    grid-row: 1;
    width: 100%;
    height: fit-content;
    display: grid;
    grid-template-rows: 15vh 21vh;

      #userInfo {
        height: 100%;
        width: 100%;
        background-color: rgb(0,150,199);
        background: linear-gradient(54deg, rgba(0,150,199,1) 0%, rgba(144,224,239,1) 35%, rgba(0,180,216,1) 100%);
        grid-row: 1;
      }

      #tweetInputContainer {
        grid-row: 2; 
        background-color: #ADE8F4;
      }
    }
}
      #mainFeed {
        height: fit-content;
        width: 100%;
      }

  //fixes page scaled on small phones
  @media screen and (max-width: 768px) {
    #homePageContainer {
      height: 45vh;

      #userInfo {
        height: 15vh;
      }

      #tweetInputContainer {
        height: 30vh;
      }
    }
    
    #mainFeed {
        margin-top: 8vh;
      }
  }

  @media screen and (min-width: 768px) {

    #navBar {
      right: 0;
    }

    #homePage {
      justify-items: center;
      background: transparent;

      #homePageContainer, #tweetInputContainer{
        width: 768px;
      }

      #homePageContainer {
        grid-template-rows: 25vh 21vh;
      }
    }
  }

  @media screen and (min-width: 1100px) {
    #navBar {
        display: none;
    }

    #homePage {
      grid-template-rows: auto auto;
      grid-template-columns: 20% 80%;
      justify-items: center;

      #sideMenu {
        display: block;
        grid-column: 1;
        width: 20%;
        height: 100vh;
        position: fixed;
        right: 80%;
        background-color: #CAF0F8;
      }

      #homePageContainer{
        margin-top: 0;
        width: 80%;
        grid-column: 2;
        grid-row: 1;

        #userInfo {
          margin-left: 0.2vw;
        }

          #tweetInputContainer{
            width: 100%;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            margin-left: 0.2vw;
          }
      }

      #mainFeed {
        grid-row: 2;
        margin-top: 1vh;
        margin-left: 90%;
      }
    }
  }
    
</style>
