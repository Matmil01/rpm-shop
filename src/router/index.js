import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import FullShop from "../views/FullShop.vue"
import SingleProduct from "../views/SingleRecord.vue"
import AdminView from "@/views/AdminUI/AdminView.vue"
import ContactView from "@/views/ContactView.vue"

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/shop", name: "shop", component: FullShop },
  { path: "/contact", name: "contact", component: ContactView },
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
        component: () => import("@/views/AdminUI/AddRecord.vue")
      },
      {
        path: "manage",
        name: "ManageProducts",
        component: () => import("@/views/AdminUI/ManageRecords.vue")
      }
    ]
  },
  {
    path: "/user",
    children: [
      {
        path: "wishlist",
        name: "WishList",
        component: () => import("@/views/UserUI/WishList.vue")
      },
      {
        path: "cart",
        name: "CartView",
        component: () => import("@/views/UserUI/CartView.vue")
      },
      {
        path: "checkout",
        name: "CheckoutView",
        component: () => import("@/views/UserUI/CheckoutView.vue")
      }
    ]
  },
  { path: "/404", name: "ThankYou", component: () => import("@/views/UserUI/ThankYouView.vue") }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
