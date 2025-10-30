import { ref } from 'vue'

// Composable for animating the spinning home logo
export function useSpinAnimation(spinSpeed = 180) {
  const angle = ref(0)         // Current rotation angle in degrees
  let spinning = false         // Is the animation running?
  let frameId = null           // requestAnimationFrame ID
  let lastTimestamp = null     // Last frame timestamp

  // Animation step: advances the angle based on time delta
  function spinStep(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp
    const delta = timestamp - lastTimestamp
    lastTimestamp = timestamp
    angle.value += (delta / 1000) * spinSpeed // Advance angle
    angle.value %= 360                        // Keep angle in [0, 360)
    if (spinning) frameId = requestAnimationFrame(spinStep)
  }

  // Starts the spinning animation
  function startSpin() {
    if (!spinning) {
      spinning = true
      lastTimestamp = null
      frameId = requestAnimationFrame(spinStep)
    }
  }

  // Stops the spinning animation
  function stopSpin() {
    spinning = false
    if (frameId) cancelAnimationFrame(frameId)
    frameId = null
    lastTimestamp = null
  }

  return {
    angle,      // Reactive angle value for binding to style
    startSpin,  // Function to start spinning
    stopSpin,   // Function to stop spinning
  }
}
