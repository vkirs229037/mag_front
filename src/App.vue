<template>
  <div class="container">
    <header>
      <nav v-if="auth.isAuthenticated">
        <a href="/">Профиль</a>
        <a href="/files">Файлы</a>
        <a href="/search">Поиск</a>
        <a v-if="auth.isAdmin" href="/users">Пользователи</a>
        <a @click.prevent="handleLogout" href="#">Выйти</a>
      </nav>
      <nav v-else>
        <a href="/login">Вход</a>
        <a href="/register">Регистрация</a>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer class="text-center mt-2">
      <small>Микросервисы: {{ authStatus }} | {{ searchStatus }}</small>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authAPI, searchAPI } from '@/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const authStatus = ref('проверка...')
const searchStatus = ref('проверка...')

const checkHealth = async () => {
  try {
    await authAPI.healthcheck()
    authStatus.value = '✓ auth'
  } catch { authStatus.value = '✗ auth' }
  
  try {
    await searchAPI.healthcheck()
    searchStatus.value = '✓ search'
  } catch { searchStatus.value = '✗ search' }
}

const handleLogout = () => {
  auth.logout()
  router.replace('/login')
}

onMounted(() => {
  if (auth.token) auth.fetchUser()
  checkHealth()
})
</script>