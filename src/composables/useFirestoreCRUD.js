import { ref } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc as getSingleDoc, onSnapshot } from 'firebase/firestore'

export function useFirestoreCRUD() {
  const products = ref([])
  const loading = ref(false)
  let unsubscribeProducts = null

  async function fetchProducts() {
    loading.value = true
    const querySnapshot = await getDocs(collection(db, 'products'))
    products.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    loading.value = false
  }

  function listenToProducts() {
    loading.value = true
    const colRef = collection(db, 'products')
    unsubscribeProducts = onSnapshot(colRef, snapshot => {
      products.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    })
  }

  async function fetchProduct(id) {
    const docRef = doc(db, 'products', id)
    const docSnap = await getSingleDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
  }

  async function addProduct(product) {
    await addDoc(collection(db, 'products'), product)
  }

  async function updateProduct(id, data) {
    await updateDoc(doc(db, 'products', id), data)
  }

  async function deleteProduct(id) {
    await deleteDoc(doc(db, 'products', id))
  }

  function listenToProduct(id, callback) {
    const docRef = doc(db, 'products', id)
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() })
      } else {
        callback(null)
      }
    })
  }

  return {
    products,
    loading,
    fetchProducts,
    listenToProducts,
    unsubscribeProducts,
    fetchProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    listenToProduct
  }
}
