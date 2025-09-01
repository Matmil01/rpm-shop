import { ref } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc as getSingleDoc } from 'firebase/firestore'

export function useFirestoreCRUD() {
  const products = ref([])
  const loading = ref(false)

  async function fetchProducts() {
    loading.value = true
    const querySnapshot = await getDocs(collection(db, 'products'))
    products.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    loading.value = false
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

  return {
    products,
    loading,
    fetchProducts,
    fetchProduct,
    addProduct,
    updateProduct,
    deleteProduct
  }
}
