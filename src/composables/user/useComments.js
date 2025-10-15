import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '@/firebase'
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore'
import { useUserStore } from '@/composables/piniaStores/userStore'

export function useComments(recordId) {
  const userStore = useUserStore()
  const comments = ref([])
  const newComment = ref('')
  let unsubscribeComments = null

  function listenToComments() {
    if (!recordId) return
    const commentsRef = collection(db, 'records', recordId, 'comments')
    const q = query(commentsRef, orderBy('date', 'desc')) // uses existing 'date' field
    unsubscribeComments = onSnapshot(q, snapshot => {
      comments.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    })
  }

  async function addComment(extra = {}) {
    const text = (newComment.value || '').trim()
    if (!text) return
    const payload = {
      text,
      username: userStore.username || 'Anonymous',
      uid: userStore.uid || null,
      profilePic: userStore.profilePic || null, // store avatar with the comment
      date: new Date().toISOString(),
      createdAt: serverTimestamp(),
      ...extra
    }
    await addDoc(collection(db, 'records', recordId, 'comments'), payload)
    newComment.value = ''
  }

  onMounted(listenToComments)
  onUnmounted(() => {
    if (typeof unsubscribeComments === 'function') unsubscribeComments()
  })

  return { comments, newComment, addComment }
}
