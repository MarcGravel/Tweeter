<template>
    <div id="othersFeedContainer">
        <div id="othersTweeterDisplay" v-for="tweetInfo in othersUsersTweets" :key="tweetInfo.tweetId">
            <TweetCard :tweetInfo="tweetInfo" />
        </div>
        <TweeterFooter />
    </div>
</template>

<script>
import axios from 'axios'
import TweeterFooter from './TweeterFooter.vue'
import TweetCard from './TweetCard.vue'

    export default {
        name: "OthersFeedDisplay",
        components: {
            TweeterFooter,
            TweetCard
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
                isFlagged: false
            }
        }, 
        methods: {
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
</style>