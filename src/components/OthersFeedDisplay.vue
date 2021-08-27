<template>
    <div id="othersFeedContainer">
        <div id="tweetDisplay" v-for="tweetInfo in othersUsersTweets" :key="tweetInfo.tweetId">
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

    export default {
        name: "OthersFeedDisplay",
        props: {
            'othersId': Number
        },
        mounted() {
            this.callForTweets(this.othersId);
        },
        computed: {
            updateProp() {
                this.callForTweets(this.othersId)
                return this.othersId;
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
        }

    }
</script>

<style lang="scss" scoped>

    #othersFeedContainer {
        display: grid;

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
    
    #testGetId {
        color: white;
    }
</style>