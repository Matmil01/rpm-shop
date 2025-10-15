<template>
  <div class="max-w-lg mx-auto mt-10 p-8 font-main">
    <h2 class="text-2xl font-headline mb-6 text-MyWhite">Edit Profile</h2>

    <h3 class="text-xl font-bold mb-2 text-MyWhite text-left">Profile Picture</h3>
    <div class="mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow flex flex-col items-center gap-3">
      <img
        :src="previewUrl || avatarSrc"
        alt="Profile Picture"
        class="w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600 object-cover"
        @error="onAvatarError"
      />

      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

      <div class="flex gap-3">
        <SimpleButton @click="chooseFile">Choose Picture</SimpleButton>
        <SimpleButton @click="uploadAvatar" :disabled="!selectedFile || uploading">
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </SimpleButton>
      </div>

      <div v-if="selectedFile" class="text-MyYellow text-sm">
        {{ selectedFile.name }}
      </div>
      <div v-if="uploadError" class="text-MyRed font-main text-sm">{{ uploadError }}</div>
      <div v-if="uploadSuccess" class="text-green-400 font-main text-sm">{{ uploadSuccess }}</div>
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

      <SimpleButton @click="saveProfile">Save Profile</SimpleButton>
      <div v-if="success" class="text-green-400 mt-2 font-main">{{ success }}</div>
      <div v-if="error" class="text-MyRed mt-2 font-main">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { db, auth } from '@/firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { useUserStore } from '@/composables/piniaStores/userStore'
import SimpleButton from '@/components/buttons/SimpleButton.vue'
import { uploadToCloudinary } from '@/composables/user/useCloudinaryUpload'

const userStore = useUserStore()

const name = ref('')
const address = ref('')
const success = ref('')
const error = ref('')

// Avatar state
const fileInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref('')
const uploading = ref(false)
const uploadError = ref('')
const uploadSuccess = ref('')

const DEFAULT_AVATAR = '/avatars/userDefault.svg'

// Only render from store (prevents cross-user leakage)
const avatarSrc = computed(() =>
  (typeof userStore.profilePic === 'string' && userStore.profilePic.trim()) || DEFAULT_AVATAR
)

function onAvatarError(e) {
  const img = e?.target
  if (img && img.tagName === 'IMG' && !img.src.endsWith(DEFAULT_AVATAR)) {
    img.src = DEFAULT_AVATAR
  }
}

async function loadProfile() {
  if (!userStore.uid) return
  const snap = await getDoc(doc(db, 'users', userStore.uid))
  if (snap.exists()) {
    const data = snap.data()
    name.value = data.name || ''
    address.value = data.address || ''
    // Prefer profilePic; support legacy avatarUrl; finally fall back to Auth once
    const pic = data.profilePic || data.avatarUrl || auth.currentUser?.photoURL || null
    if (pic && userStore.profilePic !== pic) {
      userStore.profilePic = pic
    }
  }
}
loadProfile()

function chooseFile() {
  uploadError.value = ''
  uploadSuccess.value = ''
  fileInput.value?.click()
}

function onFileChange(e) {
  uploadError.value = ''
  uploadSuccess.value = ''
  const file = e.target.files?.[0]
  selectedFile.value = file || null

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = file ? URL.createObjectURL(file) : ''
}

async function uploadAvatar() {
  if (!selectedFile.value || !userStore.uid) return
  try {
    uploading.value = true
    uploadError.value = ''
    uploadSuccess.value = ''

    const result = await uploadToCloudinary(selectedFile.value, { folder: 'rpm-shop/avatars' })
    const secureUrl = result.secure_url

    // Write profilePic (and avatarUrl for legacy compatibility)
    await updateDoc(doc(db, 'users', userStore.uid), {
      profilePic: secureUrl,
      avatarUrl: secureUrl
    })

    // Update Firebase Auth (optional)
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL: secureUrl })
    }

    // Update store for Navbar
    userStore.profilePic = secureUrl

    uploadSuccess.value = 'Profile picture updated!'
    selectedFile.value = null
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  } catch (e) {
    console.error('Cloudinary upload error:', e)
    uploadError.value = e?.message || 'Upload failed.'
  } finally {
    uploading.value = false
  }
}

async function saveProfile() {
  if (!userStore.uid) return
  try {
    await updateDoc(doc(db, 'users', userStore.uid), {
      name: name.value,
      address: address.value
    })
    success.value = 'Profile updated!'
    error.value = ''
  } catch (err) {
    error.value = 'Failed to save profile.'
    success.value = ''
  }
}
</script>
