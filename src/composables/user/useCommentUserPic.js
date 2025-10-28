import { ref } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { useProfilePic } from '@/composables/user/useProfilePic'

// Composable for managing and caching user profile pictures for comments
export function useCommentUserPic() {
  const profilePicCache = ref({})
  const userStore = useUserStore()
  const { profilePicSrc, DEFAULT_PROFILE_PIC } = useProfilePic()

  // Gets UID from a comment object (supports multiple possible field names)
  function getUid(comment) {
    return (
      comment?.uid ||
      comment?.userId ||
      comment?.userID ||
      comment?.userUid ||
      comment?.authorId ||
      comment?.authorID ||
      null
    )
  }

  // Gets the profile picture URL for a comment
  function getProfilePic(comment) {
    const inlinePic = comment?.profilePic && String(comment.profilePic).trim()
    if (inlinePic) return inlinePic

    const uid = getUid(comment)
    if (uid === userStore.uid) {
      return profilePicSrc.value
    }
    const cached = uid ? profilePicCache.value[uid] : null
    return (cached && String(cached).trim()) || DEFAULT_PROFILE_PIC
  }

  // Loads missing profile pictures from Firestore for comments
  async function hydrateMissingProfilePics(comments) {
    const lookups = []
    const seen = new Set()
    for (const c of comments || []) {
      const uid = getUid(c)
      if (!uid) continue
      const hasInline = c.profilePic && String(c.profilePic).trim()
      if (hasInline) continue
      if (profilePicCache.value[uid] !== undefined) continue
      if (seen.has(uid)) continue
      seen.add(uid)
      lookups.push(
        getDoc(doc(db, 'users', uid))
          .then(snap => {
            const url = snap.exists() ? (snap.data().profilePic || null) : null
            profilePicCache.value = { ...profilePicCache.value, [uid]: url }
          })
          .catch(() => {
            profilePicCache.value = { ...profilePicCache.value, [uid]: null }
          })
      )
    }
    if (lookups.length) await Promise.allSettled(lookups)
  }

  return {
    profilePicCache,
    getUid,
    getProfilePic,
    hydrateMissingProfilePics,
    DEFAULT_PROFILE_PIC
  }
}
