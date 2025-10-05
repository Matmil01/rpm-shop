import { db } from '@/firebase'
import { collection, onSnapshot } from 'firebase/firestore'

export function useUsersCRUD() {
  function listenToUsers(callback) {
    const usersRef = collection(db, 'users')
    return onSnapshot(usersRef, (snapshot) => {
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
