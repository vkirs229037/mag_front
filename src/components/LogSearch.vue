<template>
  <div class="card">
    <h2>Нечёткий поиск в логах</h2>
    
    <form @submit.prevent="doSearch" class="flex">
      <div class="form-group" style="flex:1">
        <label>Запрос</label>
        <input v-model="query" type="text" required placeholder="Введите текст для поиска" />
      </div>
      <div class="form-group">
        <label>Точность (%)</label>
        <select v-model.number="fuzziness">
          <option :value="70">70</option>
          <option :value="80">80</option>
          <option :value="90" selected>90</option>
          <option :value="100">100</option>
        </select>
      </div>
      <div class="form-group">
        <label>На страницу</label>
        <select v-model.number="size">
          <option :value="10">10</option>
          <option :value="25" selected>25</option>
          <option :value="50">50</option>
        </select>
      </div>
      <button type="submit" class="btn" style="margin-top:22px" :disabled="searching">
        {{ searching ? 'Поиск...' : 'Найти' }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="results.length">
      <div class="flex" style="margin:12px 0">
        <strong>Найдено: {{ total }}</strong>
        <span> | Страница {{ page }} из {{ Math.ceil(total/size) || 1 }}</span>
        <button class="btn" :disabled="page<=1" @click="changePage(page-1)">← Назад</button>
        <button class="btn" :disabled="page*size>=total" @click="changePage(page+1)">Вперёд →</button>
      </div>
      
      <div v-for="(r, i) in results" :key="i" class="search-result">
        <div><strong>Файл:</strong> {{ r.file }}</div>
        <div style="margin:4px 0">{{ r.line }}</div>
        <div class="score">Совпадение: {{ r.score }}%</div>
      </div>
      
      <div class="text-center mt-2">
        <small>Время выполнения: {{ metadata?.execution_time_sec }} с</small>
      </div>
    </div>
    
    <p v-if="searched && !results.length && !error">Ничего не найдено</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchAPI } from '@/api'

const query = ref('')
const fuzziness = ref(90)
const size = ref(25)
const page = ref(1)
const results = ref([])
const total = ref(0)
const metadata = ref(null)
const searching = ref(false)
const searched = ref(false)
const error = ref(null)

const doSearch = async () => {
  searching.value = true
  error.value = null
  searched.value = true
  
  try {
    const res = await searchAPI.search(query.value, {
      fuzziness: fuzziness.value,
      page: page.value,
      size: size.value
    })
    results.value = res.data.results
    total.value = res.data.metadata.total_count
    metadata.value = res.data.metadata
  } catch (e) {
    error.value = e.response?.data?.description || 'Ошибка поиска'
  } finally {
    searching.value = false
  }
}

const changePage = (newPage) => {
  if (newPage < 1) return
  page.value = newPage
  doSearch()
}
</script>