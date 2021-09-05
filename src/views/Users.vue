<!--This view is purposely a different format that the others, just trying to
build views in a few different ways to practice structure-->

<template>
    <div id="usersPage">
        <div id="navBar">
            <NavBar />
        </div>
        <aside id="sideMenu">
            <AsideMenu />
        </aside>
        <div id="userPageContainer" @click="flipMenu">
            <div id="othersContainer">
                <div id="bannerContainer">
                    <img v-if="othersData.bannerUrl == null" src="@/assets/TweeterBanner.png" alt="No Image">
                    <img v-else @click="addUrlToClickedData(othersData.bannerUrl), imageOverlay = !imageOverlay" :src="othersData.bannerUrl" alt="Users Image">
                </div>
                <div id="imageContainer">
                    <img v-if="othersData.imageUrl == null" src="https://image.flaticon.com/icons/png/512/847/847969.png" alt="No Image">
                    <img v-else @click="addUrlToClickedData(othersData.imageUrl), imageOverlay = !imageOverlay" :src="othersData.imageUrl" alt="Users Image">
                </div>
                <h2 id="userName" @click="goToProfile($event)">{{othersData.username}}</h2>
                <p id="bioParagraph">{{othersData.bio}}</p>
                <p id="birthdate">Birthday: {{othersData.birthdate}}</p>
                <v-btn id="followBtn"
                v-if="!isFollowing"
                color="primary"
                @click="followClickedUser()"
                >
                    <v-icon left>
                        follow_the_signs
                    </v-icon>
                Follow
                </v-btn>
                <v-btn id="unfollowBtn"
                v-else
                color="error"
                @click="unfollowClickedUser()"
                >
                    <v-icon left>
                        follow_the_signs
                    </v-icon>
                Unfollow
                </v-btn>
                <AsideMenu v-if="drawer == true" :drawerStatus="drawer"/>
            </div>
            <div id="displayBanner">
                <h4>See what {{othersData.username}} is talking about</h4>
            </div>
        </div>
        <div id="feedDisplay">
            <OthersFeedDisplay :othersId="othersData.userId" />
        </div>
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
import axios from 'axios'
import cookies from 'vue-cookies'
import router from '../router'
import OthersFeedDisplay from '../components/OthersFeedDisplay.vue'
import AsideMenu from '../components/AsideMenu.vue'
import NavBar from '../components/NavBar.vue'

    export default {
        name: "Users",
        components: {
            OthersFeedDisplay,
            AsideMenu,
            NavBar,
        },
        props: ['username'],
        computed: {
            getLoginToken() {
                return cookies.get('loginToken');
            },
        },
        beforeMount() {
            this.getOthersData();
            this.userDataInfo();
            if (this.getLoginToken === null) {
                router.push('/');
            }
            
        },
        mounted() {
            this.checkforFollows();
        },
        data() {
            return {
                othersData: {

                },
                drawer: null,
                isFollowing: null,
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
            //gets data of user based on username passed by parent
            getOthersData() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    for(let i=0; i<response.data.length; i++) {
                        if(response.data[i].username == this.username) {
                            this.othersData = response.data[i];
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                })
            },
            userDataInfo() {
                return this.$store.currentUser;
            },
            //gets name clicked on and sends name to action to get user data
            goToProfile(event) {
                let clickedUserName = event.srcElement.innerText;
                return this.$store.dispatch('dataOfClickedName', clickedUserName)
            },
            //checks if logout button clicked. if so, sends data to store for logout
            checkForLogout(itemTitle) {
                return this.$store.dispatch('logout', itemTitle);
            },
            followClickedUser() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/follows',
                    method: "POST",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "loginToken": cookies.get('loginToken'),
                        'followId': this.othersData.userId
                    }
                }).then(() => {
                   this.isFollowing = true;
                }).catch((error) => {
                    console.log(error);
                })
            },
            unfollowClickedUser() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/follows',
                    method: "DELETE",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "loginToken": cookies.get('loginToken'),
                        'followId': this.othersData.userId
                    }
                }).then(() => {
                    this.isFollowing = false;
                }).catch((error) => {
                    console.log(error);
                })
            },
            checkforFollows() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/follows',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "userId": cookies.get('userId')
                    }
                }).then((response) => {
                    if(response.data.length != 0)
                    for(let i=0; i<response.data.length; i++) {
                        if(response.data[i].userId == this.othersData.userId) {
                            this.isFollowing = true;
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                })
            },
            addUrlToClickedData(clickedUrl) {
                this.clickedImage = clickedUrl;
            }
        }
    }
</script>

