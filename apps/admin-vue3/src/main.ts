import { createApp, ref } from 'vue'
import App from './App.vue'
import { FormPilotPlugin } from '@fhuang/form-pilot-vue'
import PlainAdapter from '@fhuang/form-pilot-adapter-plain'

const app = createApp(App)
app.use(FormPilotPlugin, { adapters: [PlainAdapter] })
app.mount('#app')