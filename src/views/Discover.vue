<template>
    <div id="dicoverPage">
        <div id="navBar">
            <NavBar />
        </div>
        <aside id="sideMenu">
            <AsideMenu />
        </aside>
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
    </div>
</template>

<script>
import DiscoverUsers from '../components/DiscoverUsers.vue'
import UserHomePage from '../components/UserHomePage.vue'
import FeaturedTweet from '../components/FeaturedTweet.vue'
import NavBar from '../components/NavBar.vue'
import cookies from 'vue-cookies'
import router from '../router'
import AsideMenu from '../components/AsideMenu.vue'

    export default {
        name: "Discover",
        components: {
            DiscoverUsers,
            UserHomePage,
            FeaturedTweet,
            NavBar,
            AsideMenu,
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

    #navBar {
    position: fixed;
    z-index: 99;
    grid-row: 1;
    height: 56px;
    }

    #sideMenu {
        display: none;
    }

    #discoverPage {
        background: linear-gradient(0deg, rgb(49, 49, 49) 0%, rgb(43, 42, 42) 33%, rgb(63, 63, 63) 100%);
    }
    
    #discoverContainer {
        grid-row: 2;
        margin-top: 56px;
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-rows: 15vh auto 45%;

        #userInfo {
            height: 100%;
            width: 100%;
            background-color: rgb(0,150,199);
            background: linear-gradient(54deg, rgba(0,150,199,1) 0%, rgba(144,224,239,1) 35%, rgba(0,180,216,1) 100%);
            grid-row: 1;
        }

        #featuredTweet {
            height: auto;
            width: 100%;
            grid-row: 2;
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

    @media screen and (min-width: 768px) {
        #discoverContainer {
            grid-template-rows: 25vh auto 45%;

            #userInfo{
                width: 768px;
                justify-self: center;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
            }

            #featuredTweet {
            
                h3{
                    font-size: 1.5em;
                }
            }

            #discoverUsersContainer {
                display: grid;

                #discoverBanner {
                    width: 768px;
                    justify-self: center;
                    
                    h1 {
                        font-size: 2.5em;
                    }
                }
            }
        }
    }

    @media screen and (min-width: 1100px) {

        #navBar {
            display: none;
        }

        #discoverPage {
            display: grid;
            grid-template-columns: 20% 80%;
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

        #discoverContainer {
            grid-column: 2;
            margin-top: 0;
            width: 80%;
            margin-left: 10%;

            #userInfo{
                width: 60%;
                margin-left: 0.3vw;
            }

            #discoverUsersContainer {

                #discoverBanner {
                    width: 60%;
                }
            }
        }
    }
</style>