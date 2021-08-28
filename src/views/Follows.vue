<template>
    <div id='followsContainer'>
        <v-app-bar-nav-icon id="hamburgerIcon" color="white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <div id="bannerContainer">
            <img v-if="userDataInfo.bannerUrl == null" src="@/assets/TweeterBanner.png" alt="No Image">
            <img v-else :src="userDataInfo.bannerUrl" alt="Users Image">
        </div>
        <div id="displayBtns">
            <v-btn id="myFeed"
                tile
                @click="showFollows"
                >You Follow
            </v-btn>
            <v-btn id="mainFeed" 
                tile
                @click="showFollowers"
                >Your Followers
            </v-btn>
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
                        class="text-h6 font-weight-light"
                        @click="goToProfile($event)"
                        >
                        {{tweetInfo.username}}</span>
                    <v-col class="text-right">
                        <v-btn
                        color="primary"
                        @click="goToFollowProfile(tweetInfo.username)">
                            Visit Profile
                        </v-btn>
                    </v-col>    
                </v-card-title>

                <v-card-text class="text-h5 font-weight-bold">
                {{tweetInfo.bio}}
                </v-card-text>
            </v-card>
        </div>
        <aside id="drawer">
            <v-navigation-drawer
            v-model="drawer"
            color="#CAF0F8"
            absolute
            temporary
            >
            <v-list-item>
                <v-list-item-avatar>
                <v-img v-if="userDataInfo.imageUrl != undefined" src="https://image.flaticon.com/icons/png/512/847/847969.png"></v-img>
                <v-img v-else :src="userDataInfo.imageUrl"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                <v-list-item-title>{{userDataInfo.username}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense>
                <v-list-item
                v-for="item in items"
                :key="item.title"
                :to="item.route"
                @click="checkForLogout(item.title)"
                link
                >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title >{{ item.title }}</v-list-item-title>
                </v-list-item-content>
                </v-list-item>
            </v-list>
            </v-navigation-drawer>
        </aside>
        <TweeterFooter />
    </div>
</template>

<script>
import axios from 'axios'
import TweeterFooter from '../components/TweeterFooter.vue'

    export default {
        name: "Follows",
        components: {
            TweeterFooter
        },
        mounted() {
            this.getFollowData(this.$store.state.followsPageUserId);
            this.getFollowerData(this.$store.state.followsPageUserId)
        },
        computed: {
            userDataInfo() {
                return this.$store.state.currentUser;
            },
            updateDOM() {
                this.getFollowData(this.$store.state.followsPageUserId);
                this.getFollowerData(this.$store.state.followsPageUserId)
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
                //items inside the side menu
                items: [
                { title: 'Home', icon: 'dashboard', route: '/home' },
                { title: 'My Profile', icon: 'account_circle', route: '/profile' },
                { title: 'Discover', icon: 'explore', route: '/discover' },
                { title: 'Follows', icon: 'follow_the_signs', route: '/follows' },
                { title: 'Log Out', icon: 'logout' },
                ],
                followsUsers: {

                },
                followerUsers: {

                },
            }
        },
        methods: {
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

    #followsContainer {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 3fr 1fr auto;

        #bannerContainer {
            width: 100vw;
            height: 15vh;
            grid-column: 1 / 3;
            grid-row: 1;

            img {
                width: 100vw;
                height: 15vh;
                object-fit: cover;
            }
        }

        #hamburgerIcon {
            grid-row: 1;
            grid-column: 2;
            justify-self: end;
            margin-right: 1vw;
            position: relative;
        }

        #displayBtns {
            grid-column: 1 / 3;
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
            grid-column: 1 / 3;
            margin: 1vh 0 1vh 0;

            #followCard {
                display: grid;
                
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
</style>