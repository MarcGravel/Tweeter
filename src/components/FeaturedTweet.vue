<template>
    <div>
        <div id="featuredDisplay">
            <img id="userImg" :src="featuredTweet.userImageUrl" alt="User Image">
            <h5 id="username" @click="goToProfile($event)">{{featuredTweet.username}}</h5>
            <p id="tweetContent">{{featuredTweet.content}}</p>
            <img id="tweetImg" v-if="featuredTweet.tweetImageUrl != ''" :src="featuredTweet.tweetImageUrl" alt="Tweet Image">
            <h6 id="createdDate">{{featuredTweet.createdAt}}</h6>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

    export default {
        name: "FeaturedTweet",
        computed: {
            featuredTweet() {
                return this.$store.state.featuredTweet;
            },
        },
        methods: {
            callTweetsPickOne() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/tweets',
                    method: ""
                })
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
    #featuredDisplay {
            margin: 1vh 0 1vh 0;
            height: auto;
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
</style>