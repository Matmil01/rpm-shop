<template>
  <div class="max-w-3xl mx-auto p-8 text-center text-MyWhite font-main">
    <div class="mb-8 p-8 bg-MyBlack rounded">
      <h1 class="text-4xl font-bold mb-8 text-center">
        Thank You{{ orderData?.customer?.name ? `, ${orderData.customer.name}` : '' }}!
      </h1>
      <p class="mb-4 text-lg text-center">
        Your order has been placed.
      </p>
      <!-- Customer Info -->
      <h2 class="text-xl font-bold mb-2 text-left">Customer Information</h2>
      <div class="mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow text-left">
        <div><span class="font-bold">Name:</span> {{ orderData?.customer?.name }}</div>
        <div><span class="font-bold">Username:</span> {{ username }}</div>
        <div><span class="font-bold">Address:</span> {{ orderData?.customer?.address }}</div>
        <div><span class="font-bold">Email:</span> {{ orderData?.customer?.email }}</div>
      </div>
      <!-- Order Details -->
      <h2 class="text-xl font-bold mb-2 text-left">Order Details</h2>
      <div class="mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow text-left">
        <div>Order #: {{ orderNumber }}</div>
        <div>Date: {{ orderData?.orderDate?.toDate ? orderData.orderDate.toDate().toLocaleString() : '' }}</div>
        <div>
          Status:
          <span class="px-2 py-1 rounded text-xs" :class="getStatusColor(orderData?.status)">
            {{ getStatusLabel(orderData?.status) }}
          </span>
        </div>
      </div>
      <!-- Items List -->
      <h2 class="font-bold mb-4 text-xl text-left">Order Summary</h2>
      <div v-if="orderItems.length" class="mb-8 text-left">
        <div v-for="item in orderItems" :key="item.id"
          class="flex items-center justify-between mb-4 p-4 rounded bg-MyDark shadow shadow-MyYellow gap-4">
          <img v-if="item.coverImage" :src="item.coverImage" alt="Cover"
            class="w-20 h-20 object-cover rounded shadow" />
          <div v-else class="w-20 h-20 flex items-center justify-center bg-MyDark text-xs rounded">
            No Image
          </div>
          <div class="flex-1">
            <div class="font-bold truncate">{{ item.album }}</div>
            <div class="text-sm mb-1 truncate">{{ item.artist }}</div>
            <div class="text-sm">
              <span v-if="item.discount && item.discount > 0">
                <span class="line-through text-gray-400 mr-2">{{ item.price }} kr.</span>
                <span class="text-red-600 font-bold">{{ item.finalPrice }} kr.</span>
              </span>
              <span v-else>
                <span class="text-gray-200 font-bold">{{ item.finalPrice }} kr.</span>
              </span>
            </div>
            <div class="text-xs mt-1">Qty: {{ item.quantity }}</div>
          </div>
        </div>
        <div class="text-right font-bold text-xl mt-4">
          Total: {{ orderTotal }} kr.
        </div>
      </div>
      <div class="mt-8 text-center">
        <SimpleButton to="/" class="px-6 inline-block">
          Continue Shopping
        </SimpleButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersCRUD } from '@/composables/CRUD/useOrdersCRUD'
import { useOrderStatus } from '@/composables/admin/useOrderStatus'
import SimpleButton from '@/components/buttons/SimpleButton.vue'
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

// Get route instance for reading order number from query
const route = useRoute()

// Orders CRUD composable for fetching order by number
const { fetchOrderByNumber } = useOrdersCRUD()

// Order status helpers for label and color
const { getStatusLabel, getStatusColor } = useOrderStatus()

// Computed: order number from query or fallback to random
const orderNumber = computed(() =>
  route.query.orderNumber || `RPM-${Math.floor(100000 + Math.random() * 900000)}`
)

// Reactive order data object
const orderData = ref(null)

// Reactive array of order items
const orderItems = ref([])

// Reactive total price for the order
const orderTotal = ref(0)

// Loading state for async fetch
const isLoading = ref(true)

// Username for display in customer info
const username = ref('')

// On mount: fetch order details and customer username
onMounted(async () => {
  if (orderNumber.value) {
    try {
      // Fetch order data from Firestore using order number
      const fetchedOrder = await fetchOrderByNumber(orderNumber.value)
      if (fetchedOrder) {
        // Set order data and items
        orderData.value = fetchedOrder
        orderItems.value = fetchedOrder.items || []
        orderTotal.value = fetchedOrder.totalAmount || 0

        // Fetch username from Firestore using customer UID
        if (fetchedOrder.customer?.uid) {
          const userDoc = await getDoc(doc(db, 'users', fetchedOrder.customer.uid))
          if (userDoc.exists()) {
            username.value = userDoc.data().username || ''
          }
        }
      }
    } catch (error) {
      // Log error if fetch fails
      console.error('Error fetching order:', error)
    } finally {
      // Set loading state to false after fetch
      isLoading.value = false
    }
  }
})
</script>
