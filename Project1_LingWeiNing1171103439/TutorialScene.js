export default class TutorialScene extends Phaser.Scene {
  constructor() {
      super({ key: 'TutorialScene' });
  }

  preload() {
      this.load.image('startButton', 'images/PlayButton.png');
      this.load.image('bg', 'images/greyBG.jpg');
      this.load.image('tut', 'images/Tutorial.png');
  }

  create() {
      const gameWidth = this.sys.game.config.width;
      const gameHeight = this.sys.game.config.height;

      const bg = this.add.image(gameWidth / 2, gameHeight / 2, 'bg');
      bg.setOrigin(0.5, 0.5);
      bg.displayWidth = gameWidth;
      bg.displayHeight = gameHeight;

      const tut = this.add.image(gameWidth / 2, gameHeight / 2 - 50, 'tut');
      tut.setOrigin(0.5, 0.5);
      tut.displayWidth = 450;
      tut.displayHeight = 650;

      this.add.text(gameWidth / 2, gameHeight / 2 - 400, 'Tutorial', { fontSize: '42px', fill: '#fff' }).setOrigin(0.5);

      const startButton = this.add.image(gameWidth / 2, gameHeight / 2 + 350, 'startButton').setInteractive();
      startButton.on('pointerdown', () => {
          this.scene.start('MainScene');
      });
  }
}
