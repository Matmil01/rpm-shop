import { db } from '@/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

export function useUsersCRUD() {
  function listenToUsers(callback) {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })))
    })
  }

  return {
    listenToUsers,
  }
}
