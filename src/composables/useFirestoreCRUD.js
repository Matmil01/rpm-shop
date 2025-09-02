import { ref } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc as getSingleDoc, onSnapshot } from 'firebase/firestore'

export function useFirestoreCRUD() {
  const records = ref([])
  const loading = ref(false)
  let unsubscribeRecords = null

  async function fetchRecords() {
    loading.value = true
    const querySnapshot = await getDocs(collection(db, 'records'))
    records.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    loading.value = false
  }

  function listenToRecords() {
    loading.value = true
    const colRef = collection(db, 'records')
    unsubscribeRecords = onSnapshot(colRef, snapshot => {
      records.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    })
  }

  async function fetchRecord(id) {
    const docRef = doc(db, 'records', id)
    const docSnap = await getSingleDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
  }

  async function addRecord(record) {
    await addDoc(collection(db, 'records'), record)
  }

  async function updateRecord(id, data) {
    await updateDoc(doc(db, 'records', id), data)
  }

  async function deleteRecord(id) {
    await deleteDoc(doc(db, 'records', id))
  }

  function listenToRecord(id, callback) {
    const docRef = doc(db, 'records', id)
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() })
      } else {
        callback(null)
      }
    })
  }

  return {
    records,
    loading,
    fetchRecords,
    listenToRecords,
    unsubscribeRecords,
    fetchRecord,
    addRecord,
    updateRecord,
    deleteRecord,
    listenToRecord
  }
}
