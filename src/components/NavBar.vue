<template>
    <div id="navBar">
        <v-toolbar id="toolbar"
            dark
            >
            <v-list-item-avatar @click="routeToProfile">
                <v-img v-if="userDataInfo.imageUrl == null" src="https://image.flaticon.com/icons/png/512/847/847969.png"></v-img>
                <v-img v-else :src="userDataInfo.imageUrl"></v-img>
            </v-list-item-avatar>
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


    export default {
        name: "NavBar",
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
            }
        },
        methods: {
            redirectPendingTitleName(itemTitle) {
                if (itemTitle == 'Log Out') {
                    //checks if logout button clicked. if so, sends data to store for logout
                    return this.$store.dispatch('logout', itemTitle);
                } else if (itemTitle == 'Follows') {
                    //if follows button is clicked, sends data to store. this data is hard coded as 'follows'
                    //as it is using the same follow request as on the profile page
                    let passedData = ["Follows", this.userDataInfo.userId];
                    return this.$store.commit('followLinkClick', passedData);
                }
            },
            //goes to user profile page when clicked
            routeToProfile() {
                router.push('/profile');
            },
        }
    }
</script>

<style lang="scss" scoped>

    #navBar {
        height: 56px;
        width: 100vw;
        box-shadow: 0 0 10px #000000;

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