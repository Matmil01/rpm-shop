<template>
  <div class="max-w-3xl mx-auto p-8 text-MyWhite font-main">
    <h1 class="text-2xl font-bold mb-6">Your Cart</h1>
    <div v-if="cart.items.length">
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="flex items-center justify-between mb-4 p-4 rounded bg-black/40 gap-4"
      >
        <img
          v-if="item.coverImage"
            :src="item.coverImage"
            alt="Cover"
            class="w-20 h-20 object-cover rounded shadow"
        />
        <div v-else class="w-20 h-20 flex items-center justify-center bg-gray-700 text-xs rounded">
          No Image
        </div>
        <div class="flex-1">
          <div class="font-bold truncate">{{ item.album }}</div>
          <div class="text-sm mb-1 truncate">{{ item.artist }}</div>
          <div class="text-sm">
            <span v-if="item.discount && item.discount > 0">
              <span class="line-through text-gray-400 mr-2">{{ item.price }} kr.</span>
              <span class="text-red-600 font-bold">{{ discounted(item) }} kr.</span>
            </span>
            <span v-else>
              <span class="text-gray-200 font-bold">{{ item.price }} kr.</span>
            </span>
          </div>
          <div class="text-xs mt-1">Qty: {{ item.quantity }}</div>
        </div>
        <button @click="cart.removeFromCart(item.id)" class="text-red-500 hover:underline shrink-0">Remove</button>
      </div>
      <div class="mt-6 font-bold text-lg">
        Total: {{ totalPrice }} kr.
      </div>
      <button @click="checkout" class="mt-6 px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-900">
        Checkout
      </button>
      <button @click="cart.clearCart()" class="mt-2 px-6 py-2 bg-MyRed text-white rounded hover:bg-red-700">
        Clear Cart
      </button>
    </div>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/composables/piniaStores/cartStore'

const cart = useCartStore()

function discounted(item) {
  if (!item.discount || item.discount <= 0) return item.price
  return Math.round(item.price * (1 - item.discount / 100))
}

const totalPrice = computed(() =>
  cart.items.reduce((sum, item) => {
    const price = item.discount && item.discount > 0
      ? Math.round(item.price * (1 - item.discount / 100))
      : item.price
    return sum + price * item.quantity
  }, 0)
)

function checkout() {
  alert('Purchase complete! (Fake checkout)')
  cart.clearCart()
}
</script>
