import Vue from 'vue'
import App from './App.vue'
import { FormPilotPlugin } from '@form-pilot/vue'
import PlainAdapter from '@form-pilot/adapter-plain'

Vue.config.productionTip = false
Vue.use(FormPilotPlugin, { adapters: [PlainAdapter] })

new Vue({ render: h => h(App) }).$mount('#app')