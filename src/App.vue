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
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const role = userDoc.exists() ? userDoc.data().role : 'user'
      const profilePic = userDoc.exists() ? userDoc.data().profilePic || null : null
      userStore.setUser(user, role, profilePic)
    } else {
      userStore.clearUser()
    }
  })
})
</script>