<style lang="scss" scoped>

    #navBar {
      position: fixed;
      z-index: 99;
      grid-row: 1;
      height: 56px;
    }

    #usersPage {
        display: grid;

        #sideMenu {
            display: none;
        }
        
        #feedDisplay {
            margin-top: 7vh;
        }

        #userPageContainer {
            margin-top: 56px;
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-rows: 1fr 8vh auto;
            
            #othersContainer {
                grid-row: 1;
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-template-rows: 15vh 15vh 8vh 8vh 4vh;

                #bannerContainer {
                    width: 100vw;
                    height: fit-content;
                    grid-column: 1 / 4;
                    grid-row: 1;

                    img {
                        cursor: pointer;
                        width: 100vw;
                        height: 15vh;
                        object-fit: cover;
                    }
                }

                #imageContainer {
                    grid-column: 1;
                    grid-row: 2;
                    width: fit-content;
                    height: fit-content;

                    img {
                        cursor: pointer;
                        height: 15vh;
                        width: 15vh;
                        object-fit: cover;
                        margin-left: 2vw;
                        margin-top: 1vh;
                        border-radius: 50%;
                    }
                }

                #followBtn {
                    width: fit-content;
                    grid-column: 2 / 4;
                    grid-row: 2;
                    justify-self: center;
                    align-self: center;
                }

                #unfollowBtn {
                    width: fit-content;
                    grid-column: 2 / 4;
                    grid-row: 2;
                    justify-self: center;
                    align-self: center;
                }

                #userName {
                    cursor: pointer;
                    grid-column: 1 / 5;
                    grid-row: 3;
                    justify-self: start;
                    align-self: end;
                    color: white; 
                    margin: 0 0 0 2vw;
                }

                #userName:hover {
                    color: #90E0EF;
                }

                #bioParagraph {
                    grid-row: 4;
                    grid-column: 1 / 5;
                    justify-self: start;
                    align-self: center;
                    font-size: 1.3em;
                    font-style: italic;
                    color: white; 
                    margin: 0 0 0 2vw;
                }

                #birthdate{
                    grid-row: 5;
                    grid-column: 1 / 5;
                    justify-self: start;
                    align-self: start;
                    font-size: 1.1em;
                    color: white; 
                    margin: 0 0 0 2vw;
                }
            }

            #displayBanner {
                grid-row: 2;
                background-color: #0096C7;
                height: 8vh;
                display: grid;
                justify-items: center;
                align-items: center;
                box-shadow: 0 10px 20px #03045E ;
                
                h4 {
                    color: white;
                }
            }
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


    @media screen and (max-width: 400px) {
        #userPageContainer {

            #followFollowerBtns {
                align-self: start;
                justify-self: start;
                position: relative;
                left: 11vw;
            }

            #followFollowerBtns {
                grid-column: 1 / 5;
                position: relative;
                bottom: 15vh;
            }
        }
    }

    @media screen and (min-width: 768px) {

        #usersPage {

            #userPageContainer {
                width: 768px;
                justify-self: center;
                grid-template-rows: 1fr 8vh;
                
                #othersContainer {
                    width: 768px;
                    justify-items: center;

                    #bannerContainer {
                        width: 768px;
                        
                        img {
                            width: 768px;
                        }
                    }

                    #imageContainer {
                        grid-column: 2;
                        grid-row: 2;

                        img {
                            height: 18vh;
                            width: 18vh;
                            margin-left: 0;
                        }
                    }

                    #followBtn {
                        grid-column: 3 / 5;
                        justify-self: end;
                        align-self: start;
                    }

                    #unfollowBtn {
                        grid-column: 3 / 5;
                        justify-self: end;
                        align-self: start;
                    }

                    #userName {
                        justify-self: center;                      
                        margin: 0 0 0 0;
                        font-size: 1.8em;
                    }

                    #bioParagraph {
                        justify-self: center;
                        font-size: 1.6em;
                    }

                    #birthdate{
                        justify-self: center;
                        font-size: 1.2em;
                    }
                }

                 #displayBanner {

                     h4 {
                         font-size: 1.6em;
                     }
                 }
            }
        }
    }

    @media screen and (min-width: 1100px) { 
        #navBar {
            display: none;
        }

        #usersPage {
            grid-template-columns: 20% 60% 20%;
            grid-template-rows: auto auto;

            #sideMenu {
                display: block;
                grid-column: 1;
                width: 20%;
                height: 100vh;
                position: fixed;
                right: 80%;
                background-color: #CAF0F8; 
            }

            #userPageContainer {
                margin-top: 0;
                grid-column: 2;
                width: 100%;
                justify-self: start;
                margin-left: 0.2%;

                #othersContainer {
                    width: 100%;

                    #bannerContainer {
                        width: 100%;

                        img {
                            width: 100%;
                        }
                    }

                    #imageContainer {

                        img {
                            height: 22vh;
                            width: 22vh;
                        }
                    }

                    #followBtn, #unfollowBtn {
                        margin-top: 1vh;
                    }

                    #userName {
                        grid-column: 1 / 5;
                        justify-self: start;
                        margin: 0 0 0 2vw;
                    }

                    #bioParagraph {
                        grid-column: 1 / 5;
                        justify-self: start;
                        margin: 0 0 0 3vw;
                    }
                }

                #displayBanner {
                    margin-top: 2vh;
                }
            }
        }
        #feedDisplay {
            grid-row: 2;
        }
    }
</style>