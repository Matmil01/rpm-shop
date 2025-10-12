import { ref } from 'vue'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'

export function useDeleteItem() {
  const deletingId = ref(null)
  const error = ref('')

  async function deleteItem(collection, id, localList = null, key = 'id') {
    error.value = ''
    if (!window.confirm('Are you sure? This cannot be undone.')) return false
    deletingId.value = id
    try {
      await deleteDoc(doc(db, collection, id))
      if (localList) {
        const arr = localList.value || localList
        const idx = arr.findIndex(item => item[key] === id)
        if (idx !== -1) arr.splice(idx, 1)
      }
      deletingId.value = null
      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete item.'
      deletingId.value = null
      return false
    }
  }

  return { deleteItem, deletingId, error }
}
