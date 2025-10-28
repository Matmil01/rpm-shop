import { computed, watch } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { db, auth } from '@/firebase'
import { useUserStore } from '@/composables/piniaStores/userStore'

const DEFAULT_PROFILE_PIC = '/profilePics/userDefault.svg'

export function useProfilePic() {
  const userStore = useUserStore()
  // Computed: returns user's profilePic or default if missing
  const profilePicSrc = computed(() =>
    (typeof userStore.profilePic === 'string' && userStore.profilePic.trim()) || DEFAULT_PROFILE_PIC
  )

  // Loads profilePic from Firestore and updates userStore
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

  // Loads profilePic from Firebase Auth if not set in userStore
  function syncFromAuth() {
    const authPic = auth.currentUser?.photoURL || null
    if (userStore.loggedIn && !userStore.profilePic && authPic) {
      userStore.profilePic = authPic
    }
  }

  // Updates profilePic in Firestore, Auth, and userStore
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

  // Watches for changes to user UID and syncs profilePic
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
