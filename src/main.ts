import './assets/base.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './firebase/firebaseConfig.ts'



const app = createApp(App)

app.use(router)
app.use(createPinia())
app.mount('#app')
