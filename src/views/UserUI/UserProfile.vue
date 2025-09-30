<template>
  <div class="max-w-lg mx-auto mt-10 p-8 font-main">
    <h2 class="text-2xl font-headline mb-6 text-MyWhite">Edit Profile</h2>
    <div class="flex flex-col items-center mb-6">
      <img
        src="/avatars/userDefault.svg"
        alt="Profile Picture"
        class="w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600 mb-2"
      />
    </div>
    <div class="text-center text-MyYellow">
      <div class="mb-2"><strong>Username:</strong> {{ userStore.username }}</div>
      <div><strong>Email:</strong> {{ userStore.email }}</div>
    </div>
    <div class="w-full max-w-xs mx-auto">
      <label class="block mb-1 text-MyYellow">Name</label>
      <input v-model="name" class="w-full p-2 rounded-full bg-MyBlack text-MyYellow border border-MyYellow mb-4" />

      <label class="block mb-1 text-MyYellow">Address</label>
      <input v-model="address" class="w-full p-2 rounded-full bg-MyBlack text-MyYellow border border-MyYellow mb-4" />

      <SimpleButton
        :onClick="saveProfile"
      >
        Save Profile
      </SimpleButton>
      <div v-if="success" class="text-MyGreen mt-2 font-main">{{ success }}</div>
      <div v-if="error" class="text-MyRed mt-2 font-main">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { db } from '@/firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import SimpleButton from '@/components/SimpleButton.vue'
const userStore = useUserStore()
const name = ref('')
const address = ref('')
const success = ref('')
const error = ref('')

async function loadProfile() {
  if (!userStore.uid) return
  const userDoc = await getDoc(doc(db, 'users', userStore.uid))
  if (userDoc.exists()) {
    name.value = userDoc.data().name || ''
    address.value = userDoc.data().address || ''
  }
}
loadProfile()

async function saveProfile() {
  if (!userStore.uid) return
  try {
    await updateDoc(doc(db, 'users', userStore.uid), {
      name: name.value,
      address: address.value
    })
    success.value = 'Profile updated!'
    error.value = ''
  } catch (error) {
    error.value = 'Failed to save profile.'
    success.value = ''
  }
}
</script>
