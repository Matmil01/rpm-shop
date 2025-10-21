<template>
  <transition name="fade">
    <div v-if="visible" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-MyYellow text-MyBlack px-6 py-3 rounded shadow-lg z-50 font-main">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: String,
  show: Boolean,
  duration: { type: Number, default: 3000 }
})

const visible = ref(props.show)

watch(() => props.show, (val) => {
  visible.value = val
  if (val) {
    setTimeout(() => visible.value = false, props.duration)
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
