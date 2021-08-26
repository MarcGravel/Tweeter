<template>
    <div id="profileContainer">
        <div id="userProfile">
            <UserProfilePage />
        </div>            
        <div id="userEditInfo">
            <FeedDisplay />
        </div>

    </div>
</template>

<script>
import UserProfilePage from '@/components/UserProfilePage.vue'
import FeedDisplay from '../components/FeedDisplay.vue'
import cookies from 'vue-cookies'
import router from '../router'

    export default {
        name: "Profile",
        components: {
            UserProfilePage,
            FeedDisplay,
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
    #profileContainer {
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