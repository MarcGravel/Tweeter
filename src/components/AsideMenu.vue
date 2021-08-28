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
                { title: 'Follows', icon: 'follow_the_signs', route: '/follows' },
                { title: 'Log Out', icon: 'logout' },
                ],
                absolute: true,
            }
        },
        methods: {
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
        }
    }
</script>

<style lang="scss" scoped>

</style>