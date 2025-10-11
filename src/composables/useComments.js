import { ref, onMounted, onUnmounted } from 'vue'
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import { useUserStore } from '@/composables/piniaStores/userStore'

export function useComments(recordId) {
  const comments = ref([])
  const newComment = ref('')
  let unsubscribeComments = null
  const userStore = useUserStore()

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

  async function addComment() {
    if (!newComment.value.trim() || !recordId || !userStore.uid) return
    const commentsRef = collection(db, 'records', recordId, 'comments')
    await addDoc(commentsRef, {
      userId: userStore.uid,
      username: userStore.username || 'Anonymous',
      text: newComment.value,
      date: new Date().toLocaleString()
    })
    newComment.value = ''
  }

  onMounted(listenToComments)
  onUnmounted(() => {
    if (unsubscribeComments) unsubscribeComments()
  })

  return {
    comments,
    newComment,
    addComment
  }
}
