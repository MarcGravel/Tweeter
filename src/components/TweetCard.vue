<template>
    <div>
        <v-card
                id="tweeterCard"
                class="mx-auto"
                color="#26c6da"
                dark
            >
                <v-card-title>
                    <v-list-item-avatar color="grey darken-3">
                        <v-img
                            v-if="tweetInfo.userImageUrl == null"
                            class="elevation-6"
                            alt="User avatar"
                            src="https://image.flaticon.com/icons/png/512/847/847969.png"
                        ></v-img>
                        <v-img
                            v-else
                            class="elevation-6"
                            alt="User avatar"
                            :src="tweetInfo.userImageUrl"
                        ></v-img>
                    </v-list-item-avatar>
                    <span 
                        id="cardUsername"
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
                    <span class="subheading mr-2">{{likeCount}}</span>
                    </v-row>
                </v-list-item>
                </v-card-actions>
                <v-btn id="commentButton"
                    color="primary"
                    @click="showHideComments"
                    >
                    Comments
                </v-btn>
                <!--v-show will show the tweet comment of button with tweetID that matches-->
                <div v-show="tweetInfo.tweetId == activeComment && isActive" :id="tweetInfo.tweetId">
                    <CommentsContainer v-if="isActive" :tweetId="tweetInfo.tweetId"/>
                </div>
            </v-card>
            <v-overlay
                :absolute="absolute"
                :value="overlay"
                :opacity="opacity">
                <v-form id=editTweetForm>
                    <h3>Change any field below to update it</h3>
                    <v-text-field id="editInput"
                        v-model="updatedTweetContent"
                        :label="clickedTweetEditData.content"
                    ></v-text-field>
                    <div id="btnGrid">
                        <div id="saveAndBackBtns">
                            <v-btn id="saveTweetBtn"
                                color="primary" 
                                @click="sendTweetUpdatedData(updatedTweetContent, clickedTweetEditData.tweetId), overlay = !overlay">
                                Save
                            </v-btn>
                            <v-btn id="tweetOverlaybackBtn"
                                color="primary" 
                                @click="overlay = !overlay">
                                    Back
                            </v-btn>
                        </div>
                        <v-btn id="deleteTweetBtn"
                            color="error"
                            @click="deleteTweet(clickedTweetEditData.tweetId), overlay = !overlay">
                            Delete
                        </v-btn>
                    </div>
                </v-form>
            </v-overlay>
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import axios from 'axios'
import { eventBus } from '../main'
import CommentsContainer from './CommentsContainer.vue'

    export default {
        name: "TweetCard",
        components: {
            CommentsContainer,
        },
        props: ['tweetInfo'],
        beforeMount() {
            this.tweetLikeCount();
        },
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
                activeComment: null,
                isActive: false,
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
                        eventBus.$emit('updateFeed');
                    }).catch((error) => {
                        console.log(error.response);
                    })
                }
            },
            deleteTweet(tweetId) {
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
                    eventBus.$emit('updateFeed');
                }).catch((error) => {
                    console.log(error);
                })
            },
            likeTweet(tweetId) {
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
                    let passedData = [response.data, tweetId];
                    this.updateTweetLikes(passedData);
                }).catch((error) => {
                    console.log(error);
                })
            },
            updateTweetLikes(passedData) {
                //check if user already liked the tweet
                let userLiked = passedData[0].filter(tweet => tweet.userId == cookies.get('userId'));
                //conditional depending if userLike is populated(meaning tweet has already been liked)
                if(userLiked.length == 0) {
                    //post tweet like 
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/tweet-likes',
                        method: "POST",
                        headers: {
                            'X-Api-Key': process.env.VUE_APP_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            "loginToken": cookies.get('loginToken'),
                            "tweetId": passedData[1]
                        }
                    }).then(() => {
                        this.tweetLikeCount();
                    }).catch((error) => {
                        console.log(error);
                    })               
                } else {
                    //delete tweet like
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/tweet-likes',
                        method: "DELETE",
                        headers: {
                            'X-Api-Key': process.env.VUE_APP_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            "loginToken": cookies.get('loginToken'),
                            "tweetId": passedData[1]
                        }
                }).then(() => {
                    this.tweetLikeCount();
                }).catch((error) => {
                    console.log(error);
                })
            }
            },
            tweetLikeCount() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/tweet-likes',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "tweetId": this.tweetInfo.tweetId
                    }
                }).then((response) => {
                    this.likeCount = response.data.length;
                }).catch((error) => {
                    console.log(error);
                })
            },
            //checks to ensure isActive is true and then sets active comment to 
            //tweet id that matches clicked tweet. once activeComment is set
            //and isActive is true, comments for clicked tweet will display
            showHideComments() {
                this.isActive = !this.isActive;
                if(this.isActive == true) {
                    this.activeComment = this.tweetInfo.tweetId;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #tweeterCard {
        display: grid;
        width: 80vw;
        
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
        
        #btnGrid {
            display: grid;
            grid-template-columns: 1fr 1fr;

            #saveAndBackBtns {
                grid-column: 1;

                #tweetOverlaybackBtn {
                    margin-left: 2vw;
                }
            }
            
            #deleteTweetBtn {
                justify-self: end;
            }
        }
    }

    @media screen and (min-width: 600px) {
        #tweeterCard {
        display: grid;
        width: 500px;
        
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

    @media screen and (min-width: 768px) {
        #tweeterCard {
        width: 600px;
        
            #createdAtDate {
                font-size: 1em;
            }

            #cardLogo {
                width: 60px;
                margin-right: 2vw;
            }

            #tweeterImg {
                height: 25vh;
                width: 25vh;
                object-fit: cover;
                justify-self: center;
            }

            #commentButton {
                font-size: 1.1em;
            }
        }
    }
</style>