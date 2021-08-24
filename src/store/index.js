import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    signUpBtnValue: false,
    currentUser: [],
    otherUser: [],
    featuredTweet: [],
    isUserProfile: true,
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
    } 
  },
  actions: {
  },
  modules: {
  }
})
