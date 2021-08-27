import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import cookies from 'vue-cookies'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    flagState: true,
    signUpBtnValue: false,
    currentUser: [],
    otherUser: [],
    featuredTweet: [],
    isUserProfile: true,
    othersUsername: null,
  },
  mutations: {
    signUpBtnClicked(state) {
      state.signUpBtnValue = true;
    },
    userData(state, dataArray) {
      state.currentUser = dataArray;
    },
    loadUserProfile(state, bool) {
      state.isUserProfile = bool;
      router.push('/profile');
    },
    featuredTweet(state, tweet) {
      state.featuredTweet = tweet
    },
    //if user is current user, go to profile
    //if user not current user, update state with clicked user data and go to profile
    clickedUsername(state, user) {
      if(user.userId == cookies.get('userId')) {
        if(window.location.hash == "#/profile") {
          //do nothing
        } else {
          state.flagState = !state.flagState
          router.push('/profile');
        }
      } else {
        state.otherUser = user;
        router.push(`/users/${user.username}`);
      }
    },
    usernameLink(state, username) {
      state.othersUsername = username
    },
    changeFlagState(state) {
      state.flagState = !state.flagState;
      console.log(state.flagState);
    } 
  },
  actions: {
    //gets user data of passed username and passes to mutation
    dataOfClickedName(state, username) {
      axios.request({
          url: process.env.VUE_APP_API_SITE+'/api/users',
          method: "GET",
          headers: {
              'X-Api-Key': process.env.VUE_APP_API_KEY,
              'Content-Type': 'application/json'
          }
      }).then((response) => {
          for(let i=0; i<response.data.length; i++) {
              if(response.data[i].username == username) {
                  return this.commit('clickedUsername', response.data[i])
              }
          }
      }).catch((error) => {
          console.log(error);
      })
  }
  },
  modules: {
  }
})
