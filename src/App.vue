<template>
  <NavBar />
  <router-view />
  <FooterView />
</template>

<script setup>
import './main.css'
import { onMounted } from 'vue'
import { auth, db } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/composables/piniaStores/userStore'
import NavBar from './components/NavBar.vue';
import FooterView from './components/FooterView.vue';

const userStore = useUserStore()

onMounted(() => {
  // Listen for Firebase auth state changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // If user is logged in, fetch user document from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      // Get role and profilePic from Firestore, fallback to 'user' and null
      const role = userDoc.exists() ? userDoc.data().role : 'user'
      const profilePic = userDoc.exists() ? userDoc.data().profilePic || null : null
      // Set user info in Pinia store
      userStore.setUser(user, role, profilePic)
    } else {
      // If no user, clear user info from Pinia store
      userStore.clearUser()
    }
  })
})
</script>
