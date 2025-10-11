<template>
  <button
    @click="toggleWishlist"
    class="font-main cursor-pointer text-MyYellow border border-MyYellow px-4 py-1 rounded-full shadow transition duration-200 ease-in-out whitespace-nowrap hover:bg-MyYellow hover:text-MyBlack hover:border-MyYellow"
  >
    <span v-if="inWishlist">In Wishlist</span>
    <span v-else>Add to Wishlist</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useWishlistStore } from '@/composables/piniaStores/wishlistStore'

const props = defineProps({
  record: {
    type: Object,
    required: true
  }
})

const wishlist = useWishlistStore()

const inWishlist = computed(() =>
  wishlist.items.some(item => item.id === props.record.id)
)

async function toggleWishlist() {
  if (!props.record.id) return
  if (inWishlist.value) {
    await wishlist.removeFromWishlist(props.record.id)
  } else {
    await wishlist.addToWishlist({
      id: props.record.id,
      album: props.record.album,
      artist: props.record.artist,
      coverImage: props.record.coverImage,
      price: props.record.price,
      discount: props.record.discount
    })
  }
}
</script>
