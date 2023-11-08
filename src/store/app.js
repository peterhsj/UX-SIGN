// Utilities
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', {
  state: () => ({
    //
  }),
})

export const useCountStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const increment = () => {
    count.value++
  }

  return {count, doubleCount, increment}
})

// 導入 axios 進行 HTTP 請求
import axios from "axios"
export const useUserStore = defineStore("user", {
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
        const data = await axios.get('https://jsonplaceholder.typicode.com/users')
          this.users = data.data
        }
        catch (error) {
          alert(error)
          console.log(error)
      }
    }
  },
})
