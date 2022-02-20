import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
//import VueResource from 'vue-resource'

const app = createApp(App)
app.use(router)
app.use(VueAxios, axios)
//app.use(VueResource)
app.mount('#app')
