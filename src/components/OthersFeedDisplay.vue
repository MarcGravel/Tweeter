<template>
    <div id="othersFeedContainer">
        <div id="othersTweeterDisplay" v-for="tweetInfo in othersUsersTweets" :key="tweetInfo.tweetId">
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
        name: "OthersFeedDisplay",
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
    
    #testGetId {
        color: white;
    }
</style>