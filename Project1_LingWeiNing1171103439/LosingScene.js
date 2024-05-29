export default class LosingScene extends Phaser.Scene {
  constructor() {
      super({ key: 'LosingScene' });
  }

  preload() {
      this.load.image('NewGameButton', 'images/NewGameButton.png');
      this.load.image('bg', 'images/greyBG.jpg');
      this.load.image('lose', 'images/losingDoktah.jpg');
  }

  create() {
      const gameWidth = this.sys.game.config.width;
      const gameHeight = this.sys.game.config.height;

      this.scene.get('MainScene').backgroundMusic.stop();

      const bg = this.add.image(gameWidth / 2, gameHeight / 2, 'bg');
      bg.setOrigin(0.5, 0.5);
      bg.displayWidth = gameWidth;
      bg.displayHeight = gameHeight;

      const lose = this.add.image(gameWidth / 2, gameHeight / 2 - 50, 'lose');
      lose.setOrigin(0.5, 0.5);
      lose.displayWidth = 600;
      lose.displayHeight = 400;

      this.add.text(gameWidth / 2, gameHeight / 2 - 350, '         You Lost \n   Better Luck Next Time', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

      const startButton = this.add.image(gameWidth / 2, gameHeight / 2 + 300, 'NewGameButton').setInteractive();
      startButton.on('pointerdown', () => {
          this.scene.start('MainScene');
      });
  }
}
