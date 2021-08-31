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
                @click="postComment(commentInput, tweetId)"
                >
                Submit
            </v-btn>
            <div id='displayComments' v-for="comment in tweetComments" :key="comment.commentId">
                <p>{{comment.commentId}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'

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
            }
        },
        methods: {
            postComment(input, tweetId) {
                if(input != '') {
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/comments',
                        method: "POST",
                        headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                        },
                        data: {
                            "loginToken": cookies.get('loginToken'),
                            "tweetId": tweetId,
                            "content": input
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
            getTweetComments(tweetId) {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/comments',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "tweetId": tweetId 
                    }
                }).then((response) => {
                    for(let i=0; i<response.data.length; i++) {
                        if(response.data[i].length > 0) {
                            this.tweetComments.push(response.data[i])
                        }
                    }
                    console.log(this.tweetComments);
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
    }
</style>