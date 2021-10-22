<template>
    <div id="othersFeedContainer">
        <div id="spinContainer">
            <!--style bindings to display loader or notifications based on loaded value-->
            <!--v-if stops loader from running when no notifications exist-->
            <div v-if="tweetCounter != 0" :style="{'display': loadStyle}" id="spinner">
                <!-- Pulse loader is a package for spinner animations (npm install vue-spinner)) -->
                <PulseLoader :color="spinColor" :size="size" />
            </div>
        </div>
        <div :style="{'display': displayStyle}">
            <div id="othersTweeterDisplay" v-for="tweetInfo in othersUsersTweets" :key="tweetInfo.tweetId">
                <TweetCard :tweetInfo="tweetInfo" @tweetLoaded="checkTweetCount" />
            </div>
        </div>
        <TweeterFooter />
    </div>
</template>

<script>
import axios from 'axios'
import TweeterFooter from './TweeterFooter.vue'
import TweetCard from './TweetCard.vue'
//Pulse loader is a package for spinner animations (npm install vue-spinner))
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

    export default {
        name: "OthersFeedDisplay",
        components: {
            TweeterFooter,
            TweetCard,
            PulseLoader
        },
        props: {
            'othersId': Number
        },
        mounted() {
            this.callForTweets(this.othersId);
        },
        updated() {
            this.updateProp;
        },
        computed: {
            updateProp() {
                this.callForTweets(this.othersId)
                return this.$store.state.otherUser;
            }
        },
        data() {
            return {
                othersUsersTweets: {

                },
                isFlagged: false,
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

                if(this.tweetCounter == this.othersUsersTweets.length) {
                        this.updateMenuView();
                    }
            },
            updateMenuView() {
                this.loadStyle = "none";
                this.displayStyle = "block";
            },
            callForTweets(othersId) {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/tweets',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "userId": othersId
                        
                    }
                }).then((response) => {
                    //reverses the order so you can see newest tweets first
                    this.othersUsersTweets = response.data.reverse();
                }).catch((error) => {
                    console.log(error);
                })
            },
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

    #othersFeedContainer {
        display: grid;
        background-color: rgb(34, 34, 34);
        background: linear-gradient(0deg, rgba(34,34,34,1) 0%, rgba(40,39,39,1) 33%, rgba(63,63,63,1) 100%);

        #spinContainer {
            display: grid;
            
            #spinner {
                justify-self: center;
                margin-top: 8vh;
            }
        }
        
        #othersTweeterDisplay {
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

    @media screen and (min-width: 1100px) {
        #othersFeedContainer {
            width: 60%;
        }
    }
</style>