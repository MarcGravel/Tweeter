<template>
    <div id="tweetPage">
        <div id="navBar">
            <NavBar />
        </div>
        <aside id="sideMenu">
            <AsideMenu />
        </aside>
        <div id="bannerContainer">
            <img v-if="userDataInfo.bannerUrl == null" src="@/assets/TweeterBanner.png" alt="No Image">
            <img v-else @click="addUrlToClickedData(userDataInfo.bannerUrl), imageOverlay = !imageOverlay" :src="userDataInfo.bannerUrl" alt="Users Image">
        </div>
        <div id="spinContainer">
            <!--style bindings to display loader or notifications based on loaded value-->
            <div :style="{'display': loadStyle}" id="spinner">
                <!-- Pulse loader is a package for spinner animations (npm install vue-spinner)) -->
                <PulseLoader :color="spinColor" :size="size" />
            </div>
        </div>
        <div :style="{'display': displayStyle}" id="tweetCont">
            <div id="tweetPageContainer" v-if="this.tweetInfo.tweetId">
                <TweetCard id="card" :tweetInfo="this.tweetInfo" :openComments="true" @tweetLoaded="checkTweetLoaded"/>
            </div>
        </div>
        <v-overlay
            :value="imageOverlay"
            :opacity="imageOpacity">
            <div id="imageOverlay">
                <img :src="clickedImage" alt="The Clicked tweet image">
                <v-btn
                    id="imageBack"
                    color="error"
                    @click="imageOverlay = !imageOverlay"
                    >
                    Back
                </v-btn>
            </div>
        </v-overlay>
    </div>
</template>

<script>

import NavBar from '../components/NavBar.vue'
import AsideMenu from '../components/AsideMenu.vue'
import cookies from 'vue-cookies'
import axios from 'axios'
import TweetCard from '../components/TweetCard.vue'
//Pulse loader is a package for spinner animations (npm install vue-spinner))
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

    export default {
        name: "Tweet",
        props: ['tweetId'],
        components: { 
            NavBar,
            AsideMenu,
            TweetCard,
            PulseLoader
        },
        beforeMount() {
            if (this.getLoginToken === null) {
                router.push('/');
            }
            axios.request({
                url: process.env.VUE_APP_API_SITE+'/api/tweets',
                method: "GET",
                headers: {
                    'X-Api-Key': process.env.VUE_APP_API_KEY,
                    'Content-Type': 'application/json'
                },
                params: {
                    'tweetId': this.tweetId
                }
            }).then((response) => {
                this.tweetInfo = response.data;
            }).catch((error) => {
                console.log(error.response);
            })
        },
        computed: {
            getLoginToken() {
                return cookies.get('loginToken') 
            },
            userDataInfo() {
                return this.$store.state.currentUser;
            },
        },
        data() {
            return {
                tweetInfo: '',
                clickedImage: '',
                imageOverlay: false,
                imageOpacity: 1,
                displayStyle: "none",
                loadStyle: "block",
                tweetCounter: 0,
                spinColor: "#FFF",
                size: "3em",
            }
        },
        methods: {
            checkTweetLoaded() {
                if (this.tweetInfo != '') {
                    this.updateMenuView();
                }
            },
            updateMenuView() {
                this.loadStyle = "none";
                this.displayStyle = "block";
            },
            addUrlToClickedData(clickedUrl) {
                this.clickedImage = clickedUrl;
            }
        }
    }
</script>

<style lang="scss" scoped>

    #tweetPage {
        display: grid;
        
        #navBar {
            position: fixed;
            z-index: 99;
            grid-row: 1;
            height: 56px;
        }

        #bannerContainer {
            width: 100%;
            height: fit-content;
            
            img {
                cursor: pointer;
                width: 100vw;
                height: 20vh;
                object-fit: cover;
            }
        }

        #spinContainer {
            justify-self: center;
            
            #spinner {
                margin-top: 30vh;
            }
        }

        #tweetPageContainer {
            margin-top: 8vh;
        }

        #sideMenu {
            display: none;
        }
    }

    @media screen and (min-width: 768px) {

        #tweetPage {
            
            #navBar {
                right: 0;
            }
        }
    }

    @media screen and (min-width: 1100px) {

        #tweetPage {
            display:grid;
            grid-template-columns: 20% 80%;
        
            #navBar {
                display: none;
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

            #bannerContainer {
                grid-column: 2;
                display: grid;

                img {
                    width: 100%;
                    justify-self: center;
                }
            }

            #tweetCont {
                grid-column: 2;
            }

            #tweetPageContainer {
                grid-column: 2;
                justify-self: center;
                margin-top: 10vh;
            }

            #spinContainer {
                grid-column: 2;
            }
        }
    }
</style>