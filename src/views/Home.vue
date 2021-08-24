<template>
  <div id="homePageContainer">
    <div id="userInfo">
      <UserHomePage />
    </div>
    <aside id="sideBar">

    </aside>
    <div id="tweetInputContainer">
      <UserTweetInput />
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

  export default {
    name: 'Home',
    components: {
        UserHomePage,
        UserTweetInput,
        FeedDisplay
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
    #homePageContainer {
      width: 100vw;
      height: 100vh;
      display: grid;
      grid-template-rows: 15% 20% 65%;

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

      #mainFeed {
        height: fit-content;
        width: 100%;
        background-color: rgb(63, 63, 63);
        grid-row: 3; 
        overflow: scroll;
      }

    }

    @media screen and (min-width: 500px) {
       
    }

    @media screen and (min-width: 900px) {
       
    }
</style>
