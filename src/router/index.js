import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import FullShop from "../views/FullShop.vue"
import SingleRecord from "../views/SingleRecord.vue"
import AdminNav from "@/views/AdminUI/AdminNav.vue"
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import OrderHistory from '@/views/UserUI/OrderHistory.vue'

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/shop", name: "shop", component: FullShop },
  { path: "/record/:id", name: "record", component: SingleRecord, props: true },

  {
    path: '/user/orders/:orderNumber',
    name: 'UserOrderDetails',
    component: () => import('@/views/UserUI/OrderDetails.vue'),
    meta: { requiresAuth: true }
  },

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
      },
      {
        path: "orders",
        name: "OrderHistory",
        component: OrderHistory,
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
  history: createWebHistory(), // Use HTML5 history mode for clean URLs
  routes                        // Array of route definitions
})

let isAuthResolved = false      // Tracks if auth state has been checked
function waitForAuth() {
  return new Promise(resolve => {
    // If already resolved and user is present, resolve immediately
    if (isAuthResolved && auth.currentUser !== null) {
      resolve(auth.currentUser)
    } else {
      // Otherwise, wait for Firebase auth state change
      const unsubscribe = onAuthStateChanged(auth, user => {
        isAuthResolved = true
        unsubscribe() // Stop listening after first result
        resolve(user) // Resolve with user object (or null)
      })
    }
  })
}

router.beforeEach(async (to, from, next) => {
  const user = await waitForAuth() // Wait for auth state before routing
  // If route requires authentication and user is not logged in, redirect to login
  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    return next({ name: "Login" })
  }
  // If route requires admin, check user role in Firestore
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!user) return next({ name: "Login" })
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (!userDoc.exists() || userDoc.data().role !== 'admin') return next({ name: "home" })
  }
  // If route requires unauthenticated user and user is logged in, redirect to home
  if (to.matched.some(record => record.meta.requiresUnauth) && user) {
    return next({ name: "home" })
  }
  next() // Otherwise, proceed to route
})

export default router
