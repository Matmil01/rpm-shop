import { ref } from 'vue'

export function useSpinAnimation(spinSpeed = 180) {
  const angle = ref(0)
  let spinning = false
  let frameId = null
  let lastTimestamp = null

  function spinStep(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp
    const delta = timestamp - lastTimestamp
    lastTimestamp = timestamp
    angle.value += (delta / 1000) * spinSpeed
    angle.value %= 360
    if (spinning) frameId = requestAnimationFrame(spinStep)
  }

  function startSpin() {
    if (!spinning) {
      spinning = true
      lastTimestamp = null
      frameId = requestAnimationFrame(spinStep)
    }
  }

  function stopSpin() {
    spinning = false
    if (frameId) cancelAnimationFrame(frameId)
    frameId = null
    lastTimestamp = null
  }

  return {
    angle,
    startSpin,
    stopSpin,
  }
}
