import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    profile: {},
    songUrl: '',
    songLrc: ''
  },
  getters: {
    getProfile: state => state.profile,
    getSongUrl: state => state.songUrl,
    getSongLrc: state => state.songLrc
  },
  mutations: {
    setProfile(state, profile) {
      state.profile = profile;
    },
    setSongUrl(state, songUrl) {
      state.songUrl = songUrl;
    },
    setSongLrc(state, songLrc) {
      state.songLrc = songLrc;
    }
  },
  actions: {
    updateProfile({ commit }, profile) {
      commit('setProfile', profile);
    },
    updateSongUrl({ commit }, songUrl) {
      commit('setSongUrl', songUrl);
    },
    updateSongLrc({ commit }, songLrc) {
      commit('setSongLrc', songLrc);
    }
  },
  modules: {
  }
})
