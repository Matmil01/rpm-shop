import { db } from '@/firebase'
import { collection, getDocs, addDoc, updateDoc, doc, onSnapshot, query, where, orderBy, deleteDoc } from 'firebase/firestore'

// Composable for CRUD operations on orders collection
export function useOrdersCRUD() {
  async function addOrder(order) {
    return await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: new Date()
    })
  }

  // Fetches a single order by its order number
  async function fetchOrderByNumber(orderNumber) {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, where('orderNumber', '==', orderNumber))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data()
    }
    return null
  }

  // Fetches all orders from Firestore
  async function fetchAllOrders() {
    const ordersRef = collection(db, 'orders')
    const snapshot = await getDocs(ordersRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  // Sets up a real-time listener for all orders, sorted by orderDate
  function listenToOrders(callback) {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, orderBy('orderDate', 'desc'))
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
  }

  // Updates the status field of an order
  async function updateOrderStatus(orderId, newStatus) {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, { status: newStatus })
  }

  // Updates any fields of an order
  async function updateOrder(orderId, updates) {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, updates)
  }

  // Deletes an order from Firestore
  async function deleteOrder(orderId) {
    const orderRef = doc(db, 'orders', orderId)
    await deleteDoc(orderRef)
  }

  // Expose CRUD functions
  return {
    addOrder,
    fetchOrderByNumber,
    fetchAllOrders,
    listenToOrders,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
  }
}
