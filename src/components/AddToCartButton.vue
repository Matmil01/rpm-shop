<template>
  <button
    type="button"
    @click="handleAdd"
    :disabled="loading"
    class="px-6 py-2 rounded-3xl font-main cursor-pointer border border-MyYellow text-MyYellow hover:opacity-70 transition duration-200 ease-in-out flex items-center gap-2 relative bg-MyDark"
  >
    <span v-if="item.discount && item.discount > 0">
      <span class="text-MyRed font-bold">{{ discountedPrice }} kr.</span>
      <span class="line-through text-gray-400 ml-2">{{ item.price }} kr.</span>
    </span>
    <span v-else>
      <span class="text-MyYellow font-bold">{{ item.price }} kr.</span>
    </span>
    <img
      src="/icons/cartIcon.svg"
      alt="Add to Cart"
      class="w-5 h-5 opacity-60"
    />
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/usePriceCalculator'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const cart = useCartStore()

const { calculateDiscountedPrice } = usePriceCalculator()
const discountedPrice = computed(() =>
  calculateDiscountedPrice(props.item.price, props.item.discount)
)

function handleAdd() {
  cart.addToCart(props.item)
}
</script>
