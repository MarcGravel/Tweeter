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
        <div id="tweetDisplay" v-for="tweetInfo in theDisplayStatus" :key="tweetInfo.tweetId">
            <img id="userImg" v-if="tweetInfo.userImageUrl == null" src="https://image.flaticon.com/icons/png/512/847/847969.png" alt="User Image">
            <img id="userImg" v-else :src="tweetInfo.userImageUrl" alt="User Image">
            <h5 id="username" @click="goToProfile($event)">{{tweetInfo.username}}</h5>
            <p id="tweetContent">{{tweetInfo.content}}</p>
            <img id="tweetImg" v-if="tweetInfo.tweetImageUrl != ''" :src="tweetInfo.tweetImageUrl" alt="Tweet Image">
            <h6 id="createdDate">{{tweetInfo.createdAt}}</h6>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import { eventBus } from '../main'

    export default {
        name: 'FeedDisplay',
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
        computed: {
            //used to display either user tweets or follow tweets depending on button choice
            theDisplayStatus() {
                if(this.displayFeedOption == true) {
                    return this.userTweets;
                } else {
                    return this.followingTweets;
                }
            }
        },
        data() {
            return {
                //true will display users tweets, false will display following
                displayFeedOption: true,
                userTweets: {
                    
                },
                followingIds: [],
                allTweets: {

                },
                followingTweets: {

                },
                mockData: {
                    tweet1: {
                    content: "Mock",
                    createdAt: "mock",
                    tweetId: 1,
                    tweetImageUrl: 'https://images.unsplash.com/photo-1529032980400-2f6c425c0ec5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
                    userId: 2,
                    userImageUrl: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGljb258ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                    username: "Mock"
                    }
                }
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
                this.followingTweets = allFollowingTweets;
            }
            
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

        #tweetDisplay {
            margin: 1vh 0 1vh 0;
            height: auto;
            width: 95%;
            justify-self: center;
            background-color: #ADE8F4;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
            border-radius: 20px;

            #userImg {
                grid-column: 1;
                grid-row: 1;
                width: 60px;
                margin: 1vh 0 0 1vw;

            }

            #username {
                grid-column: 1;
                grid-row: 1;
                margin: 2vh 0 0 20vw;
                color: #023E8A; 
                font-size: 1em;
                text-decoration: underline;
            }

            #tweetContent {
                grid-column: 1 / 3;
                grid-row: 2;
                margin: 2vh 0 2vh 3vw;
            }

            #tweetImg {
                grid-column: 1 / 3;
                grid-row: 3;
                height: 20vh;
                justify-self: center;
            }

            #createdDate {
                grid-column: 1;
                grid-row: 4;
                margin: 2vh 0 0 3vw;
            }
        }
    }
    
</style>