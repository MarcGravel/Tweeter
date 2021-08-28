<template>
    <div id="feedContainer">
        <div id="displayBtns">
            <v-btn id="myFeed"
                tile
                @click="changeToMyTweets"
                >My Tweets
            </v-btn>
            <v-btn id="mainFeed" 
                tile
                @click="changeToFollowingTweets"
                >Following
            </v-btn>
        </div>
        <div id="tweeterDisplay" v-for="tweetInfo in theDisplayStatus" :key="tweetInfo.tweetId">
            <TweetCard :tweetInfo="tweetInfo" />
        </div>
        <TweeterFooter />
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import { eventBus } from '../main'
import TweeterFooter from './TweeterFooter.vue'
import TweetCard from './TweetCard.vue'

    export default {
        name: 'FeedDisplay',
        components: {
            TweeterFooter,
            TweetCard
        },
        beforeMount() {
            let theUserId = cookies.get('userId');
            this.loadUserTweets(theUserId);
            this.loadAllTweets();
            this.loadFollowers();
        },
        created() {
            //updates the feed without page refresh
            eventBus.$on('updateFeed', () => {
                this.loadUserTweets(cookies.get('userId'));
            }) 
        },
        updated(){
            this.updateDOM;
        },
        computed: {
            //used to display either user tweets or follow tweets depending on button choice
            theDisplayStatus() {
                if(this.displayFeedOption == true) {
                    return this.userTweets;
                } else {
                    return this.followingTweets;
                }
            },
            updateDOM() {
                let theUserId = cookies.get('userId');
                this.loadUserTweets(theUserId);
                this.loadAllTweets();
                this.loadFollowers();
                return this.$store.state.flagState;
            },
        },
        data() {
            return {
                //true will display users tweets, false will display following
                displayFeedOption: true,
                userTweets: {
                    
                },
                followingIds: [],
                allTweets: [],
                followingTweets: {

                },
            }
        },
        methods: {
            loadUserTweets(theUserId) {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/tweets',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "userId": theUserId 
                    }
                }).then((response) => {
                    //reverses the order so you can see newest tweets first
                    this.userTweets = response.data.reverse();
                }).catch((error) => {
                    console.log(error);
                })
            },
            changeToMyTweets() {
                this.displayFeedOption = true;
            },
            changeToFollowingTweets() {
                this.displayFeedOption = false;
            },
            //gets name clicked on and sends name to action to get user data
            goToProfile(event) {
                let clickedUserName = event.srcElement.innerText;
                return this.$store.dispatch('dataOfClickedName', clickedUserName);
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
                    this.filterTweets();
                }).catch((error) => {
                    console.log(error);
                });
            },
            filterTweets() {
                let parsedFollowing = JSON.parse(JSON.stringify(this.followingIds))
                let allFollowingTweets = this.allTweets.filter(tweet => parsedFollowing.includes(tweet.userId))
                //adds filtered array to data(). also reverses so newest tweets are first
                this.followingTweets = allFollowingTweets.reverse();
            },
        }
    }
</script>

<style lang="scss" scoped>
    #feedContainer {
        display: grid;
        
        #displayBtns {
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

        #tweeterDisplay {
            margin: 1vh 0 1vh 0;
        }
    }
    
</style>