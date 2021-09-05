<template>
    <div>
        <div id="displayComments">
            <div id="postedComments">
                <h4 @click="goToProfile($event)">{{comment.username}}</h4>
                <p id="commentContent">{{comment.content}}</p>
                <p id="commentCreated">{{comment.createdAt}}</p>
                <v-col id="editBtn"
                    v-if="comment.userId == userId" 
                    class="text-right"
                    @click="editComment(comment), overlay = !overlay">
                    <v-icon class="mr-1">
                        edit
                    </v-icon>
                </v-col> 
                <div id="commentLike">
                    <v-icon 
                        v-if="isLiked == false"
                        class="mr-1"
                        @click="likeComment(comment.commentId)"
                        >
                        favorite_border
                    </v-icon>
                    <v-icon
                        v-else 
                        class="mr-1"
                        @click="likeComment(comment.commentId)"
                        >
                        favorite
                    </v-icon>
                    <span class="subheading mr-2">{{commentLikes}}</span>
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
                <div id="btnGrid">
                    <div id="saveAndBackBtns">
                        <v-btn id="saveCommentBtn"
                            color="primary" 
                            @click="sendCommentUpdatedData(comment.commentId), overlay = !overlay">
                            Save
                        </v-btn>
                        <v-btn id="commentOverlaybackBtn"
                            color="primary" 
                            @click="overlay = !overlay">
                                Back
                        </v-btn>
                    </div>
                    <v-btn id="deleteCommentBtn"
                        color="error"
                        @click="deleteComment(comment.commentId), overlay = !overlay">
                        Delete
                    </v-btn>
                </div>
            </v-form>
        </v-overlay>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import { eventBus } from '../main'

    export default {
        name: "TweetComment",
        props: ['comment'],
        beforeMount() {
            this.commentLikeCount();
        },
        data () {
            return {
                textAmt: [v => v.length <= 149 || 'Max 150 characters'],
                tweetComments: [],
                userId: cookies.get('userId'),
                updatedCommentContent: '',
                clickedCommentEditData: {
                    content: '',
                    commentId: '',
                },
                commentLikes: 0,
                overlay: false,
                opacity: 0.9,
                absolute: true,
                isLiked: false
            }
        },
        methods: {
            goToProfile(event) {
                let clickedUserName = event.srcElement.innerText;
                return this.$store.dispatch('dataOfClickedName', clickedUserName);
            },
            editComment(comment) {
                this.clickedCommentEditData.content = comment.content;
                this.clickedCommentEditData.commentId = comment.commentId;
            },
            sendCommentUpdatedData(id) {
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
                            'commentId': id,
                            'content': this.updatedCommentContent,
                        }
                    }).then(() => {
                        eventBus.$emit('updateFeed');
                    }).catch((error) => {
                        console.log(error.response);
                    })
                }
            },
            deleteComment(id) {
                axios.request({
                    url: process.env.VUE_APP_API_SITE +'/api/comments',
                    method: "DELETE",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "loginToken": cookies.get('loginToken'),
                        "commentId": id
                    }
                }).then(() => {
                    eventBus.$emit('updateFeed');
                }).catch((error) => {
                    console.log(error);
                })
            },
            likeComment(id) {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/comment-likes',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "commentId": id
                    }
                }).then((response) => {
                    let passedCommentData = [response.data, id];
                    this.updateCommentLikes(passedCommentData);
                }).catch((error) => {
                    console.log(error);
                })
            },
            updateCommentLikes(passedCommentData) {
                //check if user already liked the comment
                let userLiked = passedCommentData[0].filter(comment => comment.userId == cookies.get('userId'));
                //conditional depending if userLiked is populated(meaning comment has already been liked)
                if(userLiked.length == 0) {
                    //post tweet like 
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/comment-likes',
                        method: "POST",
                        headers: {
                            'X-Api-Key': process.env.VUE_APP_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            "loginToken": cookies.get('loginToken'),
                            "commentId": passedCommentData[1]
                        }
                    }).then(() => {
                        this.commentLikeCount();
                    }).catch((error) => {
                        console.log(error);
                    })               
                } else {
                    //delete tweet like
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/comment-likes',
                        method: "DELETE",
                        headers: {
                            'X-Api-Key': process.env.VUE_APP_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            "loginToken": cookies.get('loginToken'),
                            "commentId": passedCommentData[1]
                        }
                    }).then(() => {
                        this.commentLikeCount();
                    }).catch((error) => {
                        console.log(error);
                    })
                }
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
                        "commentId": this.comment.commentId
                    }
                }).then((response) => {
                    this.commentLikes = response.data.length;
                    
                    //sets data variable for like unlink button if user already liked
                    let counter = 0;
                    for(let i=0; i<response.data.length; i++) {
                        if(response.data[i].userId == cookies.get('userId')) {
                            this.isLiked = true;
                            counter++
                        }
                    }
                    //ensures to set isLiked back to false to button changes on screen for user view.
                    if(counter == 0) {
                        this.isLiked = false;
                    }
                }).catch((error) => {
                    console.log(error);
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    
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
                cursor: pointer;
                grid-row: 1;
                grid-column: 1;
                margin: 0.5vh 0 0 2vw;
                font-size: 1.2em;
                text-decoration: underline;
            }

            h4:hover {
                color: #023E8A;
            }

            #commentContent {
                grid-row: 2;
                grid-column: 1 / 3;
                margin: 0 2vw 0.5vh 4vw;
            }

            #commentCreated {
                grid-column: 1 / 3;
                grid-row: 3;
                justify-self: end;
                margin: 1vh 1vw 0 0;
                font-size: 0.7em;
            }

            #commentLike {
                grid-row: 1;
                grid-column: 2;
                margin-right: 2vw;
                justify-self: end;
            }

            #editBtn {
                grid-row: 1;
                grid-column: 2;
                justify-self: end;
                margin-right: 9vw;
                cursor: pointer;
            }
        }
    }
    
    #editCommentForm {
        width: 90vw;

        #btnGrid {
            display: grid;
            grid-template-columns: 1fr 1fr;

            #saveAndBackBtns {
                grid-column: 1;

                #commentOverlaybackBtn {
                    margin-left: 2vw;
                }
            }
            
            #deleteCommentBtn {
                justify-self: end;
            }
        }
    }

    @media screen and (min-width: 768px) {
        #editCommentForm {
            width: 70vw;
        }
    }

    @media screen and (min-width: 1100px) {
        #editCommentForm {
            width: 50vw;
        }
    }
</style>