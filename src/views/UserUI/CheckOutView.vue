<template>
  <div class="max-w-3xl mx-auto p-8 text-MyWhite font-main">
    <h1 class="text-2xl font-headline mb-6">Checkout</h1>

    <div v-if="!cart.items.length">
      <p>Your cart is empty.</p>
    </div>

    <div v-else>
      <div class="mb-6 p-4 rounded bg-MyBlack">
        <h2 class="font-bold mb-2">Order Summary</h2>
        <div v-for="item in cart.items" :key="item.id" class="flex items-center justify-between mb-4 p-4 rounded bg-MyDark border border-MyYellow gap-4">
          <!-- Image -->
          <img
            v-if="item.coverImage"
            :src="item.coverImage"
            alt="Cover"
            class="w-20 h-20 object-cover rounded shadow"
          />
          <div v-else class="w-20 h-20 flex items-center justify-center bg-MyDark text-xs rounded">
            No Image
          </div>

          <!-- Details -->
          <div class="flex-1">
            <div class="font-bold truncate">{{ item.album }}</div>
            <div class="text-sm mb-1 truncate">{{ item.artist }}</div>
            <div class="text-sm">
              <span v-if="item.discount && item.discount > 0">
                <span class="line-through text-gray-400 mr-2">{{ item.price }} kr.</span>
                <span class="text-MyRed font-bold">{{ priceCalculator.calculateDiscountedPrice(item.price, item.discount) }} kr.</span>
              </span>
              <span v-else>
                <span class="text-gray-200 font-bold">{{ item.price }} kr.</span>
              </span>
            </div>
            <div class="text-xs mt-1">Qty: {{ item.quantity }}</div>
          </div>
        </div>
        <div class="mt-4 text-xl font-bold">
          Total: {{ totalPrice }} kr.
        </div>
      </div>

      <!-- Customer input fields -->
      <div v-if="!orderSubmitted">
        <h2 class="font-bold mb-4">Customer Information</h2>
        <div v-if="submitError" class="bg-MyRed p-3 rounded mb-4 text-MyWhite">
          {{ submitError }}
        </div>

        <form @submit.prevent="submitOrder" class="space-y-4">
          <div>
            <label class="block mb-1">Name</label>
            <input
              type="text"
              v-model="customerName"
              required
              class="w-full p-2 rounded bg-gray-800 text-MyWhite border border-gray-700"
            />
          </div>

          <div>
            <label class="block mb-1">Address</label>
            <textarea
              v-model="customerAddress"
              required
              rows="3"
              class="w-full p-2 rounded bg-gray-800 text-MyWhite border border-gray-700 resize-none"
            />
          </div>

          <div class="pt-4">
            <SimpleButton
              type="submit"
              class="w-full py-3"
              :disabled="processing"
            >
              <span v-if="processing">Processing...</span>
              <span v-else>Place Order</span>
            </SimpleButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/usePriceCalculator'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import SimpleButton from '@/components/SimpleButton.vue'

const router = useRouter()
const cart = useCartStore()
const priceCalculator = usePriceCalculator()
const { addOrder, fetchRecord, updateRecord } = useFirestoreCRUD()
const userStore = useUserStore()

const customerName = ref('')
const customerAddress = ref('')
const orderNumber = ref(`RPM-${Math.floor(100000 + Math.random() * 900000)}`)
const processing = ref(false)
const submitError = ref('')
const orderSubmitted = ref(false)

const totalPrice = computed(() => priceCalculator.calculateTotalPrice(cart.items))

onMounted(async () => {
  if (userStore.uid) {
    const userDoc = await getDoc(doc(db, 'users', userStore.uid))
    if (userDoc.exists()) {
      customerName.value = userDoc.data().name || ''
      customerAddress.value = userDoc.data().address || ''
    }
  }
})

async function submitOrder() {
  if (processing.value) return

  processing.value = true
  submitError.value = ''

  try {
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

    const unavailableItem = stockCheckResults.find(item => !item.available)
    if (unavailableItem) {
      submitError.value = unavailableItem.message
      return
    }

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

    await addOrder(orderData)

    await Promise.all(
      cart.items.map(async (item) => {
        const stockInfo = stockCheckResults.find(record => record.id === item.id)
        if (stockInfo && stockInfo.available) {
          const newStock = stockInfo.currentStock - item.quantity
          await updateRecord(item.id, { stock: newStock })
        }
      })
    )

    cart.clearCart()

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
