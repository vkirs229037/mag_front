<template>
  <div class="card">
    <h2>Управление пользователями</h2>
    <div v-if="error" class="error">{{ error }}</div>
    <table v-if="users.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Роль</th>
          <th>Создан</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.role === 2 ? 'Админ' : 'Пользователь' }}</td>
          <td>{{ new Date(u.created_at).toLocaleDateString() }}</td>
          <td>
            <button 
              v-if="u.id !== auth.user?.id"
              class="btn btn-danger" 
              @click="confirmDelete(u.id)"
            >
              Удалить
            </button>
            <span v-else>—</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else-if="!loading">Нет пользователей</p>
    <p v-if="loading">Загрузка...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const users = ref([])
const loading = ref(true)
const error = ref(null)

const load = async () => {
  const res = await auth.loadUsers()
  if (res.success) users.value = res.users
  else error.value = res.error
  loading.value = false
}

const confirmDelete = async (id) => {
  if (!confirm('Удалить пользователя?')) return
  const res = await auth.removeUser(id)
  if (res.success) load()
  else alert('Ошибка: ' + res.error)
}

onMounted(load)
</script>