<template>
  <div class="card">
    <h2>Файлы логов</h2>
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="files.length">
      <div class="form-group">
        <label>Выберите файл:</label>
        <select v-model="selected" @change="loadFile">
          <option value="">-- Выберите --</option>
          <option v-for="f in files" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>
      
      <div v-if="fileContent">
        <div class="flex">
          <strong>{{ fileContent.path }}</strong>
          <small>({{ fileContent.size_bytes }} байт)</small>
        </div>
        <pre style="border:1px solid #000; padding:8px; margin:8px 0; background:#fff; overflow-x:auto;">
{{ fileContent.lines.join('\n') }}
        </pre>
      </div>
    </div>
    <p v-else-if="!loading">Нет доступных файлов</p>
    <p v-if="loading">Загрузка списка файлов...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { searchAPI } from '@/api'

const files = ref([])
const selected = ref('')
const fileContent = ref(null)
const loading = ref(true)
const error = ref(null)

const loadFiles = async () => {
  try {
    const res = await searchAPI.listFiles()
    files.value = res.data
  } catch (e) {
    error.value = 'Не удалось загрузить список файлов'
  } finally {
    loading.value = false
  }
}

const loadFile = async () => {
  if (!selected.value) return
  try {
    const res = await searchAPI.viewFile(selected.value, 50)
    fileContent.value = res.data
  } catch {
    error.value = 'Ошибка чтения файла'
  }
}

onMounted(loadFiles)
</script>