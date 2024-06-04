import './assets/base.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './firebase/firebaseConfig.ts'
import Toast, { POSITION } from "vue-toastification"
import type { PluginOptions } from "vue-toastification"
import "vue-toastification/dist/index.css"



const app = createApp(App)
const options: PluginOptions = {
    position: POSITION.BOTTOM_CENTER,
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
}

app.use(router)
app.use(createPinia())
app.use(Toast, options)
app.mount('#app')
