<template>
  <transition name="fade">
    <div v-if="visible"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-MyYellow text-MyBlack px-6 py-3 rounded shadow-lg z-50 font-main">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props:
// - message: text to display in the snackbar
// - show: controls visibility from parent
// - duration: how long to show the snackbar (ms)
const props = defineProps({
  message: String,
  show: Boolean,
  duration: { type: Number, default: 3000 }
})

// Internal state for visibility
const visible = ref(props.show)

// Watch for changes to 'show' prop and update visibility
watch(() => props.show, (val) => {
  visible.value = val
  if (val) {
    // Hide snackbar after 'duration' ms
    setTimeout(() => visible.value = false, props.duration)
  }
})
</script>

<style scoped>
/* Fade transition for snackbar appearance/disappearance */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
