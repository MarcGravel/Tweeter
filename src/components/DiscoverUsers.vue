<template>
    <div id="dicoverContainer">
        <div id="discoverDisplay" v-for="tweetInfo in discoverTweets" :key="tweetInfo.tweetId">
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

    export default {
        name: "DiscoverUsers",
        beforeMount() {
            this.loadAllTweets();
        },
        computed: {
            discoverTweets() {
                return this.discoverTweetArray
            }
        },
        data() {
            return {
                discoverTweetArray: [],
                removedFollowedArray: []
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
                    //sends info to new axios call to check for followers
                    this.checkForFollowers(response)
                    this.sendFeaturedTweetToStore(response)
                }).catch((error) => {
                    console.log(error);
                })
            },
            checkForFollowers(allTweets) {
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
                }).then((followed) => {
                    //checks for tweets by followers and omits them from array
                    //then calls function to check for users own tweets and
                    //removes them from array for final discover array
                    if(followed.data.length == 0 ) {
                        this.removedFollowedArray = allTweets.data;
                        this.removeUsersTweets(this.removedFollowedArray)
                    } else {
                        for(let i=0; i<allTweets.data.length; i++) {
                           if (followed.data[i].userId != allTweets.data[i].userId) {
                               this.removedFollowedArray.push(allTweets.data[i])
                           }
                        }
                        this.removeUsersTweets(this.removedFollowedArray)
                    }
                }).catch((error) => {
                    console.log(error);
                })
            },
            //checks for tweets by current user and omits them
            //final array includes tweets by non followed only
            removeUsersTweets(removedFollowedArray) {
                for(let i=0; i<removedFollowedArray.length; i++) {
                    if(removedFollowedArray[i].userId != cookies.get('userId')) {
                        this.discoverTweetArray.push(removedFollowedArray[i])
                    }
                }
                
                //reverse to show newest tweets first;
                this.discoverTweetArray.reverse();
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    #dicoverContainer {
        display: grid;
        justify-items: center;

        #discoverDisplay {
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