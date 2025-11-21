import { ref, watch } from 'vue'

export function useStaggerAnimation(items, options = {}) {
  const {
    delayIncrement = 0.1,
    resetOnChange = true
  } = options

  const animationKey = ref(0)

  // Watch for changes in items array and reset animation
  if (resetOnChange) {
    watch(() => items.value, () => {
      animationKey.value++
    })
  }

  // Calculate delay for each item
  function getDelay(index) {
    return `${index * delayIncrement}s`
  }

  return {
    animationKey,
    getDelay
  }
}
