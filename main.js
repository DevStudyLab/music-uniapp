import App from './App'

import {
	myGlobalFunction
} from '@/utils/myFunction.js'

Vue.prototype.$myGlobalFunction = myGlobalFunction;

import MusicBackground from './components/music-background/music-background.vue'
Vue.component('music-background', MusicBackground);

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif