<template>
    <div id=profilePage>
        <div id="navBar">
            <NavBar />
        </div>
        <div id="profileContainer">
            <div id="userProfile">
                <UserProfilePage />
            </div>            
            <div id="userEditInfo">
                <FeedDisplay />
            </div>
        </div>
    </div>
</template>

<script>
import UserProfilePage from '@/components/UserProfilePage.vue'
import FeedDisplay from '../components/FeedDisplay.vue'
import NavBar from '../components/NavBar.vue'
import cookies from 'vue-cookies'
import router from '../router'

    export default {
        name: "Profile",
        components: {
            UserProfilePage,
            FeedDisplay,
            NavBar
        },
        computed: {
            isUserProfile() {
                return this.$store.state.isUserProfile;
            },
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

    #navBar {
      position: fixed;
      z-index: 99;
      grid-row: 1;
      height: 56px;
    }

    #profileContainer {
        margin-top: 56px;
        display: grid;
        grid-template-rows: 50vh 50vh;

        #userProfile, #othersProfile {
            grid-row: 1;
        }

        #userEditInfo, #othersTweetDisplay {
            grid-row: 2;
        }
    }
</style>