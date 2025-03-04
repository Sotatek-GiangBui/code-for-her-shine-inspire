// This file defines custom shapes for the canvas-confetti library
// It adds heart and flower shapes to be used in our celebration effects

// Create a heart shape for the confetti
function createHeartShape(context) {
  // Draw a heart shape
  context.beginPath()
  context.moveTo(0, 0)
  context.bezierCurveTo(0, -3, 5, -3, 5, 0)
  context.bezierCurveTo(5, 5, 0, 10, 0, 10)
  context.bezierCurveTo(0, 10, -5, 5, -5, 0)
  context.bezierCurveTo(-5, -3, 0, -3, 0, 0)
  context.fill()
}

// Create a simple flower shape for the confetti
function createFlowerShape(context) {
  // Draw a flower with 5 petals
  const petalCount = 5
  const petalSize = 4

  context.beginPath()
  // Draw center circle
  context.arc(0, 0, 2, 0, 2 * Math.PI)
  context.fill()

  // Draw petals
  for (let i = 0; i < petalCount; i++) {
    context.beginPath()
    const angle = (i / petalCount) * 2 * Math.PI
    const x = Math.cos(angle) * petalSize
    const y = Math.sin(angle) * petalSize

    context.ellipse(x, y, 3, 2, angle, 0, 2 * Math.PI)
    context.fill()
  }
}

// Register the custom shapes with canvas-confetti
// This will be called when the main component loads
export function registerConfettiShapes() {
  if (typeof window !== "undefined" && window.confetti) {
    window.confetti.addShape("heart", createHeartShape)
    window.confetti.addShape("flower", createFlowerShape)
  }
}

