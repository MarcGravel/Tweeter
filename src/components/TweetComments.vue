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
            <div id='displayComments' v-for="comment in tweetComments" :key="comment.commentId">
                <div id="postedComments">
                    <h4>{{comment.username}}</h4>
                    <p id="commentContent">{{comment.content}}</p>
                    <p id="commentCreated">{{comment.createdAt}}</p>
                    <v-col 
                        v-if="comment.userId == userId" 
                        class="text-right"
                        @click="editComment(comment), overlay = !overlay">
                        <v-icon class="mr-1">
                            edit
                        </v-icon>
                    </v-col> 
                </div>
            </div>
        </div>
        <v-overlay
                :absolute="absolute"
                :value="overlay"
                :opacity="opacity">
                <v-form id=editCommentForm>
                    <h3>Edit or delete your comment</h3>
                    <v-text-field
                        single-line
                        rows="1"
                        auto-grow
                        dense
                        clearable
                        counter
                        :rules="textAmt"
                        v-model="updatedCommentContent"
                        :label="clickedCommentEditData.content"
                    ></v-text-field>
                    <v-btn id="saveCommentBtn"
                        color="primary" 
                        @click="sendCommentUpdatedData, overlay = !overlay">
                        Save
                    </v-btn>
                    <v-btn id="commentOverlaybackBtn"
                        color="primary" 
                        @click="overlay = !overlay">
                            Back
                    </v-btn>
                    <v-btn id="deleteCommentBtn"
                        color="error"
                        @click="deleteComment, overlay = !overlay">
                        Delete
                    </v-btn>
                </v-form>
            </v-overlay>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import router from '../router'

    export default {
        name: "TweetComments",
        props: ['tweetId'],
        beforeMount() {
            this.getTweetComments(this.tweetId);
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
                submittedComment: '',
                textAmt: [v => v.length <= 149 || 'Max 150 characters'],
                tweetComments: [],
                updateFlag: true,
                userId: cookies.get('userId'),
                overlay: false,
                opacity: 0.9,
                absolute: true,
                updatedCommentContent: '',
                clickedCommentEditData: {
                    content: '',
                    commentId: '',
                },
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
                        //flips flag for computed property to reload comments after submission
                        this.updateFlag = !this.updateFlag;
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
            editComment(comment) {
                this.clickedCommentEditData.content = comment.content;
                this.clickedCommentEditData.commentId = comment.commentId;
            },
            sendCommentUpdatedData() {
                if(this.updatedCommentContent != '') {
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/comments',
                        method: "PATCH",
                        headers: {
                            'X-Api-Key': process.env.VUE_APP_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'loginToken': cookies.get('loginToken'),
                            'commentId': this.clickedCommentEditData.commentId,
                            'content': this.updatedCommentContent,
                        }
                    }).then(() => {
                        router.go();
                    }).catch((error) => {
                        console.log(error.response);
                    })
                }
            },
            deleteComment() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE +'/api/comments',
                    method: "DELETE",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "loginToken": cookies.get('loginToken'),
                        "commentId": this.clickedCommentEditData.commentId
                    }
                }).then(() => {
                    router.go();
                }).catch((error) => {
                    console.log(error);
                })
            }
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

        #displayComments {
            display: grid;

            #postedComments {
                justify-self: center;
                background-color: #027e8f;
                border-radius: 10px;
                width: 90%;
                margin: 0.5vh 0 0.5vh 0;
                display: grid;
                grid-template-rows: 1fr auto 1fr;
                grid-template-columns: 1fr 1fr;
                align-items: center;

                h4 {
                    grid-row: 1;
                    grid-column: 1;
                    margin: 0.5vh 0 0 2vw;
                }

                #commentContent {
                    grid-row: 2;
                    grid-column: 1 / 3;
                    margin: 0 2vw 0.5vh 2vw;
                }

                #commentCreated {
                    grid-column: 1 / 3;
                    grid-row: 3;
                    justify-self: end;
                    margin: 1vh 1vw 0 0;
                    font-size: 0.7em;
                }
            }
        }
    }

    #editCommentForm {
        width: 90vw;

        #commentOverlaybackBtn {
            margin: 0 0 0 1vw;
        }

        #deleteCommentBtn {
            margin-left: 40vw;
        }
    }
</style>