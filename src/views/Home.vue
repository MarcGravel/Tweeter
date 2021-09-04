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
        AsideMenu
    },
    computed: {
      getLoginToken() {
        return cookies.get('loginToken') 
      },
    },
    //if login token not there, this will not allow home page to loat and will redirect to login
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
        background-color: #0096C7;
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
        background-color: rgb(63, 63, 63); 
      }

  @media screen and (min-width: 768px) {

    #navBar {
    right: 0;
  }

    #homePage {
      justify-items: center;

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
      grid-template-columns: 20% 60% 20%;
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
        width: 99%;
        grid-column: 2;

          #tweetInputContainer{
            width: 100%;
          }
      }

      #homePageContainer {
        grid-row: 1;
      }

      #mainFeed {
        grid-row: 2;
        margin-top: 1vh;
      }
    }
  }
    
</style>
