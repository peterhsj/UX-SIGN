// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Contract',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Contract.vue'),
      },
      {
        path: '/History',
        name: 'History',
        component: () => import('@/views/History.vue')
      },
      {
        path: '/UserProfile',
        name: 'UserProfile',
        component: () => import('@/views/UserProfile.vue')
      },
      {
        path: '/CompanyProfile',
        name: 'CompanyProfile',
        component: () => import('@/views/CompanyProfile.vue')
      },
      {
        path: '/Seal',
        name: 'Seal',
        component: () => import('@/views/Seal.vue')
      },
      {
        path: '/Logout',
        name: 'Logout',
        component: () => import('@/views/Logout.vue')
      }, {
        path: '/Sample',
        name: 'Sample',
        component: () => import('@/views/Sample.vue')
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
