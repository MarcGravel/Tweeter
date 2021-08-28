<!--This view is purposely a different format that the others, just trying to
build views in a few different ways to practice structure-->

<template>
    <div id="userPageContainer">
        <div id="othersContainer">
            <v-app-bar-nav-icon id="hamburgerIcon" color="white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <div id="bannerContainer">
                <img v-if="othersData.bannerUrl == null" src="@/assets/TweeterBanner.png" alt="No Image">
                <img v-else :src="othersData.bannerUrl" alt="Users Image">
            </div>
            <div id="imageContainer">
                <img @click.stop="drawer = !drawer" v-if="othersData.imageUrl == null" src="https://image.flaticon.com/icons/png/512/847/847969.png" alt="No Image">
                <img @click.stop="drawer = !drawer" v-else :src="othersData.imageUrl" alt="Users Image">
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
            <aside id="drawer">
                <v-navigation-drawer
                v-model="drawer"
                color="#CAF0F8"
                absolute
                temporary
                >
                <v-list-item>
                    <v-list-item-avatar>
                    <v-img v-if="userDataInfo.imageUrl != undefined" src="https://image.flaticon.com/icons/png/512/847/847969.png"></v-img>
                    <v-img v-else :src="userDataInfo.imageUrl"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                    <v-list-item-title>{{userDataInfo.username}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list dense>
                    <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    :to="item.route"
                    @click="checkForLogout(item.title), clickedUserProfile(item.title)"
                    link
                    >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title >{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                    </v-list-item>
                </v-list>
                </v-navigation-drawer>
            </aside>
        </div>
        <div id="displayBanner">
            <h4>See what {{othersData.username}} is talking about</h4>
        </div>
        <div id="feedDisplay">
            <OthersFeedDisplay :othersId="othersData.userId" />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import router from '../router'
import OthersFeedDisplay from '../components/OthersFeedDisplay.vue'

    export default {
        name: "Users",
        components: {
            OthersFeedDisplay,
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
                //items inside the side menu
                items: [
                { title: 'Home', icon: 'dashboard', route: '/home' },
                { title: 'My Profile', icon: 'account_circle', route: '/profile' },
                { title: 'Discover', icon: 'explore', route: '/discover' },
                { title: 'Follows', icon: 'follow_the_signs', route: '/follows' },
                { title: 'Log Out', icon: 'logout' },
                ],
                isFollowing: null
            }
        },
        methods: {
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    #userPageContainer {
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
                justify-self: end;
                align-self: center;
            }

            #unfollowBtn {
                width: fit-content;
                grid-column: 2 / 4;
                grid-row: 2;
                justify-self: end;
                align-self: center;
            }

            #userName {
                grid-column: 1 / 5;
                grid-row: 3;
                justify-self: start;
                align-self: end;
                color: white; 
                margin: 0 0 0 2vw;
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

            #hamburgerIcon {
            grid-column: 5;
            grid-row: 2;
            margin-right: 1vw;
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

        #feedDisplay {
            grid-row: 3;
        }
    }
</style>