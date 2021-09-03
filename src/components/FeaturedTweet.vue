<template>
    <div>
        <div id="featTweeterDisplay">
            <TweetCard :tweetInfo="featuredTweet" />
        </div>
    </div>
</template>

<script>
import TweetCard from './TweetCard.vue'

    export default {
        name: "FeaturedTweet",
        components: {
            TweetCard,
        },
        computed: {
            featuredTweet() {
                console.log(this.$store.state.featuredTweet);
                return this.$store.state.featuredTweet;
            },
        },
        methods: {
            //gets name clicked on and sends name to action to get user data
            goToProfile(event) {
                let clickedUserName = event.srcElement.innerText;
                return this.$store.dispatch('dataOfClickedName', clickedUserName);
            },
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