// Utility functions for creating various confetti effects
import confetti from "canvas-confetti"

// Colors for the celebration effects
const celebrationColors = [
  "#ff69b4", // Hot Pink
  "#ff1493", // Deep Pink
  "#da70d6", // Orchid
  "#ba55d3", // Medium Orchid
  "#9370db", // Medium Purple
  "#8a2be2", // Blue Violet
  "#ff6b6b", // Light Red
  "#f06292", // Pink
  "#e91e63", // Material Pink
]

// Create a fireworks effect
export function createFireworks() {
  const duration = 5 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    // Since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: celebrationColors,
      }),
    )

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: celebrationColors,
      }),
    )
  }, 250)
}

// Create heart-shaped confetti burst
export function createHeartBurst() {
  // Launch from bottom center
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.9 },
    colors: celebrationColors,
    shapes: ["heart"],
    scalar: 2,
  })
}

// Create flower petals falling
export function createFlowerPetals() {
  const end = Date.now() + 3 * 1000

  // Create a flower petal interval
  const interval: any = setInterval(() => {
    if (Date.now() > end) {
      return clearInterval(interval)
    }

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: celebrationColors,
    })

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: celebrationColors,
    })
  }, 150)
}

// Combined celebration effect
export function createCelebration() {
  // Start with hearts
  createHeartBurst()

  // Add fireworks after a short delay
  setTimeout(() => {
    createFireworks()
  }, 300)

  // Add flower petals after another delay
  setTimeout(() => {
    createFlowerPetals()
  }, 600)
}

