<template>
    <div id="discoverContainer">
        <div id="userInfo">
            <UserHomePage />
        </div>
        <div id="featuredTweet">
            <h3>Featured Tweet</h3>
            <FeaturedTweet />
        </div>
        <div id="discoverUsersContainer">
            <div id="discoverBanner">
                <h1>Explore new content!</h1>
            </div>
            <DiscoverUsers />
        </div>
    </div>
</template>

<script>
import DiscoverUsers from '../components/DiscoverUsers.vue'
import UserHomePage from '../components/UserHomePage.vue'
import FeaturedTweet from '../components/FeaturedTweet.vue'
import cookies from 'vue-cookies'
import router from '../router'

    export default {
        name: "Discover",
        components: {
            DiscoverUsers,
            UserHomePage,
            FeaturedTweet
        },
        computed: {
            getLoginToken() {
                return cookies.get('loginToken');
            }
        },
        beforeMount() {
            if (this.getLoginToken === null) {
                router.push('/');
            }
        }
    }
</script>

<style lang="scss" scoped>
    #discoverContainer {
      width: 100vw;
      height: 100vh;
      display: grid;
      grid-template-rows: 15vh auto 45%;

        #userInfo {
            height: 100%;
            width: 100%;
            background-color: #0096C7;
            grid-row: 1;
        }

        #featuredTweet {
            height: auto;
            width: 100%;
            grid-row: 2;
            background-color: rgb(63, 63, 63);
            display: grid;
            justify-items: center;
            
            h3{
                color: whitesmoke;
                margin-top: 2vh;
            }
        }

        #discoverUsersContainer {
          grid-row: 3;

          #discoverBanner {
            background-color: #0096C7;
            height: 8vh;
            display: grid;
            justify-items: center;
            align-items: center;
            box-shadow: 0 10px 20px #03045E ;
            
            h1 {
                color: white;
            }
          }
      }
    }
</style>