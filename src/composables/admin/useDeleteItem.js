import { ref } from 'vue'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'

// Composable for deleting items from Firestore and updating local state
export function useDeleteItem() {
  const deletingId = ref(null) // ID of item currently being deleted
  const error = ref('')        // Error message if deletion fails

  // Deletes an item from Firestore and optionally removes it from a local list
  async function deleteItem(collection, id, localList = null, key = 'id') {
    error.value = ''
    // Confirm deletion with user
    if (!window.confirm('Are you sure? This cannot be undone.')) return false
    deletingId.value = id
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, collection, id))
      // Remove from local list if provided
      if (localList) {
        const arr = localList.value || localList
        const idx = arr.findIndex(item => item[key] === id)
        if (idx !== -1) arr.splice(idx, 1)
      }
      deletingId.value = null
      return true
    } catch (err) {
      // Set error message if deletion fails
      error.value = err.message || 'Failed to delete item.'
      deletingId.value = null
      return false
    }
  }

  // Return composable API
  return { deleteItem, deletingId, error }
}
