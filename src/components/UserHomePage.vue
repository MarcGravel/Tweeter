<template>
    <div id="userContainer" @click="flipMenu">
        <div id="imageContainer">
            <img v-if="userDataInfo.imageUrl == null" src="https://image.flaticon.com/icons/png/512/847/847969.png" alt="No Image">
            <img v-else @click="addUrlToClickedData(userDataInfo.imageUrl), imageOverlay = !imageOverlay" :src="userDataInfo.imageUrl" alt="Users Image">
        </div>
        <h2 id="userName" @click="goToProfile($event)">{{userDataInfo.username}}</h2>
        <p id="bioParagraph">{{userDataInfo.bio}}</p>
        <AsideMenu v-if="drawer == true" :drawerStatus="drawer"/>
        <v-overlay
            :value="imageOverlay"
            :opacity="imageOpacity">
            <div id="imageOverlay">
                <img :src="clickedImage" alt="The Clicked tweet image">
                <v-btn
                    id="imageBack"
                    color="error"
                    @click="imageOverlay = !imageOverlay"
                    >
                    Back
                </v-btn>
            </div>
        </v-overlay>
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import AsideMenu from './AsideMenu.vue'

    export default {
        name: "HomeFeed",
        components: {
            AsideMenu,
        },
        //gets user info from ID before mounting
        beforeMount() {
            let theUserId = cookies.get('userId');
            this.requestCurrentUserInfo(theUserId);
        },
        computed: {
            //gets all current user data
            userDataInfo() {
                return this.$store.state.currentUser;
            }
        },
        data () {
            return {
                drawer: null,
                imageOverlay: false,
                imageOpacity: 1,
                clickedImage: '',
            }
        },
        methods: {
            //flips drawer flag back on click to close aside menu
            flipMenu() {
                if(this.drawer == true) {
                    this.drawer = !this.drawer;
                }
            },
            //this request returns user info to computed: userDataInfo()
            requestCurrentUserInfo(userId) {
                return this.$store.dispatch('getUserInfo', userId);
            },
            //checks if logout button clicked. if so, sends data to store for logout
            checkForLogout(itemTitle) {
                return this.$store.dispatch('logout', itemTitle);
            },
            //goes to user profile page when clicked
            clickedUserProfile(itemTitle) {
                if (itemTitle == "My Profile") {
                    return this.$store.commit('loadUserProfile', true);
                }
            },
            //gets name clicked on and sends name to action to get user data
            goToProfile(event) {
                let clickedUserName = event.srcElement.innerText;
                return this.$store.dispatch('dataOfClickedName', clickedUserName)
            },
            addUrlToClickedData(clickedUrl) {
                this.clickedImage = clickedUrl;
            }
        }
    }
</script>

<style lang="scss" scoped>
    #userContainer {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 30% 70%;
        grid-template-rows: 1fr 1fr;

        #imageContainer {
            grid-column: 1;
            grid-row: 1 / 3;
            width: 100%;

            img {
                cursor: pointer;
                height: 13vh;
                width: 13vh;
                object-fit: cover;
                margin-left: 2vw;
                margin-top: 1vh;
                border-radius: 50%;
            }
        }

        #userName {
            cursor: pointer;
            grid-column: 2;
            grid-row: 1;
            justify-self: start;
            align-self: end;
            color: #023E8A; 
            margin: 0 4vw 1vh 0;
        }

        #userName:hover {
            color: whitesmoke;
        }

        #bioParagraph {
            grid-row: 2;
            grid-column: 2;
            justify-self: start;
            align-self: start;
            font-size: 1.3em;
            font-style: italic;
            margin: 0 0 0 10vw;
        }
    }

    #imageOverlay {
        display: grid;
        justify-items: center;

        img {
            display: block;
            width: 100%;
            max-height: 90vh;
            object-fit: cover;
        }

        #imageBack {
            margin-top: 2vh;
        }
    }

    @media screen and (min-width: 768px) {
        #userContainer {
        width: 768px;

            #imageContainer {

                img {
                    height: 23vh;
                    width: 23vh;
                }
            }

            #userName {
                font-size: 2.5em;
                margin: 0 4vw 1vh 0;
            }

            #bioParagraph {
                grid-column: 1 / 5;
                font-size: 1.6em;
                margin: 0 0 0 27vw;

            }
        }
    }

    @media screen and (min-width: 1100px) {
        #userContainer {
            width: 100%;
            grid-template-columns: 30% 70%;

            #imageContainer {
                grid-column: 1;
                grid-row: 1 / 3;
                width: 100%;

                img {
                    height: 23vh;
                    width: 23vh;
                }
            }

            #userName {
                grid-column: 2;
                justify-self: start;
                margin-left: 3vw;
            }

            #bioParagraph {
                justify-self: start;
                grid-column: 2;
                margin: 0 0 0 4vw;
            }
        }
    }
</style>