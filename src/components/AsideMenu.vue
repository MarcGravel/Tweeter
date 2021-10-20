<template>
    <div>
        <div id="sideContainer">
            <!-- @transitionend fires when nav draw is closed --> 
            <v-navigation-drawer
                @transitionend="patchNotification"
                id="notificationDrawer"
                v-model="noteDrawer"
                absolute
                temporary
                color="#00B4D8"
                width="100%"
                >
                <NotificationMenu @newNotificationCount="updateNew" />
            </v-navigation-drawer>
            <h1 id="siteName">Tweeter</h1>
            <aside id="sideMenu">
                <v-navigation-drawer
                color="#CAF0F8"
                width="100%"
                >
                <v-list-item id="userAvatarName">
                    <v-badge
                    id="badge"
                    overlap
                    bordered
                    color="error"
                    offset-x="30"
                    offset-y="20"
                    :value="notes"
                    :content="notes"
                    >
                        <v-list-item-avatar>
                        <v-img id="avatar" v-if="userDataInfo.imageUrl == null" src="https://image.flaticon.com/icons/png/512/847/847969.png" @click="notificationDrawer"></v-img>
                        <v-img id="avatar" v-else :src="userDataInfo.imageUrl" @click="notificationDrawer"></v-img>
                        </v-list-item-avatar>
                    </v-badge>

                    <v-list-item-content>
                    <v-list-item-title 
                        id="menuUsername"
                        @click="goToProfile($event)"
                        >
                        {{userDataInfo.username}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list dense>
                    <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    :to="item.route"
                    @click="redirectPendingTitleName(item.title)"
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
            <img id="logo" src="@/assets/TweeterLogo.png" alt="TweeterLogo">
            <img id="logo2" src="@/assets/TweeterLogo.png" alt="TweeterLogo">
            <img id="logo3" src="@/assets/TweeterLogo.png" alt="TweeterLogo">
        </div>
    </div>
</template>

<!-- <v-app-bar-nav-icon id="hamburgerIcon" color="black" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>-->

<script>
import router from '../router'
import { eventBus } from '../main'
import NotificationMenu from './NotificationMenu.vue'
    export default {
        name: "AsideMenu",
        components: {
            NotificationMenu,
        },
        computed: {
            userDataInfo() {
                return this.$store.state.currentUser;
            },
        },
        data() {
            return {
                //items inside the side menu
                items: [
                { title: 'Home', icon: 'dashboard', route: '/home' },
                { title: 'My Profile', icon: 'account_circle', route: '/profile' },
                { title: 'Discover', icon: 'explore', route: '/discover' },
                { title: 'Follows', icon: 'follow_the_signs' },
                { title: 'Log Out', icon: 'logout' },
                ],
                absolute: true,
                noteDrawer: null,
                notes: 0,
                show: false,
            }
        },
        methods: {
            //updates the unseen notifications from note menu emit
            updateNew(count){
                this.notes = count;
            },
            patchNotification() {
                //only runs when noteification drawer closes
                if (this.noteDrawer == false) {
                    eventBus.$emit("patchNotifications");

                    //then cleanrs notification badge after patch
                    this.notes = 0;
                }
            },
            notificationDrawer() {
                this.noteDrawer = !this.noteDrawer;
                //loads all notifications again when clicked to check for updated IsSeen
                eventBus.$emit("loadNotifications");
            },
            goToProfile(event) {
                let clickedUserName = event.srcElement.innerText;
                return this.$store.dispatch('dataOfClickedName', clickedUserName);
            },
            redirectPendingTitleName(itemTitle) {
                if (itemTitle == 'Log Out') {
                    //checks if logout button clicked. if so, sends data to store for logout
                    return this.$store.dispatch('logout', itemTitle);

                //ensures router is not current at /follows to avoid NavigationDuplicated
                } else if (itemTitle == 'Follows' && router.currentRoute.path !="/follows") {
                    //if follows button is clicked, sends data to store. this data is hard coded as 'follows'
                    //as it is using the same follow request as on the profile page
                    //ensures router is not current at /follows to avoid NavigationDuplicated
                    let passedData = ["Follows", this.userDataInfo.userId];
                    return this.$store.commit('followLinkClick', passedData); 

                //ensures router is not current at /profile to avoid NavigationDuplicated    
                } else if (itemTitle == "My Profile" && router.currentRoute.path !="/profile") {
                    //goes to user profile page when clicked
                    return this.$store.commit('loadUserProfile', true);
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

    #sideContainer {
        height: 100vh;
        width: 100%;
        display: grid;
        grid-template-rows: repeat(10, 10%);

        #siteName {
            grid-row: 1;
            justify-self: center;
            align-self: center;
            font-family: 'Cedarville Cursive', cursive;
            font-size: 4em;
            color: #00B4D8;
        }

        #userAvatarName {
            padding-left: 0;
        }

        #avatar {
            cursor: pointer;
        }

        #menuUsername {
            cursor: pointer;
        }

        #sideMenu {
            grid-row: 2 / 5;
            height: fit-content;
        }

        #logo {
            width: 80%;
            justify-self: center;
            grid-row: 5;
            margin-top: 1vh;
        }

        #logo2 {
            width: 40%;
            justify-self: center;
            grid-row: 8;
            margin-top: 3vh;
        }

        #logo3 {
            width: 20%;
            justify-self: center;
            grid-row: 10;
        }
    }
</style>