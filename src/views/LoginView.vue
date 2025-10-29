<template>
  <div class="container mx-auto px-4 flex flex-col items-center justify-center min-h-[400px] font-main">
    <form @submit.prevent="login" class="bg-MyBlack/80 p-8 rounded shadow-lg w-full max-w-md font-main">
      <h2 class="text-2xl font-bold mb-6 text-MyYellow font-headline">Login</h2>
      <input v-model="username" placeholder="Username"
        class="mb-4 w-full p-2 rounded bg-gray-900 text-MyYellow shadow shadow-MyYellow font-main" />
      <input v-model="password" type="password" placeholder="Password"
        class="mb-4 w-full p-2 rounded bg-gray-900 text-MyYellow shadow shadow-MyYellow font-main" />
      <SimpleButton type="submit" class="w-full mt-2 flex items-center justify-center" :disabled="loading">
        <span v-if="!loading">Login</span>
        <svg v-else class="animate-spin h-5 w-5 text-MyYellow" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </SimpleButton>
      <div v-if="error" class="text-MyRed mt-2 font-main">{{ error }}</div>
      <div v-if="success" class="text-MyGreen mt-2 font-main">{{ success }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/composables/piniaStores/userStore'
import SimpleButton from '@/components/buttons/SimpleButton.vue'

// Username input field
const username = ref('')
// Password input field
const password = ref('')
// Error message for login failures
const error = ref('')
// Success message for login
const success = ref('')
// Loading state for login process
const loading = ref(false)
// Router instance for navigation
const router = useRouter()
// Access user store for setting user info
const userStore = useUserStore()

// Handles login form submission
async function login() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    // Construct email from username for Firebase Auth
    const email = `${username.value}@rpmshop.local`
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password.value)
    const user = userCredential.user
    // Fetch user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    // Get role and username from Firestore, fallback to defaults
    const role = userDoc.exists() ? userDoc.data().role : 'user'
    const usernameFromDoc = userDoc.exists() ? userDoc.data().username : user.email.split('@')[0]
    // Set user info in Pinia store
    userStore.setUser(user, role, null, usernameFromDoc)
    success.value = `Hello, ${usernameFromDoc}!`
    setTimeout(() => {
      loading.value = false
      // Redirect based on role
      if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }, 700)
  } catch (err) {
    loading.value = false
    error.value = 'Wrong username or password.'
  }
}
</script>
