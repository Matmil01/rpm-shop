<template>
  <!-- Dropdown cart summary, shown when cart has items -->
  <div v-if="cart.items.length"
    class="absolute right-0 mt-2 w-72 bg-MyBlack rounded-3xl shadow shadow-MyYellow opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
    <div class="p-4">
      <!-- Show up to 5 cart items -->
      <div v-for="item in cart.items.slice(0, 5)" :key="item.id"
        class="flex items-center mb-3 relative bg-MyBlack p-2 rounded">
        <img :src="item.coverImage" alt="" class="w-10 h-10 rounded mr-2" />
        <div class="flex-1">
          <div class="text-sm text-MyWhite font-bold">{{ item.album }}</div>
          <div class="text-xs text-MyWhite">{{ item.artist }}</div>
          <div class="text-xs text-MyWhite">x{{ item.quantity }}</div>
        </div>
        <TrashButton title="Remove from cart" alt="Remove" class="absolute top-0 right-0 p-1" :disabled="false"
          @click.stop="cart.removeFromCart(item.id)" />
      </div>
      <div v-if="cart.items.length > 5" class="text-xs text-MyWhite mb-2">
        +{{ cart.items.length - 5 }} more...
      </div>
      <div class="flex justify-between items-center font-bold text-sm text-MyWhite mb-2">
        <span>{{ cart.items.length }} items</span>
        <span>Total: {{ calculateTotalPrice(cart.items) }} kr.</span>
      </div>
      <SimpleButton to="/user/cart" class="w-full mt-2">
        Go to Cart
      </SimpleButton>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/records/usePriceCalculator'
import SimpleButton from '@/components/buttons/SimpleButton.vue'
import TrashButton from '@/components/buttons/TrashButton.vue'

const cart = useCartStore()
const { calculateTotalPrice } = usePriceCalculator()
</script>
