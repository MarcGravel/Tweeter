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
        <div id="spinContainer">
            <!--style bindings to display loader or notifications based on loaded value-->
            <div :style="{'display': loadStyle}" id="spinner">
                <!-- Pulse loader is a package for spinner animations (npm install vue-spinner)) -->
                <PulseLoader :color="spinColor" :size="size" />
            </div>
        </div>
        <div :style="{'display': displayStyle}">
            <div id="tweeterDisplay" v-for="tweetInfo in theDisplayStatus" :key="tweetInfo.tweetId">
                <TweetCard :tweetInfo="tweetInfo" @tweetLoaded="checkTweetCount" />
            </div>
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
//Pulse loader is a package for spinner animations (npm install vue-spinner))
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

    export default {
        name: 'FeedDisplay',
        components: {
            TweeterFooter,
            TweetCard,
            PulseLoader
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

                if (this.displayFeedOption == true) {
                    if(this.tweetCounter == this.userTweets.length) {
                        this.updateMenuView();
                    }
                } else if (this.displayFeedOption == false) {
                    if(this.tweetCounter == this.followingTweets.length) {
                        this.updateMenuView();
                    }
                }
            },
            updateMenuView() {
                this.loadStyle = "none";
                this.displayStyle = "block";
            },
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
        background-color: rgb(34, 34, 34);
        background: transparent;
        
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
        #spinContainer {
            display: grid;
            
            #spinner {
                justify-self: center;
                margin-top: 8vh;
            }
        }

        #tweeterDisplay {
            margin: 1vh 0 1vh 0;
        }
    }

    @media screen and (min-width: 768px) {
        #feedContainer {

            #displayBtns {
                height: 7vh;
                width: 768px;
                justify-self: center;

                #myFeed {
                    height: 7vh;
                    border-bottom-left-radius: 20px;
                }

                #mainFeed {
                    height: 7vh;
                    border-bottom-right-radius: 20px;
                }
            }
        }
    }

    @media screen and (min-width: 1100px) {
        #feedContainer {

            #displayBtns {
                width: 59%;

                #myFeed {
                    border-bottom-left-radius: 40px;
                    border-top-left-radius: 40px;
                }

                #mainFeed {
                    border-bottom-right-radius: 40px;
                    border-top-right-radius: 40px;
                }
            }
        }
    }
    
</style>