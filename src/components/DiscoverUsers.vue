<template>
    <div id="dicoverContainer">
        <div id="spinContainer">
            <!--style bindings to display loader or notifications based on loaded value-->
            <!--v-if stops loader from running when no notifications exist-->
            <div v-if="tweetCounter != 0" :style="{'display': loadStyle}" id="spinner">
                <!-- Pulse loader is a package for spinner animations (npm install vue-spinner)) -->
                <PulseLoader :color="spinColor" :size="size" />
            </div>
        </div>
        <div :style="{'display': displayStyle}">
            <div id="discoverTweeterDisplay" v-for="tweetInfo in discoverTweets" :key="tweetInfo.tweetId">
                <TweetCard :tweetInfo="tweetInfo" @tweetLoaded="checkTweetCount"/>
            </div>
        </div>
        <TweeterFooter />
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import TweeterFooter from './TweeterFooter.vue'
import TweetCard from './TweetCard.vue'
//Pulse loader is a package for spinner animations (npm install vue-spinner))
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

    export default {
        name: "DiscoverUsers",
        components: {
            TweeterFooter,
            TweetCard,
            PulseLoader
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
                displayStyle: "none",
                loadStyle: "block",
                tweetCounter: 0,
                spinColor: "#FFF",
                size: "3em",
            }
        },
        methods: {
            checkTweetCount() {
                this.tweetCounter++;

                if(this.tweetCounter == this.discoverTweetArray.length) {
                        this.updateMenuView();
                    }
            },
            updateMenuView() {
                this.loadStyle = "none";
                this.displayStyle = "block";
            },
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
            //used to remove followers and user from discover display
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
        }
    }
</script>

<style lang="scss" scoped>
    #dicoverContainer {
        display: grid;
        justify-items: center;
        background-color: #2e2d2d;

        #spinContainer {
            display: grid;
            
            #spinner {
                justify-self: center;
                margin-top: 8vh;
            }
        }

        #discoverTweeterDisplay {
            margin: 1vh 0 1vh 0;
        }
    }
</style>