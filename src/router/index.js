import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import FullShop from "../views/FullShop.vue"
import SingleProduct from "../views/SingleProduct.vue"
import AdminView from "@/views/AdminUI/AdminView.vue"

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/shop", name: "shop", component: FullShop },
  { path: "/product/:id", name: "product", component: SingleProduct, props: true },
  {
    path: "/admin",
    component: AdminView,
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: () => import("@/views/AdminUI/AdminDashboard.vue")
      },
      {
        path: "add",
        name: "AddProduct",
        component: () => import("@/views/AdminUI/AddProduct.vue")
      },
      {
        path: "manage",
        name: "ManageProducts",
        component: () => import("@/views/AdminUI/ManageProducts.vue")
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
