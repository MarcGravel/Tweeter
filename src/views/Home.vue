<template>
  <div id="homePageContainer">
    <div id="userInfo">
      <UserHomePage />
    </div>
    <aside id="sideBar">

    </aside>
    <main id="mainFeed">

    </main>
  </div>
</template>

<script>
import cookies from 'vue-cookies'
import router from '../router'
import UserHomePage from '../components/UserHomePage.vue'

  export default {
    name: 'Home',
    components: {
        UserHomePage
    },
    computed: {
      getLoginToken() {
        return cookies.get('loginToken') 
      },
    },
    //if login token not there, this will not allow home page to mount
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
      grid-template-rows: 20% 80%;

      #userInfo {
        height: 100%;
        width: 100%;
        background-color: rgb(106, 160, 179);
        grid-row: 1;
      }

      #sideBar {
        display: none;
      }

      #mainFeed {
        height: 100%;
        width: 100%;
        background-color: rgb(193, 228, 240);
        grid-row: 2; 
      }

    }

    @media screen and (min-width: 500px) {
       
    }

    @media screen and (min-width: 900px) {
       
    }
</style>
