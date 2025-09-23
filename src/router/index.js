import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import FullShop from "../views/FullShop.vue"
import SingleRecord from "../views/SingleRecord.vue"
import AdminView from "@/views/AdminUI/AdminView.vue"
import ContactView from "@/views/ContactView.vue"
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/shop", name: "shop", component: FullShop },
  { path: "/contact", name: "contact", component: ContactView },
  { path: "/record/:id", name: "record", component: SingleRecord, props: true },
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
        name: "AddRecord",
        component: () => import("@/views/AdminUI/AddRecord.vue")
      },
      {
        path: "manage",
        name: "ManageRecords",
        component: () => import("@/views/AdminUI/ManageRecords.vue")
      },
      {
        path: "profile",
        name: "AdminProfile",
        component: () => import("@/views/UserUI/UserProfile.vue")
      },
      {
        path: "users",
        name: "ManageUsers",
        component: () => import("@/views/AdminUI/ManageUsers.vue")
      },
      {
        path: '/admin/wishlist',
        name: 'AdminWishlist',
        component: () => import('@/views/UserUI/WishList.vue')
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
        component: () => import("@/views/UserUI/CheckOutView.vue")
      },
      {
        path: "profile",
        name: "UserProfile",
        component: () => import("@/views/UserUI/UserProfile.vue")
      }
    ]
  },
  { path: "/thankyou", name: "ThankYou", component: () => import("@/views/UserUI/ThankYouView.vue") },
  { path: "/login", name: "Login", component: () => import("@/views/LoginView.vue") }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let isAuthResolved = false

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

router.beforeEach(async (to, from, next) => {
  const user = await waitForAuth()
  if (to.path.startsWith('/admin')) {
    if (!user) return next('/login')
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (!userDoc.exists() || userDoc.data().role !== 'admin') return next('/')
  }
  if (to.path.startsWith('/user')) {
    if (!user) return next('/login')
  }
  next()
})

export default router
