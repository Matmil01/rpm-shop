import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FullShop from '../views/FullShop.vue'
import SingleProduct from '../views/SingleProduct.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/shop', name: 'shop', component: FullShop },
  { path: '/product/:id', name: 'product', component: SingleProduct, props: true },
  {
    path: "/admin",
    name: "AdminView",
    component: () => import("@/views/AdminUI/AdminView.vue"),
    meta: { requiresAuth: true, adminOnly: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
