<template>
  <div style="height:100vh; display:flex; flex-direction:column; font-family: sans-serif;">
    <header style="padding:10px 16px; border-bottom: 1px solid #eee; display:flex; align-items:center; justify-content:space-between;">
      <h2 style="margin:0;">Admin Vue2 Demo</h2>
      <div>FormPilot Demo</div>
    </header>
    <div style="flex:1; display:flex;">
      <aside style="width:220px; border-right:1px solid #eee; padding:12px;">
        <div style="font-weight:bold; margin-bottom:8px;">菜单</div>
        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px;">
          <li><a href="#">用户管理</a></li>
          <li><a href="#">角色管理</a></li>
          <li><a href="#">表单配置</a></li>
        </ul>
      </aside>
      <main style="flex:1; padding:16px; overflow:auto;">
        <FormPanel :formObj="formObj" />
      </main>
      <ChatPanel :client="client" formId="userCreate" />
    </div>
  </div>
</template>

<script>
import { useAiForm } from '@fhuang/form-pilot-vue'
import { MCPClient } from '@fhuang/form-pilot-mcp-client'
import FormPanel from './components/FormPanel.vue'
import ChatPanel from './components/ChatPanel.vue'

export default {
  name: 'App',
  components: { FormPanel, ChatPanel },
  data() {
    return {
      formObj: { name: '', email: '', role: '', dob: '', files: [], volume: 0, rating: 0, color: '#000000', tags: [], interests: [] },
      output: '',
    }
  },
  created() {
    this.handle = useAiForm(this.formObj, { id: 'userCreate' })
    this.client = new MCPClient({
      actor: 'demo-bot',
      guards: { userCreate: { allowedFields: ['name', 'email', 'role', 'dob', 'files', 'volume', 'rating', 'color', 'tags', 'interests'] } },
      clientGuard: { submitRequiresConfirm: true, confirm: async (id) => window.confirm(`提交 ${id}?`) },
      onAudit: (entry) => console.log('AUDIT', entry),
    })
    this.client.registerForm('userCreate', () => this.handle)
  },
  methods: {
    async onSubmit() {
      const res = await this.client.dispatch({ tool: 'submitForm', params: { formId: 'userCreate' } })
      this.output = JSON.stringify(res, null, 2)
    },
  }
}
</script>

<style>
input { padding: 6px; }
button { padding: 6px 10px; }
pre { background: #f5f5f5; padding: 10px; }
</style>