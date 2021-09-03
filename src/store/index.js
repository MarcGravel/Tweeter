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
    followsPageFlag: true,
    followsPageUserId: 0,
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
    },

    followLinkClick(state, infoArray) {
      state.followsPageUserId = infoArray[1];
      if(infoArray[0] == "Followers") {
        state.followsPageFlag = false;
        router.push('/follows')
      } else {
        state.followsPageFlag = true;
        router.push('/follows')
      }
    },

    followsPageBtns(state, boolVal) {
      state.followsPageFlag = boolVal;
    },
  },
  actions: {
    // /users GET - user data
    getUserInfo(state, userId) {
      axios.request({
        url: process.env.VUE_APP_API_SITE+'/api/users',
        method: "GET",
        headers: {
            'X-Api-Key': process.env.VUE_APP_API_KEY,
            'Content-Type': 'application/json'
        },
        params: {
            userId: userId
        }
    }).then((response) => {
      return this.commit('userData', response.data[0])
    }).catch((error) => {
        console.log(error);
    })
    },

    //users GET - all Users

    //user DELETE - user data
    deleteUser(state, pass) {
      axios.request({
        url: process.env.VUE_APP_API_SITE +'/api/users',
        method: "DELETE",
        headers: {
            'X-Api-Key': process.env.VUE_APP_API_KEY,
            'Content-Type': 'application/json'
        },
        data: {
            "loginToken": cookies.get('loginToken'),
            "password": pass
        }
    }).then(() => {
        cookies.remove('loginToken');
        cookies.remove('userId');
        router.push('/');
    }).catch((error) => {
        console.log(error);
    })
    },
    //LogsOut if logout button is clicked
    logout(state, itemTitle) {
      if (itemTitle == "Log Out") {

        axios.request({
            url: process.env.VUE_APP_API_SITE+'/api/login',
            method: 'DELETE',
            headers: {
                'X-Api-Key': process.env.VUE_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            data: {
                'loginToken': cookies.get('loginToken')
            }
        }).then(() => {
            cookies.remove('loginToken');
            cookies.remove('userId');
        }).catch((error) => {
            console.log(error + ' error');
        })

        router.push('/')
      }
    },

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
    },
  },
  modules: {
  }
})
