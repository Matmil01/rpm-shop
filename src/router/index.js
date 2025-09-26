import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import FullShop from "../views/FullShop.vue"
import SingleRecord from "../views/SingleRecord.vue"
import AdminNav from "@/views/AdminUI/AdminNav.vue"
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/shop", name: "shop", component: FullShop },
  { path: "/record/:id", name: "record", component: SingleRecord, props: true },
  {
    path: "/admin",
    component: AdminNav,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "",
        name: "ProcessOrders",
        component: () => import("@/views/AdminUI/ProcessOrders.vue"),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: "add",
        name: "AddRecord",
        component: () => import("@/views/AdminUI/AddRecord.vue"),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: "manage",
        name: "ManageRecords",
        component: () => import("@/views/AdminUI/ManageRecords.vue"),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: "profile",
        name: "AdminProfile",
        component: () => import("@/views/UserUI/UserProfile.vue"),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: "users",
        name: "ManageUsers",
        component: () => import("@/views/AdminUI/ManageUsers.vue"),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: "wishlist",
        name: "AdminWishlist",
        component: () => import('@/views/UserUI/WishList.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
  },
  {
    path: "/user",
    meta: { requiresAuth: true },
    children: [
      {
        path: "wishlist",
        name: "WishList",
        component: () => import("@/views/UserUI/WishList.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "cart",
        name: "CartView",
        component: () => import("@/views/UserUI/CartView.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "checkout",
        name: "CheckoutView",
        component: () => import("@/views/UserUI/CheckOutView.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "profile",
        name: "UserProfile",
        component: () => import("@/views/UserUI/UserProfile.vue"),
        meta: { requiresAuth: true }
      }
    ]
  },
  { path: "/thankyou",
    name: "ThankYou",
    component: () => import("@/views/UserUI/ThankYouView.vue") },
  { path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: { requiresUnauth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let isAuthResolved = false
// helper that makes sure route guard only runs after Auth has finished loading the user.
function waitForAuth() {
  return new Promise(resolve => {
    if (isAuthResolved && auth.currentUser !== null) {
      resolve(auth.currentUser)
    } else {
      const unsubscribe = onAuthStateChanged(auth, user => {
        isAuthResolved = true
        unsubscribe()
        resolve(user)
      })
    }
  })
}

// Navigation Guard using meta fields
router.beforeEach(async (to, from, next) => {
  const user = await waitForAuth()
  // If route requires authentication and user is not logged in
  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    return next({ name: "Login" })
  }
  // If route requires admin and user is not admin
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!user) return next({ name: "Login" })
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (!userDoc.exists() || userDoc.data().role !== 'admin') return next({ name: "home" })
  }
  // If route requires unauthenticated user and user is logged in
  if (to.matched.some(record => record.meta.requiresUnauth) && user) {
    return next({ name: "home" })
  }
  next()
})

export default router
