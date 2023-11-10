// Utilities
import { BaseService } from '@/store/module/base.service'
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
        const data = await BaseService.get('/users').then(res => res);
        console.log(data)  
        //this.users = data.data

        }
        catch (error) {
          alert(error)
          console.log(error)
      }
    }
  },
})
