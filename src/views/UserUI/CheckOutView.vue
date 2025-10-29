<template>
  <div class="max-w-3xl mx-auto p-8 text-MyWhite font-main">
    <h1 class="text-2xl font-headline mb-6">Checkout</h1>

    <div v-if="!cart.items.length">
      <p>Your cart is empty.</p>
    </div>

    <div v-else>
      <div class="mb-6 p-4 rounded bg-MyBlack">
        <h2 class="text-xl font-bold mb-2">Order Summary</h2>
        <div v-for="item in cart.items" :key="item.id"
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
                <span class="text-MyRed font-bold">{{ priceCalculator.calculateDiscountedPrice(item.price,
                  item.discount) }} kr.</span>
              </span>
              <span v-else>
                <span class="text-gray-200 font-bold">{{ item.price }} kr.</span>
              </span>
            </div>
            <div class="text-xs mt-1">Qty: {{ item.quantity }}</div>
          </div>
        </div>
        <div class="mt-4 text-xl font-bold text-right">
          Total: {{ totalPrice }} kr.
        </div>
      </div>

      <div v-if="!orderSubmitted">
        <h2 class="text-xl font-bold mb-4">Customer Information</h2>
        <div class="mb-4 p-4 rounded bg-MyDark shadow shadow-MyYellow text-MyWhite">
          <div><span class="font-bold">Name:</span> {{ customerName }}</div>
          <div><span class="font-bold">Username:</span> {{ username }}</div>
          <div><span class="font-bold">Address:</span> {{ customerAddress }}</div>
          <div v-if="userStore.email"><span class="font-bold">Email:</span> {{ userStore.email }}</div>
        </div>
        <div v-if="submitError" class="bg-MyRed p-3 rounded mb-4 text-MyWhite">
          {{ submitError }}
        </div>
        <div class="pt-4 flex justify-center">
          <SimpleButton @click="submitOrder" :disabled="processing">
            <span v-if="processing">Processing...</span>
            <span v-else>Place Order</span>
          </SimpleButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/records/usePriceCalculator'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { useOrdersCRUD } from '@/composables/CRUD/useOrdersCRUD'
import { useRecordsCRUD } from '@/composables/CRUD/useRecordsCRUD'
import SimpleButton from '@/components/buttons/SimpleButton.vue'

// Router instance for navigation
const router = useRouter()
// Access cart store
const cart = useCartStore()
// Price calculation functions
const priceCalculator = usePriceCalculator()
// Orders CRUD composable
const { addOrder } = useOrdersCRUD()
// Records CRUD composable
const { fetchRecord, updateRecord } = useRecordsCRUD()
// User store for customer info
const userStore = useUserStore()

// Customer info fields
const customerName = ref('')
const customerAddress = ref('')
const username = ref('')
// Random order number
const orderNumber = ref(`RPM-${Math.floor(100000 + Math.random() * 900000)}`)
// State for order submission
const processing = ref(false)
const submitError = ref('')
const orderSubmitted = ref(false)
// Computed: total price of all items in cart
const totalPrice = computed(() => priceCalculator.calculateTotalPrice(cart.items))

// On mount: load customer info from Firestore
onMounted(async () => {
  if (userStore.uid) {
    const userDoc = await getDoc(doc(db, 'users', userStore.uid))
    if (userDoc.exists()) {
      customerName.value = userDoc.data().name || ''
      customerAddress.value = userDoc.data().address || ''
      username.value = userDoc.data().username || ''
    }
  }
})

// Handles order submission
async function submitOrder() {
  if (processing.value) return

  processing.value = true
  submitError.value = ''

  try {
    // Check stock for each item in cart
    const stockCheckResults = await Promise.all(
      cart.items.map(async (item) => {
        const record = await fetchRecord(item.id)
        if (!record) {
          return {
            id: item.id,
            available: false,
            message: 'Product no longer exists'
          }
        }
        if (record.stock < item.quantity) {
          return {
            id: item.id,
            available: false,
            message: `Only ${record.stock} units available for ${item.album}`
          }
        }
        return {
          id: item.id,
          available: true,
          currentStock: record.stock
        }
      })
    )

    // If any item is unavailable, show error
    const unavailableItem = stockCheckResults.find(item => !item.available)
    if (unavailableItem) {
      submitError.value = unavailableItem.message
      return
    }

    // Build order data
    const orderData = {
      orderNumber: orderNumber.value,
      customer: {
        uid: userStore.uid,
        username: userStore.username,
        email: userStore.email,
        name: customerName.value,
        address: customerAddress.value
      },
      items: cart.items.map(item => ({
        id: item.id,
        album: item.album,
        artist: item.artist,
        coverImage: item.coverImage,
        price: Number(item.price),
        discount: Number(item.discount) || 0,
        finalPrice: priceCalculator.calculateDiscountedPrice(item.price, item.discount),
        quantity: item.quantity
      })),
      totalAmount: totalPrice.value,
      orderDate: new Date(),
      status: 'new'
    }

    // Add order to Firestore
    await addOrder(orderData)

    // Update stock for each item
    await Promise.all(
      cart.items.map(async (item) => {
        const stockInfo = stockCheckResults.find(record => record.id === item.id)
        if (stockInfo && stockInfo.available) {
          const newStock = stockInfo.currentStock - item.quantity
          await updateRecord(item.id, { stock: newStock })
        }
      })
    )

    // Clear cart after successful order
    cart.clearCart()

    // Redirect to thank you page with order number
    router.push({
      path: '/thankyou',
      query: { orderNumber: orderNumber.value }
    })

  } catch (error) {
    console.error('Error submitting order:', error)
    submitError.value = 'There was a problem processing your order. Please try again.'
  } finally {
    processing.value = false
  }
}
</script>
