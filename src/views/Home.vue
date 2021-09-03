<template>
  <div id="homePage">
    <div id="navBar">
      <NavBar />
    </div>
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

  export default {
    name: 'Home',
    components: {
        UserHomePage,
        UserTweetInput,
        FeedDisplay,
        NavBar
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

      #sideBar {
        display: none;
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
    
</style>
