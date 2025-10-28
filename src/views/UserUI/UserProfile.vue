<template>
  <div class="max-w-lg mx-auto mt-10 p-8 font-main">
    <div class="w-full max-w-xs mx-auto">
      <h2 class="text-2xl font-headline mb-6 text-MyWhite">Edit Profile</h2>
    </div>

    <!-- Profile Picture Section -->
    <div class="w-full max-w-xs mx-auto">
      <h3 class="text-xl font-bold mb-2 text-MyWhite text-left">Profile Picture</h3>
      <div class="mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow flex flex-col items-center gap-3">
        <img
          :src="previewUrl || profilePicSrc"
          alt="Profile Picture"
          class="w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600 object-cover"
          @error="onProfilePicError"
        />

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

        <div class="flex gap-3">
          <SimpleButton @click="chooseFile">Choose Picture</SimpleButton>
          <SimpleButton @click="uploadProfilePic" :disabled="!selectedFile || uploading">
            {{ uploading ? 'Uploading...' : 'Upload' }}
          </SimpleButton>
        </div>

        <div v-if="selectedFile" class="text-MyYellow text-sm">
          {{ selectedFile.name }}
        </div>
      </div>
    </div>

    <!-- Account Section -->
    <div class="w-full max-w-xs mx-auto">
      <h3 class="text-xl font-bold mb-2 text-MyWhite text-left">Account</h3>
      <div class="mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow text-center">
        <div class="mb-2 text-MyYellow"><strong>Username:</strong> {{ userStore.username }}</div>
        <div class="text-MyYellow"><strong>Email:</strong> {{ userStore.email }}</div>
      </div>
    </div>

    <!-- Customer Info Section -->
    <div class="w-full max-w-xs mx-auto">
      <h3 class="text-xl font-bold mb-2 text-MyWhite text-left">Customer Info</h3>
      <div class="mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow">
        <label class="block mb-1 text-MyYellow">Name</label>
        <input v-model="name" class="w-full p-2 rounded-full bg-MyBlack text-MyWhite border border-MyYellow mb-4" />

        <label class="block mb-1 text-MyYellow">Address</label>
        <input v-model="address" class="w-full p-2 rounded-full bg-MyBlack text-MyWhite border border-MyYellow mb-4" />

        <SimpleButton @click="saveProfile">Save Profile</SimpleButton>
      </div>
    </div>

    <Snackbar :message="snackbarMessage" :show="snackbarShow" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '@/firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/composables/piniaStores/userStore'
import SimpleButton from '@/components/buttons/SimpleButton.vue'
import { uploadToCloudinary } from '@/composables/user/useCloudinaryUpload'
import { useProfilePic } from '@/composables/user/useProfilePic'
import Snackbar from '@/components/Snackbar.vue'

// Snackbar state for notifications
const snackbarMessage = ref('')
const snackbarShow = ref(false)

// Helper to show snackbar notification
function showSnackbar(msg) {
  snackbarMessage.value = msg
  snackbarShow.value = true
  setTimeout(() => snackbarShow.value = false, 3000)
}

// Access user store for current user info
const userStore = useUserStore()

// Customer info fields
const name = ref('')
const address = ref('')

// Profile picture state
const fileInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref('')
const uploading = ref(false)

// Use composable for profilePic logic
const { profilePicSrc, updateProfilePic, DEFAULT_PROFILE_PIC } = useProfilePic()

// Handles profile picture load errors (fallback to default)
function onProfilePicError(e) {
  const img = e?.target
  if (img && img.tagName === 'IMG' && !img.src.endsWith(DEFAULT_PROFILE_PIC)) {
    img.src = DEFAULT_PROFILE_PIC
  }
}

// Loads profile info from Firestore
async function loadProfile() {
  if (!userStore.uid) return
  const snap = await getDoc(doc(db, 'users', userStore.uid))
  if (snap.exists()) {
    const data = snap.data()
    name.value = data.name || ''
    address.value = data.address || ''
    // Do NOT set userStore.profilePic here; composable handles it
  }
}
loadProfile()

// Opens file picker for profile picture
function chooseFile() {
  fileInput.value?.click()
}

// Handles file input change and sets preview
function onFileChange(e) {
  const file = e.target.files?.[0]
  selectedFile.value = file || null

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = file ? URL.createObjectURL(file) : ''
}

// Uploads selected profile picture to Cloudinary and saves URL
async function uploadProfilePic() {
  if (!selectedFile.value || !userStore.uid) return
  try {
    uploading.value = true

    // Upload to Cloudinary
    const result = await uploadToCloudinary(selectedFile.value, { folder: 'rpm-shop/avatars' })
    if (!result?.secure_url) {
      throw new Error('No secure_url returned from Cloudinary')
    }

    // Save to Firestore and Pinia
    await updateProfilePic(result.secure_url)

    showSnackbar('Profile picture updated!')
    selectedFile.value = null
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  } catch (e) {
    console.error('Cloudinary upload error:', e)
    showSnackbar('Error uploading profile picture')
  } finally {
    uploading.value = false
  }
}

// Saves customer info (name, address) to Firestore
async function saveProfile() {
  if (!userStore.uid) return
  try {
    await updateDoc(doc(db, 'users', userStore.uid), {
      name: name.value,
      address: address.value
    })
    showSnackbar('Profile updated!')
  } catch (err) {
    showSnackbar('Error saving profile')
  }
}
</script>
