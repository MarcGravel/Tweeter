import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    signUpBtnValue: false,
    currentUser: {
      email: '',
      username: '',
      userId: '',
      birthdate: '',
      bio: '',
      bannerUrl: '',
      imageUrl: ''
    }
  },
  mutations: {
    signUpBtnClicked(state) {
      state.signUpBtnValue = true;
    },
    userData(state, dataArray) {
      state.currentUser.email = dataArray.email;
      state.currentUser.username = dataArray.username;
      state.currentUser.userId = dataArray.userId;
      state.currentUser.birthdate = dataArray.birthdate;
      state.currentUser.bio = dataArray.bio;
      state.currentUser.bannerUrl = dataArray.bannerUrl;
      state.currentUser.imageUrl - dataArray.imageUrl;
      console.log(state.currentUser);
    }
  },
  actions: {
  },
  modules: {
  }
})
