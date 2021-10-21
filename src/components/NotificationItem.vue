<template>
    <div>
        <div v-if="this.note.typeOf == 'like'" id="likeNote" @click="sendTweetData">
            <div v-if="this.note.isSeen == 1" id="notePanel">
                <h5 id="username">{{this.userInfo.username}} </h5>
                <h5>has liked your tweet.</h5>
                <p><i>{{this.tweetContentSum}}...</i></p>
            </div>
            <div v-else id="noteUnseen">
                <h5 id="username">{{this.userInfo.username}} </h5>
                <h5>has liked your tweet.</h5>
                <p><i>{{this.tweetContentSum}}...</i></p>
            </div>
        </div>
        <div v-if="this.note.typeOf == 'follow'" id="followNote">
            <div v-if="this.note.isSeen == 1" id="notePanel">
                <h5 id="username">{{this.userInfo.username}} </h5>
                <h5>has started following you.</h5>
            </div>
            <div v-else id="noteUnseen">
                <h5 id="username">{{this.userInfo.username}} </h5>
                <h5>has started following you.</h5>
            </div>
        </div>
        <div v-if="this.note.typeOf == 'comment'" id="commentNote" @click="sendTweetData">
            <div v-if="this.note.isSeen == 1" id="notePanel">
                <h5 id="username">{{this.userInfo.username}} </h5>
                <h5>commented on your tweet.</h5>
                <p><i>{{this.commentContentSum}}...</i></p>
            </div>
            <div v-else id="noteUnseen">
                <h5 id="username">{{this.userInfo.username}} </h5>
                <h5>commented on your tweet.</h5>
                <p><i>{{this.commentContentSum}}...</i></p>
            </div>
        </div>
        <div v-if="this.note.typeOf == 'reply'" id="replyNote" @click="sendTweetData">
            <div v-if="this.note.isSeen == 1" id="notePanel">
                <h5 id="username">{{this.userInfo.username}} </h5>
                <h5>has replied to your comment.</h5>
                <p><i>{{this.commentContentSum}}...</i></p>
            </div>
            <div v-else id="noteUnseen">
                <h5 id="username">{{this.userInfo.username}} </h5>
                <h5>has replied to your comment.</h5>
                <p><i>{{this.commentContentSum}}...</i></p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import router from '../router'

    export default {
        name: "NotificationItem",
        props: ['note'],
        //load all info from prop. does not load tweets or comments on a "follow" type
        beforeMount() {
            this.loadOthersInfo(this.note.othersId)
            
            if(this.note.typeOf == "like") {
                this.loadTweet(this.note.tweetId)
            }
            if (this.note.typeOf == "comment" || this.note.typeOf == "reply") {
                this.loadTweet(this.note.tweetId)
                this.loadComments(this.note.tweetId)
            }
        },
        data() {
            return {
                userInfo: {

                },
                tweetContentSum: '',
                commentContentSum: '',
            }
        },
        methods: {
            sendTweetData() {
                if (router.currentRoute.path != '/tweet/'+this.note.tweetId) {
                    this.$router.push('/tweet/'+this.note.tweetId);
                } else {
                    router.go();
                }
            },
            loadOthersInfo(othersId) {
                axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/users',
                        method: "GET",
                        headers: {
                            'X-Api-Key': process.env.VUE_APP_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            'userId': othersId
                        }
                    }).then((response) => {
                        this.userInfo = response.data[0];
                        //emits loaded event for notification to notification menu
                        this.$emit("fullLoaded")
                    }).catch((error) => {
                        console.log(error.response);
                    })
            },
            loadTweet(tweetId) {
                if (tweetId != null) {
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/tweets',
                        method: "GET",
                        headers: {
                            'X-Api-Key': process.env.VUE_APP_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            'tweetId': tweetId
                        }
                    }).then((response) => {
                        this.tweetInfo = response.data;
                        //sends tweet content to function to get a substring length
                        this.getTweetSumry(this.tweetInfo.content)
                    }).catch((error) => {
                        console.log(error.response);
                    })
                }
            },
            //gets a length of max 20 characters for a preview on the notification
            getTweetSumry(content) {
                this.tweetContentSum = content.slice(0, 15);
            },
            loadComments(tweetId) {
                if (tweetId != null) {
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/comments',
                        method: "GET",
                        headers: {
                            'X-Api-Key': process.env.VUE_APP_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            'tweetId': tweetId
                        }
                    }).then((response) => {
                        let commentList = response.data;
                        let currentCommentContent
                        for(let i = 0; i< commentList.length; i++) {
                            if (commentList[i].commentId == this.note.commentId) {
                                currentCommentContent = commentList[i].content
                            }
                        }
                        this.getCommentSumry(currentCommentContent)
                    }).catch((error) => {
                        console.log(error);
                    })
                }
            },
            getCommentSumry(content) {
                this.commentContentSum = content.slice(0, 15);
            },
        }
    }
</script>

<style lang="scss" scoped>
    #notePanel {
        height: 10vh;
        padding: 1vh 1vw 1vh 0.5vw;
        border-bottom: 1px solid black;
        background-color:#26c6da;

        h5 {
            color: white;
            display: inline;
        }

        #username {
            color: #0162b8;
        }

        p {
            margin-left: 0.5vw;
        }
    }

    #noteUnseen {
        height: 10vh;
        padding: 1vh 1vw 1vh 0.5vw;
        border-bottom: 1px solid black;
        background-color:#078494;

        h5 {
            color: white;
        }

        #username {
            color: #0162b8;
        }

        p {
            margin-left: 0.5vw;
        }
    }

    #notePanel:hover, #noteUnseen:hover {
        cursor: pointer;
        background-color:#6cdceb; 
    }
</style>