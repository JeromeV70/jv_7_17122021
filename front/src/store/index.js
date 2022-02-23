import { createStore } from 'vuex'

export default createStore({
  state: {
    compte: {
      id:Number,
      nom:String,
      email:String,
      avatar:Boolean,
      admin:Boolean,
    },
    loader:false,
    token:String
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
