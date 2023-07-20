// register vue composition api globally
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import { Dialog, Notify, Quasar } from 'quasar'
import { createPinia } from 'pinia'
import App from './App.vue'

import './styles/main.css'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes,
})
app.use(router)
app.use(createPinia())
app.use(Quasar, {
  plugins: { Dialog, Notify },

})
app.mount('#app')
