// Utilities
import { BaseService } from '@/store/module/base.service'
import { defineStore } from 'pinia'

// 進行 HTTP 請求
export const useUserStore =  defineStore("user", {
  state: () => ({
      users: [],
  }),
  getters: {
    getUsers(state){
      return state.users
    }
  },
  actions: {
    async fetchUsers() {
      try {
        const data = await BaseService.get('/users');
        this.users = data.data
        }
        catch (error) {
          alert(error)
          console.log(error)
      }
    }
  },
})
