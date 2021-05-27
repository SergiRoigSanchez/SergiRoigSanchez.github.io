class Victory extends Phaser.Scene {
  constructor() {
    super("victory");
  }

  title_song;

  preload() {
    this.load.image('title_background', 'assets/images/title_background2.png');
    this.load.image('play', 'assets/images/new_game.png');
    this.load.image('exit', 'assets/images/exit1.png');
    this.load.image('victory', 'assets/images/victory.png');
    this.load.image('diamond_particle', 'assets/particles/diamond.png');
    this.load.audio('title_song', 'assets/sfx/glory-of-Turodin.mp3');
  }

  create() {
    var bg = this.add.sprite(0,0,'title_background');
    bg.setOrigin(0,0);

    var img = this.add.image(610,375, 'play');
    img.setInteractive({ useHandCursor: true });
    img.on('pointerdown', () => this.newGame());

    var img2 = this.add.image(610,475, 'exit');
    img2.setInteractive({ useHandCursor: true });
    img2.on('pointerdown', () => this.exit());

    var img3 = this.add.image(610,175, 'victory');

    this.title_song = this.sound.add('title_song', {volume: 0.15});
    this.title_song.play();
  }

  newGame() {
    this.title_song.stop();
    this.scene.switch('scene1');
  }

  exit() {
    this.title_song.stop();
    game.destroy();
    window.close();
  }
}