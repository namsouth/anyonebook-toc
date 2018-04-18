import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
import './mock' // simulation data

import * as filters from './filters' // global filters

import Viewer from 'v-viewer'
Vue.use(Viewer)

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
var config = {
  apiKey: 'AIzaSyDO92j4Z1wnBuK3E1-Y12hs1jt8f25SqcI',
  authDomain: 'development-170710.firebaseapp.com',
  databaseURL: 'https://development-170710.firebaseio.com',
  projectId: 'development-170710',
  storageBucket: 'development-170710.appspot.com',
  messagingSenderId: '885393204029'
}
Vue.use(VueFire)
firebase.initializeApp(config)
export const db = firebase.firestore()
export const timestamp = firebase.firestore.FieldValue.serverTimestamp()
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
