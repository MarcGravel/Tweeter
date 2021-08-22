<template>
    <div id="userContainer">
        <div id="imageContainer">
            <img @click.stop="drawer = !drawer" v-if="userDataInfo.imageUrl != undefined" src="https://image.flaticon.com/icons/png/512/847/847969.png" alt="No Image">
            <img @click.stop="drawer = !drawer" v-else :src="userDataInfo.imageUrl" alt="Users Image">
        </div>
        <h2 id="userName">{{userDataInfo.username}}</h2>
        <p id="bioParagraph">{{userDataInfo.bio}}</p>
            <v-navigation-drawer
            v-model="drawer"
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
                link
                >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
                </v-list-item>
            </v-list>
            </v-navigation-drawer>
            <v-app-bar-nav-icon id="hamburgerIcon" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import axios from 'axios'

    export default {
        name: "HomeFeed",
        beforeMount() {
            let theUserId = cookies.get('userId');
            this.requestCurrentUserInfo(theUserId);
        },
        computed: {
            userDataInfo() {
                return this.$store.state.currentUser;
            }
        },
        data () {
            return {
                drawer: null,
                items: [
                { title: 'Home', icon: 'mdi-view-dashboard' },
                { title: 'About', icon: 'mdi-forum' },
                ],
            }
        },
        methods: {
            //this request returns user info to computed: getUserData()
            requestCurrentUserInfo(userId) {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: "GET",
                    headers: {
                        'X-Api-Key': process.env.VUE_APP_API_KEY
                    },
                    params: {
                        userId: userId
                    }
                }).then((response) => {
                    return this.$store.commit('userData', response.data[0])
                }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    #userContainer {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: 1fr 1fr;

        #imageContainer {
            grid-column: 1 / 3;
            grid-row: 1 / 3;
            width: 50%;

            img {
                width: 100%;
                object-fit: cover;
                margin-left: 2vw;
                margin-top: 1vh;
            }
        }

        #userName {
            grid-column: 1;
            grid-row: 2;
            justify-self: center;
            align-self: end;
            color: #023E8A; 
            margin-left: 2vw;
            margin-bottom: 1vh;
        }

        #bioParagraph {
            grid-row: 1;
            grid-column: 2 / 5;
            justify-self: center;
            align-self: end;
            font-size: 1.3em;
            font-style: italic;
            margin-bottom: 0;
        }

        #hamburgerIcon {
            grid-column: 5;
            grid-row: 1;
            margin-right: 1vw;
        }
    }
</style>