<template>
    <div>
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
        <div id="tweeterDisplay" v-for="note in this.allNotifications" :key="note.notificationId">
            <NotificationItem :note="note"/>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import { eventBus } from '../main'
import NotificationItem from './NotificationItem.vue'
    export default {
        name: "NotificationMenu",
        components: {
            NotificationItem,
        },
        beforeMount() {
            this.loadNotifications()
        },
        updated() {
            //event called from AsideMenu when clicking avatar to check notifications
            //eventBus is seet on a timeout so patch does not run for 3 seconds past click
            eventBus.$on('patchNotifications', () => {
                this.patchNotifications()
            })
        },
        data() {
            return {
                allNotifications: []
            }
        },
        methods: {
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
                        this.loadNotifications(this.userId, this.token);
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
</style>