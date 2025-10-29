<template>
  <button type="button" @click="handleAdd" :disabled="loading"
    class="px-6 py-2 rounded-3xl font-main cursor-pointer border border-MyYellow text-MyYellow hover:opacity-70 transition duration-200 ease-in-out flex items-center gap-2 relative bg-MyDark">
    <!-- Show discounted price if discount is present -->
    <span v-if="item.discount && item.discount > 0">
      <span class="text-MyRed font-bold">{{ discountedPrice }} kr.</span>
      <span class="line-through text-gray-400 ml-2">{{ item.price }} kr.</span>
    </span>
    <!-- Otherwise, show regular price -->
    <span v-else>
      <span class="text-MyYellow font-bold">{{ item.price }} kr.</span>
    </span>
    <!-- Cart icon -->
    <img src="/icons/cartIcon.svg" alt="Add to Cart" class="w-5 h-5 opacity-60" />
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/records/usePriceCalculator'

// Props: expects an item object (record info)
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Access the cart store
const cart = useCartStore()

// Get the price calculator composable
const { calculateDiscountedPrice } = usePriceCalculator()
// Compute the discounted price for display
const discountedPrice = computed(() =>
  calculateDiscountedPrice(props.item.price, props.item.discount)
)

// Emits: 'added' event when item is added to cart
const emit = defineEmits(['added'])

// Handles the button click: adds item to cart and emits 'added' event
function handleAdd() {
  cart.addToCart(props.item)
  emit('added')
}
</script>
