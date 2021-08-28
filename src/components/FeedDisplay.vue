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
                    <v-col 
                        v-if="displayFeedOption == true" 
                        class="text-right"
                        @click="editTweet(tweetInfo), overlay = !overlay">
                        <v-icon class="mr-1">
                            edit
                        </v-icon>
                    </v-col> 
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
                        @click="likeTweet(tweetInfo.tweetId)"
                        >
                        mdi-heart
                    </v-icon>
                    <span class="subheading mr-2">0</span>
                    </v-row>
                </v-list-item>
                </v-card-actions>
            </v-card>
        </div>
        <v-overlay
                :absolute="absolute"
                :value="overlay"
                :opacity="opacity">
                <v-form id=editTweetForm>
                    <h3>Change any field below to update it</h3>
                    <v-text-field
                        v-model="updatedTweetContent"
                        :label="clickedTweetEditData.content"
                    ></v-text-field>
                    <v-btn id="saveTweetBtn"
                        color="primary" 
                        @click="sendTweetUpdatedData(updatedTweetContent, clickedTweetEditData.tweetId), overlay = !overlay">
                        Save
                    </v-btn>
                    <v-btn id="deleteTweetBtn"
                        color="error"
                        @click="deleteTweet(clickedTweetEditData.tweetId), overlay = !overlay">
                        Delete Tweet
                    </v-btn>
                </v-form>
            </v-overlay>
        <TweeterFooter />
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import router from '../router'
import { eventBus } from '../main'
import TweeterFooter from './TweeterFooter.vue';

    export default {
        name: 'FeedDisplay',
        components: {
            TweeterFooter,
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
                overlay: false,
                opacity: 0.9,
                absolute: true,
                clickedTweetEditData: {
                    content: '',
                    tweetImageUrl: '',
                    tweetId: '',
                },
                updatedTweetContent: '',  
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
            editTweet(tweetInfo) {
                this.clickedTweetEditData.content = tweetInfo.content;
                this.clickedTweetEditData.tweetImageUrl = tweetInfo.tweetImageUrl;
                this.clickedTweetEditData.tweetId = tweetInfo.tweetId;
            },
            sendTweetUpdatedData(content, tweetId) {
                console.log(content, tweetId);
                if (content != '') {
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/tweets',
                        method: "PATCH",
                        headers: {
                            'X-Api-Key': process.env.VUE_APP_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'loginToken': cookies.get('loginToken'),
                            'tweetId': tweetId,
                            'content': content
                        }
                    }).then(() => {
                        router.go();
                    }).catch((error) => {
                        console.log(error.response);
                    })
                }
            },
            deleteTweet(tweetId) {
                console.log(tweetId);
                axios.request({
                    url: process.env.VUE_APP_API_SITE +'/api/tweets',
                    method: "DELETE",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "loginToken": cookies.get('loginToken'),
                        "tweetId": tweetId
                    }
                }).then(() => {
                    router.go();
                }).catch((error) => {
                    console.log(error);
                })
            },
            likeTweet(tweetId) {
                return this.$store.dispatch('getLikedTweets', tweetId);
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

        #editTweetForm {
            width: 90vw;
            display: grid;

            #saveTweetBtn {
                width: fit-content;
                display: inline;
            }

            #deleteTweetBtn {
                justify-self: end;
                display: inline;
                position: relative;
                bottom: 4.2vh;
            }
        }
    }
    
</style>