<template>
    <div id="navBar">
        <v-toolbar id="toolbar"
            dark
            >
            <!-- @transitionend fires when nav draw is closed --> 
            <v-navigation-drawer
                @transitionend="patchNotification"
                id="notificationDrawer"
                v-model="noteDrawer"
                absolute
                temporary
                color="#00B4D8"
                width="70%"
                height="80vh"
                >
                <!-- receives emit data for notification count --> 
                <NotificationMenu @newNotificationCount="updateNew" />
            </v-navigation-drawer>
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
                        <v-list-item-avatar @click="notificationDrawer" id="navAvatar">
                            <v-img v-if="userDataInfo.imageUrl == null" src="https://image.flaticon.com/icons/png/512/847/847969.png"></v-img>
                            <v-img v-else :src="userDataInfo.imageUrl"></v-img>
                        </v-list-item-avatar>
                    </v-badge>
            <v-list-item id="listItem"
                v-for="item in items"
                :key="item.title"
                :to="item.route"
                @click="redirectPendingTitleName(item.title)"
                link
                >
                <v-btn id="buttons">
                    <v-icon>{{ item.icon }}</v-icon>
                </v-btn>
            </v-list-item>
        </v-toolbar>
    </div>
</template>

<script>
import router from '../router';
import { eventBus } from '../main'
import NotificationMenu from './NotificationMenu.vue'

    export default {
        name: "NavBar",
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
                items: [
                { title: 'Home', icon: 'dashboard', route: '/home' },
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
                    //reloads notifications after patch to change notification background color to "seen"
                    eventBus.$emit("loadNotifications");

                    //then clears notification badge after patch
                    this.notes = 0;
                }
            },
            notificationDrawer() {
                this.noteDrawer = !this.noteDrawer;
            },
            redirectPendingTitleName(itemTitle) {
                if (itemTitle == 'Log Out') {
                    //checks if logout button clicked. if so, sends data to store for logout
                    return this.$store.dispatch('logout', itemTitle);
                } else if (itemTitle == 'Follows' && router.currentRoute.path !="/follows") {
                    //if follows button is clicked, sends data to store. this data is hard coded as 'follows'
                    //as it is using the same follow request as on the profile page
                    let passedData = ["Follows", this.userDataInfo.userId];
                    return this.$store.commit('followLinkClick', passedData);
                }
            },
            //goes to user profile page when clicked
            routeToProfile() {
                if (router.currentRoute.path !="/profile") {
                    router.push('/profile');
                }
            },
        }
    }
</script>

<style lang="scss" scoped>

    #navBar {
        height: 56px;
        width: 100vw;
        box-shadow: 0 0 10px #000000;

        #navAvatar {
            cursor: pointer;
        }

        #notificationDrawer {
            border-bottom-right-radius: 20px;
        }

        #listItem {
            padding: 0;
            margin: 0;

            #buttons {
                width: 100%;
                height: 50px;
                border: none;
                border-radius: none;
                padding: 0;
                margin: 0;
                justify-items: end;
            }
        }

    }
</style>