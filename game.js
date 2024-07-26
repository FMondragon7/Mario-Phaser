import { createAnimations } from "./animations.js"

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  parent: 'game',
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

const Game = new Phaser.Game(config)

function preload() {
  this.load.image(
    "cloud1",
    "assets/scenery/overworld/cloud1.png"
  )

  this.load.spritesheet(
    "mario",
    "assets/entities/mario.png",
    { frameWidth: 18, frameHeight: 16 }
  )

  this.load.image(
    "floorbricks",
    "assets/scenery/overworld/floorbricks.png"
  )

  this.load.audio(
    "gameover",
    "assets/sound/music/gameover.mp3"
  )
}

function create() {
  this.add.image(100, 50, "cloud1").setScale(0.15).setOrigin(0, 0)
  
  // #region Physics
  // world
  this.physics.world.setBounds(0, 0, 2000, config.height)
  // floor
  this.floor = this.physics.add.staticGroup()
  
  const segmentWidth = 160;  // Adjust this to match the width of your floor segment

  this.floor
      .create(0, config.height, "floorbricks")
      .setOrigin(0, 1)
      .refreshBody();

  this.floor
      .create(128, config.height, "floorbricks")
      .setOrigin(0, 1)
      .refreshBody();
  
  for (let i = 0; 300 + (i * segmentWidth) <= 2000; i++) {
    this.floor
      .create(300 + (i * segmentWidth), config.height, "floorbricks")
      .setOrigin(0, 1)
      .refreshBody();
  }
  
  // #region Entities
  // this.mario = this.add.sprite(50, 210, "mario").setOrigin(0, 1)
  this.mario = this.physics.add.sprite(50, 200, "mario")
  .setOrigin(0, 1)
  .setGravityY(600)
  .setCollideWorldBounds(true)

  // #region Animations
  createAnimations(this)

  // #region Sounds
  this.gameoverSound = this.sound.add("gameover", { volume: 0.2 })
  
  
  // #region Collisions
  this.marioFloorCollider = this.physics.add.collider(this.mario, this.floor)

  // #region Camara
  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)
  
  // #region Movement
  //* Movement
  this.keys = this.input.keyboard.createCursorKeys() 
}

function update() {
  if (this.mario.isDead) return
  
  if (this.keys.left.isDown) {
    this.mario.body.touching.down && this.mario.anims.play("mario-walk", true)
    this.mario.x -= 1
    this.mario.flipX = true
  } else if(this.keys.right.isDown) {
    this.mario.body.touching.down && this.mario.anims.play("mario-walk", true)
    this.mario.x += 1
    this.mario.flipX = false
  } else {
    this.mario.anims.play("mario-idle", true)
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-300)
    this.mario.anims.play("mario-jump", true)
  }

  if (this.mario.y >= config.height) {
    this.mario.isDead = true
    this.mario.anims.play("mario-death")
    this.mario.setCollideWorldBounds(false)
    this.marioFloorCollider.destroy()
    this.gameoverSound.play()
    
    setTimeout(() => {
      this.mario.setVelocityY(-450)
    }, 50)

    setTimeout(() => {
      this.gameoverSound.stop()
      this.scene.restart()
    }, 3000)
  }
}
