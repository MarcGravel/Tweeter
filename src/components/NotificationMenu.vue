<template>
    <div id="mainMenu">
        <v-list-item>
            <v-list-item-content id="noteHeader">
            <v-list-item-title id="noteTitle">Notifications</v-list-item-title>
            <v-btn
                    color="error"
                    id="clearBtn"
                    @click="deleteNotifications"
                    >
                    Clear All
                    </v-btn>
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <!--style bindings to display loader or notifications based on loaded value-->
        <div :style="{'display': loadStyle}" id="spinner">
            <!-- Pulse loader is a package for spinner animations (npm install vue-spinner)) -->
            <PulseLoader :color="spinColor" :size="size" />
        </div>
        <div :style="{'display': displayStyle}">
            <div id="tweeterDisplay" v-for="note in this.allNotifications" :key="note.notificationId">
                <NotificationItem :note="note" @fullLoaded="checkNoteCount" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import { eventBus } from '../main'
import NotificationItem from './NotificationItem.vue'
//Pulse loader is a package for spinner animations (npm install vue-spinner))
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

    export default {
        name: "NotificationMenu",
        components: {
            NotificationItem,
            PulseLoader
        },
        beforeMount() {
            this.loadNotifications()
        },
        mounted() {
            //event called from AsideMenu when clicking avatar to check notifications
            eventBus.$on('patchNotifications', () => {
                this.patchNotifications()
            })
            eventBus.$on('loadNotifications', () => {
                this.loadNotifications()
            })
        },
        data() {
            return {
                allNotifications: [],
                spinColor: "#FFF",
                size: "1.5em",
                displayStyle: "none",
                loadStyle: "block",
                noteCounter: 0
            }
        },
        methods: {
            //adds 1 to the note counter. when note counter = same amount of notifications
            //will fire the update for display
            //this ensures all notifications are loaded before loader animation stops.
            checkNoteCount() {
                this.noteCounter++;

                if(this.noteCounter == this.allNotifications.length) {
                    this.updateMenuView();
                }
            },
            //changes the display values of loader and notifications once $emit received
            updateMenuView() {
                this.displayStyle = "block";
                this.loadStyle = "none";
            },
            loadNotifications() {
                let userId = cookies.get('userId');
                let token = cookies.get('loginToken');
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/notifications',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY,
                        'loginToken': token,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        "userId": userId 
                    }
                }).then((response) => {
                    //do not reverse order, order will be reversed when making api calls in item component
                    this.allNotifications = response.data;
                    
                    //get new notification count for badge display
                    let newNoteCount = 0;
                    for (let i=0; i<this.allNotifications.length; i++) {
                        if (this.allNotifications[i].isSeen == 0) {
                            newNoteCount++
                        }
                    }
                    //send to components displaying badge for count
                    this.$emit('newNotificationCount', newNoteCount);
                }).catch((error) => {
                    console.log(error);
                })
            },
            patchNotifications() {
                let token = cookies.get('loginToken');
                axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/notifications',
                        method: "PATCH",
                        headers: {
                            'X-Api-Key': process.env.VUE_APP_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'loginToken': token
                        }
                    }).then(() => {

                    }).catch((error) => {
                        console.log(error);
                    })
            },
            deleteNotifications() {
                let userId = cookies.get('userId');
                let token = cookies.get('loginToken');
                axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/notifications',
                        method: "DELETE",
                        headers: {
                            'X-Api-Key': process.env.VUE_APP_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'loginToken': token,
                            "userId": userId
                        }
                    }).then(() => {
                        this.loadNotifications(this.userId, this.token);
                    }).catch((error) => {
                        console.log(error);
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    #noteHeader {
        display: grid;

        #noteTitle {
        font-size: 1.8em;
        }
        
        #clearBtn {
            justify-self: end;
        }
    }

    #mainMenu {
        display: grid;

        #spinner {
            justify-self: center;
            margin-top: 5vh;
        }
    }

    [v-cloak] {
        display: none;
    }
</style>