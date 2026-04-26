<template>
  <div class="card">
    <h2>Профиль</h2>
    <div v-if="auth.user">
      <p><strong>ID:</strong> {{ auth.user.id }}</p>
      <p><strong>Email:</strong> {{ auth.user.email }}</p>
      <p><strong>Роль:</strong> {{ auth.user.role === 2 ? 'Администратор' : 'Пользователь' }}</p>
      <p><strong>Создан:</strong> {{ new Date(auth.user.created_at).toLocaleString() }}</p>
    </div>
    <div v-else>Загрузка...</div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>