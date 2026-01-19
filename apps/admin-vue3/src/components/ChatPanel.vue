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

<script setup lang="ts">
import { ref } from 'vue'
import type { MCPClient } from '@fhuang/form-pilot-mcp-client'

const props = defineProps<{ client: MCPClient; formId?: string }>()

const chatInput = ref('')
const messages = ref<Array<{ role: 'user' | 'assistant' | 'tool'; text: string }>>([])
const formIds = ref<string[]>([])
const currentFormId = ref<string>('')

function refreshForms() {
  formIds.value = props.client.listFormIds()
  if (!currentFormId.value) currentFormId.value = props.formId || formIds.value[0] || ''
}
refreshForms()

function parseAndDispatch(input: string) {
  const txt = input.trim()
  if (!txt) return
  messages.value.push({ role: 'user', text: txt })
  const lower = txt.toLowerCase()
  const fid = currentFormId.value || props.formId || ''
  if (!fid) {
    messages.value.push({ role: 'assistant', text: '未选择表单，请先选择表单' })
    return
  }
  if (lower === 'schema') {
    props.client.dispatch({ tool: 'getFormSchema', params: { formId: fid } }).then(res => messages.value.push({ role: 'tool', text: JSON.stringify(res) }))
    return
  }
  if (lower === 'validate') {
    props.client.dispatch({ tool: 'validateForm', params: { formId: fid } }).then(res => messages.value.push({ role: 'tool', text: JSON.stringify(res) }))
    return
  }
  if (lower === 'submit') {
    props.client.dispatch({ tool: 'submitForm', params: { formId: fid } }).then(res => messages.value.push({ role: 'tool', text: JSON.stringify(res) }))
    return
  }
  const m = /^set\s+(\w+)\s*=\s*(.+)$/.exec(txt)
  if (m) {
    const key = m[1]
    let val: any = m[2]
    if (/^\d+(\.\d+)?$/.test(val)) val = Number(val)
    if (val === 'true' || val === 'false') val = val === 'true'
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    props.client.dispatch({ tool: 'setFormValues', params: { formId: fid, values: { [key]: val } } }).then(res => messages.value.push({ role: 'tool', text: JSON.stringify(res) }))
    return
  }
  messages.value.push({ role: 'assistant', text: '未识别指令：支持 schema / validate / submit / set key=value' })
}

function onChatSend() {
  parseAndDispatch(chatInput.value)
  chatInput.value = ''
}
</script>