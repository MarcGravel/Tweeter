<template>
    <div id="followsPage">
        <div id="navBar">
            <NavBar />
        </div>
        <aside id="sideMenu">
            <AsideMenu />
        </aside>
        <aside id="advertBar">
            <AdvertSidebar />
        </aside>
        <div id='followsContainer' @click="flipMenu">
            <div id="bannerContainer">
                <img v-if="userDataInfo.bannerUrl == null" src="@/assets/TweeterBanner.png" alt="No Image">
                <img v-else :src="userDataInfo.bannerUrl" alt="Users Image">
            </div>
            <div id="displayBtns">
                <v-btn id="mainFeed" 
                    tile
                    @click="showFollowers"
                    >Your Followers
                </v-btn>
                <v-btn id="myFeed"
                    tile
                    @click="showFollows"
                    >You Follow
                </v-btn>
                <AsideMenu v-if="drawer == true" :drawerStatus="drawer"/>
            </div>
            <div id="followDisplay" v-for="tweetInfo in theDisplayStatus" :key="tweetInfo.tweetId">
                <v-card
                    id="followCard"
                    class="mx-auto"
                    color="#1da7b9"
                    dark
                    width="100vw"
                >
                    <v-card-title>
                        <v-list-item-avatar color="grey darken-3">
                        <v-img
                            v-if="tweetInfo.imageUrl == null"
                            class="elevation-6"
                            alt=""
                            src="https://image.flaticon.com/icons/png/512/847/847969.png"
                        ></v-img>
                        <v-img
                            v-else
                            class="elevation-6"
                            alt=""
                            :src="tweetInfo.imageUrl"
                        ></v-img>
                        </v-list-item-avatar>
                        <span 
                            id="userName"
                            class="text-h6 font-weight-light"
                            @click="goToProfile($event)"
                            >
                            {{tweetInfo.username}}</span>
                        <v-col class="text-right">
                            <v-btn
                            color="primary"
                            @click="goToFollowProfile(tweetInfo.username)">
                                Visit
                            </v-btn>
                        </v-col>    
                    </v-card-title>

                    <v-card-text class="text-h5 font-weight-bold">
                    {{tweetInfo.bio}}
                    </v-card-text>
                </v-card>
            </div>
            <TweeterFooter />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import TweeterFooter from '../components/TweeterFooter.vue'
import AsideMenu from '../components/AsideMenu.vue'
import NavBar from '../components/NavBar.vue'
import AdvertSidebar from '../components/AdvertSidebar.vue'

    export default {
        name: "Follows",
        components: {
            TweeterFooter,
            AsideMenu,
            NavBar,
            AdvertSidebar
        },
        mounted() {
            this.getFollowData(this.$store.state.followsPageUserId);
            this.getFollowerData(this.$store.state.followsPageUserId);
        },
        computed: {
            userDataInfo() {
                return this.$store.state.currentUser;
            },
            updateDOM() {
                this.getFollowData(this.$store.state.followsPageUserId);
                this.getFollowerData(this.$store.state.followsPageUserId);
                return this.$store.state.followsPageFlag;
            },
            theDisplayStatus() {
                if(this.$store.state.followsPageFlag == true) {
                    return this.followsUsers;
                } else {
                    return this.followerUsers;
                }
            },
        },
        data() {
            return {
                drawer: null,
                followsUsers: {

                },
                followerUsers: {

                },
            }
        },
        methods: {
            //flips drawer flag back on click to close aside menu
            flipMenu() {
                if(this.drawer == true) {
                    this.drawer = !this.drawer;
                }
            },
            getFollowData(userId){
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/follows',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "userId": userId
                    }
                }).then((response) => {
                    this.followsUsers = response.data;
                }).catch((error) => {
                    console.log(error);
                });
            },
            getFollowerData(userId) {
                    axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/followers',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "userId": userId
                    }
                }).then((response) => {
                    this.followerUsers = response.data;
                }).catch((error) => {
                    console.log(error);
                });
            },
            showFollows() {
                return this.$store.commit('followsPageBtns', true);
            },
            showFollowers() {
                return this.$store.commit('followsPageBtns', false);
            },
            //checks if logout button clicked. if so, sends data to store for logout
            checkForLogout(itemTitle) {
                return this.$store.dispatch('logout', itemTitle);
            },
            goToProfile(event) {
                let clickedUserName = event.srcElement.innerText;
                return this.$store.dispatch('dataOfClickedName', clickedUserName);
            },
            goToFollowProfile(username) {
                return this.$store.dispatch('dataOfClickedName', username);
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

    #advertBar {
        display: none;
    }

    #followsContainer {
        margin-top: 56px;
        grid-row: 2;
        display: grid;  
        grid-template-rows: 3fr auto auto;
        width: 100%;

        #bannerContainer {
            width: 100%;
            height: 15vh;
            grid-row: 1;

            img {
                width: 100%;
                height: 15vh;
                object-fit: cover;
            }
        }

        #displayBtns {
            grid-row: 2;
            width: 100%;

            #myFeed {
                width: 50%;
                background-color: #0096C7;
                color: white;
                border-right: 1px black solid;
            }

            #mainFeed {
                width: 50%;
                background-color: #0096C7;
                color: white;
            }
        }

        #followDisplay {
            margin: 1vh 0 1vh 0;

            #followCard {
                display: grid;

                #userName {
                    cursor: pointer;
                }

                #userName:hover {
                    color: #023E8A;
                }
                
                #createdAtDate {
                    font-size: 0.8em;
                }

                #cardLogo {
                    width: 50px;
                    margin-right: 2vw;
                }

                #tweeterImg {
                    height: 25vh;
                    width: 25vh;
                    object-fit: cover;
                    justify-self: center;
                }
            }
        }
    }

    @media screen and (min-width: 768px) {
        #followsContainer {

            #bannerContainer {
                display: grid;
                justify-items: center;
                width: 768px;
                justify-self: center;

                img {
                    width: 768px;
                }
            }

            #displayBtns {
                width: 768px;
                justify-self: center;

                #mainFeed {
                    height: 7vh;
                    border-bottom-left-radius: 20px;
                }

                #myFeed {
                    height: 7vh;
                    border-bottom-right-radius: 20px;
                }
            }

            #followDisplay {
                width: 768px;
                justify-self: center;
            }
        }
    }

    @media screen and (min-width: 1100px) {
        #navBar {
            display: none;
        }

        #followsPage {
            display: grid;
            grid-template-columns: 20% 60% 20%;

            #sideMenu {
                display: block;
                grid-column: 1;
                width: 20%;
                height: 100vh;
                position: fixed;
                right: 80%;
                background-color: #CAF0F8; 
            }

            #advertBar {
                display: inline-block;
                grid-column: 3;
                width: 19%;
                justify-self: end;
                position: fixed;
            }

            #followsContainer {
                grid-column: 1;
                margin-top: 0;
                margin-left: 0.7vw;
                width: 100%;

                #bannerContainer {
                    width: 60%;

                    img {
                        width: 100%;
                    }
                }

                #displayBtns {
                    width: 60%;
                }
            }

            #followDisplay {
                width: 60%;
            }
        }
    }
</style>