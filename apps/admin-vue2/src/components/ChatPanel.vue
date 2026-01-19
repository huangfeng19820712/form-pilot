<template>
  <aside style="width:360px; border-left:1px solid #eee; padding:12px; display:flex; flex-direction:column;">
    <div style="font-weight:bold; margin-bottom:8px;">聊天模式（操作中间表单）</div>
    <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
      <label>表单：</label>
      <select v-model="currentFormId" style="flex:1; padding:4px;">
        <option v-for="fid in formIds" :key="fid" :value="fid">{{ fid }}</option>
      </select>
      <button @click="refreshForms">刷新</button>
    </div>
    <div style="flex:1; overflow:auto; border:1px solid #eee; padding:8px;">
      <div v-for="(m, idx) in messages" :key="idx" :style="{ margin: '6px 0', textAlign: m.role==='user' ? 'right' : 'left' }">
        <span :style="{ display:'inline-block', background: m.role==='user' ? '#d0ebff' : '#f1f3f5', padding:'6px 8px', borderRadius:'6px' }">{{ m.text }}</span>
      </div>
    </div>
    <div style="display:flex; gap:8px; margin-top:8px;">
      <input v-model="chatInput" placeholder="例如: set name=Alice / schema / validate / submit" style="flex:1; padding:6px;" />
      <button @click="onChatSend">发送</button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'ChatPanel',
  props: {
    client: { type: Object, required: true },
    formId: { type: String, required: false },
  },
  data() {
    return {
      chatInput: '',
      messages: [],
      formIds: [],
      currentFormId: '',
    }
  },
  methods: {
    refreshForms() {
      this.formIds = this.client.listFormIds()
      if (!this.currentFormId) this.currentFormId = this.formId || (this.formIds[0] || '')
    },
    mounted() {
      this.refreshForms()
    },
    parseAndDispatch(input) {
      const txt = String(input || '').trim()
      if (!txt) return
      this.messages.push({ role: 'user', text: txt })
      const lower = txt.toLowerCase()
      const fid = this.currentFormId || this.formId || ''
      if (!fid) {
        this.messages.push({ role: 'assistant', text: '未选择表单，请先选择表单' })
        return
      }
      if (lower === 'schema') {
        this.client.dispatch({ tool: 'getFormSchema', params: { formId: fid } }).then(res => this.messages.push({ role: 'tool', text: JSON.stringify(res) }))
        return
      }
      if (lower === 'validate') {
        this.client.dispatch({ tool: 'validateForm', params: { formId: fid } }).then(res => this.messages.push({ role: 'tool', text: JSON.stringify(res) }))
        return
      }
      if (lower === 'submit') {
        this.client.dispatch({ tool: 'submitForm', params: { formId: fid } }).then(res => this.messages.push({ role: 'tool', text: JSON.stringify(res) }))
        return
      }
      const m = /^set\s+(\w+)\s*=\s*(.+)$/.exec(txt)
      if (m) {
        const key = m[1]
        let val = m[2]
        if (/^\d+(\.\d+)?$/.test(val)) val = Number(val)
        if (val === 'true' || val === 'false') val = (val === 'true')
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        this.client.dispatch({ tool: 'setFormValues', params: { formId: fid, values: { [key]: val } } }).then(res => this.messages.push({ role: 'tool', text: JSON.stringify(res) }))
        return
      }
      this.messages.push({ role: 'assistant', text: '未识别指令：支持 schema / validate / submit / set key=value' })
    },
    onChatSend() {
      this.parseAndDispatch(this.chatInput)
      this.chatInput = ''
    },
  },
}
</script>