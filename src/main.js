import { createApp } from 'vue'
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// eslint-disable-next-line import/no-extraneous-dependencies
import { library } from '@fortawesome/fontawesome-svg-core'
// eslint-disable-next-line import/no-extraneous-dependencies
import { fas } from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'
import './assets/tailwind.css'

library.add(fas)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
