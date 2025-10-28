import { db } from '@/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

// Composable for real-time listening to users collection
export function useUsersCRUD() {
  // Sets up a real-time listener for all users, sorted by creation date
  function listenToUsers(callback) {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('createdAt', 'desc'))
    // Calls the callback with an array of user objects whenever data changes
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })))
    })
  }

  // Expose the listener function
  return {
    listenToUsers,
  }
}
