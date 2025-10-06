<template>
  <div class="max-w-3xl mx-auto p-8 text-MyWhite font-main">
    <h1 class="text-2xl font-headline text-MyWhite mb-6">Your Cart</h1>
    <div v-if="cart.items.length">
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="flex items-center justify-between mb-4 p-4 rounded bg-MyDark shadow shadow-MyYellow gap-4"
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
              class="w-6 h-6 bg-gray-700 text-MyWhite rounded-l flex items-center justify-center hover:opacity-70 transition ease-in-out duration-200 cursor-pointer"
              :disabled="item.quantity <= 1"
            >
              -
            </button>
            <div class="px-2 py-1 bg-gray-800 text-center text-xs w-8">
              {{ item.quantity }}
            </div>
            <button
              @click="incrementQuantity(item)"
              class="w-6 h-6 bg-gray-700 text-MyWhite rounded-r flex items-center justify-center hover:opacity-70 transition ease-in-out duration-200 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        <TrashButton
          title="Remove from cart"
          alt="Remove"
          class="flex items-center"
          :disabled="false"
          @click="cart.removeFromCart(item.id)"
        />
      </div>
      <div class="mt-6 font-bold text-xl text-right text-MyWhite">
        Total: {{ totalPrice }} kr.
      </div>
      <div class="flex justify-center mt-6">
        <SimpleButton
          @click="checkout"
        >
          Checkout
        </SimpleButton>
      </div>
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
import SimpleButton from '@/components/SimpleButton.vue'
import TrashButton from '@/components/TrashButton.vue'

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
