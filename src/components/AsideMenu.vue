<template>
    <div>
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
    </div>
</template>

<!-- <v-app-bar-nav-icon id="hamburgerIcon" color="black" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>-->

<script>
    export default {
        name: "AsideMenu",
        props: ['drawerStatus'],
        computed: {
            userDataInfo() {
                return this.$store.state.currentUser;
            },
        },
        data() {
            return {
                drawer: this.drawerStatus,
                //items inside the side menu
                items: [
                { title: 'Home', icon: 'dashboard', route: '/home' },
                { title: 'My Profile', icon: 'account_circle', route: '/profile' },
                { title: 'Discover', icon: 'explore', route: '/discover' },
                { title: 'Follows', icon: 'follow_the_signs' },
                { title: 'Log Out', icon: 'logout' },
                ],
                absolute: true,
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
                } else if (itemTitle == "My Profile") {
                    //goes to user profile page when clicked
                     return this.$store.commit('loadUserProfile', true);
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    #drawer {
        margin-top: 56px;
    }
</style>