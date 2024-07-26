export const createAnimations = (game) => {
  // mario walk animation
  game.anims.create({
    key: "mario-walk",
    frames: game.anims.generateFrameNumbers(
      "mario",
      { start: 3, end: 2 }
    ),
    frameRate: 12,
    repeat: -1
  })
  
  // mario jump animation
  game.anims.create({
    key: "mario-jump",
    frames: [{ key: "mario", frame: 5 }],
  })
  
  // mario idle
  game.anims.create({
    key: "mario-idle",
    frames: [{ key: "mario", frame: 0 }]
  })

  // mario death
  game.anims.create({
    key: "mario-death",
    frames: [{ key: "mario", frame: 4 }]
  })
}
