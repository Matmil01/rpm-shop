import { computed, watch } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { db, auth } from '@/firebase'
import { useUserStore } from '@/composables/piniaStores/userStore'

const DEFAULT_PROFILE_PIC = '/profilePics/userDefault.svg'

export function useProfilePic() {
  const userStore = useUserStore()
  const profilePicSrc = computed(() =>
    (typeof userStore.profilePic === 'string' && userStore.profilePic.trim()) || DEFAULT_PROFILE_PIC
  )

  // Load from Firestore
  async function syncFromFirestore() {
    if (!userStore.loggedIn || !userStore.uid) return
    try {
      const snap = await getDoc(doc(db, 'users', userStore.uid))
      if (snap.exists()) {
        const data = snap.data()
        const pic = data.profilePic || null
        if (pic && pic !== userStore.profilePic) {
          userStore.profilePic = pic
        }
      }
    } catch (_) {}
  }

  // Fallback to Auth
  function syncFromAuth() {
    const authPic = auth.currentUser?.photoURL || null
    if (userStore.loggedIn && !userStore.profilePic && authPic) {
      userStore.profilePic = authPic
    }
  }

  // Update everywhere
  async function updateProfilePic(url) {
    if (!userStore.uid) return
    await updateDoc(doc(db, 'users', userStore.uid), {
      profilePic: url
    })
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL: url })
    }
    userStore.profilePic = url
  }

  // Watch for changes
  watch(() => userStore.uid, async () => {
    await syncFromFirestore()
    syncFromAuth()
  }, { immediate: true })

  return {
    profilePicSrc,
    syncFromFirestore,
    syncFromAuth,
    updateProfilePic,
    DEFAULT_PROFILE_PIC
  }
}
