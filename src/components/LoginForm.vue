<template>
  <div class="card">
    <h2>Вход</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div class="form-group">
        <label>Пароль</label>
        <input v-model="password" type="password" required />
      </div>
      <div v-if="auth.error" class="error">{{ auth.error }}</div>
      <button type="submit" class="btn" :disabled="loading">
        {{ loading ? 'Вход...' : 'Войти' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  const res = await auth.login(email.value, password.value)
  loading.value = false
  if (res.success) router.push('/')
}
</script>