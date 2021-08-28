<template>
    <div>
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
                        v-if="tweetInfo.userId == userId" 
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
                    <span class="subheading mr-2">{{tweetLikeCount(tweetInfo.tweetId)}}</span>
                    </v-row>
                </v-list-item>
                </v-card-actions>
            </v-card>
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
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import axios from 'axios'
import router from '../router'

    export default {
        name: "TweetCard",
        props: ['tweetInfo'],
        data() {
            return {
                userId: cookies.get('userId'),
                clickedTweetEditData: {
                    content: '',
                    tweetImageUrl: '',
                    tweetId: '',
                },
                updatedTweetContent: '', 
                likeCount: 0,
                overlay: false,
                opacity: 0.9,
                absolute: true,
            }
        },
        methods: {
            goToProfile(event) {
                let clickedUserName = event.srcElement.innerText;
                return this.$store.dispatch('dataOfClickedName', clickedUserName);
            },
            editTweet(tweetInfo) {
                this.clickedTweetEditData.content = tweetInfo.content;
                this.clickedTweetEditData.tweetImageUrl = tweetInfo.tweetImageUrl;
                this.clickedTweetEditData.tweetId = tweetInfo.tweetId;
            },
            sendTweetUpdatedData(content, tweetId) {
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
            tweetLikeCount(tweetId) {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/tweet-likes',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "tweetId": tweetId
                    }
                }).then((response) => {
                    this.likeCount = response.data.length;
                }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
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
</style>