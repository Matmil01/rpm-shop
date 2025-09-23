<template>
  <div class="max-w-3xl mx-auto p-8 text-MyWhite font-main">
    <h1 class="text-2xl font-bold mb-6">Your Cart</h1>
    <div v-if="cart.items.length">
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="flex items-center justify-between mb-4 p-4 rounded bg-MyBlack/40 gap-4"
      >
        <img
          v-if="item.coverImage"
            :src="item.coverImage"
            alt="Cover"
            class="w-20 h-20 object-cover rounded shadow"
        />
        <div v-else class="w-20 h-20 flex items-center justify-center bg-MyDark text-xs rounded">
          No Image
        </div>
        <div class="flex-1">
          <div class="font-bold truncate">{{ item.album }}</div>
          <div class="text-sm mb-1 truncate">{{ item.artist }}</div>
          <div class="text-sm">
            <span v-if="item.discount && item.discount > 0">
              <span class="line-through text-gray-400 mr-2">{{ item.price }} kr.</span>
              <span class="text-MyRed font-bold">{{ calculateDiscountedPrice(item.price, item.discount) }} kr.</span>
            </span>
            <span v-else>
              <span class="text-MyWhite font-bold">{{ item.price }} kr.</span>
            </span>
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center mt-2">
            <button
              @click="decrementQuantity(item)"
              class="w-6 h-6 bg-gray-700 text-MyWhite rounded-l flex items-center justify-center hover:bg-gray-600 cursor-pointer"
              :disabled="item.quantity <= 1"
            >
              -
            </button>
            <div class="px-2 py-1 bg-gray-800 text-center text-xs w-8">
              {{ item.quantity }}
            </div>
            <button
              @click="incrementQuantity(item)"
              class="w-6 h-6 bg-gray-700 text-MyWhite rounded-r flex items-center justify-center hover:bg-gray-600 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        <button
          @click="cart.removeFromCart(item.id)"
          class="text-MyRed flex items-center cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          Remove
        </button>
      </div>
      <div class="mt-6 font-bold text-lg">
        Total: {{ totalPrice }} kr.
      </div>
      <button @click="checkout" class="mt-6 px-6 py-2 bg-gray-700 text-MyWhite rounded hover:bg-gray-900 cursor-pointer">
        Checkout
      </button>
    </div>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/usePriceCalculator'

const router = useRouter()
const cart = useCartStore()
const { calculateDiscountedPrice, calculateTotalPrice } = usePriceCalculator()

const totalPrice = computed(() => calculateTotalPrice(cart.items))

function incrementQuantity(item) {
  const cartItem = cart.items.find(cartItem => cartItem.id === item.id)
  if (cartItem) {
    cartItem.quantity += 1
    cart.saveToLocalStorage()
  }
}

function decrementQuantity(item) {
  const cartItem = cart.items.find(cartItem => cartItem.id === item.id)
  if (cartItem && cartItem.quantity > 1) {
    cartItem.quantity -= 1
    cart.saveToLocalStorage()
  }
}

function checkout() {
  router.push('/user/checkout')
}
</script>
