import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Discover from '../views/Discover.vue'
import Profile from '../views/Profile.vue'
import Users from '../views/Users.vue'
import Follows from '../views/Follows.vue'
import Tweet from '../views/Tweet.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/discover',
    name: 'Discover',
    component: Discover
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  //props for dynamic routing
  {
    path: '/users/:username',
    name: 'Users',
    props: true,
    component: Users
  },
  {
    path: '/follows',
    name: "Follows",
    component: Follows
  },
  {
    path: '/tweet/:tweetId',
    name: "Tweet",
    props: true,
    component: Tweet
  }
]

const router = new VueRouter({
  routes
})

export default router
