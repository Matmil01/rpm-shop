<template>
  <div class="max-w-lg mx-auto mt-10 p-8 font-main">
    <h2 class="text-2xl font-headline mb-6 text-MyWhite">Edit Profile</h2>

    <h3 class="text-xl font-bold mb-2 text-MyWhite text-left">Profile Picture</h3>
    <div class="mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow flex flex-col items-center">
      <img
        src="/avatars/userDefault.svg"
        alt="Profile Picture"
        class="w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600 mb-2"
      />
    </div>

    <h3 class="text-xl font-bold mb-2 text-MyWhite text-left">Account</h3>
    <div class="mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow text-center">
      <div class="mb-2 text-MyYellow"><strong>Username:</strong> {{ userStore.username }}</div>
      <div class="text-MyYellow"><strong>Email:</strong> {{ userStore.email }}</div>
    </div>

    <h3 class="text-xl font-bold mb-2 text-MyWhite text-left">Costumer Info</h3>
    <div class="w-full max-w-xs mx-auto mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow">
      <label class="block mb-1 text-MyYellow">Name</label>
      <input v-model="name" class="w-full p-2 rounded-full bg-MyBlack text-MyWhite border border-MyYellow mb-4" />

      <label class="block mb-1 text-MyYellow">Address</label>
      <input v-model="address" class="w-full p-2 rounded-full bg-MyBlack text-MyWhite border border-MyYellow mb-4" />

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
import { db } from '@/firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/composables/piniaStores/userStore'
import SimpleButton from '@/components/buttons/SimpleButton.vue'

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
