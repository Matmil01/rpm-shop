import { db } from '@/firebase'
import { collection, getDocs, addDoc, updateDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore'

export function useOrdersCRUD() {
  async function addOrder(order) {
    return await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: new Date()
    })
  }

  async function fetchOrderByNumber(orderNumber) {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, where('orderNumber', '==', orderNumber))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data()
    }
    return null
  }

  async function fetchAllOrders() {
    const ordersRef = collection(db, 'orders')
    const snapshot = await getDocs(ordersRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  function listenToOrders(callback) {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, orderBy('orderDate', 'desc'))
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
  }

  async function updateOrderStatus(orderId, newStatus) {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, { status: newStatus })
  }

  async function updateOrder(orderId, updates) {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, updates)
  }

  return {
    addOrder,
    fetchOrderByNumber,
    fetchAllOrders,
    listenToOrders,
    updateOrder,
    updateOrderStatus,
  }
}
