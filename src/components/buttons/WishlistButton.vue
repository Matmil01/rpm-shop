<template>
  <button @click="toggleWishlist"
    class="font-main cursor-pointer text-MyYellow border border-MyYellow px-4 py-2 rounded-full shadow transition duration-200 ease-in-out whitespace-nowrap hover:bg-MyYellow hover:text-MyBlack hover:border-MyYellow">
    <span v-if="inWishlist">In Wishlist</span>
    <span v-else>Add to Wishlist</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useWishlistStore } from '@/composables/piniaStores/wishlistStore'

// Props:
// - record: the item to add/remove from wishlist
const props = defineProps({
  record: {
    type: Object,
    required: true
  }
})

// Emits:
// - 'added': when item is added to wishlist
// - 'removed': when item is removed from wishlist
const emit = defineEmits(['added', 'removed'])

// Access the wishlist store
const wishlist = useWishlistStore()

// Computed: is this record currently in the wishlist?
const inWishlist = computed(() =>
  wishlist.items.some(item => item.id === props.record.id)
)

// Handles button click: toggles add/remove and emits event
async function toggleWishlist() {
  if (!props.record.id) return
  if (inWishlist.value) {
    // Remove from wishlist and emit 'removed'
    await wishlist.removeFromWishlist(props.record.id)
    emit('removed')
  } else {
    // Add to wishlist and emit 'added'
    await wishlist.addToWishlist({
      id: props.record.id,
      album: props.record.album,
      artist: props.record.artist,
      coverImage: props.record.coverImage,
      price: props.record.price,
      discount: props.record.discount
    })
    emit('added')
  }
}
</script>
