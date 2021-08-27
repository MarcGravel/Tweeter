<template>
    <div>
        <div id="featTweeterDisplay">
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
                        v-if="featuredTweet.userImageUrl == undefined"
                        class="elevation-6"
                        alt=""
                        src="https://image.flaticon.com/icons/png/512/847/847969.png"
                    ></v-img>
                    <v-img
                        v-else
                        class="elevation-6"
                        alt=""
                        :src="featuredTweet.userImageUrl"
                    ></v-img>
                    </v-list-item-avatar>
                    <span 
                        class="text-h6 font-weight-light"
                        @click="goToProfile($event)"
                            >{{featuredTweet.username}}</span>
                </v-card-title>

                <v-card-text class="text-h5 font-weight-bold">
                {{featuredTweet.content}}
                </v-card-text>

                <img id="tweeterImg" v-if="featuredTweet.tweetImageUrl != ''" :src="featuredTweet.tweetImageUrl" alt="Tweet Image">

                <v-card-actions>
                <v-list-item class="grow">
                <img id="cardLogo" src="@/assets/TweeterLogo.png" alt="TweeterLogo">    
                <v-list-item-content>
                    <v-list-item-title
                    id="createdAtDate">{{featuredTweet.createdAt}}</v-list-item-title>
                </v-list-item-content>

                    <v-row
                    align="center"
                    justify="end"
                    >
                    <v-icon class="mr-1">
                        mdi-heart
                    </v-icon>
                    <span class="subheading mr-2">0</span>
                    </v-row>
                </v-list-item>
                </v-card-actions>
            </v-card>
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
        #featTweeterDisplay {
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
</style>