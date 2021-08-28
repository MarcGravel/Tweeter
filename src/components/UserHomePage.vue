<template>
    <div id="userContainer">
        <v-app-bar-nav-icon id="hamburgerIcon" color="white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <div id="imageContainer">
            <img @click.stop="drawer = !drawer" v-if="userDataInfo.imageUrl == null" src="https://image.flaticon.com/icons/png/512/847/847969.png" alt="No Image">
            <img @click.stop="drawer = !drawer" v-else :src="userDataInfo.imageUrl" alt="Users Image">
        </div>
        <h2 id="userName" @click="goToProfile($event)">{{userDataInfo.username}}</h2>
        <p id="bioParagraph">{{userDataInfo.bio}}</p>
        <aside id="drawer">
            <v-navigation-drawer
            v-model="drawer"
            color="#CAF0F8"
            absolute
            temporary
            >
            <v-list-item>
                <v-list-item-avatar>
                <v-img v-if="userDataInfo.imageUrl == null" src="https://image.flaticon.com/icons/png/512/847/847969.png"></v-img>
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
</template>

<script>
import cookies from 'vue-cookies'

    export default {
        name: "HomeFeed",
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
                //items inside the side menu
                items: [
                { title: 'Home', icon: 'dashboard', route: '/home' },
                { title: 'My Profile', icon: 'account_circle', route: '/profile' },
                { title: 'Discover', icon: 'explore', route: '/discover' },
                { title: 'Follows', icon: 'follow_the_signs', route: '/follows' },
                { title: 'Log Out', icon: 'logout' },
                ],
            }
        },
        methods: {
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
                height: 13vh;
                width: 13vh;
                object-fit: cover;
                margin-left: 2vw;
                margin-top: 1vh;
                border-radius: 50%;
            }
        }

        #userName {
            grid-column: 2 / 5;
            grid-row: 1;
            justify-self: center;
            align-self: end;
            color: #023E8A; 
            margin: 0 4vw 1vh 0;
        }

        #bioParagraph {
            grid-row: 2;
            grid-column: 2 / 5;
            justify-self: center;
            align-self: start;
            font-size: 1.3em;
            font-style: italic;
            margin: 0 0 0 10vw;
        }

        #hamburgerIcon {
            grid-column: 5;
            grid-row: 1;
            margin-right: 1vw;
        }
    }
</style>