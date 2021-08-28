<template>
    <div id="dicoverContainer">
        <div id="discoverTweeterDisplay" v-for="tweetInfo in discoverTweets" :key="tweetInfo.tweetId">
            <v-card
                id="tweeterCard"
                class="mx-auto"
                color="#26c6da"
                dark
                width="400"
            >
                <v-card-title>
                    <v-list-item-avatar color="grey darken-3">
                    <v-img
                        v-if="tweetInfo.userImageUrl == null"
                        class="elevation-6"
                        alt=""
                        src="https://image.flaticon.com/icons/png/512/847/847969.png"
                    ></v-img>
                    <v-img
                        v-else
                        class="elevation-6"
                        alt=""
                        :src="tweetInfo.userImageUrl"
                    ></v-img>
                    </v-list-item-avatar>
                    <span
                        class="text-h6 font-weight-light"
                        @click="goToProfile($event)"
                        >
                        {{tweetInfo.username}}</span>
                </v-card-title>

                <v-card-text class="text-h5 font-weight-bold">
                {{tweetInfo.content}}
                </v-card-text>

                <img id="tweeterImg" v-if="tweetInfo.tweetImageUrl != ''" :src="tweetInfo.tweetImageUrl" alt="Tweet Image">

                <v-card-actions>
                <v-list-item class="grow">
                <img id="cardLogo" src="@/assets/TweeterLogoWhite.png" alt="TweeterLogo">    
                <v-list-item-content>
                    <v-list-item-title
                    id="createdAtDate">{{tweetInfo.createdAt}}</v-list-item-title>
                </v-list-item-content>

                    <v-row
                    align="center"
                    justify="end"
                    >
                    <v-icon 
                        class="mr-1"
                        @click="likeTweet(tweetInfo.tweetId)">
                        mdi-heart
                    </v-icon>
                    <span class="subheading mr-2">0</span>
                    </v-row>
                </v-list-item>
                </v-card-actions>
            </v-card>
        </div>
        <TweeterFooter />
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import TweeterFooter from './TweeterFooter.vue';

    export default {
        name: "DiscoverUsers",
        components: {
            TweeterFooter
        },
        beforeMount() {
            this.loadAllTweets();
            this.loadFollowers();
        },
        updated(){
            this.updateDOM;
        },
        computed: {
            discoverTweets() {
                return this.discoverTweetArray
            },
            updateDOM() {
                this.loadAllTweets();
                this.loadFollowers();
                return this.$store.state.flagState;
            }
        },
        data() {
            return {
                discoverTweetArray: {

                },
                followingIds: [],
                allTweets: [],
                followingTweets: {

                },
            }
        },
        methods: {
            loadAllTweets() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/tweets',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    this.allTweets = response.data;
                    this.sendFeaturedTweetToStore(response)
                }).catch((error) => {
                    console.log(error);
                })
            },
            loadFollowers() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/follows',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "userId": cookies.get('userId')
                    }
                }).then((response) => {
                    for(let i=0; i<response.data.length; i++) {
                        this.followingIds.push(response.data[i].userId)
                    }
                    //add in own user id as well to ensure it is also filtered out
                    let parsedUserId = Number(cookies.get('userId'))
                    this.followingIds.push(parsedUserId)
                    this.filterDiscoverTweets();
                }).catch((error) => {
                    console.log(error);
                });
            },
            filterDiscoverTweets() {
                let parsedFollowing = JSON.parse(JSON.stringify(this.followingIds))
                let allFollowingTweets = this.allTweets.filter(tweet => !parsedFollowing.includes(tweet.userId))
                this.discoverTweetArray = allFollowingTweets;
            },
            //sends a single random tweet to store for featured tweet component
            sendFeaturedTweetToStore(tweets) {
                let randomNumber = Math.floor(Math.random() * tweets.data.length);
                return this.$store.commit('featuredTweet', tweets.data[randomNumber]);
            },
            //gets name clicked on and sends name to action to get user data
            goToProfile(event) {
                let clickedUserName = event.srcElement.innerText;
                return this.$store.dispatch('dataOfClickedName', clickedUserName);
            },
            likeTweet(tweetId) {
                return this.$store.dispatch('getLikedTweets', tweetId);
            },
        }
    }
</script>

<style lang="scss" scoped>
    #dicoverContainer {
        display: grid;
        justify-items: center;

        #discoverTweeterDisplay {
            margin: 1vh 0 1vh 0;

            #tweeterCard {
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