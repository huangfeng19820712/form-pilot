<template>
  <div style="display:flex; gap:12px; flex-direction:column; max-width:540px;">
    <label>
      Name
      <input v-model="formObj.name" placeholder="Name" />
    </label>
    <label>
      Email
      <input v-model="formObj.email" placeholder="Email" />
    </label>
    <label>
      Role
      <select v-model="formObj.role">
        <option value="">Select role</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="auditor">Auditor</option>
      </select>
    </label>
    <label>
      Date of Birth
      <input type="date" v-model="formObj.dob" />
    </label>
    <label>
      Upload Files
      <input type="file" multiple @change="onFilesChange" />
    </label>
    <label>
      Volume
      <input type="range" min="0" max="100" step="1" v-model.number="formObj.volume" />
    </label>
    <label>
      Rating (1-5)
      <input type="number" min="1" max="5" step="1" v-model.number="formObj.rating" />
    </label>
    <label>
      Favorite Color
      <input type="color" v-model="formObj.color" />
    </label>
    <div>
      <div>Tags (Transfer)</div>
      <div style="display:flex; gap:8px;">
        <select multiple size="4" v-model="srcSel">
          <option v-for="t in sourceTags" :key="t" :value="t">{{ t }}</option>
        </select>
        <div style="display:flex; flex-direction:column; gap:4px; align-items:center; justify-content:center;">
          <button @click="moveToTarget"> &gt; </button>
          <button @click="moveToSource"> &lt; </button>
        </div>
        <select multiple size="4" v-model="tgtSel">
          <option v-for="t in formObj.tags" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </div>
    <div>
      <div>Interests (Checkbox Group)</div>
      <label><input type="checkbox" value="music" v-model="formObj.interests" /> Music</label>
      <label><input type="checkbox" value="sports" v-model="formObj.interests" /> Sports</label>
      <label><input type="checkbox" value="tech" v-model="formObj.interests" /> Tech</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ formObj: { name: string; email: string; role: string; dob: string; files: Array<{ name: string; size: number }>; volume: number; rating: number; color: string; tags: string[]; interests: string[] } }>()

const allTags = ['alpha', 'beta', 'gamma', 'delta']
const srcSel = ref<string[]>([])
const tgtSel = ref<string[]>([])
const sourceTags = computed(() => allTags.filter(t => !props.formObj.tags.includes(t)))

function onFilesChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  const list: Array<{ name: string; size: number }> = []
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const f = files.item(i)
      if (f) list.push({ name: f.name, size: f.size })
    }
  }
  props.formObj.files = list
}

function moveToTarget() {
  const set = new Set(props.formObj.tags)
  srcSel.value.forEach(t => set.add(t))
  props.formObj.tags = Array.from(set)
  srcSel.value = []
}
function moveToSource() {
  const remaining = props.formObj.tags.filter(t => !tgtSel.value.includes(t))
  props.formObj.tags = remaining
  tgtSel.value = []
}
</script>

<style scoped>
input { padding: 6px; }
button { padding: 6px 10px; }
</style>