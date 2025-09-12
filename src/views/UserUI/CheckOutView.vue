<template>
  <div class="max-w-3xl mx-auto p-8 text-MyWhite font-main">
    <h1 class="text-2xl font-bold mb-6">Checkout</h1>

    <div v-if="!cart.items.length" class="text-center p-6">
      <p>Your cart is empty.</p>
      <router-link to="/shop" class="text-blue-400 underline mt-4 block">
        Continue Shopping
      </router-link>
    </div>

    <div v-else>
      <div class="mb-6 p-4 rounded bg-black/40">
        <h2 class="font-bold mb-2">Order Summary</h2>
        <div v-for="item in cart.items" :key="item.id" class="flex items-center justify-between mb-4 p-4 rounded bg-black/40 gap-4">
          <!-- Image -->
          <img
            v-if="item.coverImage"
            :src="item.coverImage"
            alt="Cover"
            class="w-20 h-20 object-cover rounded shadow"
          />
          <div v-else class="w-20 h-20 flex items-center justify-center bg-gray-700 text-xs rounded">
            No Image
          </div>

          <!-- Details -->
          <div class="flex-1">
            <div class="font-bold truncate">{{ item.album }}</div>
            <div class="text-sm mb-1 truncate">{{ item.artist }}</div>
            <div class="text-sm">
              <span v-if="item.discount && item.discount > 0">
                <span class="line-through text-gray-400 mr-2">{{ item.price }} kr.</span>
                <span class="text-red-600 font-bold">{{ priceCalculator.calculateDiscountedPrice(item.price, item.discount) }} kr.</span>
              </span>
              <span v-else>
                <span class="text-gray-200 font-bold">{{ item.price }} kr.</span>
              </span>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center mt-2">
              <button
                @click="decrementQuantity(item)"
                class="w-6 h-6 bg-gray-700 text-white rounded-l flex items-center justify-center hover:bg-gray-600 cursor-pointer"
                :disabled="item.quantity <= 1"
              >
                -
              </button>
              <div class="px-2 py-1 bg-gray-800 text-center text-xs w-8">
                {{ item.quantity }}
              </div>
              <button
                @click="incrementQuantity(item)"
                class="w-6 h-6 bg-gray-700 text-white rounded-r flex items-center justify-center hover:bg-gray-600 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <!-- Remove Button -->
          <button
            @click="cart.removeFromCart(item.id)"
            class="text-red-500 hover:text-red-400 hover:underline shrink-0 flex items-center cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Remove
          </button>
        </div>
        <div class="mt-4 text-xl font-bold">
          Total: {{ totalPrice }} kr.
        </div>
      </div>

      <!-- Customer input fields -->
      <div v-if="!orderSubmitted">
        <h2 class="font-bold mb-4">Customer Information</h2>
        <div v-if="submitError" class="bg-red-800 p-3 rounded mb-4 text-white">
          {{ submitError }}
        </div>

        <form @submit.prevent="submitOrder" class="space-y-4">
          <div>
            <label class="block mb-1">Name</label>
            <input
              type="text"
              v-model="customerName"
              required
              class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label class="block mb-1">Address</label>
            <input
              type="text"
              v-model="customerAddress"
              required
              class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label class="block mb-1">More of your super sensitive information</label>
            <input
              type="text"
              v-model="sensitivePurchaseInfo"
              class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full py-3 bg-green-700 text-white rounded hover:bg-green-800 transition cursor-pointer"
              :disabled="processing"
            >
              <span v-if="processing">Processing...</span>
              <span v-else>Place Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/usePriceCalculator'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'

const router = useRouter()
const cart = useCartStore()
const priceCalculator = usePriceCalculator()
const { addOrder, fetchRecord, updateRecord } = useFirestoreCRUD()

const customerName = ref('')
const customerAddress = ref('')
const sensitivePurchaseInfo = ref('')
const orderNumber = ref(`RPM-${Math.floor(100000 + Math.random() * 900000)}`)
const processing = ref(false)
const submitError = ref('')
const orderSubmitted = ref(false)

const totalPrice = computed(() => priceCalculator.calculateTotalPrice(cart.items))

// Quantity control functions
function incrementQuantity(item) {
  // Find the item in the cart and update its quantity
  const cartItem = cart.items.find(i => i.id === item.id)
  if (cartItem) {
    cartItem.quantity += 1
    cart.saveToLocalStorage()
  }
}

function decrementQuantity(item) {
  // Find the item in the cart and update its quantity
  const cartItem = cart.items.find(i => i.id === item.id)
  if (cartItem && cartItem.quantity > 1) {
    cartItem.quantity -= 1
    cart.saveToLocalStorage()
  }
}

async function submitOrder() {
  if (processing.value) return

  processing.value = true
  submitError.value = ''

  try {
    // Tjekker stock quantity
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

    // Opretter ordre data/struktur som sendes til Firestore
    const orderData = {
      orderNumber: orderNumber.value,
      customer: {
        name: customerName.value,
        address: customerAddress.value,
        sensitiveInfo: sensitivePurchaseInfo.value // 3rd input field, change later
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

    // Gemmer til Firestore
    await addOrder(orderData)

    // Updatatere quantity i database
    await Promise.all(
      cart.items.map(async (item) => {
        const stockInfo = stockCheckResults.find(r => r.id === item.id)
        if (stockInfo && stockInfo.available) {
          const newStock = stockInfo.currentStock - item.quantity
          await updateRecord(item.id, { stock: newStock })
        }
      })
    )

    // Clear cart
    cart.clearCart()

    // Redirect til thank you page
    router.push({
      path: '/404',
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
