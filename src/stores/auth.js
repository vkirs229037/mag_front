import { defineStore } from 'pinia'
import { authAPI } from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('access_token'),
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => {
      if (state.user) {
        return state.user.role === 2
      }
      return !!state.token
    }
  },

  actions: {
    async login(email, password) {
      try {
        const res = await authAPI.login(email, password)
        this.token = res.data.access_token
        this.error = null
        localStorage.setItem('access_token', this.token)
        await this.fetchUser()
        return { success: true }
      } catch (e) {
        this.error = e.response?.data?.message || 'Ошибка входа'
        return { success: false, error: this.error }
      }
    },

    async register(email, password) {
      try {
        await authAPI.register(email, password)
        this.error = null
        return { success: true }
      } catch (e) {
        this.error = e.response?.data?.message || 'Ошибка регистрации'
        return { success: false, error: this.error }
      }
    },

    async fetchUser() {
      try {
        const res = await authAPI.getMe()
        this.user = res.data
        return { success: true }
      } catch (e) {
        this.logout()
        return { success: false }
      }
    },

    async loadUsers() {
      try {
        const res = await authAPI.listUsers()
        return { success: true, users: res.data.users }
      } catch (e) {
        return { success: false, error: e.response?.data?.message }
      }
    },

    async removeUser(userId) {
      try {
        await authAPI.deleteUser(userId)
        return { success: true }
      } catch (e) {
        return { success: false, error: e.response?.data?.message }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      localStorage.removeItem('access_token')
    }
  }
})