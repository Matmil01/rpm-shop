import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '@/firebase'
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { useProfilePic } from '@/composables/user/useProfilePic'

// Composable for managing comments on a record
export function useComments(recordId) {
  const userStore = useUserStore()
  const { profilePicSrc } = useProfilePic()
  const comments = ref([])
  const newComment = ref('')
  let unsubscribeComments = null

  function listenToComments() {
    if (!recordId) return
    const commentsRef = collection(db, 'records', recordId, 'comments')
    const q = query(commentsRef, orderBy('date', 'desc'))
    unsubscribeComments = onSnapshot(q, snapshot => {
      comments.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    })
  }

  // Adds a new comment to Firestore
  async function addComment(extra = {}) {
    const text = (newComment.value || '').trim()
    if (!text) return
    const payload = {
      text,
      username: userStore.username || 'Anonymous',
      uid: userStore.uid || null,
      profilePic: profilePicSrc.value,
      date: new Date().toISOString(),
      createdAt: serverTimestamp(),
      ...extra
    }
    await addDoc(collection(db, 'records', recordId, 'comments'), payload)
    newComment.value = ''
  }

  // Start listening for comments when component mounts
  onMounted(listenToComments)
  // Unsubscribe from listener when component unmounts
  onUnmounted(() => {
    if (typeof unsubscribeComments === 'function') unsubscribeComments()
  })

  // Expose comments state and functions
  return { comments, newComment, addComment }
}
