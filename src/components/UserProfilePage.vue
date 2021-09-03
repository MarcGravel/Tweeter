<template>
    <div id="userPage">
        <div id="userContainer" @click="flipMenu">
            <div id="bannerContainer">
                <img v-if="userDataInfo.bannerUrl == null" src="@/assets/TweeterBanner.png" alt="No Image">
                <img v-else @click="addUrlToClickedData(userDataInfo.bannerUrl), imageOverlay = !imageOverlay" :src="userDataInfo.bannerUrl" alt="Users Image">
            </div>
            <div id="imageContainer">
                <img v-if="userDataInfo.imageUrl == null" src="https://image.flaticon.com/icons/png/512/847/847969.png" alt="No Image">
                <img v-else @click="addUrlToClickedData(userDataInfo.imageUrl), imageOverlay = !imageOverlay" :src="userDataInfo.imageUrl" alt="Users Image">
            </div>
            <h2 id="userName" @click="goToProfile($event)">{{userDataInfo.username}}</h2>
            <p id="bioParagraph">{{userDataInfo.bio}}</p>
            <p id="birthdate">Birthday: {{userDataInfo.birthdate}}</p>
            <div id="followFollowerBtns">
                <a @click="sendToFollowPage($event, userDataInfo.userId)">Followers</a> {{followersCount}} 
                <span class="mr-1">·</span>
                <a @click="sendToFollowPage($event, userDataInfo.userId)">Following</a> {{followsCount}}
            </div>
            <v-btn id="editBtn"
                color="error"
                @click="overlay = !overlay"
                >
                    <v-icon left>
                        mdi-pencil
                    </v-icon>
                Edit Profile
            </v-btn>
            <v-overlay
                :value="overlay" 
                :opacity="opacity">
                <v-form id="editForm">
                    <h3>Change any field below to update it</h3>
                    <v-text-field
                        v-model="updatedUserData.email"
                        :rules="emailRules"
                        :label="userDataInfo.email"
                    ></v-text-field>
                    <v-text-field
                        v-model="updatedUserData.imageUrl"
                        :rules="validateUrl"
                        :label="userDataInfo.imageUrl"
                        hint="A photo of yourself. Must be a valid https:// URL"
                    ></v-text-field>
                    <v-text-field
                        v-model="updatedUserData.bannerUrl"
                        :rules="validateUrl"
                        :label="userDataInfo.bannerUrl"
                        hint="Your Banner Image. Must be a valid https:// URL link"
                    ></v-text-field>
                    <v-text-field
                        v-model="updatedUserData.username"
                        :label="userDataInfo.username"
                    ></v-text-field>
                    <v-text-field
                        v-model="updatedUserData.bio"
                        :rules="bioRules"
                        :label="userDataInfo.bio"
                    ></v-text-field>
                    <label id="birthdayLabel" for="datePicker">Enter Birthday</label>
                    <v-date-picker id="datePicker" 
                        elevation="15"
                        width="70%"
                        v-model="updatedUserData.birthdate"
                        color="#0096C7"
                    ></v-date-picker>
                    <v-btn id="saveUpdateBtn"
                        color="primary" 
                        @click="sendUpdatedData(updatedUserData), overlay = !overlay">
                            Save
                    </v-btn>
                    <v-btn id="firstOverlaybackBtn"
                        color="primary" 
                        @click="overlay = !overlay">
                            Back
                    </v-btn>
                    <v-btn id="deleteBtn"
                        color="error" 
                        @click="overlayDelAcc = !overlayDelAcc">
                            Delete Account
                    </v-btn>
                    <v-overlay
                        :value="overlayDelAcc"
                        :opacity="opacity">
                        <v-text-field
                        v-model="deleteAccountPass"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="passwordRules"
                        :type="show1 ? 'text' : 'password'"
                        label="Enter Your Password"
                        hint="Deleting your account is permanent"
                        @click:append="show1 = !show1"
                    ></v-text-field>
                    <v-btn id="backBtn"
                        color="primary" 
                        @click="overlayDelAcc = !overlayDelAcc">
                            Back
                    </v-btn>
                    <v-btn id="confirmDeleteBtn"
                        color="error" 
                        @click="deleteAccount()">
                            Confirm Delete
                    </v-btn>
                    </v-overlay>
            </v-form>
            </v-overlay>
            <AsideMenu v-if="drawer == true" :drawerStatus="drawer"/>
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
import cookies from 'vue-cookies'
import axios from 'axios'
import AsideMenu from './AsideMenu.vue'

    export default {
        name: "UserProfilePage",
        components: {
            AsideMenu,
        },
        //gets user info from ID before mounting
        beforeMount() {
            let theUserId = cookies.get('userId');
            this.requestCurrentUserInfo(theUserId);
            this.getFollowCounts();
        },
        computed: {
            //gets all current user data
            userDataInfo() {
                return this.$store.state.currentUser;
            },
            updateDOM() {
                this.getFollowCounts();
                return this.$store.state.followsPageFlag;
            }
        },
        data () {
            return {
                drawer: null,
                overlay: false,
                overlayDelAcc: false,
                opacity: 0.95,
                validateUrl: [
                    (value) => this.isURL(value) || 'Not a valid URL'
                ],
                updatedUserData: {
                    email: '',
                    imageUrl: '',
                    bannerUrl: '',
                    username: '',
                    bio: '',
                    birthdate: '',
                },
                emailRules: [
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
                ],
                bioRules: [
                    v => v.length  <= 70 || 'Max 70 characters'
                ],
                deleteAccountPass: '',
                show1: false,
                show2: true,
                show3: false,
                show4: false,
                passwordRules: [
                    value => !!value || 'Required.'
                ],
                followsCount: 0,
                followersCount: 0,
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
            //axios request done here as date-picker not accepting birthdate from store
            requestCurrentUserInfo(userId) {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        userId: userId
                    }
                }).then((response) => {
                    //sets currentbirthdate for "edit profile",
                    //must be done now due to v-date-picker not able to display computed property strings 
                    this.updatedUserData.birthdate = response.data[0].birthdate;

                    return this.$store.commit('userData', response.data[0])
                }).catch((error) => {
                    console.log(error);
                })
            },
            //gets name clicked on and sends name to action to get user data
            goToProfile(event) {
                let clickedUserName = event.srcElement.innerText;
                return this.$store.dispatch('dataOfClickedName', clickedUserName)
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
            },
            //checks if logout button clicked. if so, removes cookies and sends API call to clear login token
            //checks if logout button clicked. if so, sends data to store for logout
            checkForLogout(itemTitle) {
                return this.$store.dispatch('logout', itemTitle);
            },
            sendUpdatedData(userData) {

                //if birthdate is unchanged, change userData birthdays to '' to work with forEach statement below
                if (userData.birthdate == this.userDataInfo.birthdate) {
                    userData.birthdate = '';
                }

                //adds key:value pairs to param array on condition they are not empty strings
                Object.keys(userData).forEach((key) => {
                        if(userData[key] == '') {
                            delete userData[key];
                        }
                });

                //adds login token to userData object
                userData.loginToken = cookies.get('loginToken');

                //parse object wrapped in observer to passable JSON for axios request 
                var parseUserData = JSON.parse(JSON.stringify(userData))
                
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: "PATCH",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    data: parseUserData
                }).then(() => {
                    this.requestCurrentUserInfo(cookies.get('userId'));
                }).catch((error) => {
                    console.log(error.response);
                })
            }, 
            deleteAccount() {
                return this.$store.dispatch('deleteUser', this.deleteAccountPass); 
            },
            sendToFollowPage(event, userId) {
                let passedData = [event.srcElement.innerText, userId];
                return this.$store.commit('followLinkClick', passedData);
            },
            getFollowCounts() {
                //follows count
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
                    this.followsCount = response.data.length;
                }).catch((error) => {
                    console.log(error);
                });

                //followers count
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/followers',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "userId": cookies.get('userId')
                    }
                }).then((response) => {
                    this.followersCount = response.data.length;
                }).catch((error) => {
                    console.log(error);
                });
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
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 15vh 15vh 8vh 8vh 4vh;

        #bannerContainer {
            width: 100%;
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

        #editBtn {
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

        #followFollowerBtns {
            grid-column: 2 / 5;
            justify-self: end;
            margin-right: 4vw;
            grid-row: 5;
            color: white;

            a {
                color: whitesmoke;
                text-decoration: underline;
            }
        }

        #saveUpdateBtn, #firstOverlaybackBtn {
            margin-top: 1vh;
        }

        #firstOverlaybackBtn {
            margin-left: 2vw;
        }

        #deleteBtn {
           margin: 1vh 0 0 20vw;
        }

        #confirmDeleteBtn {
            margin-left: 5vw;
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
        #userContainer {

            #editBtn {
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

        #userPage {
            display: grid;

            #userContainer {
                width: 768px;
                justify-self: center;

                #bannerContainer {
                    width: 100%;

                    img {
                        width: 768px;
                    }
                }

                #imageContainer {
                    grid-column: 1 / 5;
                    justify-self: center;

                    img {
                        height: 18vh;
                        width: 18vh;
                    }
                }

                #userName {
                    justify-self: center;
                    margin: 0 0 0 3vw;
                    font-size: 1.8em;
                }

                #bioParagraph {
                    justify-self: center;
                    font-size: 1.6em;
                }

                #birthdate {
                    font-size: 1.2em;
                }

                #followFollowerBtns {
                    font-size: 1.2em;
                }

                #editBtn {
                    grid-column: 3 / 5;
                    justify-self: end;
                    align-self: start;
                    margin-top: 1vh;
                }
            }
        }
    }
</style>