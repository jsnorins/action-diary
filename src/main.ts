import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { getEnvironmentType } from './environment'

createApp(App).mount('#app')

console.warn(`The app is running in ${getEnvironmentType()} environment'`)