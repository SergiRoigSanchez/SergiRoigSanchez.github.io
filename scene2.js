class Scene2 extends Phaser.Scene {
  constructor() {
    super("scene2");
  }

  score = 0;
  scoreText;
  lives = 3;
  livesText;
  keys = 0;
  keysText;
  info = '';
  infoText;

  sfx_game_over;
  sfx_victory;
  sfx_coin;
  sfx_hit;
  sfx_jump;
  song2;

  preload() {
    this.load.image('background', 'assets/images/big_background2.png');
    this.load.image('spike', 'assets/images/spike.png');
    this.load.image('spike2', 'assets/images/spike2.png');
    this.load.image('lava', 'assets/images/lava.png');
    this.load.image('blue_block', 'assets/images/blue_block.png');
    this.load.image('blue_block_empty', 'assets/images/blue_block_empty.png');
    this.load.image('water1', 'assets/images/water1.png');
    this.load.image('water2', 'assets/images/water2.png');
    this.load.image('door', 'assets/images/door.png');
    this.load.image('key', 'assets/images/key.png');
    this.load.image('diamond', 'assets/images/diamond.png');
    this.load.atlas('player', 'assets/images/kenney_player.png','assets/images/kenney_player_atlas.json');
    this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
    this.load.tilemapTiledJSON('map2', 'assets/tilemaps/level2-4.json');
    this.load.audio('game_over', 'assets/sfx/game_over.wav');
    this.load.audio('victory', 'assets/sfx/victory.wav');
    this.load.audio('coin', 'assets/sfx/coin.wav');
    this.load.audio('hit', 'assets/sfx/hit.wav');
    this.load.audio('jump', 'assets/sfx/jump2.wav');
    this.load.audio('song2', 'assets/sfx/sylvan-elf-sanctuary.mp3');
  }

  create() {
    var backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0);
    backgroundImage.setScale(2, 0.8);
    const map2 = this.make.tilemap({ key: 'map2' });
    var tileset = map2.addTilesetImage('platformPack_tilesheet', 'tiles');
    var platforms = map2.createStaticLayer('Platforms', tileset, 0, 0);
    platforms.setCollisionByExclusion(-1, true);

    this.physics.world.setBounds( 0, 0, 3584, 1792 );

    this.player = this.physics.add.sprite(200, 550, 'player');
    // this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(this.player.width - 20, this.player.height - 20).setOffset(10, 20);
    this.physics.add.collider(this.player, platforms);

    this.cameras.main.setBounds(0, 0, 3584, 1792);
    this.cameras.main.startFollow(this.player);

    this.livesText = this.add.text(20, 20, 'Lives: ' + this.lives, { fontSize: '26px', fill: '#000' }).setScrollFactor(0);
    this.scoreText = this.add.text(20, 60, 'Diamonds: ' + this.score + ' / 16', { fontSize: '26px', fill: '#000' }).setScrollFactor(0);
    this.keysText = this.add.text(20, 100, 'Keys: ' + this.keys, { fontSize: '26px', fill: '#000' }).setScrollFactor(0);
    this.infoText = this.add.text(300, 20, this.info, { fontSize: '26px', fill: '#000' }).setScrollFactor(0);

    this.sfx_game_over = this.sound.add('game_over', {volume: 0.20});
    this.sfx_victory = this.sound.add('victory', {volume: 0.20});
    this.sfx_coin = this.sound.add('coin', {volume: 0.10});
    this.sfx_hit = this.sound.add('hit', {volume: 0.20});
    this.sfx_jump = this.sound.add('jump', {volume: 0.10});
    this.song2 = this.sound.add('song2', {volume: 0.10});
    this.song2.play()

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('player', {
        prefix: 'robo_player_',
        start: 2,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 'robo_player_0' }],
      frameRate: 10,
    });
    this.anims.create({
      key: 'jump',
      frames: [{ key: 'player', frame: 'robo_player_1' }],
      frameRate: 10,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.water1s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.water2s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.spikes2 = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.lava = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.blue_blocks = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.doors = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.keysP = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.diamonds = this.physics.add.group({
      allowGravity: false,
      immovable: false
    });

    var spikeObjects = map2.getObjectLayer('Spikes')['objects'];
    spikeObjects.forEach(spikeObject => {
      var spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);
      spike.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
    });
    this.physics.add.collider(this.player, this.spikes, this.spikeHit, null, this);

    var spike2Objects = map2.getObjectLayer('Spikes2')['objects'];
    spike2Objects.forEach(spike2Object => {
      var spike2 = this.spikes.create(spike2Object.x, spike2Object.y - spike2Object.height, 'spike2').setOrigin(0, 0);
      spike2.body.setSize(spike2.width + 2, spike2.height + 2);
    });
    this.physics.add.collider(this.player, this.spikes2, this.spikeHit, null, this);

    var lavaObjects = map2.getObjectLayer('Lava')['objects'];
    lavaObjects.forEach(lavaObject => {
      var lava = this.spikes.create(lavaObject.x, lavaObject.y - lavaObject.height, 'lava').setOrigin(0, 0);
    });
    this.physics.add.collider(this.player, this.lava, this.spikeHit, null, this);

    var blue_blockObjects = map2.getObjectLayer('BlueBlocks')['objects'];
    blue_blockObjects.forEach(blue_blockObject => {
      var blue_block = this.blue_blocks.create(blue_blockObject.x, blue_blockObject.y - blue_blockObject.height, 'blue_block').setOrigin(0, 0);
    });
    this.physics.add.collider(this.player, this.blue_blocks, this.blueBlockHit, null, this);

    var diamondObjects = map2.getObjectLayer('Diamonds')['objects'];
    diamondObjects.forEach(diamondObject => {
      var diamond = this.diamonds.create(diamondObject.x, diamondObject.y - diamondObject.height, 'diamond').setOrigin(0, 0);
      // diamond.body.setSize(diamond.width, diamond.height - 20).setOffset(0, 20);
    });
    this.physics.add.overlap(this.player, this.diamonds, this.diamondHit, null, this);

    var water1Objects = map2.getObjectLayer('Water1')['objects'];
    water1Objects.forEach(water1Object => {
      var water1 = this.water1s.create(water1Object.x, water1Object.y - water1Object.height, 'water1').setOrigin(0, 0);
    });
    this.physics.add.overlap(this.player, this.water1s, this.water1Hit, null, this);

    var water2Objects = map2.getObjectLayer('Water2')['objects'];
    water2Objects.forEach(water2Object => {
      var water2 = this.water2s.create(water2Object.x, water2Object.y - water2Object.height, 'water2').setOrigin(0, 0);
    });
    this.physics.add.overlap(this.player, this.water2s, this.water1Hit, null, this);

    var doorObjects = map2.getObjectLayer('Doors')['objects'];
    doorObjects.forEach(doorObject => {
      var door = this.doors.create(doorObject.x, doorObject.y - doorObject.height, 'door').setOrigin(0, 0);
    });
    this.physics.add.overlap(this.player, this.doors, this.doorHit, null, this);

    var keyObjects = map2.getObjectLayer('Keys')['objects'];
    keyObjects.forEach(keyObject => {
      var key = this.keysP.create(keyObject.x, keyObject.y - keyObject.height, 'key').setOrigin(0, 0);
    });
    this.physics.add.overlap(this.player, this.keysP, this.keyHit, null, this);

    this.children.bringToTop(this.livesText);
    this.children.bringToTop(this.scoreText);
    this.children.bringToTop(this.keysText);
    this.children.bringToTop(this.infoText);
    this.children.bringToTop(this.spikes2);
    this.children.bringToTop(this.player);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-350);
      if (this.player.body.onFloor()) {
        this.player.play('walk', true);
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(350);
      if (this.player.body.onFloor()) {
        this.player.play('walk', true);
      }
    } else {
      this.player.setVelocityX(0);
      if (this.player.body.onFloor()) {
        this.player.play('idle', true);
      }
    }

    if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
      this.sfx_jump.play()
      this.player.setVelocityY(-750);
      this.player.play('jump', true);
    }

    if (this.player.body.velocity.x > 0) {
      this.player.setFlipX(false);
    } else if (this.player.body.velocity.x < 0) {
      // otherwise, make them face the other side
      this.player.setFlipX(true);
    }
  }

  spikeHit(player, spike) {
    this.sfx_hit.play();
    this.lives -= 1;

    if (this.lives >= 0)
      this.livesText.setText('Lives: ' + this.lives);

    if (this.lives <= 0){
      this.cameras.main.shake(500, 0.02);
      this.physics.pause();
      player.setTint(0xff0000);

      this.song2.stop()
      this.sfx_game_over.play();

      this.time.addEvent({
        delay: 1000,
        callback: ()=>{
          this.scene.start("game_over");
          this.resetValues();
        },
        loop: true
      })
    }else{
      player.setVelocity(0, 0);
      player.setX(200);
      player.setY(550);
      player.play('idle', true);
      player.setAlpha(0);

      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
  }

  diamondHit (player, diamond)
  {
    this.sfx_coin.play();

    var particles = this.add.particles('diamond');

    var emitter = particles.createEmitter({
      speed: 100,
      x: diamond.x,
      y: diamond.y,
      tint: 0xeb092b,
      maxParticles: 10,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    diamond.disableBody(true, true);

    this.score += 1;
    this.scoreText.setText('Diamonds: ' + this.score + ' / 16');

    if (this.score >= 7){
      this.blue_blocks.clear();
    }
  }

  water1Hit (player, water1)
  {
    this.player.setVelocityY(100);
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-300);
    }
    if (this.cursors.down.isDown) {
      this.player.setVelocityY(300);
    }
  }

  doorHit (player, door)
  {
    if (this.keys >= 1){
      this.info = 'Victory!';
      this.infoText.setText(this.info);
      this.song2.stop()
      this.sfx_victory.play();
      this.scene.start("scene3");
      this.resetValues();
    } else {
      this.info = 'You need a key.'
      this.infoText.setText(this.info);
    }
  }

  keyHit (player, key)
  {
    this.sfx_coin.play();

    var particles = this.add.particles('key');

    var emitter = particles.createEmitter({
      speed: 100,
      x: key.x,
      y: key.y,
      tint: 0xeb092b,
      maxParticles: 10,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    this.keys += 1;
    key.disableBody(true, true);

    this.keysText.setText('Keys: ' + this.keys);
  }

  blueBlockHit (player, blue_block)
  {
    if (this.score < 16){
      this.info = 'You need 16 diamonds.'
      this.infoText.setText(this.info);
    }
  }

  resetValues(){
    this.score = 0;
    this.lives = 3;
    this.keys = 0;
    this.info = '';
  }

}