<template>
    <div id="tweetContainer">
        <div id="textArea" >
            <v-textarea
                label="What's happening?"
                v-model="tweetInput"
                :rules="textAmt"
                maxlength="140"
                outlined
                color="#2877ee"
                rows="3"
                row-height="15"
                no-resize
                counter
                inputmode="email"
            ></v-textarea>
        </div>
        <div id="imgInput">
            <v-text-field 
                v-model="tweetImg"
                label="Image URL"
                :rules="validateUrl"
            ></v-text-field>
        </div>
        <v-btn id="tweetBtn"
            rounded
            color="primary"
            dark
            @click="postTweet(tweetInput, tweetImg)"
            >
            Tweet!
        </v-btn>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import { eventBus }  from '../main'

    export default {
        name: "UserTweetInput",
        data () {
            return {
                tweetInput: '',
                textAmt: [v => v.length <= 139 || 'Max 140 characters'],
                //changed initial value to null due to backend/db url validation
                tweetImg: null,
                validateUrl: [
                    (value) => this.isURL(value) || 'Not a valid URL'
                ]
            }
        },
        methods: {
            //sends API call to post the users tweet and optional image link
            postTweet(tweet, imgLink) {
                if(tweet != '') {
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/tweets',
                        method: "POST",
                        headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                        },
                        data: {
                            "loginToken": cookies.get('loginToken'),
                            "content": tweet,
                            "imageUrl": imgLink
                        }
                    }).then(() => {
                        //sends event to listener in feed display to update tweets on the page in real time
                        eventBus.$emit('updateFeed');
                    }).catch((error) => {
                        console.log(error.response);
                    })

                    this.tweetInput = '';
                    this.tweetImg = null;
                }

                
            },
            //checks image link input and warns user if link doesnt beging with http: or https:
            isURL(input) {
                let url;
                try {
                    url = new URL(input);
                } catch (error) {
                    return false;
                }

                return url.protocol == "http:" || url.protocol == "https:";
            }
        }
    }
</script>

<style lang="scss" scoped>
    #tweetContainer {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-template-rows: 0.2fr 5fr 4fr;
     
        #textArea {
            grid-row: 2;
            grid-column: 1 / 3;
        }

        #imgInput {
            grid-row: 3;
            grid-column: 1;
            width: 80%;
            height: 70%;
            position: relative;
            bottom: 3vh;
        }

        #tweetBtn {
            grid-column: 2;
            grid-row: 3;
            width: 30vw;
            justify-self: end;
            margin-right: 4vw;
        }
    }

    @media screen and (min-width: 768px) {
        #tweetContainer 

            #tweetBtn {
                width: 80%;
            }
    }
</style>