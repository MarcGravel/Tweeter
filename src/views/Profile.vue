<template>
    <div id=profilePage>
        <div id="navBar">
            <NavBar />
        </div>
        <aside id="sideMenu">
            <AsideMenu />
        </aside>
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
import AsideMenu from '../components/AsideMenu.vue'

    export default {
        name: "Profile",
        components: {
            UserProfilePage,
            FeedDisplay,
            NavBar,
            AsideMenu,
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

    #profilePage {
        background-color: #2e2d2d;
    }

    #sideMenu {
        display: none;
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

    @media screen and (min-width: 1100px) {

        #navBar {
            display: none;
        }

        #profilePage {
            width: 100vw;
            display: grid;
            grid-template-columns: 20% 80%;
            justify-items: center;

            #profileContainer {
                grid-column: 2;
                grid-row: 1;
                margin-top: 0;

                #userProfile {
                    margin-left: 20%;
                }

                #userEditInfo {
                    margin-left: 1.5%;
                }
            }

            #sideMenu {
                display: block;
                grid-column: 1;
                width: 20%;
                height: 100vh;
                position: fixed;
                right: 80%;
                background-color: #CAF0F8; 
            }
        }
    }
</style>