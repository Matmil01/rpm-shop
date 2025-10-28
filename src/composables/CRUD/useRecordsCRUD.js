import { ref } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, onSnapshot } from 'firebase/firestore'

// Composable for CRUD operations on the records collection
export function useRecordsCRUD() {
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

  // Sets up a real-time listener for all records
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

  // Fetches a single record by ID (one-time)
  async function fetchRecord(id) {
    const docRef = doc(db, 'records', id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
  }

  // Adds a new record to Firestore
  async function addRecord(record) {
    await addDoc(collection(db, 'records'), record)
  }

  // Updates an existing record by ID
  async function updateRecord(id, data) {
    const recordRef = doc(db, 'records', id)
    await updateDoc(recordRef, data)
  }

  // Deletes a record by ID
  async function deleteRecord(id) {
    await deleteDoc(doc(db, 'records', id))
  }

  // Sets up a real-time listener for a single record by ID
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

  // Expose state and CRUD functions
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
    listenToRecord,
  }
}
