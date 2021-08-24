<template>
    <div>
        <div id="userProfile" v-if="isUserProfile">
            <UserProfilePage />
        </div>            
        <div id="othersProfile" v-else>
            <OthersProfilePage />
        </div>
        <h3 @click="getValue($event)">This Is The Value</h3>
    </div>
</template>

<script>
import UserProfilePage from '@/components/UserProfilePage.vue'
import OthersProfilePage from '../components/OthersProfilePage.vue';

    export default {
        name: "Profile",
        components: {
            UserProfilePage,
            OthersProfilePage,
        },
        computed: {
            isUserProfile() {
                return this.$store.state.isUserProfile;
            }
        },
        methods: {
            getValue(event) {
                console.log(event.srcElement.innerText);
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>