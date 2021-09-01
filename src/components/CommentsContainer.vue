<template>
    <div>
        <div id="commentBox">
            <v-col>
                <v-textarea
                    v-model="commentInput"
                    :rules="textAmt"
                    rows="1"
                    auto-grow
                    label="Say something..."
                    dense
                    outlined
                    prepend-inner-icon="insert_comment"
                    clearable
                    single-line
                    counter
                ></v-textarea>
            </v-col>
            <v-btn
                id= "commentSubmitBtn"
                color="primary"
                rounded
                @click="postComment"
                >
                Submit
            </v-btn>
            <div id="commentDisplay" v-for="comment in tweetComments" :key="comment.commentId">
                <TweetComment :comment="comment" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import TweetComment from './TweetComment.vue'
import { eventBus } from '../main'

    export default {
        name: "TweetComments",
        components: {
            TweetComment,
        },
        props: ['tweetId'],
        beforeMount() {
            this.getTweetComments(this.tweetId);
            //this.commentLikeCount();
        },
        created() {
            //updates the feed without page refresh
            eventBus.$on('updateFeed', () => {
                this.getTweetComments(this.tweetId);
            })
        },
        computed: {
            updateFeed() {
                this.getTweetComments(this.tweetId);
                return this.updateFlag;
            }
        }, 
        data () {
            return {
                commentInput: '',
                textAmt: [v => v.length <= 149 || 'Max 150 characters'],
                tweetComments: [],
                userId: cookies.get('userId'),
                commentCount: 0,
            }
        },
        methods: {
            postComment() {
                if(this.commentInput != '') {
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/comments',
                        method: "POST",
                        headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                        },
                        data: {
                            "loginToken": cookies.get('loginToken'),
                            "tweetId": this.tweetId,
                            "content": this.commentInput
                        }
                    }).then(() => {
                        this.getTweetComments(this.tweetId);
                    }).catch((error) => {
                        console.log(error);
                    })

                    this.commentInput = '';
                }
            },
            getTweetComments() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/comments',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "tweetId": this.tweetId
                    }
                }).then((response) => {
                    this.tweetComments = response.data.reverse();
                }).catch((error) => {
                    console.log(error);
                })
            },
            commentLikeCount() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/comment-likes',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "commentId": this.tweetComments.commentId
                    }
                }).then((response) => {
                    this.commentCount = response.data.length;
                }).catch((error) => {
                    console.log(error);
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    #commentBox {
        height: fit-content;
        background-color: #26c6da;
        width: 100%;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        display: grid;

        #commentSubmitBtn {
            justify-self: end;
            margin-right: 4vw;
            position: relative;
            bottom: 2vh;
        }
    }
</style>